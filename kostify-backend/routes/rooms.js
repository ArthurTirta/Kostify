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
    const { name, price, description, status, image_url } = req.body;
    
    // Validate input
    if (!name || !price) {
      console.log('Validation error: name and price are required');
      return res.status(400).json({ error: 'Nama dan harga ruangan harus diisi' });
    }
    
    const result = await pool.query(
      'INSERT INTO rooms (name, price, description, status, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, description, status || 'available', image_url || 'https://plus.unsplash.com/premium_photo-1684164601278-3063c81f17dc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D']
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
    const { name, price, description, status, image_url } = req.body;
    
    // Validate input
    if (!name || !price) {
      console.log('Validation error: name and price are required');
      return res.status(400).json({ error: 'Nama dan harga ruangan harus diisi' });
    }
    
    const result = await pool.query(
      'UPDATE rooms SET name = $1, price = $2, description = $3, status = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [name, price, description, status, image_url, id]
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
  console.log(`PATCH /rooms/${req.params.id}/book - Booking room`, req.body);
  try {
    const { id } = req.params;
    const { name, phone, startDate, duration, userId } = req.body;
    
    // Debug logging
    console.log("Booking Details:");
    console.log(" - Room ID:", id);
    console.log(" - Tenant Name:", name);
    console.log(" - Phone:", phone);
    console.log(" - Start Date:", startDate);
    console.log(" - Duration:", duration);
    console.log(" - User ID:", userId);
    
    // Validate input
    if (!name || !phone || !startDate) {
      console.log('Missing required booking fields');
      return res.status(400).json({ error: 'Semua data pemesanan harus diisi' });
    }
    
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
    
    // Check if bookings table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'bookings'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Bookings table does not exist, creating it now...');
      await require('../migrations/007_create_bookings_table');
    } else {
      console.log('Bookings table exists, proceeding with insertion');
    }
    
    // Start a transaction
    await pool.query('BEGIN');
    
    try {
      // Update room status to booked
      const roomResult = await pool.query(
        'UPDATE rooms SET status = $1 WHERE id = $2 RETURNING *',
        ['booked', id]
      );
      
      // Store booking details
      const bookingResult = await pool.query(
        'INSERT INTO bookings(room_id, user_id, tenant_name, phone_number, start_date, duration) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
        [id, userId || null, name, phone, startDate, duration]
      );
      
      console.log('Successfully inserted booking:', bookingResult.rows[0]);
      
      // Commit the transaction
      await pool.query('COMMIT');
      
      console.log(`Booked room: ${JSON.stringify(roomResult.rows[0])}`);
      console.log(`Created booking with ID: ${bookingResult.rows[0].id}`);
      
      res.json({ 
        message: 'Ruangan berhasil dipesan', 
        room: roomResult.rows[0],
        bookingId: bookingResult.rows[0].id
      });
    } catch (err) {
      // Rollback in case of error
      await pool.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error(`Error booking room ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Get booking details by room ID
router.get('/:id/booking', async (req, res) => {
  console.log(`GET /rooms/${req.params.id}/booking - Fetching booking details`);
  try {
    const { id } = req.params;
    
    // Check if bookings table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'bookings'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Bookings table does not exist!');
      return res.status(404).json({ error: 'Tabel pemesanan belum dibuat' });
    }
    
    console.log(`Querying booking details for room ID ${id}`);
    
    // Get the room data first to check if it's really booked
    const roomCheck = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    
    if (roomCheck.rows.length === 0) {
      console.log(`Room with ID ${id} not found`);
      return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }
    
    if (roomCheck.rows[0].status !== 'booked') {
      console.log(`Room with ID ${id} is not booked`);
      return res.status(400).json({ error: 'Ruangan tidak dalam status terpesan' });
    }
    
    console.log(`Room status confirmed as booked, querying booking details`);
    
    // Query booking details with user information if available
    const result = await pool.query(`
      SELECT b.*, u.username
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.room_id = $1
      ORDER BY b.created_at DESC
      LIMIT 1
    `, [id]);
    
    if (result.rows.length === 0) {
      console.log(`No booking found for room ID ${id} - this is unexpected for a booked room`);
      
      // Check if there are any bookings at all
      const allBookings = await pool.query('SELECT COUNT(*) FROM bookings');
      console.log(`Total bookings in database: ${allBookings.rows[0].count}`);
      
      return res.status(404).json({ error: 'Data pemesanan tidak ditemukan' });
    }
    
    console.log(`Found booking details for room ${id}:`, result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching booking details for room ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Delete booking for a room
router.delete('/:id/booking', async (req, res) => {
  console.log(`DELETE /rooms/${req.params.id}/booking - Deleting booking for room`);
  try {
    const { id } = req.params;
    
    // Start a transaction
    await pool.query('BEGIN');
    
    try {
      // Find the booking first
      const bookingResult = await pool.query('SELECT * FROM bookings WHERE room_id = $1', [id]);
      
      if (bookingResult.rows.length === 0) {
        await pool.query('ROLLBACK');
        console.log(`No booking found for room ID ${id}`);
        return res.status(404).json({ error: 'Data pemesanan tidak ditemukan' });
      }
      
      const booking = bookingResult.rows[0];
      
      // Delete the booking
      await pool.query('DELETE FROM bookings WHERE room_id = $1', [id]);
      console.log(`Deleted booking for room ID ${id}`);
      
      // Update the room status to available
      await pool.query('UPDATE rooms SET status = $1 WHERE id = $2', ['available', id]);
      console.log(`Updated room ID ${id} status to available`);
      
      // Commit the transaction
      await pool.query('COMMIT');
      
      res.json({ 
        message: 'Pemesanan berhasil dihapus',
        deletedBooking: booking
      });
    } catch (err) {
      // Rollback in case of error
      await pool.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error(`Error deleting booking for room ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;