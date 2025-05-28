const pool = require('./db');

async function fixRoomStatus() {
  try {
    const result = await pool.query("UPDATE rooms SET status = 'available' WHERE id = 1");
    console.log('Room ID 1 status updated to available');
    console.log(`${result.rowCount} row(s) affected`);
    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixRoomStatus();
