const { Pool } = require('pg');

// Konfigurasi koneksi database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
});

async function testDatabase() {
  console.log('Testing database connection...');
  
  try {
    // Test koneksi
    const client = await pool.connect();
    console.log('Database connection successful!');
    
    // Test query table rooms
    console.log('Testing query on rooms table...');
    try {
      const result = await client.query('SELECT * FROM rooms');
      console.log(`Found ${result.rows.length} rooms:`);
      console.log(result.rows);
    } catch (err) {
      console.error('Error executing query:', err.message);
      
      // Cek apakah table rooms ada
      console.log('Checking if rooms table exists...');
      const tableCheck = await client.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'rooms')"
      );
      
      if (tableCheck.rows[0].exists) {
        console.log('Table "rooms" exists in the database.');
      } else {
        console.log('Table "rooms" does NOT exist in the database!');
        console.log('Creating rooms table...');
        
        try {
          await client.query(`
            CREATE TABLE IF NOT EXISTS rooms (
              id SERIAL PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              price INTEGER NOT NULL,
              description TEXT,
              status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked'))
            )
          `);
          console.log('Table created successfully!');
          
          // Insert sample data
          await client.query(`
            INSERT INTO rooms (name, price, description, status) VALUES 
            ('Ruangan 1', 500000, 'Kamar nyaman dengan fasilitas lengkap', 'available'),
            ('Ruangan 2', 600000, 'Kamar luas dengan pemandangan indah', 'booked'),
            ('Ruangan 3', 450000, 'Kamar ekonomis dengan fasilitas standar', 'available')
          `);
          console.log('Sample data inserted successfully!');
        } catch (createErr) {
          console.error('Error creating table:', createErr.message);
        }
      }
    }
    
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    await pool.end();
  }
}

testDatabase(); 