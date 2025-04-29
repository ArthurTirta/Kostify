const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  console.log('GET /rooms - Fetching all rooms');
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY id ASC');
    console.log(`Found ${result.rows.length} rooms`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a specific room by ID
router.get('/:id', async (req, res) => {
  console.log(`GET /rooms/${req.params.id} - Fetching room by ID`);
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      console.log(`Room with ID ${id} not found`);
      return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }
    
    console.log(`Found room: ${JSON.stringify(result.rows[0])}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching room ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new room
router.post('/', async (req, res) => {
  console.log('POST /rooms - Creating new room', req.body);
  try {
    const { name, price, description, status } = req.body;
    
    // Validate input
    if (!name || !price) {
      console.log('Validation error: name and price are required');
      return res.status(400).json({ error: 'Nama dan harga ruangan harus diisi' });
    }
    
    const result = await pool.query(
      'INSERT INTO rooms (name, price, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, description, status || 'available']
    );
    
    console.log(`Created room: ${JSON.stringify(result.rows[0])}`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a room
router.put('/:id', async (req, res) => {
  console.log(`PUT /rooms/${req.params.id} - Updating room`, req.body);
  try {
    const { id } = req.params;
    const { name, price, description, status } = req.body;
    
    // Validate input
    if (!name || !price) {
      console.log('Validation error: name and price are required');
      return res.status(400).json({ error: 'Nama dan harga ruangan harus diisi' });
    }
    
    const result = await pool.query(
      'UPDATE rooms SET name = $1, price = $2, description = $3, status = $4 WHERE id = $5 RETURNING *',
      [name, price, description, status, id]
    );
    
    if (result.rows.length === 0) {
      console.log(`Room with ID ${id} not found for update`);
      return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }
    
    console.log(`Updated room: ${JSON.stringify(result.rows[0])}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating room ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a room
router.delete('/:id', async (req, res) => {
  console.log(`DELETE /rooms/${req.params.id} - Deleting room`);
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      console.log(`Room with ID ${id} not found for deletion`);
      return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }
    
    console.log(`Deleted room: ${JSON.stringify(result.rows[0])}`);
    res.json({ message: 'Ruangan berhasil dihapus', deletedRoom: result.rows[0] });
  } catch (err) {
    console.error(`Error deleting room ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Book a room
router.patch('/:id/book', async (req, res) => {
  console.log(`PATCH /rooms/${req.params.id}/book - Booking room`);
  try {
    const { id } = req.params;
    
    // Check if room exists and is available
    const checkRoom = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    
    if (checkRoom.rows.length === 0) {
      console.log(`Room with ID ${id} not found for booking`);
      return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }
    
    if (checkRoom.rows[0].status === 'booked') {
      console.log(`Room with ID ${id} is already booked`);
      return res.status(400).json({ error: 'Ruangan sudah dipesan' });
    }
    
    // Update room status to booked
    const result = await pool.query(
      'UPDATE rooms SET status = $1 WHERE id = $2 RETURNING *',
      ['booked', id]
    );
    
    console.log(`Booked room: ${JSON.stringify(result.rows[0])}`);
    res.json({ message: 'Ruangan berhasil dipesan', room: result.rows[0] });
  } catch (err) {
    console.error(`Error booking room ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 