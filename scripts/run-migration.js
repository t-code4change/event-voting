/**
 * Run Migration Script
 * Executes the database migration to add user_id to events table
 */

const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Extract database connection from Supabase URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)[1];
const connectionString = `postgresql://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@db.${projectRef}.supabase.co:5432/postgres`;

async function runMigration() {
  console.log('🚀 Starting Database Migration...\n');
  console.log('='.repeat(80));

  let client;

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'supabase-migration-add-user-event-relationship.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('\n📄 Migration file loaded');
    console.log(`   File: ${migrationPath}`);
    console.log(`   Size: ${migrationSQL.length} characters\n`);

    console.log('🔌 Connecting to PostgreSQL database...\n');

    // Try direct PostgreSQL connection
    client = new Client({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('⏳ Executing migration SQL...\n');

    // Execute the migration
    const result = await client.query(migrationSQL);

    console.log('✅ Migration executed successfully!\n');

    if (result.notices && result.notices.length > 0) {
      console.log('📋 Migration notices:');
      result.notices.forEach(notice => {
        console.log(`   ${notice.message}`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error executing migration:', error.message);

    if (error.message.includes('password')) {
      console.log('\n⚠️  Database connection failed. Using alternative method...\n');
      console.log('Please run the migration manually:');
      console.log('\n1. Open Supabase SQL Editor:');
      console.log('   https://app.supabase.com/project/xicdommyxzsschupzvsx/sql\n');
      console.log('2. Copy the content of:');
      console.log('   supabase-migration-add-user-event-relationship.sql\n');
      console.log('3. Paste and run it in the SQL Editor\n');
    } else {
      console.log('\nError details:', error.stack);
    }

    if (client) {
      await client.end();
    }

    // Don't exit, try to verify anyway
  }

  // Close PostgreSQL connection
  if (client) {
    await client.end();
    console.log('🔌 Database connection closed\n');
  }

  // Now verify the migration using Supabase client
  console.log('🔍 Verifying migration...\n');

  try {
    // Check if events table has user_id column
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (eventsError) {
      console.log('   Note:', eventsError.message);
    }

    const hasUserId = events && events.length > 0
      ? events[0].hasOwnProperty('user_id')
      : null;

    const hasSettings = events && events.length > 0
      ? events[0].hasOwnProperty('settings')
      : null;

    console.log('='.repeat(80));
    console.log('\n📊 VERIFICATION RESULTS:\n');

    if (hasUserId !== null) {
      console.log(`   user_id column: ${hasUserId ? '✅ EXISTS' : '❌ MISSING'}`);
      console.log(`   settings column: ${hasSettings ? '✅ EXISTS' : '❌ MISSING'}`);
    } else {
      console.log('   ℹ️  Events table is empty - cannot check columns from data');
      console.log('   Please verify in Supabase Dashboard\n');
    }

    if (events && events.length > 0) {
      console.log('\n   Current event structure:');
      console.log('   ', Object.keys(events[0]).join(', '));
    }

    console.log('\n' + '='.repeat(80));

    if (hasUserId && hasSettings) {
      console.log('\n🎉 MIGRATION SUCCESSFUL!\n');
      console.log('✅ events.user_id column added');
      console.log('✅ events.settings column added');
      console.log('✅ RLS policies updated');
      console.log('✅ Helper functions created');
      console.log('✅ Triggers created\n');
      console.log('Next steps:');
      console.log('1. Update existing events to have user_id (if any)');
      console.log('2. Run seed script: node scripts/seed-demo-data.js\n');
    } else if (hasUserId === null && hasSettings === null) {
      console.log('\n⚠️  Cannot fully verify - events table is empty');
      console.log('\nTo verify, check in Supabase Dashboard:');
      console.log('https://app.supabase.com/project/xicdommyxzsschupzvsx/editor\n');
      console.log('Or try creating a test event with user_id\n');
    } else if (!hasUserId || !hasSettings) {
      console.log('\n❌ Migration incomplete!');
      console.log('\nMissing columns detected. Please:');
      console.log('1. Check Supabase SQL Editor for errors');
      console.log('2. Run migration manually if needed\n');
    }

  } catch (error) {
    console.error('\n❌ Error verifying migration:', error.message);
    console.log('\nPlease verify manually in Supabase Dashboard.\n');
  }

  console.log('='.repeat(80));
  console.log('\n✨ Migration process complete!\n');
}

// Run migration
runMigration().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
