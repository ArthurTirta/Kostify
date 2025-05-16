const axios = require('axios');

async function testApi() {
  try {
    console.log('Testing API endpoints...');

    // Test 1: Root endpoint
    console.log('\nTest 1: GET /');
    try {
      const rootResponse = await axios.get('http://localhost:3000/');
      console.log('Response status:', rootResponse.status);
      console.log('Response data:', rootResponse.data);
    } catch (error) {
      console.error('Root endpoint error:', error.message);
    }

    // Test 2: Debug users endpoint
    console.log('\nTest 2: GET /debug/users');
    try {
      const usersResponse = await axios.get('http://localhost:3000/debug/users');
      console.log('Response status:', usersResponse.status);
      console.log('Response data:', usersResponse.data);
    } catch (error) {
      console.error('Debug users endpoint error:', error.message);
      console.error('Error details:', error.response?.data || 'No response data');
    }

    // Test 3: Auth users endpoint with dummy token
    console.log('\nTest 3: GET /auth/users with dummy token');
    try {
      const authResponse = await axios.get(
        'http://localhost:3000/auth/users',
        { headers: { Authorization: 'Bearer dummy-token' } }
      );
      console.log('Response status:', authResponse.status);
      console.log('Response data:', authResponse.data);
    } catch (error) {
      console.error('Auth users endpoint error:', error.message);
      console.error('Error details:', error.response?.data || 'No response data');
    }

    // Test 4: Auth all-users endpoint
    console.log('\nTest 4: GET /auth/all-users');
    try {
      const allUsersResponse = await axios.get('http://localhost:3000/auth/all-users');
      console.log('Response status:', allUsersResponse.status);
      console.log('Response data:', allUsersResponse.data);
    } catch (error) {
      console.error('All users endpoint error:', error.message);
      console.error('Error details:', error.response?.data || 'No response data');
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testApi(); 