const pool = require("../config/db");
const axios = require("axios");

/* ================= GET ALL MAP SPOTS ================= */
const getAllMapSpots = async (request, reply) => {
  const { tipe = "komersial" } = request.query;

  try {
    console.log("Fetching map spots with type:", tipe);

    let query = "";
    
    if (tipe === "komersial" || tipe === "all") {
      // PAKAI LOWER() untuk handle case sensitivity
      query = `
        SELECT 
          id, 
          nama_spot AS nama, 
          latitude, 
          longitude, 
          'Komersial' AS tipe,
          foto_utama,
          harga_per_jam,
          alamat,
          status
        FROM spots 
        WHERE LOWER(status) = 'approved'
        LIMIT 20
      `;
    } else if (tipe === "liar") {
      query = `
        SELECT 
          id,
          nama_lokasi AS nama,
          latitude,
          longitude,
          'Alam Liar' AS tipe,
          foto_carousel AS foto_utama,
          NULL as harga_per_jam,
          kabupaten_provinsi as alamat
        FROM wild_spots
        LIMIT 20
      `;
    }

    console.log("Executing query:", query);
    const [rows] = await pool.execute(query);
    console.log("Query result rows:", rows.length);

    // Parse data
    const processedRows = rows.map(spot => ({
      ...spot,
      latitude: spot.latitude ? parseFloat(spot.latitude) : null,
      longitude: spot.longitude ? parseFloat(spot.longitude) : null,
      harga_per_jam: spot.harga_per_jam ? parseFloat(spot.harga_per_jam) : 0
    }));

    return reply.send({
      status: "Success",
      total_found: processedRows.length,
      data: processedRows
    });
    
  } catch (error) {
    console.error("❌ MAP ERROR:", error.message);
    console.error("Error stack:", error.stack);
    
    return reply.code(500).send({ 
      error: "Gagal mengambil data peta",
      details: error.message
    });
  }
};

/* ================= SPOT DETAIL (INTEGRASI CUACA BMKG) ================= */
const getSpotDetail = async (request, reply) => {
  const { id } = request.params;
  const { tipe = "komersial" } = request.query;

  try {
    let spotData;
    if (tipe === "liar") {
      const [rows] = await pool.execute(
        `SELECT ws.*, u.nama as admin_name,
         COALESCE((SELECT AVG(rating) FROM reviews WHERE wild_spot_id = ws.id), 0) as avg_rating
         FROM wild_spots ws LEFT JOIN users u ON ws.admin_id = u.id WHERE ws.id = ?`,
        [id]
      );
      if (rows.length === 0)
        return reply.code(404).send({ message: "Spot liar tidak ditemukan" });
      spotData = rows[0];
      const [acc] = await pool.execute(
        "SELECT * FROM wild_spot_accessibility WHERE wild_spot_id = ?",
        [id]
      );
      spotData.accessibility = acc;
    } else {
      const [rows] = await pool.execute(
        `SELECT s.*, u.nama as owner_name, u.nomer_wa as owner_wa,
         COALESCE((SELECT AVG(rating) FROM reviews WHERE spot_id = s.id), 0) as avg_rating
         FROM spots s LEFT JOIN users u ON s.owner_id = u.id 
         WHERE s.id = ? AND s.status = 'approved'`,
        [id]
      );
      if (rows.length === 0)
        return reply.code(404).send({ message: "Spot tidak ditemukan" });
      spotData = rows[0];

      const [fas] = await pool.execute(
        `SELECT mf.nama_fasilitas, mf.ikon FROM spot_facilities sf 
         JOIN master_fasilitas mf ON sf.fasilitas_id = mf.id WHERE sf.spot_id = ?`,
        [id]
      );
      spotData.fasilitas_detail = fas;
    }

    // Cuaca BMKG (Objektif sesuai kode_wilayah)
    let weather = { temp: "-", condition: "No Data", icon: "" };
    if (spotData.kode_wilayah) {
      try {
        const res = await axios.get(
          `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${spotData.kode_wilayah}`,
          { timeout: 3000 }
        );
        if (res.data.data?.[0]?.cuaca?.[0]?.[0]) {
          const c = res.data.data[0].cuaca[0][0];
          weather = {
            temp: `${c.t}°C`,
            condition: c.weather_desc,
            icon: c.image,
          };
        }
      } catch (e) {
        console.error("BMKG Offline");
      }
    }

    return reply.send({
      status: "Success",
      data: { ...spotData, cuaca: weather },
    });
  } catch (error) {
    return reply.code(500).send({ error: "Internal server error" });
  }
};

/* ================= NEARBY, REVIEWS, GALLERY, EVENTS ================= */
const getNearbySpots = async (request, reply) => {
  const {
    user_lat,
    user_lon,
    radius_km = 5,
    tipe = "komersial",
  } = request.query;
  try {
    const table = tipe === "liar" ? "wild_spots" : "spots";
    const nameCol = tipe === "liar" ? "nama_lokasi" : "nama_spot";
    const [rows] = await pool.execute(
      `SELECT id, ${nameCol} as nama, latitude, longitude,
       (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS jarak
       FROM ${table} HAVING jarak <= ? ORDER BY jarak ASC LIMIT 10`,
      [user_lat, user_lon, user_lat, radius_km]
    );
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getSpotReviews = async (request, reply) => {
  const { spot_id } = request.params;
  const { tipe = "komersial" } = request.query;
  const col = tipe === "liar" ? "wild_spot_id" : "spot_id";
  try {
    const [rows] = await pool.execute(
      `SELECT r.*, u.nama, u.foto_profil FROM reviews r 
       JOIN users u ON r.user_id = u.id WHERE r.${col} = ? ORDER BY r.created_at DESC`,
      [spot_id]
    );
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getSpotGallery = async (request, reply) => {
  const { spot_id } = request.params;
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM spot_photos WHERE spot_id = ?",
      [spot_id]
    );
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getSpotEvents = async (request, reply) => {
  const { spot_id } = request.params;
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM events WHERE spot_id = ? AND status_persetujuan = 'Approved' AND tanggal_mulai > NOW()`,
      [spot_id]
    );
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

module.exports = {
  getAllMapSpots,
  getSpotDetail,
  getNearbySpots,
  getSpotReviews,
  getSpotGallery,
  getSpotEvents,
};
