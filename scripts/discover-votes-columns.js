/**
 * Discover actual columns in votes table by testing one at a time
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function discoverColumns() {
  console.log('🔍 Discovering actual columns in votes table...\n');

  const possibleColumns = [
    'id',
    'voter_id',
    'event_id',
    'category_id',
    'candidate_id',
    'created_at',
    'updated_at'
  ];

  const existingColumns = [];

  for (const col of possibleColumns) {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select(col)
        .limit(1);

      if (!error) {
        console.log(`✅ ${col} - EXISTS`);
        existingColumns.push(col);
      } else {
        console.log(`❌ ${col} - MISSING (${error.message})`);
      }
    } catch (error) {
      console.log(`❌ ${col} - ERROR`);
    }
  }

  console.log('\n📋 Summary:');
  console.log('Existing columns:', existingColumns);
  console.log('\nMissing columns:', possibleColumns.filter(c => !existingColumns.includes(c)));
}

discoverColumns();
