const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
});

async function checkUsersTable() {
  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to database');

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log('Users table exists:', tableExists);

    if (tableExists) {
      // Get users table schema
      const schemaResult = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
      
      console.log('Users table schema:', schemaResult.rows);
      
      // Check for any data in the table
      const dataCheck = await client.query('SELECT COUNT(*) FROM users');
      console.log('Number of user records:', dataCheck.rows[0].count);
      
      // Try a simple select
      const selectResult = await client.query('SELECT * FROM users LIMIT 5');
      if (selectResult.rows.length > 0) {
        console.log('Sample user records:');
        selectResult.rows.forEach(row => console.log(row));
      }

      // Check if role column exists
      const roleColumnCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND column_name = 'role'
        );
      `);
      
      const roleColumnExists = roleColumnCheck.rows[0].exists;
      console.log('Role column exists:', roleColumnExists);

      if (!roleColumnExists) {
        console.log('Adding role column to users table...');
        
        // Add role column
        await client.query(`
          ALTER TABLE users 
          ADD COLUMN role VARCHAR(20) DEFAULT 'penyewa'
        `);
        
        console.log('Role column added successfully');
        
        // Update existing users to have a role
        await client.query(`
          UPDATE users 
          SET role = 'penyewa' 
          WHERE role IS NULL
        `);
        
        console.log('Updated existing users with default role');
      }
    } else {
      console.log('Users table does not exist. Please run init-db.js first.');
    }
    
    client.release();
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pool.end();
  }
}

// Run the function
checkUsersTable(); 