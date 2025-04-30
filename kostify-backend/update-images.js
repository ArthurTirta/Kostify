const pool = require('./db');

async function updateRoomImages() {
  try {
    const client = await pool.connect();
    console.log('Memperbarui gambar contoh pada ruangan...');
    
    await client.query(`
      UPDATE rooms 
      SET image_url = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop' 
      WHERE id = 1
    `);
    
    await client.query(`
      UPDATE rooms 
      SET image_url = 'https://images.unsplash.com/photo-1594563703937-fdc640497dcd?w=600&auto=format&fit=crop' 
      WHERE id = 2
    `);
    
    await client.query(`
      UPDATE rooms 
      SET image_url = 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=600&auto=format&fit=crop' 
      WHERE id = 3
    `);
    
    console.log('Gambar ruangan berhasil diperbarui');
    client.release();
    await pool.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

updateRoomImages(); 