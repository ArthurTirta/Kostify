const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
});

async function checkDatabase() {
  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to database');

    // Check if feedback table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'feedback'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log('Feedback table exists:', tableExists);

    if (tableExists) {
      // Get feedback table schema
      const schemaResult = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'feedback'
        ORDER BY ordinal_position;
      `);
      
      console.log('Feedback table schema:', schemaResult.rows);
      
      // Check for any data in the table
      const dataCheck = await client.query('SELECT COUNT(*) FROM feedback');
      console.log('Number of feedback records:', dataCheck.rows[0].count);
      
      // Try a simple select
      const selectResult = await client.query('SELECT * FROM feedback LIMIT 1');
      if (selectResult.rows.length > 0) {
        console.log('Sample feedback record:', selectResult.rows[0]);
      }
    } else {
      console.log('Creating feedback table...');
      
      // Create the feedback table with minimum fields
      await client.query(`
        CREATE TABLE feedback (
          id SERIAL PRIMARY KEY,
          comment TEXT NOT NULL,
          user_name VARCHAR(100) NOT NULL,
          rating INTEGER DEFAULT 5,
          user_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Feedback table created successfully');
      
      // Add a test record
      await client.query(`
        INSERT INTO feedback (comment, user_name, rating) 
        VALUES ('Test feedback', 'Test User', 5)
      `);
      
      console.log('Test feedback record added');
    }
    
    client.release();
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pool.end();
  }
}

// Run the function
checkDatabase(); 