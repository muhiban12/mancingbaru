// src/controllers/systemController.js
const pool = require("../config/db");

const systemUpdateExpiredBookings = async () => {
  await pool.execute(`
    UPDATE bookings
    SET status_pembayaran = 'Cancelled'
    WHERE status_pembayaran = 'Pending'
      AND start_time < NOW()
  `);
};

module.exports = { systemUpdateExpiredBookings };