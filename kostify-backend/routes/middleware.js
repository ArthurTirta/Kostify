const jwt = require('jsonwebtoken');
const pool = require('../db');

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

// Middleware untuk verifikasi admin
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Akses ditolak, hanya admin yang dapat melakukan operasi ini' });
  }
};

module.exports = { verifyToken, verifyAdmin }; 