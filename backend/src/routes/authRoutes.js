//authRoutes.js
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

async function authRoutes(fastify) {
  fastify.post('/register', register);
  fastify.post('/login', login);
  
  // Hanya user yang login (punya token) yang bisa akses ini
  fastify.get('/me', { preHandler: authenticate }, getProfile);
}

module.exports = authRoutes;