const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const uploadRoutes = require('./routes/upload');
const feedbackRoutes = require('./routes/feedback');
const simpleFeedbackRoutes = require('./routes/simple-feedback');
const aboutUsRoutes = require('./routes/aboutUs');
const financeRoutes = require('./routes/finance');
const path = require('path');
const fs = require('fs');
const pool = require('./db');

// Pastikan folder uploads ada
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Middleware untuk logging permintaan
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Konfigurasi file statis untuk akses gambar
console.log('Setting up static files directory:', path.join(__dirname, 'public'));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Rute API
console.log('Registering auth routes...');
app.use('/auth', authRoutes);
console.log('Registering rooms routes...');
app.use('/rooms', roomsRoutes);
console.log('Registering upload routes...');
app.use('/upload', uploadRoutes);
console.log('Registering feedback routes...');
app.use('/feedback', feedbackRoutes);
console.log('Registering simple-feedback routes...');
app.use('/simple-feedback', simpleFeedbackRoutes);
console.log('Registering about routes...');
app.use('/about', aboutUsRoutes);
console.log('Registering finance routes...');
app.use('/finance', financeRoutes);

// Endpoint untuk mendapatkan semua users (tanpa otentikasi) - untuk debugging
app.get('/debug/users', async (req, res) => {
  console.log('Debug: Getting all users directly from index.js');
  try {
    const result = await pool.query('SELECT id, username, role FROM users');
    console.log('Found users:', result.rows);
    res.json({ users: result.rows });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

// Tambahkan endpoint alternatif tanpa otentikasi untuk halaman admin pengelolaan user
app.get('/api/users', async (req, res) => {
  console.log('API: Getting all users from /api/users');
  try {
    // Pastikan koneksi database berjalan
    console.log('  Querying database...');
    const result = await pool.query('SELECT id, username, role FROM users');
    console.log('  Query successful, found users:', result.rows.length);
    
    // Kirim response dengan headers CORS yang jelas
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.json({ users: result.rows });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// GET semua user - Mengambil data dari database
app.get('/users', async (req, res) => {
  console.log('GET /users - Fetching from database');
  try {
    // Explicitly include the role field
    const result = await pool.query('SELECT id, username as nama, role FROM users');
    console.log(`Found ${result.rows.length} users in database`);
    
    // Check each user has role field and log it
    result.rows.forEach(user => {
      if (!user.role) {
        console.warn(`User ${user.id} (${user.nama}) missing role, setting default`);
        user.role = 'penyewa';
      }
    });
    
    // Log the complete data that will be sent
    console.log('Sending user data (with roles):', JSON.stringify(result.rows));
    
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// GET user by ID
app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  console.log(`GET /users/${userId} - Fetching user from database`);
  
  try {
    const result = await pool.query('SELECT id, username as nama, role FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// POST user baru
app.post('/users', async (req, res) => {
  const { nama, role = 'penyewa' } = req.body;
  console.log('POST /users - Creating new user:', nama);
  
  if (!nama) {
    return res.status(400).json({ message: 'Nama harus diisi' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (username, role) VALUES ($1, $2) RETURNING id, username, role',
      [nama, role]
    );
    
    const newUser = result.rows[0];
    res.status(201).json({ 
      message: 'User ditambahkan', 
      user: {
        id: newUser.id,
        nama: newUser.username,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// PUT update user (seluruh data)
app.put('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { nama, role } = req.body;
  console.log(`PUT /users/${userId} - Updating user`);
  
  if (!nama) {
    return res.status(400).json({ message: 'Nama harus diisi' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, role = $2 WHERE id = $3 RETURNING id, username, role',
      [nama, role || 'penyewa', userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    const updatedUser = result.rows[0];
    res.json({ 
      message: 'User diperbarui', 
      user: {
        id: updatedUser.id,
        nama: updatedUser.username,
        role: updatedUser.role
      }
    });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// PATCH update sebagian data user
app.patch('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { nama, role } = req.body;
  console.log(`PATCH /users/${userId} - Partially updating user`);
  
  if (!nama && !role) {
    return res.status(400).json({ message: 'Setidaknya satu field harus diubah' });
  }

  try {
    // Dapatkan data user sekarang
    const currentUser = await pool.query('SELECT username, role FROM users WHERE id = $1', [userId]);
    
    if (currentUser.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    // Update hanya field yang diberikan
    const currentData = currentUser.rows[0];
    const newUsername = nama || currentData.username;
    const newRole = role || currentData.role;
    
    const result = await pool.query(
      'UPDATE users SET username = $1, role = $2 WHERE id = $3 RETURNING id, username, role',
      [newUsername, newRole, userId]
    );
    
    const updatedUser = result.rows[0];
    res.json({ 
      message: 'User diubah sebagian', 
      user: {
        id: updatedUser.id,
        nama: updatedUser.username,
        role: updatedUser.role
      }
    });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// DELETE user
app.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  console.log(`DELETE /users/${userId} - Deleting user`);
  
  try {
    // Dapatkan data user sebelum dihapus
    const userData = await pool.query('SELECT id, username, role FROM users WHERE id = $1', [userId]);
    
    if (userData.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    // Hapus user
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    
    const deletedUser = userData.rows[0];
    res.json({ 
      message: 'User dihapus', 
      user: {
        id: deletedUser.id,
        nama: deletedUser.username,
        role: deletedUser.role
      }
    });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

console.log('Direct endpoints:');
console.log('- GET /debug/users - Debug endpoint for user management');
console.log('- GET /api/users - Alternative endpoint for user management');
console.log('- GET /users - Database data endpoint');

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

