const pool = require("../config/db");

const createBooking = async (request, reply) => {
  const { seat_id, payment_channel_id, start_time, duration } = request.body;
  const userId = request.user.id;

  if (!seat_id || !start_time || !duration) {
    return reply.code(400).send({ message: "Data booking tidak lengkap" });
  }

  if (isNaN(duration) || duration <= 0) {
    return reply.code(400).send({ message: "Durasi tidak valid" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Ambil kursi + owner + harga spot (LOCK)
    const [seatData] = await connection.execute(
      `
      SELECT 
        s.status AS seat_status,
        p.id AS spot_id,
        p.owner_id,
        p.harga_per_jam,
        p.status AS spot_status,
        p.jam_buka,
        p.jam_tutup
      FROM seats s
      JOIN spots p ON s.spot_id = p.id
      WHERE s.id = ?
      FOR UPDATE
      `,
      [seat_id]
    );

    // 2️⃣ Validasi durasi
    if (duration > 12) {
      await connection.rollback();
      return reply.code(400).send({
        message: "Durasi maksimal booking adalah 12 jam",
      });
    }

    // 3️⃣ Validasi jam operasional
    const bookingStart = new Date(start_time);
    const bookingHour = bookingStart.getHours();

    if (seatData.length === 0) {
      await connection.rollback();
      return reply.code(404).send({
        message: "Kursi tidak ditemukan",
      });
    }

    const jamBuka = parseInt(seatData[0].jam_buka.split(":")[0]);
    const jamTutup = parseInt(seatData[0].jam_tutup.split(":")[0]);

    if (bookingHour < jamBuka || bookingHour >= jamTutup) {
      await connection.rollback();
      return reply.code(400).send({
        message: "Booking di luar jam operasional spot",
      });
    }

    // ❌ Kursi tidak ada / tidak tersedia
    if (seatData[0].seat_status !== "Available") {
      await connection.rollback();
      return reply.code(400).send({ message: "Kursi tidak tersedia" });
    }

    // ❌ Spot belum disetujui admin
    if (seatData[0].spot_status !== "approved") {
      await connection.rollback();
      return reply.code(403).send({
        message: "Spot belum disetujui admin",
      });
    }

    // 1️⃣ Cek bentrok waktu booking
    const [overlap] = await connection.execute(
      `
      SELECT id FROM bookings
      WHERE seat_id = ?
      AND status = 'Active'
      AND (
        start_time < (? + INTERVAL ? HOUR)
        AND
        (start_time + INTERVAL duration HOUR) > ?
      )
      `,
      [seat_id, start_time, duration, start_time]
    );

    if (overlap.length > 0) {
      await connection.rollback();
      return reply.code(409).send({
        message: "Kursi sudah dibooking di waktu tersebut",
      });
    }

    // 2️⃣ HITUNG TOTAL HARGA DI SERVER (WAJIB)
    const total_harga = seatData[0].harga_per_jam * duration;

    // 3️⃣ Buat booking
    const booking_token =
      "BKG-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    await connection.execute(
      `
      INSERT INTO bookings
      (user_id, seat_id, payment_channel_id, start_time, duration, total_harga, booking_token, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')
      `,
      [
        userId,
        seat_id,
        payment_channel_id,
        start_time,
        duration,
        total_harga,
        booking_token,
      ]
    );

    // 4️⃣ Update kursi
    await connection.execute(
      `UPDATE seats SET status = 'Booked' WHERE id = ?`,
      [seat_id]
    );

    // 5️⃣ Tambah saldo owner
    await connection.execute(
      `
      UPDATE owner_wallets
      SET balance = balance + ?, total_earned = total_earned + ?
      WHERE owner_id = ?
      `,
      [total_harga, total_harga, seatData[0].owner_id]
    );

    await connection.commit();

    return reply.code(201).send({
      status: "Success",
      booking_token,
      total_harga,
    });
  } catch (error) {
    await connection.rollback();
    return reply.code(500).send({ error: error.message });
  } finally {
    connection.release();
  }
};

const getUserBookings = async (request, reply) => {
  const userId = request.user.id;

  try {
    const query = `
      SELECT b.*, s.nomor_kursi, p.nama_spot, p.alamat 
      FROM bookings b
      JOIN seats s ON b.seat_id = s.id
      JOIN spots p ON s.spot_id = p.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `;
    const [rows] = await pool.execute(query, [userId]);

    return reply.send({
      status: "Success",
      data: rows,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Contoh logika yang dijalankan setiap beberapa menit
const updateExpiredBookings = async () => {
  // Ambil booking yang akan selesai
  const [finishedBookings] = await pool.execute(`
    SELECT id, user_id FROM bookings
    WHERE status = 'Active'
    AND (start_time + INTERVAL duration HOUR) < NOW()
  `);

  // Balikin kursi
  await pool.execute(`
    UPDATE seats
    SET status = 'Available'
    WHERE id IN (
      SELECT seat_id FROM bookings
      WHERE status = 'Active'
      AND (start_time + INTERVAL duration HOUR) < NOW()
    )
  `);

  // Update booking
  await pool.execute(`
    UPDATE bookings
    SET status = 'Finished'
    WHERE status = 'Active'
    AND (start_time + INTERVAL duration HOUR) < NOW()
  `);

  // Kirim notifikasi ke user
  for (const b of finishedBookings) {
    await pool.execute(
      `
      INSERT INTO notifications (user_id, title, message)
      VALUES (?, ?, ?)
      `,
      [
        b.user_id,
        "Booking Selesai",
        "Booking kamu telah selesai. Terima kasih!",
      ]
    );
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  updateExpiredBookings,
};
