const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'apps_pancingin',
  port: process.env.DB_PORT || 3307, // Menggunakan port 3307 sesuai XAMPP kamu
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;