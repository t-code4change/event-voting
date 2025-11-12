/**
 * Check votes table schema
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkVotesSchema() {
  console.log('🔍 Checking votes table schema...\n');

  try {
    // Get a sample vote to see structure
    const { data: votes, error } = await supabase
      .from('votes')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error querying votes:', error);
      return;
    }

    if (votes && votes.length > 0) {
      console.log('✅ Sample vote structure:');
      console.log(JSON.stringify(votes[0], null, 2));
      console.log('\n📋 Columns:', Object.keys(votes[0]));
    } else {
      console.log('⚠️  No votes found in table');

      // Try to get column info from information_schema
      const { data: columns, error: colError } = await supabase
        .rpc('get_votes_columns');

      if (colError) {
        console.log('Trying alternative method...');

        // Alternative: Query with all expected columns
        const { data, error: selectError } = await supabase
          .from('votes')
          .select('id, voter_id, event_id, category_id, candidate_id, created_at, updated_at')
          .limit(1);

        if (selectError) {
          console.error('❌ Error:', selectError.message);
          console.log('\nColumn that failed:', selectError.message);
        } else {
          console.log('✅ All expected columns exist!');
        }
      }
    }

    // Count total votes
    const { count, error: countError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`\n📊 Total votes in database: ${count}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkVotesSchema();
