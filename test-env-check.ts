/**
 * Test Environment Detection
 * This tests whether Discord logger correctly detects dev vs production
 */

console.log('🧪 Testing Environment Detection\n')

console.log('Current Environment Variables:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('NEXT_PUBLIC_VERCEL_ENV:', process.env.NEXT_PUBLIC_VERCEL_ENV)
console.log('')

const isProduction = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

console.log('Is Production?:', isProduction)
console.log('')

if (isProduction) {
  console.log('✅ Running in PRODUCTION mode')
  console.log('   → Discord messages WILL be sent')
} else {
  console.log('✅ Running in DEVELOPMENT mode')
  console.log('   → Discord messages will NOT be sent')
  console.log('   → Logs will appear in console only')
}

console.log('')
console.log('To test production mode:')
console.log('  NODE_ENV=production npx tsx test-env-check.ts')
console.log('')
console.log('To test development mode:')
console.log('  npx tsx test-env-check.ts')
