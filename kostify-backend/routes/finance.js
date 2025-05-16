const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Use a unique filename to prevent overrides
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'finance-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept only images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Hanya file gambar yang diperbolehkan'), false);
    }
    cb(null, true);
  }
});

// Get all financial reports
router.get('/', async (req, res) => {
  console.log('GET /finance - Fetching all financial reports');
  try {
    const result = await pool.query(
      'SELECT * FROM finance_reports ORDER BY tahun DESC, CASE ' +
      'WHEN bulan = \'Januari\' THEN 1 ' +
      'WHEN bulan = \'Februari\' THEN 2 ' +
      'WHEN bulan = \'Maret\' THEN 3 ' +
      'WHEN bulan = \'April\' THEN 4 ' +
      'WHEN bulan = \'Mei\' THEN 5 ' +
      'WHEN bulan = \'Juni\' THEN 6 ' +
      'WHEN bulan = \'Juli\' THEN 7 ' +
      'WHEN bulan = \'Agustus\' THEN 8 ' +
      'WHEN bulan = \'September\' THEN 9 ' +
      'WHEN bulan = \'Oktober\' THEN 10 ' +
      'WHEN bulan = \'November\' THEN 11 ' +
      'WHEN bulan = \'Desember\' THEN 12 ' +
      'ELSE 13 END DESC'
    );
    console.log(`Found ${result.rows.length} financial reports`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching financial reports:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a specific financial report
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`GET /finance/${id} - Fetching financial report`);
  
  try {
    const result = await pool.query(
      'SELECT * FROM finance_reports WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Laporan keuangan tidak ditemukan' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching financial report:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new financial report
router.post('/', upload.single('bukti_foto'), async (req, res) => {
  console.log('POST /finance - Creating new financial report');
  const { bulan, tahun, tanggal, status } = req.body;
  
  // Path to the uploaded file (if any)
  const bukti_foto = req.file ? `/uploads/${req.file.filename}` : null;
  
  try {
    const result = await pool.query(
      'INSERT INTO finance_reports (bulan, tahun, tanggal, status, bukti_foto) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [bulan, tahun, tanggal, status, bukti_foto]
    );
    
    console.log('Financial report created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating financial report:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a financial report
router.put('/:id', upload.single('bukti_foto'), async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`PUT /finance/${id} - Updating financial report`);
  
  const { bulan, tahun, tanggal, status } = req.body;
  
  try {
    // First get the existing record to check if we need to delete an old image
    const existingRecord = await pool.query(
      'SELECT bukti_foto FROM finance_reports WHERE id = $1',
      [id]
    );
    
    if (existingRecord.rows.length === 0) {
      return res.status(404).json({ message: 'Laporan keuangan tidak ditemukan' });
    }
    
    let bukti_foto = existingRecord.rows[0].bukti_foto;
    
    // If a new file was uploaded, update the path and delete the old one
    if (req.file) {
      bukti_foto = `/uploads/${req.file.filename}`;
      
      // Delete old file if it exists
      const oldFile = existingRecord.rows[0].bukti_foto;
      if (oldFile) {
        const oldFilePath = path.join(__dirname, '../public', oldFile);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log(`Deleted old file: ${oldFilePath}`);
        }
      }
    }
    
    const result = await pool.query(
      'UPDATE finance_reports SET bulan = $1, tahun = $2, tanggal = $3, status = $4, bukti_foto = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [bulan, tahun, tanggal, status, bukti_foto, id]
    );
    
    console.log('Financial report updated:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating financial report:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a financial report
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`DELETE /finance/${id} - Deleting financial report`);
  
  try {
    // First get the record to return it after deletion and to delete associated file
    const record = await pool.query(
      'SELECT * FROM finance_reports WHERE id = $1',
      [id]
    );
    
    if (record.rows.length === 0) {
      return res.status(404).json({ message: 'Laporan keuangan tidak ditemukan' });
    }
    
    // Delete the record
    await pool.query('DELETE FROM finance_reports WHERE id = $1', [id]);
    
    // If there was an image, delete it
    const bukti_foto = record.rows[0].bukti_foto;
    if (bukti_foto) {
      const filePath = path.join(__dirname, '../public', bukti_foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    }
    
    console.log('Financial report deleted:', record.rows[0]);
    res.json({ message: 'Laporan keuangan berhasil dihapus', report: record.rows[0] });
  } catch (err) {
    console.error('Error deleting financial report:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;