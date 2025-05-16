// Versi Node.js tidak mendukung fetch API secara native, jadi kita gunakan axios
const axios = require('axios');

async function testEndpoints() {
  const endpoints = [
    'http://localhost:3000/',
    'http://localhost:3000/debug/users',
    'http://localhost:3000/api/users',
    'http://localhost:3000/users'
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint}...`);
    
    try {
      const response = await axios.get(endpoint);
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      console.log('Data:', JSON.stringify(response.data, null, 2).substring(0, 100) + '...');
    } catch (error) {
      console.error(`❌ ${endpoint} - Error: ${error.message}`);
      if (error.response) {
        console.error(`  Status: ${error.response.status}`);
        console.error(`  Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    
    console.log('-'.repeat(50));
  }
}

testEndpoints(); 