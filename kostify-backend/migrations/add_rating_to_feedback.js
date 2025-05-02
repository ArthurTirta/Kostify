const { Pool } = require('pg');

// Database connection configuration
const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
};

async function addRatingToFeedback() {
  const pool = new Pool(config);
  const client = await pool.connect();

  try {
    console.log('Checking if rating column exists in feedback table...');
    
    // Check if the rating column already exists
    const columnCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'feedback'
        AND column_name = 'rating'
      );
    `);
    
    const columnExists = columnCheck.rows[0].exists;
    
    if (!columnExists) {
      console.log('Adding rating column to feedback table...');
      
      // Add the rating column to the feedback table
      await client.query(`
        ALTER TABLE feedback 
        ADD COLUMN rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5;
      `);
      
      console.log('Rating column added successfully');
      
      // Update existing records to have a default rating
      await client.query(`
        UPDATE feedback SET rating = 5 WHERE rating IS NULL;
      `);
      
      console.log('Updated existing feedback records with default rating');
    } else {
      console.log('Rating column already exists in feedback table');
    }
    
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await client.release();
    await pool.end();
  }
}

// Run the migration
addRatingToFeedback(); 