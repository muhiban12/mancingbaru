require("dotenv").config();
const path = require("path");
const pool = require("./config/db");
const fastify = require("fastify")({ 
  logger: { level: 'info' }, // Logger lebih bersih
  ajv: { customOptions: { removeAdditional: "all" } } // Keamanan tambahan
});
const multer = require("fastify-multer");

/* ================= CORE PLUGINS ================= */

// 1. CORS - Dibuat fleksibel agar Expo (Mobile) bisa tembus
fastify.register(require("@fastify/cors"), {
  origin: true, // Mengizinkan semua origin di development
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// 2. Multipart / Upload - Pastikan ini sebelum Routes
fastify.register(multer.contentParser);

// 3. Static Files - Diarahkan ke folder 'public' atau langsung 'uploads'
// Supaya buildFileUrl (http://ip:3000/uploads/folder/file.jpg) jalan
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "../uploads"), // Sesuaikan dengan struktur folder repo baru
  prefix: "/uploads/",
  decorateReply: false // Agar tidak bentrok jika ada static plugin lain
});

// 4. JWT - Integrasi dengan request.user
fastify.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET || "mancing_mania_mantap_123",
});

// Decorator agar request.user tersedia secara global di controller
fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

/* ================= HEALTH CHECK & DEBUG ================= */
fastify.get("/cek-koneksi", async (request, reply) => {
  try {
    const [rows] = await pool.execute("SELECT 1 + 1 AS result");
    return {
      status: "Success",
      message: "Backend Connected to Database: " + process.env.DB_NAME,
      env_ip: process.env.BASE_URL
    };
  } catch (err) {
    return reply.code(500).send({ status: "Error", message: err.message });
  }
});

/* ================= ROUTES ================= */
// Daftarkan rute utama
fastify.register(require("./routes/indexRoutes"), {
  prefix: "/api",
});

/* ================= START SERVER ================= */
const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    
    // Test Database
    const connection = await pool.getConnection();
    console.log("✅ [DB] Database Connected Successfully");
    connection.release();

    // Listen di 0.0.0.0 sangat penting untuk Expo/Mobile Testing
    await fastify.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`
🚀 SERVER PANCINGIN BERHASIL DIAKTIFKAN
=======================================
📍 Local:   http://localhost:${PORT}
📍 Network: ${process.env.EXPO_PUBLIC_API_URL}
=======================================
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();