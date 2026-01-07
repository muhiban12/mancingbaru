// src/controllers/ownerController.js
const pool = require("../config/db");
const { buildFileUrl } = require("./helper/file.helper");

/**
 * Get semua spot milik owner
 */
const getOwnerSpots = async (request, reply) => {
  const ownerId = request.user.id;

  try {
    const [spots] = await pool.execute(`
      SELECT 
        s.id,
        s.nama_spot,
        s.status,
        s.foto_utama,
        s.harga_per_jam,
        s.total_kursi,
        s.jam_buka,
        s.jam_tutup,
        s.alamat,
        -- Statistics
        (SELECT COUNT(*) FROM bookings b 
         JOIN seats st ON b.seat_id = st.id 
         WHERE st.spot_id = s.id AND DATE(b.start_time) = CURDATE()) as today_bookings,
        (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE spot_id = s.id) as avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE spot_id = s.id) as total_reviews,
        (SELECT COUNT(*) FROM seats WHERE spot_id = s.id AND status = 'Available') as available_seats
      FROM spots s
      WHERE s.owner_id = ? 
        AND s.status = 'approved'
      ORDER BY s.created_at DESC
    `, [ownerId]);

    // Format foto URLs
    const processedSpots = spots.map(spot => ({
      ...spot,
      foto_utama_url: spot.foto_utama ? buildFileUrl(spot.foto_utama) : null,
      avg_rating: parseFloat(spot.avg_rating).toFixed(1)
    }));

    return reply.send({
      status: "Success",
      data: processedSpots
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

/**
 * Get dashboard data berdasarkan spot_id tertentu
 */
const getOwnerDashboard = async (request, reply) => {
  const ownerId = request.user.id;
  const { spot_id } = request.query;

  let selectedSpotId = spot_id;

  try {
    // Jika tidak ada spot_id, ambil spot pertama yang approved
    if (!selectedSpotId || selectedSpotId === "undefined" || selectedSpotId === "null") {
      const [defaultSpot] = await pool.execute(`
        SELECT id FROM spots 
        WHERE owner_id = ? AND status = 'approved'
        ORDER BY created_at DESC 
        LIMIT 1
      `, [ownerId]);

      if (defaultSpot.length > 0) {
        selectedSpotId = defaultSpot[0].id;
      } else {
        return reply.send({
          status: "Success",
          data: null,
          message: "Belum ada spot yang disetujui"
        });
      }
    }

    // Verifikasi spot milik owner
    const [[spot]] = await pool.execute(`
      SELECT s.* FROM spots s
      WHERE s.id = ? AND s.owner_id = ? AND s.status = 'approved'
    `, [selectedSpotId, ownerId]);

    if (!spot) {
      return reply.code(403).send({
        message: "Spot tidak ditemukan atau tidak diizinkan"
      });
    }

    // 1. DATA STATISTIK UTAMA
    const [[stats]] = await pool.execute(`
      SELECT 
        -- Total bookings
        (SELECT COUNT(*) FROM bookings b 
         JOIN seats st ON b.seat_id = st.id 
         WHERE st.spot_id = ?) as total_bookings,
        
        -- Today's bookings
        (SELECT COUNT(*) FROM bookings b 
         JOIN seats st ON b.seat_id = st.id 
         WHERE st.spot_id = ? AND DATE(b.start_time) = CURDATE()) as today_bookings,
        
        -- Total revenue (hanya yang paid)
        (SELECT COALESCE(SUM(total_harga), 0) FROM bookings b 
         JOIN seats st ON b.seat_id = st.id 
         WHERE st.spot_id = ? AND b.status_pembayaran = 'Paid') as total_revenue,
        
        -- Today's revenue
        (SELECT COALESCE(SUM(total_harga), 0) FROM bookings b 
         JOIN seats st ON b.seat_id = st.id 
         WHERE st.spot_id = ? AND b.status_pembayaran = 'Paid' 
           AND DATE(b.start_time) = CURDATE()) as today_revenue,
        
        -- Avg rating
        (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE spot_id = ?) as avg_rating,
        
        -- Total reviews
        (SELECT COUNT(*) FROM reviews WHERE spot_id = ?) as total_reviews,
        
        -- Active seats
        (SELECT COUNT(*) FROM seats WHERE spot_id = ? AND status = 'Available') as available_seats,
        
        -- Total seats
        (SELECT COUNT(*) FROM seats WHERE spot_id = ?) as total_seats
    `, [
      selectedSpotId, selectedSpotId, selectedSpotId, 
      selectedSpotId, selectedSpotId, selectedSpotId,
      selectedSpotId, selectedSpotId
    ]);

    // 2. TODAY'S RESERVATIONS (dengan detail lebih lengkap)
    const [todayReservations] = await pool.execute(`
      SELECT 
        b.id,
        b.booking_token,
        b.start_time,
        b.duration,
        b.total_harga,
        b.status_pembayaran,
        b.is_check_in,
        u.nama_lengkap as customer_name,
        u.nomer_wa as customer_wa,
        u.email as customer_email,
        st.nomor_kursi,
        DATE_FORMAT(b.start_time, '%H:%i') as start_hour,
        DATE_FORMAT(DATE_ADD(b.start_time, INTERVAL b.duration HOUR), '%H:%i') as end_hour
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN seats st ON b.seat_id = st.id
      WHERE st.spot_id = ? AND DATE(b.start_time) = CURDATE()
      ORDER BY b.start_time ASC
    `, [selectedSpotId]);

    // 3. RECENT REVIEWS (maks 3)
    const [recentReviews] = await pool.execute(`
      SELECT 
        r.id,
        r.rating,
        r.ulasan,
        r.foto_ulasan,
        r.created_at,
        u.nama_lengkap as reviewer_name,
        u.foto_profil,
        DATE_FORMAT(r.created_at, '%d %b %Y') as review_date
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.spot_id = ?
      ORDER BY r.created_at DESC
      LIMIT 3
    `, [selectedSpotId]);

    // 4. EARNINGS LAST 7 DAYS (untuk chart)
    const [weeklyEarnings] = await pool.execute(`
      SELECT 
        DATE(b.start_time) as date,
        SUM(b.total_harga) as earnings,
        COUNT(*) as bookings_count
      FROM bookings b
      JOIN seats st ON b.seat_id = st.id
      WHERE st.spot_id = ? 
        AND b.status_pembayaran = 'Paid'
        AND b.start_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(b.start_time)
      ORDER BY date ASC
    `, [selectedSpotId]);

    // 5. GET ALL SPOTS OWNED (untuk dropdown switch)
    const [allSpots] = await pool.execute(`
      SELECT id, nama_spot, foto_utama, status
      FROM spots 
      WHERE owner_id = ? AND status = 'approved'
      ORDER BY nama_spot
    `, [ownerId]);

    // 6. GET OWNER WALLET INFO
    const [[wallet]] = await pool.execute(`
      SELECT balance, total_earned 
      FROM owner_wallets 
      WHERE owner_id = ?
    `, [ownerId]);

    // Format response
    const response = {
      spot_info: {
        id: spot.id,
        nama_spot: spot.nama_spot,
        alamat: spot.alamat,
        deskripsi: spot.deskripsi,
        foto_utama_url: spot.foto_utama ? buildFileUrl(spot.foto_utama) : null,
        harga_per_jam: spot.harga_per_jam,
        total_kursi: spot.total_kursi,
        jam_buka: spot.jam_buka?.substring(0, 5) || '08:00',
        jam_tutup: spot.jam_tutup?.substring(0, 5) || '20:00',
        kode_wilayah: spot.kode_wilayah
      },
      statistics: {
        total_bookings: stats.total_bookings || 0,
        today_bookings: stats.today_bookings || 0,
        total_revenue: stats.total_revenue || 0,
        today_revenue: stats.today_revenue || 0,
        avg_rating: parseFloat(stats.avg_rating || 0).toFixed(1),
        total_reviews: stats.total_reviews || 0,
        available_seats: stats.available_seats || 0,
        total_seats: stats.total_seats || 0,
        occupancy_rate: stats.total_seats > 0 
          ? Math.round(((stats.total_seats - stats.available_seats) / stats.total_seats) * 100)
          : 0,
        wallet_balance: wallet?.balance || 0,
        total_earned: wallet?.total_earned || 0
      },
      today_reservations: todayReservations.map(res => ({
        ...res,
        formatted_time: `${res.start_hour} - ${res.end_hour}`,
        status_color: res.status_pembayaran === 'Paid' ? 'green' : 
                      res.status_pembayaran === 'Pending' ? 'orange' : 'red'
      })),
      recent_reviews: recentReviews.map(review => ({
        ...review,
        foto_profil_url: review.foto_profil ? buildFileUrl(review.foto_profil) : null,
        foto_ulasan_url: review.foto_ulasan ? buildFileUrl(review.foto_ulasan) : null,
        rating_stars: '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
      })),
      weekly_earnings: weeklyEarnings,
      all_spots: allSpots.map(s => ({
        ...s,
        foto_utama_url: s.foto_utama ? buildFileUrl(s.foto_utama) : null,
        is_active: s.id === parseInt(selectedSpotId)
      }))
    };

    return reply.send({
      status: "Success",
      data: response
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    return reply.code(500).send({ error: error.message });
  }
};

/**
 * Set active spot (simpan di localStorage saja - client side)
 */
const setActiveSpot = async (request, reply) => {
  const ownerId = request.user.id;
  const { spot_id } = request.body;

  try {
    // Verifikasi spot milik owner
    const [[spot]] = await pool.execute(`
      SELECT id, nama_spot FROM spots 
      WHERE id = ? AND owner_id = ? AND status = 'approved'
    `, [spot_id, ownerId]);

    if (!spot) {
      return reply.code(403).send({
        message: "Spot tidak ditemukan atau tidak diizinkan"
      });
    }

    // Tidak perlu simpan di database, cukup return info
    return reply.send({
      status: "Success",
      message: "Spot aktif berhasil diubah",
      active_spot: {
        id: spot.id,
        nama_spot: spot.nama_spot
      }
    });

  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

/**
 * Check owner status & spot count (untuk sidebar)
 */
const getOwnerStatus = async (request, reply) => {
  const userId = request.user.id;

  try {
    // Cek role owner
    const [roleRows] = await pool.execute(`
      SELECT r.role_name 
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ? AND r.role_name = 'Owner'
    `, [userId]);

    const isOwner = roleRows.length > 0;
    
    if (!isOwner) {
      return reply.send({
        is_owner: false,
        has_spots: false,
        spot_count: 0
      });
    }

    // Hitung spot approved
    const [spotRows] = await pool.execute(`
      SELECT COUNT(*) as spot_count 
      FROM spots 
      WHERE owner_id = ? AND status = 'approved'
    `, [userId]);

    const spotCount = spotRows[0].spot_count;
    const hasSpots = spotCount > 0;

    // Ambil spot pertama untuk default
    let activeSpot = null;
    if (hasSpots) {
      const [spotRows] = await pool.execute(`
        SELECT id, nama_spot, foto_utama
        FROM spots 
        WHERE owner_id = ? AND status = 'approved'
        ORDER BY created_at DESC
        LIMIT 1
      `, [userId]);
      
      if (spotRows.length > 0) {
        activeSpot = {
          id: spotRows[0].id,
          nama_spot: spotRows[0].nama_spot,
          foto_utama_url: spotRows[0].foto_utama ? buildFileUrl(spotRows[0].foto_utama) : null
        };
      }
    }

    return reply.send({
      is_owner: true,
      has_spots: hasSpots,
      spot_count: spotCount,
      active_spot: activeSpot
    });

  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

module.exports = {
  getOwnerSpots,
  getOwnerDashboard,
  setActiveSpot,
  getOwnerStatus
};