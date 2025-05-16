const { Pool } = require('pg');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
});

async function fixFinanceTable() {
  let client;
  try {
    // Connect to the database
    client = await pool.connect();
    console.log('Connected to database');

    // Check if finance_reports table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'finance_reports'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log('Finance reports table exists:', tableExists);

    if (!tableExists) {
      console.log('Creating finance_reports table...');
      
      // Create the finance_reports table
      await client.query(`
        CREATE TABLE finance_reports (
          id SERIAL PRIMARY KEY,
          bulan VARCHAR(20) NOT NULL,
          tanggal DATE NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'Belum Lunas',
          bukti_foto VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Finance reports table created successfully');
      
      // Add some sample data
      const sampleData = [
        {
          bulan: 'Jan-25',
          tanggal: '2025-01-25',
          status: 'Lunas',
          bukti_foto: '/uploads/bukti-jan25.png'
        },
        {
          bulan: 'Feb-25',
          tanggal: '2025-02-25',
          status: 'Belum Lunas',
          bukti_foto: null
        }
      ];
      
      for (const data of sampleData) {
        await client.query(`
          INSERT INTO finance_reports (bulan, tanggal, status, bukti_foto)
          VALUES ($1, $2, $3, $4)
        `, [data.bulan, data.tanggal, data.status, data.bukti_foto]);
      }
      
      console.log('Sample finance reports added');
    } else {
      // Check for any data
      const dataCheck = await client.query('SELECT COUNT(*) FROM finance_reports');
      console.log('Number of finance reports:', dataCheck.rows[0].count);
      
      // Add sample data if none exists
      if (parseInt(dataCheck.rows[0].count) === 0) {
        console.log('No finance reports found, adding sample data...');
        
        // Add some sample data
        const sampleData = [
          {
            bulan: 'Jan-25',
            tanggal: '2025-01-25',
            status: 'Lunas',
            bukti_foto: '/uploads/bukti-jan25.png'
          },
          {
            bulan: 'Feb-25',
            tanggal: '2025-02-25',
            status: 'Belum Lunas',
            bukti_foto: null
          }
        ];
        
        for (const data of sampleData) {
          await client.query(`
            INSERT INTO finance_reports (bulan, tanggal, status, bukti_foto)
            VALUES ($1, $2, $3, $4)
          `, [data.bulan, data.tanggal, data.status, data.bukti_foto]);
        }
        
        console.log('Sample finance reports added');
      }
    }
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    if (client) client.release();
    await pool.end();
    
    console.log('\nRestarting server...');
    // Check if the server is properly configured
    const indexPath = path.join(__dirname, 'index.js');
    if (fs.existsSync(indexPath)) {
      // Start the server
      const server = spawn('node', [indexPath], {
        detached: true,
        stdio: 'inherit'
      });
      
      server.unref();
      console.log('Server started with PID:', server.pid);
    } else {
      console.error('index.js not found');
    }
  }
}

// Run the function
fixFinanceTable(); 