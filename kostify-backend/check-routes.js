const express = require('express');
const app = express();

// Import the finance routes
try {
  const financeRoutes = require('./routes/finance');
  console.log('Finance routes imported successfully');
  
  // Check if it's a router
  if (financeRoutes.stack) {
    console.log('Routes defined in finance.js:', financeRoutes.stack.length);
  } else {
    console.log('Finance routes object type:', typeof financeRoutes);
  }
} catch (err) {
  console.error('Error importing finance routes:', err.message);
}

// Log existing node modules
console.log('\nChecking required modules:');
try {
  console.log('Express installed:', !!express);
  console.log('Multer installed:', !!require('multer'));
} catch (err) {
  console.error('Module missing:', err.message);
}

console.log('\nChecking index.js file:');
const fs = require('fs');
try {
  const indexContent = fs.readFileSync('./index.js', 'utf8');
  console.log('Index.js size:', indexContent.length, 'bytes');
  
  // Check for finance routes registration
  if (indexContent.includes('financeRoutes')) {
    console.log('Finance routes variable found in index.js');
  } else {
    console.log('⚠️ Finance routes variable NOT found in index.js');
  }
  
  if (indexContent.includes("app.use('/finance', finance")) {
    console.log('Finance routes registration found in index.js');
  } else {
    console.log('⚠️ Finance routes registration NOT found in index.js');
  }
} catch (err) {
  console.error('Error checking index.js:', err.message);
}

console.log('\nDone checking routes'); 