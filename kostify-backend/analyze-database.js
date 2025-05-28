const pool = require('./db');

async function analyzeDatabase() {
  try {
    console.log('========= DATABASE ANALYSIS =========');
    
    // Check if bookings table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'bookings'
      );
    `);
    
    console.log(`Bookings table exists: ${tableCheck.rows[0].exists}`);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Bookings table does not exist! Please run migrations.');
      process.exit(1);
    }
    
    // Check rooms with booked status
    const bookedRooms = await pool.query(`SELECT * FROM rooms WHERE status = 'booked'`);
    console.log(`\nNumber of booked rooms: ${bookedRooms.rows.length}`);
    
    if (bookedRooms.rows.length > 0) {
      console.log('Booked rooms:');
      bookedRooms.rows.forEach(room => {
        console.log(`- Room ID: ${room.id}, Name: ${room.name}`);
      });
    }
    
    // Check bookings
    const bookings = await pool.query(`SELECT * FROM bookings`);
    console.log(`\nNumber of bookings: ${bookings.rows.length}`);
    
    if (bookings.rows.length > 0) {
      console.log('Bookings:');
      bookings.rows.forEach(booking => {
        console.log(`- Booking ID: ${booking.id}, Room ID: ${booking.room_id}, Tenant: ${booking.tenant_name}`);
      });
    } else {
      console.log('No bookings found in the database.');
    }
    
    // Check for mismatches (rooms marked as booked but without booking data)
    console.log('\nChecking for mismatches...');
    const bookedRoomIds = bookedRooms.rows.map(room => room.id);
    const bookingRoomIds = bookings.rows.map(booking => booking.room_id);
    
    const missingBookings = bookedRoomIds.filter(roomId => !bookingRoomIds.includes(roomId));
    if (missingBookings.length > 0) {
      console.log('WARNING: The following rooms are marked as booked but have no booking data:');
      missingBookings.forEach(roomId => {
        console.log(`- Room ID: ${roomId}`);
      });
      
      console.log('\nDo you want to fix this issue by updating these rooms to "available" status? (yes/no)');
      process.stdout.write('> ');
      
      process.stdin.once('data', async (data) => {
        const answer = data.toString().trim().toLowerCase();
        
        if (answer === 'yes' || answer === 'y') {
          console.log('Fixing inconsistent room statuses...');
          
          for (const roomId of missingBookings) {
            await pool.query('UPDATE rooms SET status = $1 WHERE id = $2', ['available', roomId]);
            console.log(`- Room ID: ${roomId} status updated to "available"`);
          }
          
          console.log('Fix completed.');
        } else {
          console.log('No changes made.');
        }
        
        process.exit(0);
      });
    } else {
      console.log('No mismatches found. Database is consistent.');
      process.exit(0);
    }
    
  } catch (err) {
    console.error('Analysis error:', err);
    process.exit(1);
  }
}

analyzeDatabase();
