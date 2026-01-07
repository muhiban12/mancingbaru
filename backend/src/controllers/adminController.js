  const pool = require("../config/db");
  const { buildFileUrl } = require("./helper/file.helper");

  const getAdminPonds = async (request, reply) => {
    try {
      const [rows] = await pool.execute("SELECT * FROM spots");
      return reply.send({
        status: "Success",
        data: rows,
      });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  const approveDeletePond = async (request, reply) => {
    const pondId = request.params.id;

    await pool.execute(
      'UPDATE spots SET status = "deleted" WHERE id = ? AND status = "delete_requested"',
      [pondId]
    );

    reply.send({ message: "Pond berhasil dihapus" });
  };

  // Fungsi untuk Admin mengubah status spot
  const approveSpot = async (request, reply) => {
    const adminId = request.user.id;
    const { id } = request.params;
    const { decision } = request.body; // approved | rejected

    if (!["approved", "rejected"].includes(decision)) {
      return reply.code(400).send({ message: "Decision tidak valid" });
    }

    const [[spot]] = await pool.execute(
      `
      SELECT id, owner_id, action_type
      FROM spots 
      WHERE id = ? AND status = 'pending'
      `,
      [id]
    );

    if (!spot) {
      return reply.code(404).send({
        message: "Spot tidak ditemukan atau bukan status pending",
      });
    }

    let finalStatus = decision;

    // 🔥 LOGIKA UTAMA
    if (spot.action_type === "delete") {
      finalStatus = decision === "approved" ? "deleted" : "approved";
    }

    await pool.execute(
      `
      UPDATE spots
      SET 
        status = ?,
        approved_at = NOW(),
        approved_by = ?
      WHERE id = ?
      `,
      [finalStatus, adminId, id]
    );

    // Kirim notifikasi ke owner
    await pool.execute(
      `
    INSERT INTO notifications (user_id, title, message)
    VALUES (?, ?, ?)
    `,
      [
        spot.owner_id,
        "Status Spot Diperbarui",
        `Spot kamu telah ${decision} oleh admin`,
      ]
    );

    reply.send({
      status: "Success",
      message: `Spot berhasil di-${decision}`,
    });
  };

  //bagian spots liar
  const createWildSpot = async (request, reply) => {
    const {
      nama_lokasi,
      kabupaten_provinsi,
      deskripsi_spot,
      latitude,
      longitude,
      status_potensi,
      kode_wilayah,
      foto_carousel, // Tambahkan ini agar cuaca & foto muncul
    } = request.body;

    const adminId = request.user.id;

    try {
      const [result] = await pool.execute(
        `INSERT INTO wild_spots (
          admin_id, nama_lokasi, kabupaten_provinsi, deskripsi_spot, 
          latitude, longitude, status_potensi, kode_wilayah, foto_carousel
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          adminId,
          nama_lokasi,
          kabupaten_provinsi,
          deskripsi_spot,
          latitude,
          longitude,
          status_potensi,
          kode_wilayah,
          foto_carousel,
        ]
      );

      return reply.code(201).send({
        status: "Success",
        message: "Spot liar berhasil ditambahkan!",
        spotId: result.insertId,
      });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  const updateWildSpot = async (request, reply) => {
    const { id } = request.params;
    const {
      nama_lokasi,
      kabupaten_provinsi,
      deskripsi_spot,
      latitude,
      longitude,
      status_potensi,
      kode_wilayah,
    } = request.body;

    const fotoCarousel = buildFileUrl(request, "wildspots");

    let query = `
      UPDATE wild_spots SET
        nama_lokasi=?, kabupaten_provinsi=?, deskripsi_spot=?,
        latitude=?, longitude=?, status_potensi=?, kode_wilayah=?
    `;
    const values = [
      nama_lokasi,
      kabupaten_provinsi,
      deskripsi_spot,
      latitude,
      longitude,
      status_potensi,
      kode_wilayah,
    ];

    if (fotoCarousel) {
      query += `, foto_carousel=?`;
      values.push(fotoCarousel);
    }

    query += ` WHERE id=?`;
    values.push(id);

    await pool.execute(query, values);

    reply.send({ status: "Success", foto: fotoCarousel || "tidak diubah" });
  };

  const deleteWildSpot = async (request, reply) => {
    const { id } = request.params;

    try {
      // 1. Cek apakah data spot liar tersebut ada
      const [exist] = await pool.execute(
        "SELECT id FROM wild_spots WHERE id = ?",
        [id]
      );

      if (exist.length === 0) {
        return reply.code(404).send({
          status: "Error",
          message: "Spot liar tidak ditemukan!",
        });
      }

      // 2. Hapus data dari database
      await pool.execute("DELETE FROM wild_spots WHERE id = ?", [id]);

      return reply.send({
        status: "Success",
        message: "Spot liar berhasil dihapus dari sistem oleh Admin.",
      });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  // Admin menghapus strike feed yang melanggar aturan
  const adminDeleteStrikeFeed = async (request, reply) => {
    const { id } = request.params;
    // Pastikan request.user.role === 'Admin' (dari JWT)

    try {
      await pool.execute("DELETE FROM strike_feeds WHERE id = ?", [id]);
      return reply.send({
        status: "Success",
        message: "Postingan berhasil dihapus oleh Admin.",
      });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  // Admin menghapus ulasan yang tidak pantas
  const adminDeleteReview = async (request, reply) => {
    const { id } = request.params;

    try {
      await pool.execute("DELETE FROM reviews WHERE id = ?", [id]);
      return reply.send({
        status: "Success",
        message: "Ulasan berhasil dihapus oleh Admin.",
      });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  const getFeedReports = async (request, reply) => {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          fr.id,
          fr.reason,
          fr.status,
          fr.created_at,
          u.nama_lengkap AS reporter,
          sf.caption
        FROM feed_reports fr
        JOIN users u ON fr.reporter_id = u.id
        JOIN strike_feeds sf ON fr.feed_id = sf.id
        ORDER BY fr.created_at DESC
      `);

      return reply.send({
        status: 'Success',
        data: rows
      });

    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  const resolveFeedReport = async (request, reply) => {
    const { id } = request.params;
    const { action } = request.body;
    // action: 'delete' | 'ignore'

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [[report]] = await conn.execute(
        'SELECT feed_id FROM feed_reports WHERE id = ?',
        [id]
      );

      if (!report) {
        await conn.rollback();
        return reply.code(404).send({ message: 'Laporan tidak ditemukan' });
      }

      if (action === 'delete') {
        await conn.execute(
          'DELETE FROM strike_feeds WHERE id = ?',
          [report.feed_id]
        );
      }

      await conn.execute(
        'UPDATE feed_reports SET status = ? WHERE id = ?',
        ['reviewed', id]
      );

      await conn.commit();

      return reply.send({
        status: 'Success',
        message: 'Laporan berhasil diproses'
      });

    } catch (error) {
      await conn.rollback();
      return reply.code(500).send({ error: error.message });
    } finally {
      conn.release();
    }
  };

  const getPendingEvents = async (request, reply) => {
    try {
      const [events] = await pool.execute(`
        SELECT 
          e.*,
          s.nama_spot,
          s.alamat,
          u.nama_lengkap as owner_name,
          u.email as owner_email,
          u.nomer_wa as owner_wa,
          DATE_FORMAT(e.tanggal_mulai, '%a, %d %b %Y • %H:%i') as formatted_start,
          DATE_FORMAT(e.tanggal_selesai, '%a, %d %b %Y • %H:%i') as formatted_end,
          (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id) as total_registrants
        FROM events e
        JOIN spots s ON e.spot_id = s.id
        JOIN users u ON s.owner_id = u.id
        WHERE e.status_persetujuan = 'Pending'
        ORDER BY e.created_at DESC
      `);

      return reply.send({
        status: "Success",
        data: events,
      });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  const approveEvent = async (request, reply) => {
    const { event_id } = request.params;
    const { decision, rejection_reason } = request.body; // decision: 'Approved' | 'Rejected'

    if (!['Approved', 'Rejected'].includes(decision)) {
      return reply.code(400).send({ message: 'Decision tidak valid' });
    }

    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();

      // Cek apakah event masih pending
      const [[event]] = await conn.execute(
        `SELECT e.*, s.owner_id, u.nama_lengkap as owner_name, u.email 
        FROM events e
        JOIN spots s ON e.spot_id = s.id
        JOIN users u ON s.owner_id = u.id
        WHERE e.id = ? AND e.status_persetujuan = 'Pending'`,
        [event_id]
      );

      if (!event) {
        await conn.rollback();
        return reply.code(404).send({ 
          message: 'Event tidak ditemukan atau sudah diproses' 
        });
      }

      // Update status event
      await conn.execute(
        `UPDATE events 
        SET status_persetujuan = ?, 
            admin_action_at = NOW(),
            rejection_reason = ?
        WHERE id = ?`,
        [decision, rejection_reason || null, event_id]
      );

      // Kirim notifikasi ke owner
      let notificationTitle, notificationMessage;
      
      if (decision === 'Approved') {
        notificationTitle = 'Event Disetujui!';
        notificationMessage = `Event "${event.nama_event}" telah disetujui oleh admin dan sekarang aktif.`;
      } else {
        notificationTitle = 'Event Ditolak';
        notificationMessage = `Event "${event.nama_event}" ditolak oleh admin.${rejection_reason ? ` Alasan: ${rejection_reason}` : ''}`;
      }

      await conn.execute(
        `INSERT INTO notifications (user_id, title, message) 
        VALUES (?, ?, ?)`,
        [event.owner_id, notificationTitle, notificationMessage]
      );

      await conn.commit();

      return reply.send({
        status: "Success",
        message: `Event berhasil di-${decision.toLowerCase()}`
      });

    } catch (error) {
      await conn.rollback();
      return reply.code(500).send({ error: error.message });
    } finally {
      conn.release();
    }
  };

  const deleteEvent = async (request, reply) => {
    const { event_id } = request.params;
    const { reason } = request.body;

    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();

      // Ambil info event
      const [[event]] = await conn.execute(
        `SELECT e.*, s.owner_id 
        FROM events e
        JOIN spots s ON e.spot_id = s.id
        WHERE e.id = ?`,
        [event_id]
      );

      if (!event) {
        await conn.rollback();
        return reply.code(404).send({ 
          message: 'Event tidak ditemukan' 
        });
      }

      // Hapus semua registrations terlebih dahulu (karena foreign key)
      await conn.execute(
        `DELETE FROM event_registrations WHERE event_id = ?`,
        [event_id]
      );

      // Hapus event
      await conn.execute(
        `DELETE FROM events WHERE id = ?`,
        [event_id]
      );

      // Kirim notifikasi ke owner dan semua yang terdaftar
      const notificationMessage = reason 
        ? `Event "${event.nama_event}" telah dihapus oleh admin. Alasan: ${reason}`
        : `Event "${event.nama_event}" telah dihapus oleh admin.`;

      // Notify owner
      await conn.execute(
        `INSERT INTO notifications (user_id, title, message) 
        VALUES (?, ?, ?)`,
        [event.owner_id, 'Event Dihapus', notificationMessage]
      );

      // Notify all registered users
      const [registrants] = await conn.execute(
        `SELECT DISTINCT user_id FROM event_registrations WHERE event_id = ?`,
        [event_id]
      );

      for (const registrant of registrants) {
        await conn.execute(
          `INSERT INTO notifications (user_id, title, message) 
          VALUES (?, ?, ?)`,
          [registrant.user_id, 'Event Dibatalkan', `Event "${event.nama_event}" yang Anda daftari telah dibatalkan.`]
        );
      }

      await conn.commit();

      return reply.send({
        status: "Success",
        message: "Event berhasil dihapus"
      });

    } catch (error) {
      await conn.rollback();
      return reply.code(500).send({ error: error.message });
    } finally {
      conn.release();
    }
  };

  const getEventDetailForAdmin = async (request, reply) => {
    const { event_id } = request.params;

    try {
      const [events] = await pool.execute(`
        SELECT 
          e.*,
          s.nama_spot,
          s.alamat,
          s.foto_utama as spot_foto,
          u.nama_lengkap as owner_name,
          u.email as owner_email,
          u.nomer_wa as owner_wa,
          DATE_FORMAT(e.tanggal_mulai, '%a, %d %b %Y • %H:%i') as formatted_start,
          DATE_FORMAT(e.tanggal_selesai, '%a, %d %b %Y • %H:%i') as formatted_end,
          DATE_FORMAT(e.batas_pendaftaran, '%a, %d %b %Y • %H:%i') as formatted_registration_deadline,
          (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id) as total_registrants,
          GROUP_CONCAT(DISTINCT er.user_id) as registrant_ids
        FROM events e
        JOIN spots s ON e.spot_id = s.id
        JOIN users u ON s.owner_id = u.id
        LEFT JOIN event_registrations er ON e.id = er.event_id
        WHERE e.id = ?
        GROUP BY e.id
      `, [event_id]);

      if (events.length === 0) {
        return reply.code(404).send({ 
          message: 'Event tidak ditemukan' 
        });
      }

      const event = events[0];
      
      // Parse hadiah dari JSON
      let hadiahArray = [];
      if (event.hadiah) {
        try {
          hadiahArray = JSON.parse(event.hadiah);
        } catch (err) {
          hadiahArray = [];
        }
      }

      // Ambil daftar peserta
      const [participants] = await pool.execute(`
        SELECT 
          er.*,
          u.nama_lengkap,
          u.email,
          u.nomer_wa,
          DATE_FORMAT(er.registration_date, '%d %b %Y %H:%i') as formatted_registration_date
        FROM event_registrations er
        JOIN users u ON er.user_id = u.id
        WHERE er.event_id = ?
        ORDER BY er.registration_date DESC
      `, [event_id]);

      const responseData = {
        ...event,
        hadiah: hadiahArray,
        participants: participants,
        kuota_tersisa: Math.max(0, event.maks_peserta - event.total_registrants),
        status_event: event.status_persetujuan === 'Pending' ? 'Menunggu Approval' : 
                      event.status_persetujuan === 'Approved' ? 'Aktif' : 'Ditolak'
      };

      return reply.send({
        status: "Success",
        data: responseData,
      });

    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  // ==================== OWNER UPGRADE APPROVAL ====================

  /**
   * Mendapatkan daftar user yang mengajukan upgrade ke Owner
   */
  const getOwnerUpgradeRequests = async (request, reply) => {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          u.id,
          u.nama_lengkap,
          u.email,
          u.nomer_wa,
          u.provinsi_asal,
          u.kota_kabupaten,
          u.foto_ktp,
          u.foto_wajah_verifikasi,
          u.status_akun,
          u.created_at as request_date,
          COUNT(s.id) as total_spots_submitted
        FROM users u
        LEFT JOIN spots s ON u.id = s.owner_id 
          AND s.action_type = 'create' 
          AND s.status = 'pending'
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        WHERE ur.role_id = 2 
          AND u.status_akun = 'Pending'
        GROUP BY u.id
        ORDER BY u.created_at DESC
      `);

      // Tambahkan URL lengkap untuk foto
      const processedRows = rows.map(user => ({
        ...user,
        foto_ktp_url: buildFileUrl(request, user.foto_ktp),
        foto_wajah_url: buildFileUrl(request, user.foto_wajah_verifikasi)
      }));

      return reply.send({
        status: "Success",
        data: processedRows
      });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  /**
   * Admin approve/reject upgrade user ke Owner
   */
  const approveOwnerUpgrade = async (request, reply) => {
    const adminId = request.user.id;
    const { user_id } = request.params;
    const { decision, rejection_reason } = request.body; // decision: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(decision)) {
      return reply.code(400).send({ 
        message: "Decision harus 'approve' atau 'reject'" 
      });
    }

    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();

      // Cek apakah user masih pending
      const [[user]] = await conn.execute(`
        SELECT u.*, ur.role_id 
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.role_id = 2
        WHERE u.id = ? AND u.status_akun = 'Pending'
      `, [user_id]);

      if (!user) {
        await conn.rollback();
        return reply.code(404).send({ 
          message: 'User tidak ditemukan atau sudah diproses' 
        });
      }

      // Update status user
      const newStatus = decision === 'approve' ? 'Verified' : 'Rejected';
      
      await conn.execute(
        `UPDATE users 
        SET status_akun = ?, 
            verified_at = NOW()
        WHERE id = ?`,
        [newStatus, user_id]
      );

      // Jika approve, auto-approve juga spots pending milik user ini
      if (decision === 'approve') {
        await conn.execute(`
          UPDATE spots 
          SET status = 'approved',
              approved_at = NOW(),
              approved_by = ?
          WHERE owner_id = ? 
            AND status = 'pending' 
            AND action_type = 'create'
        `, [adminId, user_id]);

        // Buat wallet untuk owner jika belum ada
        const [[wallet]] = await conn.execute(
          'SELECT * FROM owner_wallets WHERE owner_id = ?',
          [user_id]
        );

        if (!wallet) {
          await conn.execute(
            'INSERT INTO owner_wallets (owner_id, balance, total_earned) VALUES (?, 0, 0)',
            [user_id]
          );
        }
      } else {
        // Jika reject, reject juga spots pending
        await conn.execute(`
          UPDATE spots 
          SET status = 'rejected'
          WHERE owner_id = ? 
            AND status = 'pending' 
            AND action_type = 'create'
        `, [user_id]);
      }

      // Kirim notifikasi ke user
      let notificationTitle, notificationMessage;
      
      if (decision === 'approve') {
        notificationTitle = 'Upgrade ke Owner Disetujui!';
        notificationMessage = `Selamat! Akun Anda sekarang telah menjadi Owner. Anda dapat mulai mengelola spot pancing Anda.`;
      } else {
        notificationTitle = 'Upgrade ke Owner Ditolak';
        notificationMessage = `Pengajuan upgrade akun Anda ke Owner ditolak.${rejection_reason ? ` Alasan: ${rejection_reason}` : ''}`;
      }

      await conn.execute(
        `INSERT INTO notifications (user_id, title, message) 
        VALUES (?, ?, ?)`,
        [user_id, notificationTitle, notificationMessage]
      );

      await conn.commit();

      return reply.send({
        status: "Success",
        message: `User berhasil di-${decision}`
      });

    } catch (error) {
      await conn.rollback();
      return reply.code(500).send({ error: error.message });
    } finally {
      conn.release();
    }
  };

  /**
   * Mendapatkan detail user yang mengajukan upgrade
   */
  const getOwnerUpgradeDetail = async (request, reply) => {
    const { user_id } = request.params;

    try {
      // Data user
      const [[user]] = await pool.execute(`
        SELECT 
          u.*,
          DATE_FORMAT(u.created_at, '%d %b %Y %H:%i') as formatted_request_date
        FROM users u
        WHERE u.id = ?
      `, [user_id]);

      if (!user) {
        return reply.code(404).send({ 
          message: 'User tidak ditemukan' 
        });
      }

      // Spots yang diajukan user ini (jika ada)
      const [spots] = await pool.execute(`
        SELECT 
          s.*,
          DATE_FORMAT(s.created_at, '%d %b %Y %H:%i') as formatted_submit_date,
          (SELECT COUNT(*) FROM spot_photos sp WHERE sp.spot_id = s.id) as total_photos,
          (SELECT GROUP_CONCAT(nama_fasilitas) 
          FROM master_fasilitas mf
          JOIN spot_facilities sf ON mf.id = sf.fasilitas_id
          WHERE sf.spot_id = s.id) as fasilitas
        FROM spots s
        WHERE s.owner_id = ? 
          AND s.action_type = 'create'
        ORDER BY s.created_at DESC
      `, [user_id]);

      // Format foto URLs
      const processedUser = {
        ...user,
        foto_ktp_url: buildFileUrl(request, user.foto_ktp),
        foto_wajah_url: buildFileUrl(request, user.foto_wajah_verifikasi),
        foto_profil_url: buildFileUrl(request, user.foto_profil)
      };

      // Format spots dengan foto URLs
      const processedSpots = await Promise.all(spots.map(async (spot) => {
        // Ambil foto-foto spot
        const [photos] = await pool.execute(
          'SELECT * FROM spot_photos WHERE spot_id = ?',
          [spot.id]
        );

        const photosWithUrls = photos.map(photo => ({
          ...photo,
          url_foto: buildFileUrl(request, photo.url_foto)
        }));

        return {
          ...spot,
          foto_utama_url: buildFileUrl(request, spot.foto_utama),
          foto_denah_url: buildFileUrl(request, spot.foto_denah),
          photos: photosWithUrls,
          fasilitas: spot.fasilitas ? spot.fasilitas.split(',') : []
        };
      }));

      return reply.send({
        status: "Success",
        data: {
          user: processedUser,
          spots: processedSpots,
          total_spots: spots.length
        }
      });

    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  // ==================== UPDATE EXPORTS ===================
  module.exports = {
      getAdminPonds,
      approveDeletePond,
      approveSpot,
      createWildSpot,
      updateWildSpot,
      deleteWildSpot,
      adminDeleteReview,
      adminDeleteStrikeFeed,
      getFeedReports,
      resolveFeedReport,
      getPendingEvents,
      approveEvent,
      deleteEvent,
      getEventDetailForAdmin,
      getOwnerUpgradeDetail,
      getOwnerUpgradeRequests,
      approveOwnerUpgrade
  };