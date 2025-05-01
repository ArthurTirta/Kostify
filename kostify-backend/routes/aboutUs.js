const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token dan role admin
const verifyAdminRole = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Akses ditolak, token tidak tersedia' });
    }

    // Verifikasi token (gunakan secret yang sama dengan yang dipakai saat login)
    const decoded = jwt.verify(token, 'kostify_secret_key');
    
    // Cek apakah user adalah admin
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Akses ditolak, hanya admin yang dapat melakukan ini' });
    }
    
    next();
  } catch (error) {
    console.error('Error verifying admin role:', error);
    res.status(401).json({ error: 'Token tidak valid' });
  }
};

// Get about us content - Bisa diakses siapa saja
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM about_us ORDER BY id ASC LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'About us content not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching about us content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update about us content - Hanya admin
router.put('/:id', verifyAdminRole, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const result = await pool.query(
      'UPDATE about_us SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'About us content not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating about us content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 