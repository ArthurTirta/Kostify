const axios = require('axios');

async function testFinanceEndpoint() {
  try {
    console.log('Testing finance endpoint...');
    
    // Test GET /finance
    console.log('\nTesting GET /finance:');
    try {
      const response = await axios.get('http://localhost:3000/finance');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    } catch (error) {
      console.error('Error:', error.message);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    
    console.log('\nDone testing.');
  } catch (err) {
    console.error('Test script error:', err);
  }
}

testFinanceEndpoint(); 