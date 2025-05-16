const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
});

async function createFinanceTable() {
  try {
    // Connect to the database
    const client = await pool.connect();
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
      
      // Create the finance_reports table with new structure
      await client.query(`
        CREATE TABLE finance_reports (
          id SERIAL PRIMARY KEY,
          bulan VARCHAR(20) NOT NULL,
          tahun INTEGER NOT NULL,
          tanggal DATE NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'Belum Lunas',
          bukti_foto VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Finance reports table created successfully');
      
      // Add some sample data with new structure
      const sampleData = [
        {
          bulan: 'Januari',
          tahun: 2025,
          tanggal: '2025-01-25',
          status: 'Lunas',
          bukti_foto: '/uploads/bukti-jan25.png'
        },
        {
          bulan: 'Februari',
          tahun: 2025,
          tanggal: '2025-02-25',
          status: 'Belum Lunas',
          bukti_foto: null
        }
      ];
      
      for (const data of sampleData) {
        await client.query(`
          INSERT INTO finance_reports (bulan, tahun, tanggal, status, bukti_foto)
          VALUES ($1, $2, $3, $4, $5)
        `, [data.bulan, data.tahun, data.tanggal, data.status, data.bukti_foto]);
      }
      
      console.log('Sample finance reports added');
    } else {
      // Check if the table needs migration to add the tahun column
      const columnCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'finance_reports' 
          AND column_name = 'tahun'
        );
      `);
      
      const hasYearColumn = columnCheck.rows[0].exists;
      
      if (!hasYearColumn) {
        console.log('Migrating finance_reports table to add tahun column...');
        
        // Add the tahun column
        await client.query(`
          ALTER TABLE finance_reports
          ADD COLUMN tahun INTEGER
        `);
        
        // Update existing records to have a default year (2025)
        await client.query(`
          UPDATE finance_reports
          SET tahun = 2025,
              bulan = CASE
                WHEN bulan LIKE 'Jan%' THEN 'Januari'
                WHEN bulan LIKE 'Feb%' THEN 'Februari'
                WHEN bulan LIKE 'Mar%' THEN 'Maret'
                WHEN bulan LIKE 'Apr%' THEN 'April'
                WHEN bulan LIKE 'May%' THEN 'Mei'
                WHEN bulan LIKE 'Jun%' THEN 'Juni'
                WHEN bulan LIKE 'Jul%' THEN 'Juli'
                WHEN bulan LIKE 'Aug%' THEN 'Agustus'
                WHEN bulan LIKE 'Sep%' THEN 'September'
                WHEN bulan LIKE 'Oct%' THEN 'Oktober'
                WHEN bulan LIKE 'Nov%' THEN 'November'
                WHEN bulan LIKE 'Dec%' THEN 'Desember'
                ELSE bulan
              END
        `);
        
        // Make tahun not null
        await client.query(`
          ALTER TABLE finance_reports
          ALTER COLUMN tahun SET NOT NULL
        `);
        
        console.log('Migration completed successfully');
      }
      
      // Check the table structure
      const schemaResult = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'finance_reports'
        ORDER BY ordinal_position;
      `);
      
      console.log('Finance reports table schema:', schemaResult.rows);
      
      // Check for any data
      const dataCheck = await client.query('SELECT COUNT(*) FROM finance_reports');
      console.log('Number of finance reports:', dataCheck.rows[0].count);
      
      // Show sample data
      const sampleData = await client.query('SELECT * FROM finance_reports LIMIT 5');
      if (sampleData.rows.length > 0) {
        console.log('Sample finance reports:');
        sampleData.rows.forEach(row => console.log(row));
      } else {
        console.log('No finance reports found');
      }
    }
    
    client.release();
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pool.end();
  }
}

// Run the function
createFinanceTable();