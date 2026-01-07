const pool = require("../config/db");

// Fungsi untuk mengambil daftar notifikasi milik user
const getNotifications = async (request, reply) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [request.user.id]
    );
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Fungsi untuk menandai notifikasi sudah dibaca (opsional)
const markNotificationRead = async (request, reply) => {
  const { id } = request.params;
  try {
    await pool.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", [
      id,
    ]);
    return reply.send({ status: "Success", message: "Notifikasi dibaca" });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

module.exports = {
    getNotifications,
    markNotificationRead
};