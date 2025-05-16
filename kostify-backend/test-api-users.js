const axios = require('axios');

async function testApiUsers() {
  try {
    console.log('Testing user management endpoints...\n');

    // Test 1: Get all users from /api/users
    console.log('Test 1: GET /api/users');
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      console.log('✅ Success! Status:', response.status);
      console.log('Users count:', response.data.users.length);
      console.log('Sample data:', response.data.users.slice(0, 2));
    } catch (error) {
      console.error('❌ Error:', error.message);
      if (error.response) {
        console.error('  Status:', error.response.status);
        console.error('  Data:', error.response.data);
      }
    }
    console.log('-'.repeat(50));
    
    // Test 2: Login as admin
    console.log('\nTest 2: POST /auth/login (admin)');
    let token;
    try {
      const loginResponse = await axios.post('http://localhost:3000/auth/login', {
        username: 'admin',
        password: 'admin123' // Asumsi password dari check-users.js
      });
      console.log('✅ Login Success! Status:', loginResponse.status);
      token = loginResponse.data.token;
      console.log('Token received:', token ? 'Yes' : 'No');
    } catch (error) {
      console.error('❌ Login Error:', error.message);
      if (error.response) {
        console.error('  Status:', error.response.status);
        console.error('  Data:', error.response.data);
      }
    }
    console.log('-'.repeat(50));
    
    // Test 3: Get users with auth token
    if (token) {
      console.log('\nTest 3: GET /auth/users (authenticated as admin)');
      try {
        const authResponse = await axios.get('http://localhost:3000/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Success! Status:', authResponse.status);
        console.log('Users count:', authResponse.data.users.length);
        console.log('Sample data:', authResponse.data.users.slice(0, 2));
      } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
          console.error('  Status:', error.response.status);
          console.error('  Data:', error.response.data);
        }
      }
      console.log('-'.repeat(50));
    }
    
  } catch (error) {
    console.error('Test suite error:', error.message);
  }
}

testApiUsers(); 