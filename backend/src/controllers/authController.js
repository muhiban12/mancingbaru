// authCOntroller.js
const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const register = async (request, reply) => {
  const {
    nama_lengkap,
    email,
    password,
    nomer_wa,
    provinsi_asal,
    kota_kabupaten,
  } = request.body;

  try {
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return reply.code(400).send({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Insert user
    const [result] = await pool.execute(
      `INSERT INTO users 
       (nama_lengkap, email, password, nomer_wa, provinsi_asal, kota_kabupaten)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nama_lengkap,
        email,
        hashedPassword,
        nomer_wa,
        provinsi_asal,
        kota_kabupaten,
      ]
    );

    // 2️⃣ Set role DEFAULT = angler (misal role_id = 3)
    await pool.execute(
      "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
      [result.insertId, 3]
    );

    return reply.code(201).send({
      status: "Success",
      message: "Registrasi berhasil sebagai Angler",
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const login = async (request, reply) => {
  const { email, password } = request.body;
  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0)
      return reply.code(401).send({ message: "Email atau password salah" });
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return reply.code(401).send({ message: "Email atau password salah" });
    const token = request.server.jwt.sign({ id: user.id, email: user.email });
    return reply.send({
      status: "Success",
      token,
      user: { id: user.id, nama: user.nama_lengkap },
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// --- FUNGSI BARU ---
const getProfile = async (request, reply) => {
  try {
    const userId = request.user.id; // Diambil dari token oleh middleware
    const [rows] = await pool.execute(
      "SELECT id, nama_lengkap, email, nomer_wa, provinsi_asal, kota_kabupaten FROM users WHERE id = ?",
      [userId]
    );
    return reply.send({ status: "Success", data: rows[0] });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// authController.js - Tambahkan function berikut:

/**
 * User mengajukan upgrade ke Owner
 */
const submitOwnerUpgrade = async (request, reply) => {
  const userId = request.user.id;
  const {
    nomer_wa,
    provinsi_asal,
    kota_kabupaten,
    // Data spot (opsional)
    nama_spot,
    alamat,
    deskripsi,
    harga_per_jam,
    total_kursi,
    jam_buka,
    jam_tutup,
    kode_wilayah,
    fasilitas, // array of facility IDs
  } = request.body;

  const files = request.files || {};

  // Validasi foto wajib
  if (!files.foto_ktp || !files.foto_wajah_verifikasi) {
    return reply.code(400).send({
      message: "Foto KTP dan foto selfie dengan KTP wajib diupload",
    });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Update data user
    const ktpPath = await uploadFile(files.foto_ktp[0], "ktp");
    const selfiePath = await uploadFile(
      files.foto_wajah_verifikasi[0],
      "selfie"
    );

    await conn.execute(
      `
      UPDATE users 
      SET 
        nomer_wa = ?,
        provinsi_asal = ?,
        kota_kabupaten = ?,
        foto_ktp = ?,
        foto_wajah_verifikasi = ?,
        status_akun = 'Pending'
      WHERE id = ?
    `,
      [nomer_wa, provinsi_asal, kota_kabupaten, ktpPath, selfiePath, userId]
    );

    // 2. Tambah role Owner (role_id = 2)
    const [[hasRole]] = await conn.execute(
      "SELECT * FROM user_roles WHERE user_id = ? AND role_id = 2",
      [userId]
    );

    if (!hasRole) {
      await conn.execute(
        "INSERT INTO user_roles (user_id, role_id) VALUES (?, 2)",
        [userId]
      );
    }

    // 3. Jika user langsung submit spot
    if (nama_spot && alamat) {
      let fotoUtamaPath = null;

      // Upload foto utama jika ada
      if (files.foto_utama && files.foto_utama[0]) {
        fotoUtamaPath = await uploadFile(files.foto_utama[0], "spot");
      }

      // Insert spot
      const [spotResult] = await conn.execute(
        `
        INSERT INTO spots (
          owner_id, nama_spot, deskripsi, harga_per_jam, alamat,
          total_kursi, jam_buka, jam_tutup, kode_wilayah,
          foto_utama, status, action_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'create')
      `,
        [
          userId,
          nama_spot,
          deskripsi || "",
          harga_per_jam || 0,
          alamat,
          total_kursi || 0,
          jam_buka || "08:00:00",
          jam_tutup || "20:00:00",
          kode_wilayah || "",
          fotoUtamaPath,
        ]
      );

      const spotId = spotResult.insertId;

      // 4. Upload foto tambahan jika ada
      if (files.spot_photos) {
        for (const photo of files.spot_photos) {
          const photoPath = await uploadFile(photo, "spot_photo");
          await conn.execute(
            "INSERT INTO spot_photos (spot_id, url_foto) VALUES (?, ?)",
            [spotId, photoPath]
          );
        }
      }

      // 5. Tambah fasilitas jika ada
      if (fasilitas && Array.isArray(fasilitas)) {
        for (const fasilitasId of fasilitas) {
          await conn.execute(
            "INSERT INTO spot_facilities (spot_id, fasilitas_id) VALUES (?, ?)",
            [spotId, fasilitasId]
          );
        }
      }

      // 6. Upload foto denah jika ada
      if (files.foto_denah && files.foto_denah[0]) {
        const denahPath = await uploadFile(files.foto_denah[0], "denah");
        await conn.execute("UPDATE spots SET foto_denah = ? WHERE id = ?", [
          denahPath,
          spotId,
        ]);
      }
    }

    // 7. Buat wallet untuk owner
    const [[wallet]] = await conn.execute(
      "SELECT * FROM owner_wallets WHERE owner_id = ?",
      [userId]
    );

    if (!wallet) {
      await conn.execute(
        "INSERT INTO owner_wallets (owner_id, balance, total_earned) VALUES (?, 0, 0)",
        [userId]
      );
    }

    // 8. Kirim notifikasi ke admin
    const [[user]] = await conn.execute(
      "SELECT nama_lengkap FROM users WHERE id = ?",
      [userId]
    );

    await conn.execute(
      `
      INSERT INTO notifications (user_id, title, message)
      VALUES (1, 'Pengajuan Owner Baru', ?)
    `,
      [`User ${user.nama_lengkap} mengajukan upgrade ke Owner.`]
    );

    await conn.commit();

    return reply.send({
      status: "Success",
      message:
        "Pengajuan upgrade ke Owner berhasil dikirim. Menunggu verifikasi admin (1-24 jam).",
    });
  } catch (error) {
    await conn.rollback();
    return reply.code(500).send({ error: error.message });
  } finally {
    conn.release();
  }
};

// Helper function untuk upload file
async function uploadFile(file, prefix) {
  // Implementasi upload sesuai dengan sistem Anda
  const fileName = `${prefix}_${Date.now()}_${file.filename}`;
  const filePath = `uploads/${fileName}`;

  // Simpan file (sesuaikan dengan sistem storage Anda)
  const fs = require("fs").promises;
  await fs.writeFile(filePath, file.buffer);
  return filePath;
}

module.exports = { register, login, getProfile, submitOwnerUpgrade };
