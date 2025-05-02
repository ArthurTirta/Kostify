const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Create direct database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kostify',
  password: 'postgres',
  port: 5432,
});

// Log database connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Feedback routes: Database connected successfully');
  }
});

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get feedback by ID - accessible to everyone
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM feedback WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching feedback by ID:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Create new feedback
router.post('/', (req, res) => {
  console.log('====== POST /feedback received ======');
  console.log('Request body:', JSON.stringify(req.body));
  console.log('Request body type:', typeof req.body);
  console.log('Request headers:', req.headers);
  
  try {
    // Check if body is defined
    if (!req.body) {
      console.error('Request body is undefined');
      return res.status(400).json({ error: 'No data provided' });
    }
    
    // Extract data with defaults - using type checks
    const comment = req.body.comment ? String(req.body.comment).trim() : '';
    const user_name = req.body.user_name ? String(req.body.user_name).trim() : 'Anonymous User';
    const rating = req.body.rating ? Number(req.body.rating) : 5;
    const user_id = req.body.user_id || null;
    
    console.log('Extracted data from request:');
    console.log('- comment:', comment, '(type:', typeof comment, ')');
    console.log('- user_name:', user_name, '(type:', typeof user_name, ')');
    console.log('- rating:', rating, '(type:', typeof rating, ')');
    console.log('- user_id:', user_id, '(type:', typeof user_id, ')');
    
    // Validate required fields after extraction
    if (!comment) {
      console.error('Missing required field: comment');
      return res.status(400).json({ error: 'Comment is required' });
    }
    
    // Insert into database with more robust error handling
    console.log('Inserting into database...');
    pool.query(
      'INSERT INTO feedback (comment, user_name, rating, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [comment, user_name, rating, user_id],
      (err, result) => {
        if (err) {
          console.error('Database error inserting feedback:');
          console.error('Error message:', err.message);
          console.error('Error code:', err.code);
          console.error('Error details:', err);
          return res.status(500).json({ 
            error: 'Failed to create feedback', 
            code: err.code,
            details: err.message 
          });
        }
        
        console.log('Feedback created successfully:', result.rows[0]);
        res.status(201).json(result.rows[0]);
      }
    );
  } catch (error) {
    console.error('Unexpected error in feedback route:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

// Update feedback - temporarily accessible without auth for testing
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body;
  
  // Validate the required fields
  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  try {
    const result = await pool.query(
      'UPDATE feedback SET comment = $1, rating = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [comment, rating, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// Delete feedback
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  
  pool.query('DELETE FROM feedback WHERE id = $1 RETURNING *', [id], (err, result) => {
    if (err) {
      console.error('Error deleting feedback:', err);
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json({ message: 'Feedback deleted successfully', feedback: result.rows[0] });
  });
});

module.exports = router; 