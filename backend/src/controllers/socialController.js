const pool = require("../config/db");
const { buildFileUrl } = require("./helper/file.helper");

const createStrikeFeed = async (request, reply) => {
  try {
    // 1. Cek apakah file ada
    if (!request.file) {
      console.log("❌ Error: No file uploaded");
      return reply.code(400).send({ message: "Foto wajib diunggah!" });
    }

    const { wild_spot_id, nama_ikan, berat, panjang, caption } = request.body;
    const userId = request.user.id;

    // 2. Ambil URL (Sekarang isinya path relatif seperti /uploads/feeds/123.jpg)
    const fotoUrl = buildFileUrl(request, "feeds");

    if (!wild_spot_id || !nama_ikan || !fotoUrl) {
      return reply.code(400).send({
        message: "Lokasi, jenis ikan, dan foto wajib diisi!",
      });
    }

    // 3. Eksekusi Query
    await pool.execute(
      `INSERT INTO strike_feeds 
       (user_id, wild_spot_id, nama_ikan, berat, panjang, caption, foto_ikan) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        wild_spot_id,
        nama_ikan,
        berat || 0,
        panjang || 0,
        caption || "",
        fotoUrl,
      ]
    );

    return reply.code(201).send({
      status: "Success",
      message: "Strike berhasil diposting!",
      foto: fotoUrl,
    });
  } catch (error) {
    console.error("🔥 DATABASE ERROR:", error.message);
    return reply.code(500).send({ error: "Terjadi kesalahan pada server" });
  }
};

const getStrikeFeeds = async (request, reply) => {
  try {
    const query = `
      SELECT f.*, u.nama_lengkap, w.nama_lokasi 
      FROM strike_feeds f
      JOIN users u ON f.user_id = u.id
      JOIN wild_spots w ON f.wild_spot_id = w.id
      ORDER BY f.created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// leaderboard
const getLeaderboard = async (request, reply) => {
  const { criteria } = request.query; // 'berat' atau 'panjang'

  try {
    // Kita urutkan berdasarkan kriteria yang dipilih user di UI
    const orderBy = criteria === "panjang" ? "f.panjang" : "f.berat";

    const query = `
      SELECT 
        u.nama_lengkap, 
        u.foto_profil, 
        f.nama_ikan, 
        f.berat, 
        f.panjang, 
        w.nama_lokasi as lokasi_spot,
        f.created_at
      FROM strike_feeds f
      JOIN users u ON f.user_id = u.id
      JOIN wild_spots w ON f.wild_spot_id = w.id
      ORDER BY ${orderBy} DESC
      LIMIT 10
    `;

    const [rows] = await pool.execute(query);
    return reply.send({
      status: "Success",
      data: rows,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const reportFeed = async (request, reply) => {
  const userId = request.user.id;
  const { id: feedId } = request.params;
  const { reason } = request.body;

  try {
    // Cegah user melaporkan feed yang sama 2x
    const [existing] = await pool.execute(
      "SELECT id FROM feed_reports WHERE feed_id = ? AND reporter_id = ?",
      [feedId, userId]
    );

    if (existing.length > 0) {
      return reply.code(400).send({
        message: "Kamu sudah melaporkan postingan ini",
      });
    }

    await pool.execute(
      `INSERT INTO feed_reports (feed_id, reporter_id, reason)
       VALUES (?, ?, ?)`,
      [feedId, userId, reason || "Tidak disebutkan"]
    );

    return reply.send({
      status: "Success",
      message: "Postingan berhasil dilaporkan",
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

module.exports = {
  getStrikeFeeds,
  createStrikeFeed,
  getLeaderboard,
  reportFeed,
};
