const pool = require("../config/db");

const getMasterFacilities = async (request, reply) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, nama_fasilitas, ikon FROM master_fasilitas"
    );
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ status: "Error", message: error.message });
  }
};

const getFishMaster = async (request, reply) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM fish_master ORDER BY nama_ikan ASC"
    );
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ status: "Error", message: error.message });
  }
};

const getWildSpotMaster = async (request, reply) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, nama_lokasi, kabupaten_provinsi FROM wild_spots ORDER BY nama_lokasi ASC"
    );
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ status: "Error", message: error.message });
  }
};

module.exports = {
  getFishMaster,
  getMasterFacilities,
  getWildSpotMaster,
};
