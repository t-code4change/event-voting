// Test Registration with Supabase Auth API
// Run with: node test-registration.js

const https = require('https');

const SUPABASE_URL = 'https://xicdommyxzsschupzvsx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2RvbW15eHpzc2NodXB6dnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMDIwMjYsImV4cCI6MjA0Njg3ODAyNn0.6r9QJ4F3pWP5RwqQrSbxmFqh9fmvYxGr9Ur_5q3wUfQ'; // You need to get this from your Supabase dashboard

// Generate random test email
const testEmail = `test_${Date.now()}@example.com`;
const testPassword = '12341234';

const payload = JSON.stringify({
  email: testEmail,
  password: testPassword,
  data: {},
  gotrue_meta_security: {},
  code_challenge: null,
  code_challenge_method: null
});

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║     🧪 TESTING REGISTRATION WITH AUTH API       ║');
console.log('╚═══════════════════════════════════════════════════╝\n');
console.log('Test Email:', testEmail);
console.log('Test Password:', testPassword);
console.log('\nSending request to Supabase Auth...\n');

const options = {
  hostname: 'xicdommyxzsschupzvsx.supabase.co',
  port: 443,
  path: '/auth/v1/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length,
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response Headers:', JSON.stringify(res.headers, null, 2));
    console.log('\n═══════════════ RESPONSE BODY ═══════════════\n');

    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));

      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('\n✅ ✅ ✅ REGISTRATION SUCCESSFUL! ✅ ✅ ✅\n');
        console.log('User ID:', jsonData.user?.id);
        console.log('Email:', jsonData.user?.email);
        console.log('Created At:', jsonData.user?.created_at);

        if (jsonData.session) {
          console.log('\n✅ Session created successfully');
          console.log('Access Token:', jsonData.session.access_token?.substring(0, 20) + '...');
        }
      } else {
        console.log('\n❌ ❌ ❌ REGISTRATION FAILED! ❌ ❌ ❌\n');
        console.log('Error Code:', jsonData.code);
        console.log('Error Message:', jsonData.message || jsonData.msg);
      }
    } catch (e) {
      console.log('Raw response:', data);
    }

    console.log('\n═══════════════════════════════════════════════\n');
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error);
});

req.write(payload);
req.end();
