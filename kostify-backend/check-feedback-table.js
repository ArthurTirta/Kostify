const { Pool } = require('pg');

// Database connection configuration
const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
};

async function checkFeedbackTable() {
  const pool = new Pool(config);
  const client = await pool.connect();

  try {
    console.log('Checking if feedback table exists...');
    
    // Check if feedback table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'feedback'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    
    if (!tableExists) {
      console.log('Creating feedback table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS feedback (
          id SERIAL PRIMARY KEY,
          user_id INTEGER,
          user_name VARCHAR(100) NOT NULL,
          comment TEXT NOT NULL,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Feedback table created successfully');
      
      // Add some initial feedback for testing
      console.log('Adding initial feedback data...');
      await client.query(`
        INSERT INTO feedback (user_name, comment, rating) VALUES 
        ('Admin User', 'Aplikasi ini sangat membantu untuk mengelola kost!', 5),
        ('User Penyewa', 'Sistem pemesanan ruangan sangat mudah digunakan', 4),
        ('Pengguna Umum', 'Tampilan aplikasi bagus, tapi perlu peningkatan fitur', 3)
      `);
      console.log('Initial feedback data added successfully');
    } else {
      console.log('Feedback table already exists');
    }
    
    console.log('Process completed');
  } catch (err) {
    console.error('Error checking/creating feedback table:', err);
  } finally {
    await client.release();
    await pool.end();
  }
}

checkFeedbackTable(); 