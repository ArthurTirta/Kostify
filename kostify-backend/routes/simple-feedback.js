const express = require('express');
const router = express.Router();

// Simple GET endpoint
router.get('/', (req, res) => {
  console.log('GET /simple-feedback received');
  res.json({ message: 'Simple feedback endpoint is working' });
});

// Simple POST endpoint - no database
router.post('/', (req, res) => {
  console.log('POST /simple-feedback received:');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  // Always return success
  res.status(201).json({ 
    success: true, 
    message: 'Feedback received (no database operation)',
    receivedData: req.body
  });
});

module.exports = router; 