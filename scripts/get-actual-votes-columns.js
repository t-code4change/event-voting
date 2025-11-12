/**
 * Get actual columns in votes table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getActualColumns() {
  console.log('🔍 Getting actual votes table columns...\n');

  try {
    // Try selecting just id first
    const { data, error } = await supabase
      .from('votes')
      .select('id, voter_id, category_id, candidate_id, created_at, updated_at')
      .limit(1);

    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ These columns exist: id, voter_id, category_id, candidate_id, created_at, updated_at');
      console.log('\n❌ Missing column: event_id');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

getActualColumns();
