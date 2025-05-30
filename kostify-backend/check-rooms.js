const pool = require('./db');

async function checkRooms() {
  try {
    const result = await pool.query("SELECT * FROM rooms WHERE status = 'booked'");
    console.log('Booked rooms:', result.rows);
    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkRooms();
