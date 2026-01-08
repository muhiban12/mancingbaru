const pool = require("../config/db");
const { buildFileUrl } = require("./helper/file.helper");
const fs = require("fs");
const path = require("path");

const createStrikeFeed = async (request, reply) => {
  try {
    // Ambil data dari body (JSON)
    const { nama_ikan, berat, panjang, caption, wild_spot_id, foto_base64 } = request.body;
    const userId = request.user.id;

    let finalImageName = "";

    // 1. LOGIKA TERIMA GAMBAR
    if (foto_base64) {
      // JALUR BASE64 (Solusi untuk Ngrok)
      finalImageName = `strike-${Date.now()}.jpg`;
      const filePath = path.join(__dirname, "../../uploads/feeds", finalImageName);
      
      // Hilangkan header base64 jika ada
      const base64Data = foto_base64.replace(/^data:image\/\w+;base64,/, "");
      
      // Simpan ke folder
      fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
      finalImageName = `feeds/${finalImageName}`;
    } else if (request.file) {
      // JALUR MULTER (Jika suatu saat pakai IP Lokal)
      finalImageName = `feeds/${request.file.filename}`;
    } else {
      // Jika tidak ada dua-duanya, baru kasih error 400
      console.log("❌ Error: No image data provided");
      return reply.code(400).send({ message: "Foto wajib diunggah!" });
    }

    // 2. VALIDASI DATA WAJIB
    if (!wild_spot_id || !nama_ikan) {
      return reply.code(400).send({ message: "Lokasi dan jenis ikan wajib diisi!" });
    }

    // 3. EKSEKUSI QUERY (Pastikan nama kolom sesuai: 'foto' atau 'foto_ikan')
    // Sesuaikan query di bawah dengan nama kolom di tabel database kamu
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
        finalImageName,
      ]
    );

    return reply.code(201).send({
      status: "Success",
      message: "Strike berhasil diposting!",
      foto: finalImageName,
    });

  } catch (error) {
    console.error("🔥 BACKEND ERROR:", error.message);
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
