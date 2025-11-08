/**
 * Script to check and fix database schema
 * - Check if user-event relationship exists
 * - Add user_id to events table if missing
 * - Verify all relationships are correct
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('🔍 Checking database schema...\n');

  try {
    // Check if events table has user_id column
    const { data: columns, error: columnError } = await supabase
      .rpc('get_table_columns', { table_name: 'events' })
      .select('*');

    if (columnError) {
      console.log('⚠️  Cannot check columns directly. Checking via query...');

      // Try to query events to see structure
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .limit(1);

      if (eventsError) {
        console.error('❌ Error checking events table:', eventsError.message);
      } else {
        console.log('✅ Events table exists');
        if (events && events.length > 0) {
          console.log('📋 Current event structure:', Object.keys(events[0]));

          if (!events[0].hasOwnProperty('user_id')) {
            console.log('\n❌ ISSUE FOUND: events table missing user_id column!');
            return { needsUpdate: true, hasUserColumn: false };
          } else {
            console.log('✅ Events table has user_id column');
          }
        } else {
          console.log('📋 Events table is empty, checking schema via insert test...');
        }
      }
    }

    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      console.log('❌ Users table not found or not accessible:', usersError.message);
      return { needsUpdate: true, hasUsersTable: false };
    } else {
      console.log('✅ Users table exists');
    }

    // Check all required tables
    const tables = ['events', 'categories', 'candidates', 'voters', 'votes', 'otp_codes',
                    'users', 'packages', 'subscriptions'];

    console.log('\n📊 Checking all tables:');
    const tableStatus = {};

    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      const exists = !error;
      tableStatus[table] = exists;
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    }

    return { needsUpdate: false, tableStatus };

  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
    return { needsUpdate: true, error: error.message };
  }
}

async function updateSchema() {
  console.log('\n🔧 Updating database schema...\n');

  const updateSQL = `
-- =============================================
-- ADD USER_ID TO EVENTS TABLE
-- =============================================

-- Add user_id column to events table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE events
    ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

    CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

    COMMENT ON COLUMN events.user_id IS 'User who owns this event (from subscription system)';

    RAISE NOTICE 'Added user_id column to events table';
  ELSE
    RAISE NOTICE 'user_id column already exists in events table';
  END IF;
END $$;

-- =============================================
-- UPDATE RLS POLICIES FOR EVENTS
-- =============================================

-- Drop old policies
DROP POLICY IF EXISTS "Public can view active events" ON events;
DROP POLICY IF EXISTS "Users can view own events" ON events;
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Users can delete own events" ON events;

-- Public can view active events (no change)
CREATE POLICY "Public can view active events"
ON events FOR SELECT
TO public
USING (is_active = true);

-- Users can view their own events
CREATE POLICY "Users can view own events"
ON events FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can create events (must set user_id to their own ID)
CREATE POLICY "Users can create events"
ON events FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own events
CREATE POLICY "Users can update own events"
ON events FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own events
CREATE POLICY "Users can delete own events"
ON events FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Admins can manage all events
DROP POLICY IF EXISTS "Admins can manage all events" ON events;
CREATE POLICY "Admins can manage all events"
ON events FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
);

-- =============================================
-- ADD SETTINGS COLUMN TO EVENTS
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'settings'
  ) THEN
    ALTER TABLE events
    ADD COLUMN settings JSONB DEFAULT '{
      "theme": "default",
      "colors": {
        "primary": "#3b82f6",
        "secondary": "#8b5cf6"
      },
      "features": {
        "show_results_realtime": true,
        "allow_comments": false,
        "require_registration": true
      }
    }'::jsonb;

    COMMENT ON COLUMN events.settings IS 'Event-specific settings (theme, colors, features)';

    RAISE NOTICE 'Added settings column to events table';
  ELSE
    RAISE NOTICE 'settings column already exists in events table';
  END IF;
END $$;

-- =============================================
-- CREATE RESULTS VIEW
-- =============================================

CREATE OR REPLACE VIEW results AS
SELECT
  e.id AS event_id,
  e.name AS event_name,
  e.user_id,
  cat.id AS category_id,
  cat.name AS category_name,
  cat.display_order AS category_order,
  cand.id AS candidate_id,
  cand.name AS candidate_name,
  cand.photo_url,
  cand.description,
  COUNT(v.id) AS vote_count,
  RANK() OVER (
    PARTITION BY cat.id
    ORDER BY COUNT(v.id) DESC
  ) AS rank
FROM events e
JOIN categories cat ON cat.event_id = e.id
JOIN candidates cand ON cand.category_id = cat.id
LEFT JOIN votes v ON v.candidate_id = cand.id
GROUP BY
  e.id, e.name, e.user_id,
  cat.id, cat.name, cat.display_order,
  cand.id, cand.name, cand.photo_url, cand.description
ORDER BY e.created_at DESC, cat.display_order, vote_count DESC;

COMMENT ON VIEW results IS 'Aggregated voting results with rankings per category';
`;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: updateSQL });

    if (error) {
      // If exec_sql doesn't exist, we need to run SQL manually
      console.log('⚠️  Cannot execute SQL via RPC. Please run the following SQL in Supabase SQL Editor:\n');
      console.log('='.repeat(80));
      console.log(updateSQL);
      console.log('='.repeat(80));
      console.log('\n📝 Steps:');
      console.log('1. Go to https://app.supabase.com/project/xicdommyxzsschupzvsx/sql');
      console.log('2. Copy the SQL above');
      console.log('3. Paste and run it in the SQL Editor');
      return false;
    }

    console.log('✅ Schema updated successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error updating schema:', error.message);
    console.log('\n⚠️  Please run the migration SQL manually in Supabase Dashboard');
    return false;
  }
}

async function clearAndRecreateData() {
  console.log('\n🗑️  Clearing existing data...\n');

  try {
    // Delete in correct order (due to foreign keys)
    console.log('Deleting votes...');
    await supabase.from('votes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting voters...');
    await supabase.from('voters').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting candidates...');
    await supabase.from('candidates').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting categories...');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting events...');
    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting OTP codes...');
    await supabase.from('otp_codes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('\n✅ Data cleared successfully!');
    console.log('\n💡 Run seed-demo-data.js to create new test data with proper relationships');

  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
  }
}

async function main() {
  console.log('🚀 Database Schema Checker & Fixer\n');
  console.log('='.repeat(80) + '\n');

  // Step 1: Check schema
  const checkResult = await checkSchema();

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY:');

  if (checkResult.needsUpdate) {
    console.log('❌ Schema needs updates!\n');
    console.log('Issues found:');
    if (checkResult.hasUserColumn === false) {
      console.log('  - events table missing user_id column');
    }
    if (checkResult.hasUsersTable === false) {
      console.log('  - users table not found');
    }

    console.log('\n🔧 Running schema updates...\n');
    const updated = await updateSchema();

    if (!updated) {
      console.log('\n⚠️  Manual migration required. See SQL above.');
      process.exit(1);
    }
  } else {
    console.log('✅ Schema looks good!\n');
    if (checkResult.tableStatus) {
      const allTablesExist = Object.values(checkResult.tableStatus).every(v => v);
      if (!allTablesExist) {
        console.log('\n⚠️  Some tables are missing. You may need to run the full schema setup.');
      }
    }
  }

  // Step 2: Ask about clearing data
  console.log('\n' + '='.repeat(80));
  console.log('\n🗑️  Do you want to clear existing data and recreate it?');
  console.log('This will delete all events, categories, candidates, votes, and voters.');
  console.log('\nTo proceed, run:');
  console.log('  node scripts/check-and-fix-schema.js --clear-data\n');

  if (process.argv.includes('--clear-data')) {
    await clearAndRecreateData();
  }

  console.log('\n✨ Done!\n');
}

main();
