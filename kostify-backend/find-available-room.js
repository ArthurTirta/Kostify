const pool = require('./db');

async function findAvailableRoom() {
  try {
    const result = await pool.query("SELECT * FROM rooms WHERE status = 'available' LIMIT 1");
    if (result.rows.length > 0) {
      console.log('Available room:', result.rows[0]);
    } else {
      console.log('No available rooms found');
    }
    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

findAvailableRoom();
