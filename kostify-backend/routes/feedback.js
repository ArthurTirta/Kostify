const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all feedback - accessible to everyone
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

// Create new feedback - accessible to everyone (no authentication required)
router.post('/', async (req, res) => {
  const { user_id, user_name, comment } = req.body;
  
  // Validate the required fields
  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }
  
  // Use a default name if not provided
  const finalUserName = user_name || 'Anonymous User';
  
  try {
    const result = await pool.query(
      'INSERT INTO feedback (user_id, user_name, comment) VALUES ($1, $2, $3) RETURNING *',
      [user_id || null, finalUserName, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

// Update feedback - temporarily accessible without auth for testing
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  
  // Validate the required fields
  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }
  
  try {
    const result = await pool.query(
      'UPDATE feedback SET comment = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [comment, id]
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

// Delete feedback - temporarily accessible without auth for testing
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM feedback WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully', feedback: result.rows[0] });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

module.exports = router; 