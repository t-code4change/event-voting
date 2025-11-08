/**
 * Quick Database Check
 * Verifies if migrations have been applied
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xicdommyxzsschupzvsx.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2RvbW15eHpzc2NodXB6dnN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMxNzc3NywiZXhwIjoyMDc3ODkzNzc3fQ.J60hFIw4ukiS60uYctmrXt3OaD2S1gxKImyeDF_VPZs';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkDatabase() {
  console.log('🔍 Checking Database Status...\n');

  try {
    // Check 1: Users table
    console.log('1️⃣ Checking users table...');
    const { data: usersCheck, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    console.log(usersError ? '❌ users table missing' : '✅ users table exists');

    // Check 2: Packages table and Basic package
    console.log('\n2️⃣ Checking packages table and Basic package...');
    const { data: packagesData, error: packagesError } = await supabase
      .from('packages')
      .select('*')
      .eq('slug', 'basic')
      .single();

    if (packagesError) {
      console.log('❌ packages table or Basic package missing');
      console.log('   Error:', packagesError.message);
    } else {
      console.log('✅ packages table exists');
      console.log('✅ Basic package exists:', packagesData.name);
    }

    // Check 3: Events table structure
    console.log('\n3️⃣ Checking events table structure...');
    const { data: eventsTest, error: eventsError } = await supabase
      .from('events')
      .select('id, user_id, code, settings')
      .limit(1);

    if (eventsError) {
      console.log('❌ events table structure issue');
      console.log('   Error:', eventsError.message);
      if (eventsError.message.includes('user_id')) {
        console.log('   💡 user_id column missing - run migration 2');
      }
      if (eventsError.message.includes('code')) {
        console.log('   💡 code column missing - run migration 2');
      }
    } else {
      console.log('✅ events table has required columns');
    }

    // Check 4: Try to call generate_event_code function
    console.log('\n4️⃣ Checking generate_event_code function...');
    const { data: codeTest, error: codeError } = await supabase.rpc('generate_event_code');

    if (codeError) {
      console.log('❌ generate_event_code function missing');
      console.log('   Error:', codeError.message);
      console.log('   💡 Run migration 2');
    } else {
      console.log('✅ generate_event_code function exists');
      console.log('   Sample code:', codeTest);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));

    const allGood = !usersError && !packagesError && !eventsError && !codeError;

    if (allGood) {
      console.log('✅ Database structure looks good!');
      console.log('\n⚠️  BUT registration is still failing...');
      console.log('\nPossible issues:');
      console.log('1. Triggers not installed on auth.users');
      console.log('2. RLS policies blocking trigger execution');
      console.log('3. Trigger functions have errors');
      console.log('\n🔧 Check Supabase Dashboard → Database → Functions');
      console.log('   Look for: handle_new_user, handle_new_user_subscription, handle_new_user_first_event');
      console.log('\n🔧 Check Supabase Dashboard → Database → Triggers');
      console.log('   Look for: on_auth_user_created (3 triggers)');
      console.log('\n📝 Or check logs: https://app.supabase.com/project/xicdommyxzsschupzvsx/logs/postgres-logs');
    } else {
      console.log('❌ Database structure incomplete');
      console.log('\n🔧 Required actions:');
      if (usersError) console.log('   1. Run: supabase-subscription-schema.sql');
      if (eventsError) console.log('   2. Run: supabase-migration-add-user-event-relationship.sql');
      if (!usersError && !eventsError) console.log('   3. Run: supabase-auto-user-setup.sql');
    }

    console.log('='.repeat(60) + '\n');

  } catch (error: any) {
    console.error('💥 Error checking database:', error.message);
  }
}

checkDatabase();
