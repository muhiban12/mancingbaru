//authMiddleware.js
const pool = require('../config/db');

const authenticate = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.code(401).send({ message: 'Sesi habis, silakan login kembali' });
  }
};

// Middleware baru khusus untuk mengecek role Owner atau Admin
const isOwner = async (request, reply) => {
  try {
    const userId = request.user.id;
    // Cek role user di tabel user_roles
    const [rows] = await pool.execute(
      'SELECT role_id FROM user_roles WHERE user_id = ?', 
      [userId]
    );

    // Jika bukan Admin (1) atau Owner (2), maka ditolak
    const hasAccess = rows.some(r => r.role_id === 1 || r.role_id === 2);
    if (!hasAccess) {
      return reply.code(403).send({ 
        status: 'Error', 
        message: 'Akses ditolak! Hanya Pemilik Spot yang bisa menambah data.' 
      });
    }
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const isAdmin = async (request, reply) => {
  const userId = request.user.id;
  const [rows] = await pool.execute('SELECT role_id FROM user_roles WHERE user_id = ?', [userId]);
  
  const hasAccess = rows.some(r => r.role_id === 1); // Role ID 1 adalah Admin
  if (!hasAccess) {
    return reply.code(403).send({ message: 'Akses ditolak! Khusus Admin.' });
  }
};

module.exports = { authenticate, isOwner, isAdmin };