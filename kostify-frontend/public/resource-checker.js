// Resource checker for Kostify frontend
// This script helps identify missing resources that might cause 404 errors

// Function to check if a resource exists
function checkResourceExists(url) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        resolve({
          url,
          status: xhr.status,
          exists: xhr.status !== 404
        });
      }
    };
    xhr.send();
  });
}

// Function to check common resources
async function checkResources() {
  const resources = [
    '/src/main.jsx',
    '/src/index.css',
    '/vite.svg',
    '/src/App.jsx',
    '/src/App.css',
    '/src/assets/react.svg',
    '/public/vite.svg'
  ];
  
  console.log('Checking for common resources...');
  
  const results = await Promise.all(
    resources.map(url => checkResourceExists(url))
  );
  
  console.log('Results:');
  results.forEach(result => {
    console.log(`${result.url}: ${result.exists ? '✅ Available' : '❌ Not found (Status: ' + result.status + ')'}`);
  });
}

// Check for common script issues
function findScriptIssues() {
  console.log('\nChecking for potential script issues...');
  
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.src) {
      console.log(`Checking script: ${script.src}`);
      fetch(script.src)
        .then(response => {
          if (!response.ok) {
            console.error(`❌ Script issue: ${script.src} - Status: ${response.status}`);
          } else {
            console.log(`✅ Script OK: ${script.src}`);
          }
        })
        .catch(error => {
          console.error(`❌ Script error: ${script.src} - ${error.message}`);
        });
    }
  });
}

// Check for broken image sources
function findImageIssues() {
  console.log('\nChecking for potential image issues...');
  
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.src) {
      console.log(`Checking image: ${img.src}`);
      const testImg = new Image();
      testImg.onload = function() {
        console.log(`✅ Image OK: ${img.src}`);
      };
      testImg.onerror = function() {
        console.error(`❌ Image issue: ${img.src}`);
      };
      testImg.src = img.src;
    }
  });
}

// Main function to run diagnostics
function runDiagnostics() {
  console.log('Running Kostify Frontend Resource Diagnostics');
  console.log('===========================================');
  
  checkResources()
    .then(() => {
      // These can be run in the browser console
      console.log('\nTo check for script and image issues, run these commands in the browser console:');
      console.log('findScriptIssues();');
      console.log('findImageIssues();');
    });
}

// Expose functions for browser console use
window.checkResources = checkResources;
window.findScriptIssues = findScriptIssues;
window.findImageIssues = findImageIssues;
window.runDiagnostics = runDiagnostics;

// Run diagnostics automatically when included
runDiagnostics();
