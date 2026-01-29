/**
 * Quick API Security Test Script
 * Run with: node test-api-security.js
 */

const BASE_URL = process.env.API_URL || 'http://localhost:8000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testPublicAPI(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}/api/website/${endpoint}`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      log(`✅ Public API /api/website/${endpoint} - Works (200 OK)`, 'green');
      return true;
    } else {
      log(`❌ Public API /api/website/${endpoint} - Failed (${response.status})`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Public API /api/website/${endpoint} - Error: ${error.message}`, 'red');
    return false;
  }
}

async function testAdminAPIWithoutToken(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/website/${endpoint}`);
    const data = await response.json();
    
    if (response.status === 401 || response.status === 403) {
      log(`✅ Admin API /api/admin/website/${endpoint} - Correctly rejected (${response.status})`, 'green');
      return true;
    } else {
      log(`❌ Admin API /api/admin/website/${endpoint} - Should require auth but returned ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Admin API /api/admin/website/${endpoint} - Error: ${error.message}`, 'red');
    return false;
  }
}

async function testAdminAPIWithToken(endpoint) {
  try {
    // Login first
    log(`\n🔐 Logging in as ${ADMIN_EMAIL}...`, 'blue');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginData.token) {
      log(`❌ Login failed: ${JSON.stringify(loginData)}`, 'red');
      return false;
    }
    
    log(`✅ Login successful, token received`, 'green');
    
    // Test admin API with token
    const response = await fetch(`${BASE_URL}/api/admin/website/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      log(`✅ Admin API /api/admin/website/${endpoint} - Works with token (200 OK)`, 'green');
      return true;
    } else if (response.status === 403) {
      log(`⚠️  Admin API /api/admin/website/${endpoint} - User lacks permission (403)`, 'yellow');
      return false;
    } else {
      log(`❌ Admin API /api/admin/website/${endpoint} - Failed (${response.status})`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Admin API /api/admin/website/${endpoint} - Error: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('\n🚀 Starting API Security Tests...\n', 'blue');
  log('='.repeat(60), 'blue');
  
  const endpoints = ['slider', 'services', 'projects', 'home-gallery', 'testimonials', 'gallery', 'gallery-videos', 'albums'];
  
  let publicPassed = 0;
  let publicFailed = 0;
  let adminWithoutTokenPassed = 0;
  let adminWithoutTokenFailed = 0;
  let adminWithTokenPassed = 0;
  let adminWithTokenFailed = 0;
  
  // Test Public APIs
  log('\n📋 Testing Public APIs (should work without auth)...\n', 'yellow');
  for (const endpoint of endpoints) {
    const result = await testPublicAPI(endpoint);
    if (result) publicPassed++;
    else publicFailed++;
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  }
  
  // Test Admin APIs without token
  log('\n📋 Testing Admin APIs without token (should fail)...\n', 'yellow');
  for (const endpoint of endpoints) {
    const result = await testAdminAPIWithoutToken(endpoint);
    if (result) adminWithoutTokenPassed++;
    else adminWithoutTokenFailed++;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Test Admin APIs with token (only test first endpoint to avoid too many login requests)
  log('\n📋 Testing Admin API with token (should work)...\n', 'yellow');
  const result = await testAdminAPIWithToken('slider');
  if (result) adminWithTokenPassed++;
  else adminWithTokenFailed++;
  
  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('\n📊 Test Summary:\n', 'blue');
  log(`Public APIs: ${publicPassed} passed, ${publicFailed} failed`, publicFailed === 0 ? 'green' : 'red');
  log(`Admin APIs (no token): ${adminWithoutTokenPassed} passed, ${adminWithoutTokenFailed} failed`, adminWithoutTokenFailed === 0 ? 'green' : 'red');
  log(`Admin APIs (with token): ${adminWithTokenPassed} passed, ${adminWithTokenFailed} failed`, adminWithTokenFailed === 0 ? 'green' : 'yellow');
  
  const totalPassed = publicPassed + adminWithoutTokenPassed + adminWithTokenPassed;
  const totalFailed = publicFailed + adminWithoutTokenFailed + adminWithTokenFailed;
  
  log(`\nTotal: ${totalPassed} passed, ${totalFailed} failed`, totalFailed === 0 ? 'green' : 'red');
  log('\n' + '='.repeat(60) + '\n', 'blue');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  log('❌ This script requires Node.js 18+ (for native fetch support)', 'red');
  log('   Or install node-fetch: npm install node-fetch', 'yellow');
  process.exit(1);
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test execution failed: ${error.message}`, 'red');
  process.exit(1);
});

