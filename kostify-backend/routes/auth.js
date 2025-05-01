const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// Secret key untuk JWT (sebaiknya taruh di environment variable)
const JWT_SECRET = 'kostify_secret_key';

// Middleware untuk verifikasi token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Akses ditolak, token tidak tersedia' });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Simpan info user yang sudah decode untuk digunakan di handler selanjutnya
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Token tidak valid' });
  }
};

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!['admin', 'penyewa'].includes(role)) {
    return res.status(400).json({ error: 'Role tidak valid' });
  }

  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashed, role]
    );
    res.json({ message: 'User berhasil didaftarkan', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'User tidak ditemukan' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Password salah' });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login berhasil', 
      user: { id: user.id, username: user.username, role: user.role },
      token: token  // Mengirim token ke client
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint untuk memvalidasi token dan mendapatkan info user
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Ambil data user dari database (untuk mendapatkan data terbaru)
    const result = await pool.query('SELECT id, username, role FROM users WHERE id = $1', [req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    
    res.json({ 
      message: 'Token valid', 
      user: result.rows[0] 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
