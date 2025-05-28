const { Pool } = require('pg');
const pool = require('../db');

async function createBookingsTable() {
  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'bookings'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('Bookings table already exists');
      return;
    }

    // Create bookings table
    await pool.query(`
      CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        room_id INTEGER NOT NULL REFERENCES rooms(id),
        user_id INTEGER REFERENCES users(id),
        tenant_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        start_date DATE NOT NULL,
        duration INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
      );
    `);

    console.log('Bookings table created successfully');
  } catch (err) {
    console.error('Error creating bookings table:', err);
  }
}

createBookingsTable();
