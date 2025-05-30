const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testBooking() {
  try {
    const roomId = 2; // Use an available room ID from your database
    
    const bookingData = {
      name: 'Test User',
      phone: '0812345678',
      startDate: '2025-05-29',
      duration: 1,
      userId: null // No user ID for this test
    };
    
    console.log('Sending booking request for room ID:', roomId);
    console.log('Booking data:', bookingData);
    
    const response = await axios.patch(`${API_BASE_URL}/rooms/${roomId}/book`, bookingData);
    
    console.log('Booking response:', response.data);
    console.log('Booking successful!');
    
    // Now try to fetch the booking details
    console.log('\nFetching booking details for room ID:', roomId);
    const detailsResponse = await axios.get(`${API_BASE_URL}/rooms/${roomId}/booking`);
    console.log('Booking details response:', detailsResponse.data);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

testBooking();
