#!/usr/bin/env node

/**
 * Auto Migration Script
 * Automatically run all database migrations
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PROJECT_REF = 'xicdommyxzsschupzvsx';

async function runMigrations() {
  console.log('🚀 Automated Database Migration');
  console.log('================================\n');

  // Check if DB password is set
  if (!process.env.SUPABASE_DB_PASSWORD) {
    console.log('❌ SUPABASE_DB_PASSWORD not found in .env\n');
    console.log('Please add it to your .env file:');
    console.log('   SUPABASE_DB_PASSWORD=your_database_password\n');
    console.log('Get your database password from:');
    console.log(`   https://app.supabase.com/project/${PROJECT_REF}/settings/database\n`);
    process.exit(1);
  }

  // Connection string - Direct connection (not pooler)
  const connectionString = `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Connect
    console.log('📡 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Migration files in order
    const migrations = [
      {
        file: 'supabase-subscription-schema.sql',
        name: 'Subscription Schema'
      },
      {
        file: 'supabase-migration-add-user-event-relationship.sql',
        name: 'User-Event Relationship + Event Code'
      }
    ];

    // Run each migration
    for (let i = 0; i < migrations.length; i++) {
      const { file, name } = migrations[i];
      const step = i + 1;

      console.log('====================================');
      console.log(`📝 STEP ${step}: ${name}`);
      console.log('====================================\n');

      const filePath = path.join(__dirname, '..', file);

      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${file}`);
        process.exit(1);
      }

      const sql = fs.readFileSync(filePath, 'utf8');

      console.log('⏳ Running migration...\n');

      try {
        const result = await client.query(sql);

        // Print notices
        if (result && result.rows) {
          console.log('Migration output:');
          result.rows.forEach(row => console.log('  ', row));
        }

        console.log('\n✅ Migration completed successfully!\n');
      } catch (error) {
        console.log('\n❌ Migration failed!');
        console.log('Error:', error.message);
        console.log('\nPlease fix the error and try again.\n');
        process.exit(1);
      }
    }

    console.log('====================================');
    console.log('🎉 ALL MIGRATIONS SUCCESSFUL!');
    console.log('====================================\n');

    // Verification
    console.log('📊 Verifying setup...\n');

    // Check tables
    const tablesResult = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN (
          'users', 'packages', 'subscriptions', 'invoices',
          'transactions', 'subscription_history',
          'events', 'categories', 'candidates', 'voters', 'votes'
        );
    `);

    console.log(`  ✅ ${tablesResult.rows[0].count} core tables created`);

    // Check events columns
    const columnsResult = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.columns
      WHERE table_name = 'events'
        AND column_name IN ('user_id', 'settings', 'code');
    `);

    console.log(`  ✅ Events table has ${columnsResult.rows[0].count} new columns (user_id, settings, code)`);

    // Check packages
    const packagesResult = await client.query(`
      SELECT COUNT(*) as count, STRING_AGG(name, ', ') as packages
      FROM packages;
    `);

    console.log(`  ✅ ${packagesResult.rows[0].count} packages: ${packagesResult.rows[0].packages}`);

    // Test event code generation
    const codeResult = await client.query(`SELECT generate_event_code() as code;`);
    console.log(`  ✅ Sample event code: ${codeResult.rows[0].code}`);

    console.log('\n====================================');
    console.log('✨ Migration Complete!');
    console.log('====================================\n');

    console.log('Next steps:');
    console.log('1. Create a test user in Supabase Auth Dashboard');
    console.log('2. Create subscription for that user');
    console.log('3. Test creating events with user_id\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run migrations
runMigrations();
