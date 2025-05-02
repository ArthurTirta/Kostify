// Import required modules
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Initialize Express app
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
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// GET /feedback - Get all feedback
app.get('/feedback', (req, res) => {
  pool.query('SELECT * FROM feedback ORDER BY created_at DESC', (err, result) => {
    if (err) {
      console.error('Error fetching feedback:', err);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }
    console.log(`Retrieved ${result.rows.length} feedback entries`);
    res.json(result.rows);
  });
});

// POST /feedback - Create new feedback
app.post('/feedback', (req, res) => {
  const comment = req.body?.comment || '';
  const user_name = req.body?.user_name || 'Anonymous';
  const rating = req.body?.rating || 5;
  
  if (!comment.trim()) {
    return res.status(400).json({ error: 'Comment is required' });
  }
  
  pool.query(
    'INSERT INTO feedback (comment, user_name, rating) VALUES ($1, $2, $3) RETURNING *',
    [comment, user_name, rating],
    (err, result) => {
      if (err) {
        console.error('Error creating feedback:', err);
        return res.status(500).json({ error: 'Failed to create feedback' });
      }
      console.log('Feedback created:', result.rows[0].id);
      res.status(201).json(result.rows[0]);
    }
  );
});

// DELETE /feedback/:id - Delete a feedback
app.delete('/feedback/:id', (req, res) => {
  const id = req.params.id;
  console.log(`Processing DELETE request for feedback ID: ${id}`);
  
  pool.query('DELETE FROM feedback WHERE id = $1 RETURNING *', [id], (err, result) => {
    if (err) {
      console.error('Error deleting feedback:', err);
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }
    
    if (result.rows.length === 0) {
      console.log(`Feedback with ID ${id} not found`);
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    console.log(`Feedback ID ${id} deleted successfully`);
    res.json({ 
      message: 'Feedback deleted successfully',
      feedback: result.rows[0] 
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Feedback server running at http://localhost:${port}`);
  console.log('Endpoints:');
  console.log('  GET /feedback - Get all feedback');
  console.log('  POST /feedback - Create new feedback');
  console.log('  DELETE /feedback/:id - Delete a feedback');
}); 