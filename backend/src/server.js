require("dotenv").config();
const path = require("path");
const pool = require("./config/db");
const fastify = require("fastify")({
  logger: true,
  bodyLimit: 20 * 1024 * 1024, // Naikkan ke 20MB di sini
});

// 1. DAFTARKAN MULTER CONTENT PARSER DULU (Cukup 1x)
const multer = require("fastify-multer");
fastify.register(multer.contentParser);

/* ================= CORE PLUGINS ================= */

// 2. CORS (Pastikan origin true atau sesuai ngrok)
// server.js
fastify.register(require("@fastify/cors"), {
  origin: true, // Sudah benar
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["*"], // IZINKAN SEMUA HEADER
  credentials: true,
});

// 3. STATIC FILES
// Sesuai struktur folder kamu, uploads ada di ROOT backend (sejajar src)
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "../uploads"), // Gunakan ../ karena server.js ada di src
  prefix: "/uploads/",
});

// 4. JWT
fastify.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET || "mancing_mania_mantap_123",
});

fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

/* ================= ROUTES ================= */
fastify.register(require("./routes/indexRoutes"), {
  prefix: "/api",
});

/* ================= START SERVER ================= */
const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    await fastify.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`🚀 SERVER PANCINGIN AKTIF`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
