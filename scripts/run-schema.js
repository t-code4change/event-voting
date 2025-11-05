/**
 * Run Schema SQL Script
 * Creates all database tables and functions
 *
 * Usage: node scripts/run-schema.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔧 Creating Database Schema...\n')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runSchema() {
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    console.log('📄 Schema file loaded')
    console.log(`   Size: ${(schema.length / 1024).toFixed(2)} KB`)

    // Split into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`   Statements: ${statements.length}\n`)

    console.log('⚙️  Executing SQL statements...\n')

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'

      // Skip comments and empty lines
      if (statement.trim().startsWith('--') || statement.trim() === ';') {
        continue
      }

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })

        if (error) {
          // Try direct query for CREATE statements
          const { error: queryError } = await supabase.from('_exec').select('*').limit(0)

          // If it's a "relation already exists" error, that's okay
          if (error.message && error.message.includes('already exists')) {
            console.log(`   ⏭️  Skipped (already exists): Statement ${i + 1}`)
            continue
          }

          console.log(`   ⚠️  Statement ${i + 1}: ${error.message}`)
        } else {
          console.log(`   ✅ Statement ${i + 1} executed`)
        }
      } catch (err) {
        console.log(`   ⚠️  Statement ${i + 1}: ${err.message}`)
      }
    }

    console.log('\n✅ Schema execution completed!')
    console.log('\n📝 Note: Some statements may need to be run manually in Supabase SQL Editor.')
    console.log('   URL: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/sql/new\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.log('\n📝 Please run the schema manually:')
    console.log('1. Open: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/sql/new')
    console.log('2. Copy contents of: supabase-schema.sql')
    console.log('3. Paste and click RUN')
    process.exit(1)
  }
}

runSchema()
