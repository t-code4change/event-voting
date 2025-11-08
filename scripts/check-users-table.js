/**
 * Check if users table exists
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsersTable() {
  console.log('🔍 Checking users table...\n');

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Users table does NOT exist!');
      console.log('   Error:', error.message);
      console.log('\n⚠️  You need to run the subscription schema first!\n');
      console.log('📝 Steps:');
      console.log('1. Open Supabase SQL Editor');
      console.log('2. Run: supabase-subscription-schema.sql');
      console.log('3. Then run: supabase-migration-add-user-event-relationship.sql\n');
      return false;
    }

    console.log('✅ Users table exists!');
    if (data && data.length > 0) {
      console.log(`   Found ${data.length} users in database`);
      console.log('   User structure:', Object.keys(data[0]));
    } else {
      console.log('   Table is empty (no users yet)');
    }

    return true;

  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

checkUsersTable();
