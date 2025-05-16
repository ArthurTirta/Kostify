const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Konfigurasi koneksi database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
});

async function checkUsersTable() {
  const client = await pool.connect();
  
  try {
    console.log('Connecting to database...');
    
    // Cek apakah tabel users sudah ada
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const usersTableExists = tableCheck.rows[0].exists;
    console.log('Users table exists:', usersTableExists);
    
    if (usersTableExists) {
      // Lihat semua user yang ada
      const result = await client.query('SELECT id, username, role FROM users');
      console.log('Current users in database:');
      result.rows.forEach(user => {
        console.log(`ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
      });
      
      // Cek jumlah user admin
      const adminCount = await client.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
      console.log('Admin count:', adminCount.rows[0].count);
      
      // Jika belum ada admin, tambahkan admin baru
      if (adminCount.rows[0].count === '0') {
        console.log('No admin found. Creating a new admin user...');
        
        // Hash password
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Tambahkan user admin
        const insertResult = await client.query(
          'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
          ['admin', hashedPassword, 'admin']
        );
        
        console.log('Admin created:', insertResult.rows[0]);
      }
      
      // Tambahkan user penyewa jika diperlukan
      const tenantCount = await client.query("SELECT COUNT(*) FROM users WHERE role = 'penyewa'");
      console.log('Tenant count:', tenantCount.rows[0].count);
      
      if (tenantCount.rows[0].count === '0') {
        console.log('No tenant found. Creating a new tenant user...');
        
        // Hash password
        const password = 'tenant123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Tambahkan user penyewa
        const insertResult = await client.query(
          'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
          ['tenant', hashedPassword, 'penyewa']
        );
        
        console.log('Tenant created:', insertResult.rows[0]);
      }
    } else {
      console.log('Users table does not exist. Run init-db.js to create it first.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkUsersTable(); 