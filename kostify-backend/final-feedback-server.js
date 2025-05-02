const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 3001;

// Database connection
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

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully:', result.rows[0].now);
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Feedback server is running' });
});

// Get all feedback
app.get('/feedback', (req, res) => {
  console.log('Processing GET /feedback request');
  
  pool.query('SELECT * FROM feedback ORDER BY created_at DESC', (err, result) => {
    if (err) {
      console.error('Error fetching feedback:', err);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }
    
    console.log(`Retrieved ${result.rows.length} feedback entries`);
    res.json(result.rows);
  });
});

// Create new feedback
app.post('/feedback', (req, res) => {
  console.log('Processing POST /feedback request');
  
  // Extract and validate data
  const comment = req.body?.comment || '';
  const user_name = req.body?.user_name || 'Anonymous';
  const rating = req.body?.rating || 5;
  
  if (!comment.trim()) {
    return res.status(400).json({ error: 'Comment is required' });
  }
  
  // Insert into database
  pool.query(
    'INSERT INTO feedback (comment, user_name, rating) VALUES ($1, $2, $3) RETURNING *',
    [comment, user_name, rating],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Failed to create feedback', 
          details: err.message 
        });
      }
      
      console.log('Feedback created successfully:', result.rows[0]);
      res.status(201).json(result.rows[0]);
    }
  );
});

// Delete feedback
app.delete('/feedback/:id', (req, res) => {
  const id = req.params.id;
  console.log('=============================================');
  console.log(`DELETE request received for feedback ID: ${id}`);
  console.log('Request URL:', req.originalUrl);
  console.log('Request params:', req.params);
  console.log('=============================================');
  
  pool.query('DELETE FROM feedback WHERE id = $1 RETURNING *', [id], (err, result) => {
    if (err) {
      console.error('Error deleting feedback:', err);
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }
    
    if (result.rows.length === 0) {
      console.log(`Feedback with ID ${id} not found`);
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    console.log('Feedback deleted successfully:', result.rows[0]);
    res.json({ message: 'Feedback deleted successfully', feedback: result.rows[0] });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Feedback server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  GET / - Test if server is running');
  console.log('  GET /feedback - Get all feedback entries');
  console.log('  POST /feedback - Create a new feedback entry');
  console.log('  DELETE /feedback/:id - Delete a feedback entry');
}); 