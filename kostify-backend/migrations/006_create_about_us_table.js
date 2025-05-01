const { Pool } = require('pg');
const pool = require('../db');

async function createAboutUsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS about_us (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default content if table is empty
    const result = await pool.query('SELECT COUNT(*) FROM about_us');
    if (parseInt(result.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO about_us (title, content)
        VALUES ('Tentang Kostify', 'Kostify adalah aplikasi manajemen kost modern yang menyediakan solusi terintegrasi untuk pemilik kost dan penyewa. Kami berkomitmen untuk memudahkan proses pengelolaan dan penyewaan kamar kost dengan teknologi terbaru.');
      `);
      console.log('Default about us content inserted');
    }

    console.log('About us table created successfully');
  } catch (error) {
    console.error('Error creating about us table:', error);
  }
}

createAboutUsTable(); 