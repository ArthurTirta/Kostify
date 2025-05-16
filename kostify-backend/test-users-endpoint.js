const axios = require('axios');

async function testUsersEndpoint() {
  try {
    console.log('Testing /users endpoint...\n');

    // Test: Get all users from /users
    console.log('GET /users');
    try {
      const response = await axios.get('http://localhost:3000/users');
      console.log('✅ Success! Status:', response.status);
      console.log('Data:', response.data);
      
      // Log jumlah user dan tampilkan beberapa informasi penting
      console.log('Total users:', response.data.length);
      console.log('Sample data structure:');
      if (response.data.length > 0) {
        const sampleUser = response.data[0];
        console.log('- First user fields:', Object.keys(sampleUser).join(', '));
        
        // Check if role field exists
        if (sampleUser.role) {
          console.log('- Role field is present with value:', sampleUser.role);
        } else {
          console.log('❌ WARNING: Role field is missing from user data!');
        }
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      if (error.response) {
        console.error('  Status:', error.response.status);
        console.error('  Data:', error.response.data);
      }
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testUsersEndpoint(); 