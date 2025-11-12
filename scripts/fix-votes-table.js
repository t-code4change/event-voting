/**
 * Fix votes table - Add missing columns
 * - event_id (references events table)
 * - updated_at (timestamp)
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixVotesTable() {
  console.log('🔧 Fixing votes table - Adding missing columns...\n');

  const migrationSQL = `
-- =============================================
-- FIX VOTES TABLE - ADD MISSING COLUMNS
-- =============================================

-- Add event_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'event_id'
  ) THEN
    -- Add the column
    ALTER TABLE votes
    ADD COLUMN event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE;

    -- Create index
    CREATE INDEX IF NOT EXISTS idx_votes_event_id ON votes(event_id);

    COMMENT ON COLUMN votes.event_id IS 'Reference to the event this vote belongs to';

    RAISE NOTICE 'Added event_id column to votes table';
  ELSE
    RAISE NOTICE 'event_id column already exists in votes table';
  END IF;
END $$;

-- Add updated_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'updated_at'
  ) THEN
    -- Add the column
    ALTER TABLE votes
    ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

    COMMENT ON COLUMN votes.updated_at IS 'Timestamp when vote was last updated';

    RAISE NOTICE 'Added updated_at column to votes table';
  ELSE
    RAISE NOTICE 'updated_at column already exists in votes table';
  END IF;
END $$;

-- Ensure trigger exists for updated_at
DROP TRIGGER IF EXISTS update_votes_updated_at ON votes;
CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON votes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VERIFICATION
-- =============================================
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'votes'
ORDER BY ordinal_position;
`;

  console.log('📝 SQL Migration:');
  console.log('='.repeat(80));
  console.log(migrationSQL);
  console.log('='.repeat(80));
  console.log('\n📋 Instructions:');
  console.log('1. Go to: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/sql/new');
  console.log('2. Copy the SQL above');
  console.log('3. Paste and run it in the SQL Editor');
  console.log('4. Verify the output shows both columns were added');
  console.log('\n⚠️  IMPORTANT: The event_id column will be added with NOT NULL constraint.');
  console.log('   If you have existing votes data, you may need to adjust the migration.');

  // Check if there are any existing votes
  const { count } = await supabase
    .from('votes')
    .select('id', { count: 'exact', head: true });

  console.log(`\n📊 Current votes in table: ${count}`);

  if (count > 0) {
    console.log('\n⚠️  WARNING: You have existing votes!');
    console.log('   The migration above will FAIL because event_id is NOT NULL.');
    console.log('   You need to either:');
    console.log('   a) Delete all existing votes first, OR');
    console.log('   b) Modify the SQL to set event_id based on voter.event_id');
    console.log('\n   Modified SQL for option (b):');
    console.log('='.repeat(80));

    const safeSQL = `
-- Add event_id column (nullable first)
ALTER TABLE votes ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE CASCADE;

-- Populate event_id from voters table
UPDATE votes v
SET event_id = vo.event_id
FROM voters vo
WHERE v.voter_id = vo.id
AND v.event_id IS NULL;

-- Make it NOT NULL after populating
ALTER TABLE votes ALTER COLUMN event_id SET NOT NULL;

-- Create index
CREATE INDEX IF NOT EXISTS idx_votes_event_id ON votes(event_id);

-- Add updated_at
ALTER TABLE votes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add trigger
DROP TRIGGER IF EXISTS update_votes_updated_at ON votes;
CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON votes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

    console.log(safeSQL);
    console.log('='.repeat(80));
  }

  console.log('\n✨ After running the migration, run this script again to verify:');
  console.log('   node scripts/discover-votes-columns.js');
}

fixVotesTable();
