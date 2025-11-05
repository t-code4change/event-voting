/**
 * Full Database Setup Script
 * Uses Supabase REST API to execute SQL directly
 *
 * Usage: node scripts/setup-full-database.js
 */

const https = require('https')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 Full Database Setup\n')
console.log('=' .repeat(50))

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1]

if (!projectRef) {
  console.error('❌ Invalid Supabase URL')
  process.exit(1)
}

console.log(`\n📋 Project: ${projectRef}`)
console.log(`🔗 URL: ${supabaseUrl}\n`)

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data })
        } else {
          resolve({ success: false, error: data, statusCode: res.statusCode })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(JSON.stringify({ query: sql }))
    req.end()
  })
}

async function setupDatabase() {
  try {
    // Step 1: Read schema
    console.log('1️⃣  Loading schema SQL...')
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    console.log(`   ✅ Loaded ${(schema.length / 1024).toFixed(2)} KB\n`)

    // Step 2: Read seed
    console.log('2️⃣  Loading seed SQL...')
    const seedPath = path.join(__dirname, '..', 'supabase-seed.sql')
    const seed = fs.readFileSync(seedPath, 'utf8')
    console.log(`   ✅ Loaded ${(seed.length / 1024).toFixed(2)} KB\n`)

    console.log('⚠️  Note: Supabase JS client does not support executing raw SQL.')
    console.log('📝 Please run the SQL scripts manually:\n')

    console.log('🔗 Open SQL Editor:')
    console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new\n`)

    console.log('📄 Step 1 - Run Schema:')
    console.log('   1. Copy all content from: supabase-schema.sql')
    console.log('   2. Paste into SQL Editor')
    console.log('   3. Click RUN\n')

    console.log('📄 Step 2 - Run Seed:')
    console.log('   1. Click "New query"')
    console.log('   2. Copy all content from: supabase-seed.sql')
    console.log('   3. Paste into SQL Editor')
    console.log('   4. Click RUN\n')

    console.log('🔄 Alternative: Use psql command line')
    console.log('   (if you have database connection string)\n')

    console.log('✅ After running both scripts, run:')
    console.log('   node scripts/verify-database.js\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

setupDatabase()
