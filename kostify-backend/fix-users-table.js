const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
});

async function fixUsersTable() {
  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to database');

    // Check for incomplete user records
    const incompleteUsers = await client.query(`
      SELECT id, username, role 
      FROM users 
      WHERE username IS NULL OR role IS NULL
    `);
    
    console.log('Found incomplete user records:', incompleteUsers.rows.length);
    
    if (incompleteUsers.rows.length > 0) {
      console.log('Incomplete user records:', incompleteUsers.rows);
      
      // Either fix or delete incomplete records
      console.log('Deleting incomplete user records...');
      
      for (const user of incompleteUsers.rows) {
        await client.query('DELETE FROM users WHERE id = $1', [user.id]);
        console.log(`Deleted user with ID ${user.id}`);
      }
    } else {
      console.log('No incomplete user records found');
    }
    
    // Fix any NULL role values
    const updateResult = await client.query(`
      UPDATE users 
      SET role = 'penyewa' 
      WHERE role IS NULL
      RETURNING id, username, role
    `);
    
    if (updateResult.rows.length > 0) {
      console.log('Fixed users with NULL role:', updateResult.rows);
    } else {
      console.log('No users with NULL role found');
    }
    
    // Check users table after fixes
    const selectResult = await client.query('SELECT * FROM users ORDER BY id');
    console.log('Users after fixes:');
    selectResult.rows.forEach(row => console.log(row));
    
    client.release();
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pool.end();
  }
}

// Run the function
fixUsersTable(); 