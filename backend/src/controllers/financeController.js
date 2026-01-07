const pool = require("../config/db");


const getOwnerWallet = async (request, reply) => {
  const ownerId = request.user.id;

  try {
    const [wallet] = await pool.execute(
      "SELECT balance, total_earned FROM owner_wallets WHERE owner_id = ?",
      [ownerId]
    );

    if (wallet.length === 0) {
      return reply.send({ balance: 0, total_earned: 0 });
    }

    return reply.send({
      status: "Success",
      data: wallet[0],
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const withdrawFunds = async (request, reply) => {
  const { amount, bank_tujuan, nomor_rekening } = request.body;
  const ownerId = request.user.id;

  if (isNaN(amount) || amount <= 0) {
    return reply.code(400).send({ message: "Jumlah tidak valid" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [wallet] = await connection.execute(
      `SELECT balance FROM owner_wallets WHERE owner_id = ? FOR UPDATE`,
      [ownerId]
    );

    if (wallet.length === 0 || wallet[0].balance < amount) {
      await connection.rollback();
      return reply.code(400).send({ message: "Saldo tidak mencukupi" });
    }

    await connection.execute(
      `UPDATE owner_wallets SET balance = balance - ? WHERE owner_id = ?`,
      [amount, ownerId]
    );

    await connection.execute(
      `
      INSERT INTO payout_logs 
      (owner_id, amount, bank_tujuan, nomor_rekening, status)
      VALUES (?, ?, ?, ?, 'Success')
      `,
      [ownerId, amount, bank_tujuan, nomor_rekening]
    );

    await connection.commit();
    return reply.send({ message: "Penarikan berhasil" });
  } catch (err) {
    await connection.rollback();
    return reply.code(500).send({ error: err.message });
  } finally {
    connection.release();
  }
};

const getOwnerTransactions = async (request, reply) => {
  const ownerId = request.user.id;

  try {
    const query = `
      SELECT b.id, b.total_harga, b.created_at, b.booking_token, u.nama_lengkap as pembeli
      FROM bookings b
      JOIN seats s ON b.seat_id = s.id
      JOIN spots p ON s.spot_id = p.id
      JOIN users u ON b.user_id = u.id
      WHERE p.owner_id = ?
      ORDER BY b.created_at DESC
    `;
    const [rows] = await pool.execute(query, [ownerId]);
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

module.exports = {
    getOwnerWallet,
    getOwnerTransactions,
    withdrawFunds
};