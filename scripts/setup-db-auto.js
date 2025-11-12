/**
 * Automatic Database Setup Script
 * Connects to Supabase and runs SQL migrations
 *
 * Usage: node scripts/setup-db-auto.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 Bright4Event - Database Setup')
console.log('=' .repeat(50))

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Missing Supabase credentials!')
  console.error('Please set in .env:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\n📖 See QUICKSTART.md for instructions')
  process.exit(1)
}

if (supabaseServiceKey === 'placeholder-service-key') {
  console.error('\n❌ Service Role Key is still placeholder!')
  console.error('\n📝 Steps to get real key:')
  console.error('1. Go to: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/settings/api')
  console.error('2. Copy "service_role" key (yellow/secret key)')
  console.error('3. Update .env: SUPABASE_SERVICE_ROLE_KEY=your-key')
  console.error('\n📖 See QUICKSTART.md for detailed instructions')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkConnection() {
  console.log('\n1️⃣  Testing Supabase connection...')
  try {
    const { data, error } = await supabase.from('events').select('count').limit(1)

    if (error && error.code === '42P01') {
      console.log('⚠️  Tables not found - will create them')
      return false
    }

    console.log('✅ Connection successful!')
    return true
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    process.exit(1)
  }
}

async function checkExistingData() {
  console.log('\n2️⃣  Checking existing data...')
  try {
    const { data: events } = await supabase
      .from('events')
      .select('id, name, is_active')
      .eq('is_active', true)

    if (events && events.length > 0) {
      console.log('✅ Active event found:', events[0].name)
      return true
    }

    console.log('⚠️  No active events found')
    return false
  } catch (error) {
    console.log('⚠️  Could not check events (tables may not exist yet)')
    return false
  }
}

async function runSQLFile(filename, description) {
  console.log(`\n${description}...`)
  try {
    const sqlPath = path.join(__dirname, '..', filename)
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Note: Supabase client doesn't support direct SQL execution
    // User must run SQL scripts manually in Supabase Dashboard
    console.log(`⚠️  Cannot auto-execute SQL via API`)
    console.log(`📝 Please run manually in Supabase SQL Editor:`)
    console.log(`   File: ${filename}`)
    console.log(`   URL: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/sql/new`)

    return false
  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error.message)
    return false
  }
}

async function main() {
  console.log('\n📊 Database Setup Process')
  console.log('-'.repeat(50))

  const hasConnection = await checkConnection()

  if (!hasConnection) {
    console.log('\n⚠️  Tables need to be created')
    console.log('\n📝 MANUAL STEPS REQUIRED:')
    console.log('\n1. Open Supabase SQL Editor:')
    console.log('   https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/sql/new')
    console.log('\n2. Copy contents of: supabase-schema.sql')
    console.log('3. Paste and click RUN')
    console.log('\n4. Copy contents of: supabase-seed.sql')
    console.log('5. Paste and click RUN')
    console.log('\n📖 See QUICKSTART.md for step-by-step instructions')
    process.exit(0)
  }

  const hasData = await checkExistingData()

  if (hasData) {
    console.log('\n✅ Database already setup!')
    console.log('\n📊 Summary:')
    console.log('   - Tables: ✅ Created')
    console.log('   - Data: ✅ Seeded')
    console.log('   - Status: Ready to use!')
    console.log('\n🚀 Start the app: npm run dev')
    console.log('🗳️  Vote: http://localhost:3000/vote')
    console.log('👨‍💼 Admin: http://localhost:3000/admin/dashboard')
    process.exit(0)
  }

  console.log('\n⚠️  Database has tables but no data')
  console.log('\n📝 Run seed data:')
  console.log('1. Open: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/sql/new')
  console.log('2. Copy contents of: supabase-seed.sql')
  console.log('3. Paste and click RUN')
  process.exit(0)
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
