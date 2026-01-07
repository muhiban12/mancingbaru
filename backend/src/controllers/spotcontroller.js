//spotController.js

const pool = require("../config/db");
const { buildFileUrl } = require("./helper/file.helper");
const { isNumber } = require("./helper/validation.helper");

/* ================= SPOT SEATS ================= */
const getSpotSeats = async (request, reply) => {
  const { spot_id } = request.params;

  try {
    const [rows] = await pool.execute(
      `SELECT 
        id, spot_id, nomor_kursi, 
        x_position, y_position, status
      FROM seats 
      WHERE spot_id = ? AND status = 'Available'
      ORDER BY nomor_kursi ASC`,
      [spot_id]
    );

    return reply.send({
      status: "Success",
      data: rows,
    });
  } catch (error) {
    console.error("Get spot seats error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= CREATE POND (OWNER) ================= */
const createPond = async (request, reply) => {
  const {
    nama_spot,
    deskripsi,
    harga_per_jam,
    alamat,
    latitude,
    longitude,
    total_kursi,
    jam_buka,
    jam_tutup,
    kode_wilayah,
    fasilitas_ids
  } = request.body;

  const ownerId = request.user.id;
  const fotoUtama = buildFileUrl(request, "ponds");

  // ✅ VALIDASI LENGKAP
  if (!nama_spot || !alamat || !latitude || !longitude) {
    return reply.code(400).send({ 
      message: "Nama spot, alamat, dan koordinat wajib diisi" 
    });
  }

  if (harga_per_jam <= 0) {
    return reply.code(400).send({ 
      message: "Harga per jam harus lebih dari 0" 
    });
  }

  if (total_kursi <= 0 || total_kursi > 200) {
    return reply.code(400).send({ 
      message: "Jumlah kursi harus antara 1-200" 
    });
  }

  if (!isNumber(latitude) || !isNumber(longitude)) {
    return reply.code(400).send({ 
      message: "Koordinat harus berupa angka" 
    });
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return reply.code(400).send({ 
      message: "Koordinat tidak valid" 
    });
  }

  if (!fotoUtama) {
    return reply.code(400).send({ 
      message: "Foto utama wajib diupload (JPG/PNG, max 5MB)" 
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Insert spot
    const [result] = await connection.execute(
      `INSERT INTO spots (
        owner_id, nama_spot, deskripsi, harga_per_jam, alamat, 
        latitude, longitude, total_kursi, jam_buka, jam_tutup, 
        kode_wilayah, foto_utama, status, action_type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'create', NOW())`,
      [
        ownerId,
        nama_spot,
        deskripsi || "",
        parseFloat(harga_per_jam),
        alamat,
        parseFloat(latitude),
        parseFloat(longitude),
        parseInt(total_kursi),
        jam_buka || "08:00:00",
        jam_tutup || "20:00:00",
        kode_wilayah || null,
        fotoUtama
      ]
    );

    const spotId = result.insertId;

    // 2. Buat kursi-kursi
    for (let i = 1; i <= total_kursi; i++) {
      await connection.execute(
        `INSERT INTO seats (spot_id, nomor_kursi, status, created_at) 
         VALUES (?, ?, 'Available', NOW())`,
        [spotId, i]
      );
    }

    // 3. Tambah fasilitas jika ada
    if (fasilitas_ids) {
      const fasilitasArray = Array.isArray(fasilitas_ids) 
        ? fasilitas_ids 
        : fasilitas_ids.split(',').map(id => parseInt(id.trim()));
      
      for (const fid of fasilitasArray) {
        await connection.execute(
          `INSERT INTO spot_facilities (spot_id, fasilitas_id, created_at) 
           VALUES (?, ?, NOW())`,
          [spotId, fid]
        );
      }
    }

    // 4. Buat wallet untuk owner jika belum ada
    const [existingWallet] = await connection.execute(
      "SELECT owner_id FROM owner_wallets WHERE owner_id = ?",
      [ownerId]
    );

    if (existingWallet.length === 0) {
      await connection.execute(
        `INSERT INTO owner_wallets (owner_id, balance, total_earned, created_at) 
         VALUES (?, 0, 0, NOW())`,
        [ownerId]
      );
    }

    // 5. Kirim notifikasi ke admin
    const [admins] = await connection.execute(
      `SELECT u.id FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE r.role_name = 'Admin'`
    );

    for (const admin of admins) {
      await connection.execute(
        `INSERT INTO notifications (user_id, title, message, created_at) 
         VALUES (?, ?, ?, NOW())`,
        [
          admin.id,
          "Spot Baru Menunggu Approval",
          `Spot "${nama_spot}" dari owner ID:${ownerId} menunggu persetujuan.`
        ]
      );
    }

    await connection.commit();

    return reply.code(201).send({
      status: "Success",
      message: "Spot berhasil dibuat dan menunggu approval admin",
      data: {
        spot_id: spotId,
        nama_spot,
        foto_utama: fotoUtama,
        status: "pending",
        note: "Spot akan ditinjau oleh admin dalam 1-3 hari kerja"
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error("Create pond error:", error);
    
    // Handle duplicate or constraint errors
    if (error.code === 'ER_DUP_ENTRY') {
      return reply.code(409).send({ 
        message: "Spot dengan nama atau lokasi yang sama sudah ada" 
      });
    }
    
    return reply.code(500).send({ 
      error: "Gagal membuat spot",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

/* ================= UPDATE POND ================= */
const updatePond = async (request, reply) => {
  const ownerId = request.user.id;
  const pondId = request.params.id;

  const { 
    nama_spot, 
    deskripsi, 
    alamat, 
    harga_per_jam,
    jam_buka,
    jam_tutup,
    kode_wilayah,
    fasilitas_ids 
  } = request.body;
  
  const fotoBaru = buildFileUrl(request, "ponds");

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Cek kepemilikan dan status
    const [pond] = await connection.execute(
      `SELECT id, status FROM spots 
       WHERE id = ? AND owner_id = ? AND status != 'deleted'`,
      [pondId, ownerId]
    );

    if (pond.length === 0) {
      await connection.rollback();
      return reply.code(404).send({ 
        message: "Spot tidak ditemukan atau bukan milik Anda" 
      });
    }

    // 2. Validasi harga jika diupdate
    if (harga_per_jam && harga_per_jam <= 0) {
      await connection.rollback();
      return reply.code(400).send({ 
        message: "Harga harus lebih dari 0" 
      });
    }

    // 3. Update data di spot
    let updateFields = [];
    let updateValues = [];

    if (nama_spot) {
      updateFields.push("nama_spot = ?");
      updateValues.push(nama_spot);
    }
    if (deskripsi) {
      updateFields.push("deskripsi = ?");
      updateValues.push(deskripsi);
    }
    if (alamat) {
      updateFields.push("alamat = ?");
      updateValues.push(alamat);
    }
    if (harga_per_jam) {
      updateFields.push("harga_per_jam = ?");
      updateValues.push(parseFloat(harga_per_jam));
    }
    if (jam_buka) {
      updateFields.push("jam_buka = ?");
      updateValues.push(jam_buka);
    }
    if (jam_tutup) {
      updateFields.push("jam_tutup = ?");
      updateValues.push(jam_tutup);
    }
    if (kode_wilayah) {
      updateFields.push("kode_wilayah = ?");
      updateValues.push(kode_wilayah);
    }
    if (fotoBaru) {
      updateFields.push("foto_utama = ?");
      updateValues.push(fotoBaru);
    }

    if (updateFields.length === 0) {
      await connection.rollback();
      return reply.code(400).send({ 
        message: "Tidak ada data yang diubah" 
      });
    }

    // Set status pending untuk approval admin
    updateFields.push("status = 'pending'");
    updateFields.push("action_type = 'update'");
    updateFields.push("approved_at = NULL");
    updateFields.push("approved_by = NULL");

    updateValues.push(pondId);

    await connection.execute(
      `UPDATE spots SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    // 4. Update fasilitas jika ada
    if (fasilitas_ids) {
      // Hapus fasilitas lama
      await connection.execute(
        "DELETE FROM spot_facilities WHERE spot_id = ?",
        [pondId]
      );

      // Tambah fasilitas baru
      const fasilitasArray = Array.isArray(fasilitas_ids) 
        ? fasilitas_ids 
        : fasilitas_ids.split(',').map(id => parseInt(id.trim()));
      
      for (const fid of fasilitasArray) {
        await connection.execute(
          `INSERT INTO spot_facilities (spot_id, fasilitas_id, created_at) 
           VALUES (?, ?, NOW())`,
          [pondId, fid]
        );
      }
    }

    // 5. Kirim notifikasi ke admin
    const [admins] = await connection.execute(
      `SELECT u.id FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE r.role_name = 'Admin'`
    );

    for (const admin of admins) {
      await connection.execute(
        `INSERT INTO notifications (user_id, title, message, created_at) 
         VALUES (?, ?, ?, NOW())`,
        [
          admin.id,
          "Update Spot Menunggu Approval",
          `Spot ID:${pondId} telah diupdate oleh owner dan menunggu persetujuan.`
        ]
      );
    }

    await connection.commit();

    return reply.send({
      status: "Success",
      message: "Update berhasil dikirim, menunggu approval admin",
      data: {
        spot_id: pondId,
        updated_fields: updateFields.filter(f => !f.includes('status') && !f.includes('action_type')),
        foto_updated: !!fotoBaru
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error("Update pond error:", error);
    return reply.code(500).send({ 
      error: "Gagal mengupdate spot",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

/* ================= REQUEST DELETE POND ================= */
const requestDeletePond = async (request, reply) => {
  const ownerId = request.user.id;
  const pondId = request.params.id;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Cek kepemilikan dan status
    const [pond] = await connection.execute(
      `SELECT id, nama_spot, status FROM spots 
       WHERE id = ? AND owner_id = ? AND status != 'deleted'`,
      [pondId, ownerId]
    );

    if (pond.length === 0) {
      await connection.rollback();
      return reply.code(404).send({ 
        message: "Spot tidak ditemukan atau bukan milik Anda" 
      });
    }

    // 2. Cek apakah ada booking aktif
    const [activeBookings] = await connection.execute(
      `SELECT COUNT(*) as total FROM bookings b
       JOIN seats s ON b.seat_id = s.id
       WHERE s.spot_id = ? AND b.status_pembayaran = 'Paid'
         AND b.start_time > NOW()`,
      [pondId]
    );

    if (activeBookings[0].total > 0) {
      await connection.rollback();
      return reply.code(400).send({ 
        message: "Tidak bisa menghapus spot yang masih memiliki booking aktif" 
      });
    }

    // 3. Update status menjadi delete_requested
    await connection.execute(
      `UPDATE spots 
       SET status = 'delete_requested', 
           action_type = 'delete',
           approved_at = NULL,
           approved_by = NULL
       WHERE id = ?`,
      [pondId]
    );

    // 4. Kirim notifikasi ke admin
    const [admins] = await connection.execute(
      `SELECT u.id FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE r.role_name = 'Admin'`
    );

    for (const admin of admins) {
      await connection.execute(
        `INSERT INTO notifications (user_id, title, message, created_at) 
         VALUES (?, ?, ?, NOW())`,
        [
          admin.id,
          "Permintaan Hapus Spot",
          `Owner meminta penghapusan spot "${pond[0].nama_spot}" (ID:${pondId}).`
        ]
      );
    }

    await connection.commit();

    return reply.send({
      status: "Success",
      message: "Permintaan hapus spot berhasil dikirim ke admin",
      note: "Admin akan memproses permintaan dalam 1-3 hari kerja"
    });

  } catch (error) {
    await connection.rollback();
    console.error("Request delete pond error:", error);
    return reply.code(500).send({ 
      error: "Gagal mengirim permintaan hapus",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

/* ================= GET SPOT MINI PREVIEW ================= */
const getSpotMiniPreview = async (request, reply) => {
  const { spot_id } = request.params;

  try {
    const [spots] = await pool.execute(
      `
      SELECT 
        s.id,
        s.nama_spot,
        s.foto_utama,
        s.harga_per_jam,
        COALESCE(
          (SELECT AVG(r.rating) FROM reviews r WHERE r.spot_id = s.id),
          0
        ) as avg_rating,
        COALESCE(
          (SELECT COUNT(r.id) FROM reviews r WHERE r.spot_id = s.id),
          0
        ) as total_reviews
      FROM spots s
      WHERE s.id = ? AND s.status = 'approved'
      `,
      [spot_id]
    );

    if (spots.length === 0) {
      return reply.code(404).send({
        message: "Spot tidak ditemukan"
      });
    }

    const spot = spots[0];
    
    return reply.send({
      status: "Success",
      data: {
        id: spot.id,
        nama_spot: spot.nama_spot,
        foto_utama: spot.foto_utama,
        harga_per_jam: spot.harga_per_jam,
        rating: {
          avg: parseFloat(spot.avg_rating.toFixed(1)),
          total: spot.total_reviews,
          formatted: spot.total_reviews > 0 
            ? `${spot.avg_rating.toFixed(1)} (${spot.total_reviews})`
            : "Belum ada rating"
        }
      }
    });
  } catch (error) {
    console.error("Get mini preview error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= GET SPOT PEEK PREVIEW ================= */
const getSpotPeekPreview = async (request, reply) => {
  const { spot_id } = request.params;
  const { user_lat, user_lon } = request.query;

  try {
    let distanceQuery = "";
    const params = [spot_id];
    
    if (user_lat && user_lon && isNumber(user_lat) && isNumber(user_lon)) {
      distanceQuery = `,
        (6371 * acos(
          cos(radians(?)) * cos(radians(s.latitude)) *
          cos(radians(s.longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(s.latitude))
        )) as jarak_km`;
      params.push(user_lat, user_lon, user_lat);
    }

    const [spots] = await pool.execute(
      `
      SELECT 
        s.id,
        s.nama_spot,
        s.deskripsi,
        s.harga_per_jam,
        s.alamat,
        s.foto_utama,
        s.jam_buka,
        s.jam_tutup,
        s.total_kursi,
        COALESCE(
          (SELECT AVG(r.rating) FROM reviews r WHERE r.spot_id = s.id),
          0
        ) as avg_rating,
        COALESCE(
          (SELECT COUNT(r.id) FROM reviews r WHERE r.spot_id = s.id),
          0
        ) as total_reviews,
        GROUP_CONCAT(DISTINCT mf.nama_fasilitas) as fasilitas_list,
        GROUP_CONCAT(DISTINCT mf.ikon) as fasilitas_ikon
        ${distanceQuery}
      FROM spots s
      LEFT JOIN spot_facilities sf ON s.id = sf.spot_id
      LEFT JOIN master_fasilitas mf ON sf.fasilitas_id = mf.id
      WHERE s.id = ? AND s.status = 'approved'
      GROUP BY s.id
      `,
      params
    );

    if (spots.length === 0) {
      return reply.code(404).send({
        message: "Spot tidak ditemukan"
      });
    }

    const spot = spots[0];

    // Format fasilitas
    let fasilitas = [];
    if (spot.fasilitas_list) {
      const namaList = spot.fasilitas_list.split(',');
      const ikonList = spot.fasilitas_ikon ? spot.fasilitas_ikon.split(',') : [];
      
      fasilitas = namaList.map((nama, index) => ({
        nama: nama.trim(),
        ikon: ikonList[index] ? ikonList[index].trim() : 'help'
      }));
    }

    // Format response untuk UI preview
    const responseData = {
      id: spot.id,
      nama_spot: spot.nama_spot,
      deskripsi: spot.deskripsi?.substring(0, 80) + (spot.deskripsi?.length > 80 ? '...' : ''),
      harga_per_jam: spot.harga_per_jam,
      alamat: spot.alamat,
      foto_utama: spot.foto_utama,
      jam_operasional: `${spot.jam_buka} - ${spot.jam_tutup}`,
      total_kursi: spot.total_kursi,
      
      // Jarak jika ada
      jarak: spot.jarak_km ? {
        km: parseFloat(spot.jarak_km.toFixed(1)),
        formatted: `${spot.jarak_km.toFixed(1)} km`
      } : null,
      
      // Rating
      rating: {
        avg: parseFloat(spot.avg_rating.toFixed(1)),
        total: spot.total_reviews,
        formatted: spot.total_reviews > 0 
          ? `${spot.avg_rating.toFixed(1)} (${spot.total_reviews})`
          : "Belum ada rating"
      },
      
      // Fasilitas (max 3 untuk preview)
      fasilitas: fasilitas.slice(0, 3),
      
      // Info booking
      booking_info: {
        tersedia: spot.total_kursi > 0,
        total_kursi: spot.total_kursi
      }
    };

    return reply.send({
      status: "Success",
      data: responseData
    });

  } catch (error) {
    console.error("Get peek preview error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= SEARCH SPOTS ================= */
const searchSpots = async (request, reply) => {
  const {
    search = "",
    user_lat,
    user_lon,
    radius_km = 10,
    fasilitas_ids = "",
    min_rating = 0,
    max_harga = 0,
    page = 1,
    limit = 20
  } = request.query;

  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT 
        s.id,
        s.nama_spot,
        s.deskripsi,
        s.harga_per_jam,
        s.alamat,
        s.foto_utama,
        s.jam_buka,
        s.jam_tutup,
        COALESCE(
          (SELECT AVG(r.rating) FROM reviews r WHERE r.spot_id = s.id),
          0
        ) as avg_rating,
        COALESCE(
          (SELECT COUNT(r.id) FROM reviews r WHERE r.spot_id = s.id),
          0
        ) as total_reviews
    `;

    const params = [];

    // Jarak jika ada koordinat
    if (user_lat && user_lon && isNumber(user_lat) && isNumber(user_lon)) {
      query += `,
        (6371 * acos(
          cos(radians(?)) * cos(radians(s.latitude)) *
          cos(radians(s.longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(s.latitude))
        )) as jarak_km`;
      params.push(user_lat, user_lon, user_lat);
    }

    query += `
      FROM spots s
      WHERE s.status = 'approved'
    `;

    // Search filter
    if (search) {
      query += ` AND (
        s.nama_spot LIKE ? OR 
        s.alamat LIKE ? OR 
        s.deskripsi LIKE ?
      )`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Filter by fasilitas
    if (fasilitas_ids) {
      const fasilitasArray = fasilitas_ids.split(',').map(id => parseInt(id.trim()));
      if (fasilitasArray.length > 0) {
        query += ` AND EXISTS (
          SELECT 1 FROM spot_facilities sf 
          WHERE sf.spot_id = s.id 
          AND sf.fasilitas_id IN (${fasilitasArray.map(() => '?').join(',')})
        )`;
        params.push(...fasilitasArray);
      }
    }

    // Filter by rating
    if (min_rating > 0) {
      query += ` HAVING avg_rating >= ?`;
      params.push(parseFloat(min_rating));
    }

    // Filter by harga
    if (max_harga > 0) {
      query += ` ${min_rating > 0 ? 'AND' : 'HAVING'} s.harga_per_jam <= ?`;
      params.push(parseFloat(max_harga));
    }

    // Filter by radius
    if (user_lat && user_lon && radius_km > 0) {
      query += ` ${params.length > 0 ? 'AND' : 'HAVING'} jarak_km <= ?`;
      params.push(parseFloat(radius_km));
    }

    // Ordering
    if (user_lat && user_lon) {
      query += ` ORDER BY jarak_km ASC`;
    } else {
      query += ` ORDER BY avg_rating DESC, total_reviews DESC`;
    }

    // Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [spots] = await pool.execute(query, params);

    // Format response
    const formattedSpots = spots.map(spot => ({
      id: spot.id,
      nama_spot: spot.nama_spot,
      deskripsi: spot.deskripsi?.substring(0, 100) + (spot.deskripsi?.length > 100 ? '...' : ''),
      harga_per_jam: spot.harga_per_jam,
      alamat: spot.alamat,
      foto_utama: spot.foto_utama,
      jam_operasional: `${spot.jam_buka} - ${spot.jam_tutup}`,
      rating: {
        avg: parseFloat(spot.avg_rating.toFixed(1)),
        total: spot.total_reviews,
        formatted: spot.total_reviews > 0 
          ? `${spot.avg_rating.toFixed(1)} (${spot.total_reviews})`
          : "Belum ada rating"
      },
      jarak: spot.jarak_km ? {
        km: parseFloat(spot.jarak_km.toFixed(1)),
        formatted: `${spot.jarak_km.toFixed(1)} km`
      } : null
    }));

    return reply.send({
      status: "Success",
      data: formattedSpots,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        has_more: spots.length === parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Search spots error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= GET MULTIPLE SPOT PREVIEWS ================= */
const getMultipleSpotPreviews = async (request, reply) => {
  const { spot_ids, user_lat, user_lon } = request.query;
  
  if (!spot_ids) {
    return reply.code(400).send({ 
      message: "spot_ids diperlukan" 
    });
  }

  const idArray = spot_ids.split(',').map(id => parseInt(id.trim()));
  
  try {
    let distanceQuery = "";
    const params = [...idArray];
    
    if (user_lat && user_lon && isNumber(user_lat) && isNumber(user_lon)) {
      distanceQuery = `,
        (6371 * acos(
          cos(radians(?)) * cos(radians(s.latitude)) *
          cos(radians(s.longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(s.latitude))
        )) as jarak_km`;
      params.push(user_lat, user_lon, user_lat);
    }

    const query = `
      SELECT 
        s.id,
        s.nama_spot,
        s.foto_utama,
        s.harga_per_jam,
        s.latitude,
        s.longitude,
        COALESCE((SELECT AVG(rating) FROM reviews WHERE spot_id = s.id), 0) as avg_rating
        ${distanceQuery}
      FROM spots s
      WHERE s.id IN (${idArray.map(() => '?').join(',')})
        AND s.status = 'approved'
    `;

    const [spots] = await pool.execute(query, params);

    return reply.send({
      status: "Success",
      data: spots.map(spot => ({
        id: spot.id,
        nama_spot: spot.nama_spot,
        foto_utama: spot.foto_utama,
        harga_per_jam: spot.harga_per_jam,
        latitude: spot.latitude,
        longitude: spot.longitude,
        avg_rating: parseFloat(spot.avg_rating.toFixed(1)),
        jarak_km: spot.jarak_km ? parseFloat(spot.jarak_km.toFixed(1)) : null
      }))
    });
  } catch (error) {
    console.error("Get multiple previews error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= GET OWNER SPOTS ================= */
const getOwnerSpots = async (request, reply) => {
  const ownerId = request.user.id;
  const { status } = request.query; // pending, approved, rejected, all

  try {
    let query = `
      SELECT 
        s.*,
        COALESCE(
          (SELECT AVG(r.rating) FROM reviews r WHERE r.spot_id = s.id),
          0
        ) as avg_rating,
        COALESCE(
          (SELECT COUNT(r.id) FROM reviews r WHERE r.spot_id = s.id),
          0
        ) as total_reviews,
        (SELECT COUNT(*) FROM seats se WHERE se.spot_id = s.id AND se.status = 'Available') as kursi_tersedia,
        DATE_FORMAT(s.created_at, '%d %b %Y') as created_formatted,
        DATE_FORMAT(s.approved_at, '%d %b %Y') as approved_formatted
      FROM spots s
      WHERE s.owner_id = ?
    `;
    
    const params = [ownerId];
    
    // Filter by status
    if (status && status !== 'all') {
      query += ` AND s.status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY 
      CASE s.status 
        WHEN 'pending' THEN 1
        WHEN 'delete_requested' THEN 2
        WHEN 'approved' THEN 3
        WHEN 'rejected' THEN 4
        ELSE 5
      END,
      s.created_at DESC`;
    
    const [spots] = await pool.execute(query, params);

    return reply.send({
      status: "Success",
      data: spots
    });

  } catch (error) {
    console.error("Get owner spots error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= GET SPOT STATS ================= */
const getSpotStats = async (request, reply) => {
  const { spot_id } = request.params;
  const ownerId = request.user.id;

  try {
    // Cek kepemilikan
    const [ownership] = await pool.execute(
      "SELECT id FROM spots WHERE id = ? AND owner_id = ?",
      [spot_id, ownerId]
    );

    if (ownership.length === 0) {
      return reply.code(403).send({ 
        message: "Spot tidak ditemukan atau bukan milik Anda" 
      });
    }

    // Ambil stats
    const [[stats]] = await pool.execute(
      `
      SELECT 
        (SELECT COUNT(*) FROM bookings b 
         JOIN seats s ON b.seat_id = s.id 
         WHERE s.spot_id = ? AND b.status_pembayaran = 'Paid') as total_bookings,
        (SELECT COALESCE(SUM(total_harga), 0) FROM bookings b 
         JOIN seats s ON b.seat_id = s.id 
         WHERE s.spot_id = ? AND b.status_pembayaran = 'Paid') as total_revenue,
        (SELECT COUNT(*) FROM reviews WHERE spot_id = ?) as total_reviews,
        (SELECT COUNT(*) FROM seats WHERE spot_id = ? AND status = 'Available') as available_seats,
        (SELECT COUNT(*) FROM seats WHERE spot_id = ?) as total_seats
      `,
      [spot_id, spot_id, spot_id, spot_id, spot_id]
    );

    // Ambil booking bulanan
    const [monthlyBookings] = await pool.execute(
      `
      SELECT 
        DATE_FORMAT(b.created_at, '%Y-%m') as month,
        COUNT(*) as booking_count,
        COALESCE(SUM(b.total_harga), 0) as revenue
      FROM bookings b
      JOIN seats s ON b.seat_id = s.id
      WHERE s.spot_id = ? 
        AND b.status_pembayaran = 'Paid'
        AND b.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(b.created_at, '%Y-%m')
      ORDER BY month DESC
      `,
      [spot_id]
    );

    return reply.send({
      status: "Success",
      data: {
        stats: {
          total_bookings: stats.total_bookings,
          total_revenue: parseFloat(stats.total_revenue),
          total_reviews: stats.total_reviews,
          seat_availability: {
            available: stats.available_seats,
            total: stats.total_seats,
            percentage: stats.total_seats > 0 
              ? Math.round((stats.available_seats / stats.total_seats) * 100)
              : 0
          }
        },
        monthly_bookings: monthlyBookings
      }
    });

  } catch (error) {
    console.error("Get spot stats error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getSpotSeats,
  createPond,
  updatePond,
  requestDeletePond,
  getSpotMiniPreview,
  getSpotPeekPreview,
  searchSpots,
  getMultipleSpotPreviews,
  getOwnerSpots,
  getSpotStats
};