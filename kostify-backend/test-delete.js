const http = require('http');

// Get the feedback ID to delete from command line args
const feedbackId = process.argv[2] || '1'; // Default to ID 1 if none provided

// Options for the DELETE request
const options = {
  hostname: 'localhost',
  port: 3001,
  path: `/feedback/${feedbackId}`,
  method: 'DELETE'
};

console.log(`Testing DELETE for feedback ID: ${feedbackId}`);
console.log(`URL: http://${options.hostname}:${options.port}${options.path}`);

// Make the request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      console.log('Response data:', parsedData);
      if (res.statusCode === 200) {
        console.log('SUCCESS: Feedback deleted successfully');
      } else {
        console.log('ERROR: Failed to delete feedback');
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

// Send the request
req.end(); 