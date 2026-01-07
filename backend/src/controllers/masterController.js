const pool = require("../config/db");

// Fungsi untuk mengambil daftar fasilitas yang tersedia
const getMasterFacilities = async (request, reply) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, nama_fasilitas, ikon FROM master_fasilitas"
    );
    return reply.send({
      status: "Success",
      data: rows,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Fungsi untuk mengambil daftar ikan untuk pilihan di Strike Feed
const getFishMaster = async (request, reply) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM fish_master ORDER BY nama_ikan ASC"
    );
    return reply.send({
      status: "Success",
      data: rows,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

module.exports = {
    getFishMaster,
    getMasterFacilities
};