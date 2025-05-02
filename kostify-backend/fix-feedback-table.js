const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
});

async function fixFeedbackTable() {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to database');
    
    // First, check if the schema needs to be modified
    console.log('Checking feedback table schema...');
    const commentCheck = await client.query(`
      SELECT column_name, is_nullable, data_type
      FROM information_schema.columns 
      WHERE table_name = 'feedback'
      AND column_name = 'comment'
    `);
    
    // Check if comment column is not required
    if (commentCheck.rows.length > 0 && commentCheck.rows[0].is_nullable === 'YES') {
      console.log('Altering comment column to make it NOT NULL...');
      // Use a transaction for safety
      await client.query('BEGIN');
      
      // First set any NULL comments to empty string
      await client.query(`
        UPDATE feedback
        SET comment = ''
        WHERE comment IS NULL
      `);
      
      // Then alter the column to NOT NULL
      await client.query(`
        ALTER TABLE feedback
        ALTER COLUMN comment SET NOT NULL
      `);
      
      await client.query('COMMIT');
      console.log('Column altered successfully');
    } else {
      console.log('Comment column already set to NOT NULL');
    }
    
    // Insert a test record to make sure it works
    try {
      const testInsert = await client.query(`
        INSERT INTO feedback (comment, user_name, rating)
        VALUES ('Test feedback from fix script', 'Test User', 5)
        RETURNING *
      `);
      console.log('Test record inserted successfully:', testInsert.rows[0]);
    } catch (insertErr) {
      console.error('Failed to insert test record:', insertErr.message);
    }
    
    // Try a basic SELECT to verify everything works
    const records = await client.query('SELECT * FROM feedback ORDER BY id DESC LIMIT 3');
    console.log('Latest 3 records in feedback table:', records.rows);
    
    console.log('Feedback table fix completed successfully');
  } catch (error) {
    console.error('Error fixing feedback table:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

fixFeedbackTable(); 