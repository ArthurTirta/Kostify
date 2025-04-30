const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Perbaikan path direktori uploads
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    console.log('Upload directory:', uploadDir);
    
    // Pastikan direktori uploads ada
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating upload directory...');
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Generate nama file unik dengan menambahkan timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Hapus spasi dan karakter khusus dari nama file asli
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    const extension = path.extname(sanitizedFileName);
    cb(null, 'room-' + uniqueSuffix + extension);
  }
});

// Fungsi filter file yang diizinkan (hanya gambar)
const fileFilter = (req, file, cb) => {
  console.log('File upload attempt:', file.originalname, file.mimetype);
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan (JPG, PNG, GIF, WEBP)'), false);
  }
};

// Error handling untuk multer
const uploadMiddleware = (req, res, next) => {
  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB max
    }
  }).single('image');

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // Multer error (file size, etc)
      console.error('Multer error:', err);
      return res.status(400).json({ error: `Error upload: ${err.message}` });
    } else if (err) {
      // Unknown error
      console.error('Unknown error during upload:', err);
      return res.status(500).json({ error: `Error upload: ${err.message}` });
    }
    // Lanjut ke route handler
    next();
  });
};

// Endpoint upload gambar
router.post('/', uploadMiddleware, (req, res) => {
  try {
    console.log('Upload request body:', req.body);
    console.log('Upload request file:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file yang diunggah' });
    }
    
    // Buat URL untuk akses gambar
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    console.log('Generated image URL:', imageUrl);
    
    res.status(200).json({ 
      message: 'Berhasil mengunggah gambar',
      imageUrl: imageUrl,
      file: req.file
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 