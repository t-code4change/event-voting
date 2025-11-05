/**
 * Database Setup Script
 * Run this to create tables and seed demo data
 *
 * Usage: node scripts/setup-database.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n')

  try {
    // Check connection
    console.log('1️⃣ Testing Supabase connection...')
    const { data, error } = await supabase.from('events').select('count').limit(1)

    if (error && error.code === '42P01') {
      console.log('⚠️  Tables not found. Please run SQL scripts manually in Supabase Dashboard.')
      console.log('\n📝 Steps:')
      console.log('1. Go to: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/editor')
      console.log('2. Click "SQL Editor"')
      console.log('3. Copy and run: supabase-schema.sql')
      console.log('4. Copy and run: supabase-seed.sql')
      process.exit(1)
    }

    console.log('✅ Connection successful!\n')

    // Check if data already exists
    console.log('2️⃣ Checking existing data...')
    const { data: existingEvents } = await supabase
      .from('events')
      .select('id, name')
      .eq('is_active', true)

    if (existingEvents && existingEvents.length > 0) {
      console.log('✅ Active event found:', existingEvents[0].name)
      console.log('\n📊 Database already setup!')
      return
    }

    console.log('⚠️  No active events found.')
    console.log('\n📝 Please run seed data script in Supabase SQL Editor:')
    console.log('   File: supabase-seed.sql')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

setupDatabase()
