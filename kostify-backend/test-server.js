const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Konfigurasi koneksi database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Test server is running!');
});

// GET all rooms
app.get('/rooms', async (req, res) => {
  console.log('GET /rooms - Fetching all rooms');
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY id ASC');
    console.log(`Found ${result.rows.length} rooms`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
}); 