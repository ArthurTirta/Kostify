const pool = require('./db');

async function validateAndFixDatabase() {
  try {
    console.log('Running database validation and fixing inconsistencies...');
    
    // 1. Find rooms marked as booked but without booking entries
    console.log('Checking for rooms marked as booked but without booking entries...');
    
    const query = `
      SELECT r.id, r.name 
      FROM rooms r 
      LEFT JOIN bookings b ON r.id = b.room_id
      WHERE r.status = 'booked' AND b.id IS NULL
    `;
    
    const inconsistentRooms = await pool.query(query);
    
    if (inconsistentRooms.rows.length > 0) {
      console.log(`Found ${inconsistentRooms.rows.length} inconsistent rooms:`);
      
      // Fix the inconsistencies by setting the rooms to available
      for (const room of inconsistentRooms.rows) {
        console.log(`- Room ${room.id} (${room.name}) marked as booked but has no booking entry. Fixing...`);
        await pool.query("UPDATE rooms SET status = 'available' WHERE id = $1", [room.id]);
        console.log(`  ✓ Room ${room.id} status updated to 'available'`);
      }
    } else {
      console.log('No inconsistencies found.');
    }
    
    // 2. Add a trigger to automatically update room status when a booking is deleted
    console.log('\nCreating trigger to maintain consistency between rooms and bookings...');
    
    const triggerExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'update_room_status_on_booking_delete'
      );
    `);
    
    if (!triggerExists.rows[0].exists) {
      // Create the trigger function
      await pool.query(`
        CREATE OR REPLACE FUNCTION update_room_status_on_booking()
        RETURNS TRIGGER AS $$
        BEGIN
          -- When a booking is deleted, update the corresponding room to available
          IF (TG_OP = 'DELETE') THEN
            UPDATE rooms SET status = 'available' WHERE id = OLD.room_id;
            RETURN OLD;
          END IF;
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
      `);
      
      // Create the trigger
      await pool.query(`
        CREATE TRIGGER update_room_status_on_booking_delete
        AFTER DELETE ON bookings
        FOR EACH ROW
        EXECUTE FUNCTION update_room_status_on_booking();
      `);
      
      console.log('Trigger created successfully.');
    } else {
      console.log('Trigger already exists.');
    }
    
    console.log('\nDatabase validation completed.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

validateAndFixDatabase();
