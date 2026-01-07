const pool = require("../config/db");
const { buildFileUrl } = require("./helper/file.helper");

/* ================= EVENT CREATION (OWNER) ================= */
const createEvent = async (request, reply) => {
  const ownerId = request.user.id;
  const {
    spot_id,
    nama_event,
    biaya_pendaftaran = 0,
    deskripsi_event,
    hadiah,
    maks_peserta,
    batas_pendaftaran,
    tanggal_mulai,
    tanggal_selesai,
  } = request.body;

  // ✅ FIX: Ambil file poster dari upload
  const foto_poster = buildFileUrl(request, "event_posters") || null;

  try {
    // Validasi required fields (sesuai UI)
    if (
      !spot_id ||
      !nama_event ||
      !maks_peserta ||
      !batas_pendaftaran ||
      !tanggal_mulai ||
      !tanggal_selesai
    ) {
      return reply.code(400).send({
        message: "Data event tidak lengkap. Harap isi semua field wajib.",
      });
    }

    // Validasi poster (sesuai UI: "Upload Poster / Banner")
    if (!foto_poster) {
      return reply.code(400).send({
        message: "Poster event wajib diupload (Format: JPG, PNG, Max 5MB)",
      });
    }

    // Validasi tanggal (sesuai UI flow)
    const batasDate = new Date(batas_pendaftaran);
    const mulaiDate = new Date(tanggal_mulai);
    const selesaiDate = new Date(tanggal_selesai);
    const now = new Date();

    if (batasDate <= now) {
      return reply.code(400).send({
        message: "Batas pendaftaran harus di masa depan",
      });
    }

    if (batasDate >= mulaiDate) {
      return reply.code(400).send({
        message: "Batas pendaftaran harus sebelum tanggal mulai event",
      });
    }

    if (mulaiDate >= selesaiDate) {
      return reply.code(400).send({
        message: "Tanggal mulai harus sebelum tanggal selesai",
      });
    }

    // Validasi spot milik owner dan approved
    const [spot] = await pool.execute(
      'SELECT id, nama_spot FROM spots WHERE id = ? AND owner_id = ? AND status = "approved"',
      [spot_id, ownerId]
    );

    if (spot.length === 0) {
      return reply.code(403).send({
        message: "Spot tidak valid atau belum disetujui admin",
      });
    }

    // Validasi maks peserta (sesuai UI: "Peserta Maksimal")
    if (maks_peserta <= 0 || maks_peserta > 1000) {
      return reply.code(400).send({
        message: "Jumlah peserta maksimal harus antara 1-1000",
      });
    }

    // Parse hadiah jika dalam format JSON
    let hadiahParsed = hadiah;
    if (typeof hadiah === "string") {
      try {
        hadiahParsed = JSON.parse(hadiah);
      } catch (e) {
        // Tetap string jika bukan JSON
      }
    }

    // Insert event dengan status Pending
    await pool.execute(
      `INSERT INTO events (
        spot_id, nama_event, biaya_pendaftaran, deskripsi_event, 
        hadiah, foto_poster, maks_peserta, batas_pendaftaran, 
        tanggal_mulai, tanggal_selesai, status_persetujuan, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())`,
      [
        spot_id,
        nama_event,
        parseFloat(biaya_pendaftaran) || 0,
        deskripsi_event || "",
        JSON.stringify(hadiahParsed),
        foto_poster,
        parseInt(maks_peserta),
        batas_pendaftaran,
        tanggal_mulai,
        tanggal_selesai,
      ]
    );

    // ✅ TAMBAH: Kirim notifikasi ke admin
    const [admins] = await pool.execute(
      `SELECT u.id FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE r.role_name = 'Admin'`
    );

    for (const admin of admins) {
      await pool.execute(
        `INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)`,
        [
          admin.id,
          "Event Baru Menunggu Review",
          `Event "${nama_event}" dari ${spot[0].nama_spot} menunggu persetujuan Anda.`,
        ]
      );
    }

    return reply.code(201).send({
      status: "Success",
      message: "Event berhasil dibuat dan menunggu persetujuan admin",
      note: "Event akan diinjau oleh tim admin sebelum dipublikasikan.",
    });
  } catch (error) {
    console.error("Create event error:", error);
    return reply.code(500).send({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* ================= GET EVENT DETAIL ================= */
const getEventDetail = async (request, reply) => {
  const { event_id } = request.params;
  const user_id = request.user?.id; // Optional for non-logged in users

  try {
    // Ambil detail event dengan format sesuai UI
    const [events] = await pool.execute(
      `
      SELECT 
        e.*,
        s.nama_spot,
        s.alamat,
        s.latitude,
        s.longitude,
        s.foto_utama as spot_foto,
        u.nama_lengkap as owner_name,
        DATE_FORMAT(e.batas_pendaftaran, '%d %b %Y %H:%i') as batas_pendaftaran_formatted,
        DATE_FORMAT(e.tanggal_mulai, '%d %b %Y %H:%i') as tanggal_mulai_formatted,
        DATE_FORMAT(e.tanggal_selesai, '%d %b %Y %H:%i') as tanggal_selesai_formatted,
        (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id) as jumlah_pendaftar,
        CASE
          WHEN NOW() < e.batas_pendaftaran THEN 'Pendaftaran Dibuka'
          WHEN NOW() BETWEEN e.tanggal_mulai AND e.tanggal_selesai THEN 'Sedang Berlangsung'
          ELSE 'Selesai'
        END AS status_event,
        CASE
          WHEN NOW() < e.batas_pendaftaran THEN 1
          ELSE 0
        END AS bisa_daftar,
        CASE
          WHEN e.maks_peserta - (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) <= 0 THEN 0
          ELSE e.maks_peserta - (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id)
        END AS kuota_tersisa
      FROM events e
      JOIN spots s ON e.spot_id = s.id
      JOIN users u ON s.owner_id = u.id
      WHERE e.id = ? AND e.status_persetujuan = 'Approved'
      `,
      [event_id]
    );

    if (events.length === 0) {
      return reply.code(404).send({
        message: "Event tidak ditemukan atau belum disetujui",
      });
    }

    const eventData = events[0];

    // Parse hadiah dari JSON
    let hadiahArray = [];
    if (eventData.hadiah) {
      try {
        hadiahArray = JSON.parse(eventData.hadiah);
      } catch (err) {
        hadiahArray = [eventData.hadiah];
      }
    }

    // Cek apakah user sudah terdaftar
    let userRegistered = false;
    let userRegistration = null;

    if (user_id) {
      const [registration] = await pool.execute(
        `SELECT ticket_code, registration_date, status_pembayaran 
         FROM event_registrations 
         WHERE user_id = ? AND event_id = ?`,
        [user_id, event_id]
      );

      if (registration.length > 0) {
        userRegistered = true;
        userRegistration = registration[0];
      }
    }

    // Format response sesuai UI "Turnamen/lomba_Detail"
    const responseData = {
      id: eventData.id,
      nama_event: eventData.nama_event,
      deskripsi_event: eventData.deskripsi_event,
      biaya_pendaftaran: eventData.biaya_pendaftaran,
      foto_poster: eventData.foto_poster,
      maks_peserta: eventData.maks_peserta,
      batas_pendaftaran: eventData.batas_pendaftaran,
      tanggal_mulai: eventData.tanggal_mulai,
      tanggal_selesai: eventData.tanggal_selesai,
      hadiah: hadiahArray,
      status_event: eventData.status_event,
      bisa_daftar: eventData.bisa_daftar && eventData.kuota_tersisa > 0,
      jumlah_pendaftar: eventData.jumlah_pendaftar,
      kuota_tersisa: eventData.kuota_tersisa,

      // Format untuk UI
      waktu_formatted: {
        batas_pendaftaran: eventData.batas_pendaftaran_formatted, // "12 Nov 08:00"
        tanggal_mulai: eventData.tanggal_mulai_formatted, // "09 Feb 10:00"
        tanggal_selesai: eventData.tanggal_selesai_formatted, // "Feb 5.00L 0:00"
      },

      // Info spot/lokasi
      spot_info: {
        id: eventData.spot_id,
        nama_spot: eventData.nama_spot,
        alamat: eventData.alamat,
        foto_utama: eventData.spot_foto,
        latitude: eventData.latitude,
        longitude: eventData.longitude,
      },

      // Info owner
      owner_info: {
        nama: eventData.owner_name,
      },

      // Info user (jika login)
      user_info: user_id
        ? {
            sudah_terdaftar: userRegistered,
            ticket_code: userRegistration?.ticket_code,
            status_pembayaran: userRegistration?.status_pembayaran,
          }
        : null,
    };

    return reply.send({
      status: "Success",
      data: responseData,
    });
  } catch (error) {
    console.error("Get event detail error:", error);
    return reply.code(500).send({ error: error.message });
  }
};

/* ================= REGISTER EVENT (PAYMENT) ================= */
const registerEvent = async (request, reply) => {
  const { event_id, payment_channel_id, nama_peserta, nomor_wa } = request.body;
  const user_id = request.user.id;

  try {
    // 1. Validasi data peserta (sesuai UI "Tampila_payment_lomba")
    if (!nama_peserta || !nomor_wa) {
      return reply.code(400).send({
        message: "Data peserta tidak lengkap. Harap isi nama dan nomor WA.",
      });
    }

    // Validasi format nomor WA
    const waRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    if (!waRegex.test(nomor_wa.replace(/\s+/g, ""))) {
      return reply.code(400).send({
        message:
          "Format nomor WhatsApp tidak valid. Gunakan format: 0812-3456-7890",
      });
    }

    // 2. Ambil detail event
    const [[event]] = await pool.execute(
      `SELECT 
        e.*,
        s.nama_spot,
        s.alamat,
        (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as total_pendaftar
       FROM events e
       JOIN spots s ON e.spot_id = s.id
       WHERE e.id = ? AND e.status_persetujuan = 'Approved'`,
      [event_id]
    );

    if (!event) {
      return reply.code(404).send({
        message: "Event tidak ditemukan atau belum disetujui",
      });
    }

    // 3. Validasi kuota
    if (event.total_pendaftar >= event.maks_peserta) {
      return reply.code(400).send({
        message: "Maaf, kuota lomba sudah penuh!",
      });
    }

    // 4. Validasi batas pendaftaran
    if (new Date() > new Date(event.batas_pendaftaran)) {
      return reply.code(400).send({
        message: "Pendaftaran event sudah ditutup",
      });
    }

    // 5. Cek apakah user sudah terdaftar
    const [[exist]] = await pool.execute(
      "SELECT id FROM event_registrations WHERE user_id = ? AND event_id = ?",
      [user_id, event_id]
    );

    if (exist) {
      return reply.code(409).send({
        message: "Kamu sudah terdaftar di event ini",
      });
    }

    // 6. Generate ticket code yang lebih unik
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 6).toUpperCase();
    const ticket_code = `EVT-${timestamp}-${randomStr}`;

    // 7. Insert registration dengan data lengkap
    await pool.execute(
      `INSERT INTO event_registrations (
        user_id, event_id, payment_channel_id, status_pembayaran, 
        ticket_code, nama_peserta, nomor_wa, registration_date
      ) VALUES (?, ?, ?, 'Pending', ?, ?, ?, NOW())`,
      [
        user_id,
        event_id,
        payment_channel_id,
        ticket_code,
        nama_peserta,
        nomor_wa,
      ]
    );

    // 8. Kirim notifikasi ke user
    await pool.execute(
      "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)",
      [
        user_id,
        "Pendaftaran Berhasil",
        `Selamat! Kamu terdaftar di event ${event.nama_event}. Kode Tiket: ${ticket_code}. Silakan selesaikan pembayaran.`,
      ]
    );

    // 9. Kirim notifikasi ke owner spot
    const [[owner]] = await pool.execute(
      "SELECT owner_id FROM spots WHERE id = ?",
      [event.spot_id]
    );

    if (owner) {
      await pool.execute(
        "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)",
        [
          owner.owner_id,
          "Pendaftaran Event Baru",
          `Ada peserta baru mendaftar di event ${event.nama_event}: ${nama_peserta}`,
        ]
      );
    }

    // 10. Response dengan data untuk halaman konfirmasi
    return reply.send({
      status: "Success",
      message: "Pendaftaran berhasil. Silakan selesaikan pembayaran.",
      data: {
        ticket_code,
        event_detail: {
          nama_event: event.nama_event,
          biaya_pendaftaran: event.biaya_pendaftaran,
          tanggal_mulai: event.tanggal_mulai,
          tanggal_selesai: event.tanggal_selesai,
          lokasi: event.alamat,
        },
        peserta_detail: {
          nama: nama_peserta,
          nomor_wa: nomor_wa,
        },
        payment_info: {
          payment_channel_id,
          total_amount: event.biaya_pendaftaran,
          status: "Pending",
        },
      },
    });
  } catch (error) {
    console.error("Register event error:", error);
    return reply.code(500).send({ error: error.message });
  }
};

/* ================= GET APPROVED EVENTS (IMPROVED) ================= */
const getApprovedEvents = async (request, reply) => {
  const {
    page = 1,
    limit = 10,
    spot_id,
    search = "",
    status = "upcoming", // upcoming, ongoing, past
  } = request.query;

  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT 
        e.*,
        s.nama_spot,
        s.alamat,
        s.foto_utama,
        DATE_FORMAT(e.tanggal_mulai, '%d %b %Y') as tanggal_formatted,
        (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id) as jumlah_pendaftar,
        CASE
          WHEN NOW() < e.batas_pendaftaran THEN 'Pendaftaran Dibuka'
          WHEN NOW() BETWEEN e.tanggal_mulai AND e.tanggal_selesai THEN 'Sedang Berlangsung'
          ELSE 'Selesai'
        END AS status_event,
        CASE
          WHEN NOW() < e.batas_pendaftaran THEN 1
          ELSE 0
        END AS bisa_daftar,
        e.maks_peserta - (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as kuota_tersisa
      FROM events e
      JOIN spots s ON e.spot_id = s.id
      WHERE e.status_persetujuan = 'Approved'
    `;

    const params = [];

    // Filter by status
    if (status === "upcoming") {
      query += " AND e.tanggal_mulai > NOW()";
    } else if (status === "ongoing") {
      query += " AND NOW() BETWEEN e.tanggal_mulai AND e.tanggal_selesai";
    } else if (status === "past") {
      query += " AND e.tanggal_selesai < NOW()";
    }

    // Filter by spot
    if (spot_id) {
      query += " AND e.spot_id = ?";
      params.push(spot_id);
    }

    // Search by event name or spot name
    if (search) {
      query += " AND (e.nama_event LIKE ? OR s.nama_spot LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Order by closest event first
    query += " ORDER BY e.tanggal_mulai ASC";

    // Add limit and offset for pagination
    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const [events] = await pool.execute(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM events e
      WHERE e.status_persetujuan = 'Approved'
    `;

    const countParams = [];

    if (status === "upcoming") {
      countQuery += " AND e.tanggal_mulai > NOW()";
    } else if (status === "ongoing") {
      countQuery += " AND NOW() BETWEEN e.tanggal_mulai AND e.tanggal_selesai";
    } else if (status === "past") {
      countQuery += " AND e.tanggal_selesai < NOW()";
    }

    if (spot_id) {
      countQuery += " AND e.spot_id = ?";
      countParams.push(spot_id);
    }

    if (search) {
      countQuery +=
        " AND (e.nama_event LIKE ? OR (SELECT s.nama_spot FROM spots s WHERE s.id = e.spot_id) LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [[countResult]] = await pool.execute(countQuery, countParams);

    return reply.send({
      status: "Success",
      data: events,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: countResult.total,
        total_pages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error("Get approved events error:", error);
    return reply.code(500).send({ error: error.message });
  }
};

/* ================= GET MY EVENT TICKETS (IMPROVED) ================= */
const getMyEventTickets = async (request, reply) => {
  const user_id = request.user.id;
  const { status } = request.query; // upcoming, ongoing, past

  try {
    let query = `
      SELECT 
        er.*,
        e.nama_event,
        e.foto_poster,
        e.biaya_pendaftaran,
        e.tanggal_mulai,
        e.tanggal_selesai,
        e.batas_pendaftaran,
        s.nama_spot,
        s.alamat,
        s.latitude,
        s.longitude,
        DATE_FORMAT(e.tanggal_mulai, '%d %b %Y %H:%i') as tanggal_mulai_formatted,
        DATE_FORMAT(e.tanggal_selesai, '%d %b %Y %H:%i') as tanggal_selesai_formatted,
        CASE
          WHEN NOW() < e.batas_pendaftaran THEN 'Menunggu Pembayaran'
          WHEN NOW() BETWEEN e.tanggal_mulai AND e.tanggal_selesai THEN 'Sedang Berlangsung'
          WHEN NOW() > e.tanggal_selesai THEN 'Selesai'
          ELSE 'Aktif'
        END AS status_event
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      JOIN spots s ON e.spot_id = s.id
      WHERE er.user_id = ?
    `;

    const params = [user_id];

    // Filter by event status
    if (status === "upcoming") {
      query += " AND e.tanggal_mulai > NOW()";
    } else if (status === "ongoing") {
      query += " AND NOW() BETWEEN e.tanggal_mulai AND e.tanggal_selesai";
    } else if (status === "past") {
      query += " AND e.tanggal_selesai < NOW()";
    }

    query += " ORDER BY e.tanggal_mulai DESC";

    const [tickets] = await pool.execute(query, params);

    return reply.send({
      status: "Success",
      data: tickets,
    });
  } catch (error) {
    console.error("Get my tickets error:", error);
    return reply.code(500).send({ error: error.message });
  }
};

/* ================= GET OWNER EVENTS ================= */
const getOwnerEvents = async (request, reply) => {
  const owner_id = request.user.id;
  const { status } = request.query; // pending, approved, rejected

  try {
    let query = `
      SELECT 
        e.*,
        s.nama_spot,
        s.alamat,
        DATE_FORMAT(e.created_at, '%d %b %Y') as created_formatted,
        DATE_FORMAT(e.tanggal_mulai, '%d %b %Y %H:%i') as tanggal_mulai_formatted,
        (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as total_pendaftar,
        CASE
          WHEN e.status_persetujuan = 'Pending' THEN 'Menunggu Review'
          WHEN e.status_persetujuan = 'Approved' THEN 'Disetujui'
          ELSE 'Ditolak'
        END AS status_display
      FROM events e
      JOIN spots s ON e.spot_id = s.id
      WHERE s.owner_id = ?
    `;

    const params = [owner_id];

    // Filter by approval status
    if (status) {
      query += " AND e.status_persetujuan = ?";
      params.push(status);
    }

    query += " ORDER BY e.created_at DESC";

    const [events] = await pool.execute(query, params);

    return reply.send({
      status: "Success",
      data: events,
    });
  } catch (error) {
    console.error("Get owner events error:", error);
    return reply.code(500).send({ error: error.message });
  }
};

/* ================= GET SPOT EVENTS ================= */
const getSpotEvents = async (request, reply) => {
  const { spot_id } = request.params;

  try {
    const [events] = await pool.execute(
      `
      SELECT 
        e.*,
        s.nama_spot,
        s.alamat,
        DATE_FORMAT(e.tanggal_mulai, '%d %b') as tanggal_pendek,
        (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as jumlah_pendaftar,
        CASE
          WHEN NOW() < e.batas_pendaftaran THEN 'Pendaftaran Dibuka'
          WHEN NOW() BETWEEN e.tanggal_mulai AND e.tanggal_selesai THEN 'Sedang Berlangsung'
          ELSE 'Selesai'
        END AS status_event
      FROM events e
      JOIN spots s ON e.spot_id = s.id
      WHERE 
        e.spot_id = ?
        AND e.status_persetujuan = 'Approved'
        AND e.tanggal_selesai >= CURDATE()
      ORDER BY e.tanggal_mulai ASC
      LIMIT 5
      `,
      [spot_id]
    );

    return reply.send({
      status: "Success",
      data: events,
    });
  } catch (error) {
    console.error("Get spot events error:", error);
    return reply.code(500).send({ error: error.message });
  }
};

/* ================= CONFIRM PAYMENT ================= */
const confirmPayment = async (request, reply) => {
  const { ticket_code } = request.body;
  const user_id = request.user.id;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Cek tiket dan pastikan milik user
    const [[registration]] = await conn.execute(
      `SELECT er.*, e.nama_event, e.biaya_pendaftaran
       FROM event_registrations er
       JOIN events e ON er.event_id = e.id
       WHERE er.ticket_code = ? AND er.user_id = ?`,
      [ticket_code, user_id]
    );

    if (!registration) {
      await conn.rollback();
      return reply.code(404).send({
        message: "Tiket tidak ditemukan atau bukan milik Anda",
      });
    }

    // Cek apakah sudah dibayar
    if (registration.status_pembayaran === "Paid") {
      await conn.rollback();
      return reply.code(400).send({
        message: "Pembayaran sudah dikonfirmasi sebelumnya",
      });
    }

    // Update status pembayaran
    await conn.execute(
      `UPDATE event_registrations 
       SET status_pembayaran = 'Paid', payment_confirmed_at = NOW()
       WHERE ticket_code = ?`,
      [ticket_code]
    );

    // Kirim notifikasi konfirmasi
    await conn.execute(
      `INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)`,
      [
        user_id,
        "Pembayaran Dikonfirmasi",
        `Pembayaran untuk event ${registration.nama_event} telah dikonfirmasi. Tiket Anda aktif!`,
      ]
    );

    await conn.commit();

    return reply.send({
      status: "Success",
      message: "Pembayaran berhasil dikonfirmasi",
      data: {
        ticket_code,
        event_name: registration.nama_event,
        amount: registration.biaya_pendaftaran,
        status: "Paid",
      },
    });
  } catch (error) {
    await conn.rollback();
    console.error("Confirm payment error:", error);
    return reply.code(500).send({ error: error.message });
  } finally {
    conn.release();
  }
};

/* ================= CANCEL REGISTRATION ================= */
const cancelRegistration = async (request, reply) => {
  const { event_id } = request.params;
  const user_id = request.user.id;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Cek apakah user terdaftar
    const [[registration]] = await conn.execute(
      `SELECT id, ticket_code, status_pembayaran 
       FROM event_registrations 
       WHERE user_id = ? AND event_id = ?`,
      [user_id, event_id]
    );

    if (!registration) {
      await conn.rollback();
      return reply.code(404).send({
        message: "Anda belum terdaftar di event ini",
      });
    }

    // Cek batas waktu pembatalan (max 24 jam sebelum event)
    const [[event]] = await conn.execute(
      `SELECT tanggal_mulai FROM events WHERE id = ?`,
      [event_id]
    );

    const eventDate = new Date(event.tanggal_mulai);
    const now = new Date();
    const hoursDiff = (eventDate - now) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      await conn.rollback();
      return reply.code(400).send({
        message:
          "Tidak bisa membatalkan pendaftaran kurang dari 24 jam sebelum event",
      });
    }

    // Hapus registration
    await conn.execute(`DELETE FROM event_registrations WHERE id = ?`, [
      registration.id,
    ]);

    // Kirim notifikasi
    await conn.execute(
      `INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)`,
      [
        user_id,
        "Pendaftaran Dibatalkan",
        `Pendaftaran Anda untuk event ini telah dibatalkan.${
          registration.status_pembayaran === "Paid"
            ? " Dana akan dikembalikan dalam 1-3 hari kerja."
            : ""
        }`,
      ]
    );

    await conn.commit();

    return reply.send({
      status: "Success",
      message: "Pendaftaran berhasil dibatalkan",
    });
  } catch (error) {
    await conn.rollback();
    console.error("Cancel registration error:", error);
    return reply.code(500).send({ error: error.message });
  } finally {
    conn.release();
  }
};

module.exports = {
  createEvent,
  getEventDetail,
  registerEvent,
  getApprovedEvents,
  getMyEventTickets,
  getOwnerEvents,
  getSpotEvents,
  confirmPayment,
  cancelRegistration,
};
