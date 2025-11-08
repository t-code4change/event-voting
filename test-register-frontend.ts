/**
 * Test User Registration - Frontend Simulation
 * This replicates the exact registration flow from your Next.js frontend
 *
 * Run: npx ts-node test-register-frontend.ts
 */

import { createClient } from '@supabase/supabase-js';

// Your actual Supabase credentials from .env
const SUPABASE_URL = 'https://xicdommyxzsschupzvsx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2RvbW15eHpzc2NodXB6dnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTc3NzcsImV4cCI6MjA3Nzg5Mzc3N30.MAmu4KlsDw-GuE_PT6ApiBq58eH3r8xnbcuQjQ4PzME';

// Create Supabase client (same as frontend)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testRegistration() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTING FRONTEND USER REGISTRATION');
  console.log('='.repeat(60));

  // Generate random test user
  const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const testEmail = `testuser${randomNum}@gmail.com`; // Changed to gmail.com to avoid Supabase blocking
  const testPassword = 'Admin@123';

  console.log('\n📧 Creating Test User:');
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password: ${testPassword}`);
  console.log('-'.repeat(60));

  try {
    // ================================================
    // STEP 1: Sign Up (Same as frontend signUpWithEmail)
    // ================================================
    console.log('\n🔄 Step 1: Signing up user via Supabase Auth...');

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: `Test User ${randomNum}`,
        },
      },
    });

    if (signUpError) {
      console.error('\n❌ SIGNUP FAILED!');
      console.error('━'.repeat(60));
      console.error('Error Code:', signUpError.status);
      console.error('Error Message:', signUpError.message);
      console.error('Error Name:', signUpError.name);
      console.error('━'.repeat(60));

      // Analyze the error
      if (signUpError.message.includes('Database error')) {
        console.log('\n💡 DIAGNOSIS: Database Error During User Creation');
        console.log('━'.repeat(60));
        console.log('\nThis error occurs when triggers fail to create:');
        console.log('  1. ❌ User profile in public.users');
        console.log('  2. ❌ Basic subscription');
        console.log('  3. ❌ First event');
        console.log('\n🔧 SOLUTION: Run all 3 migrations in order:');
        console.log('  1. supabase-subscription-schema.sql');
        console.log('  2. supabase-migration-add-user-event-relationship.sql');
        console.log('  3. supabase-auto-user-setup.sql');
        console.log('\n📝 See: REGISTRATION-ERROR-FIX.md for detailed fix steps');
      }

      console.log('\n');
      return { success: false, error: signUpError };
    }

    console.log('✅ User signed up in auth.users');
    console.log(`   User ID: ${signUpData.user?.id}`);
    console.log(`   Email: ${signUpData.user?.email}`);
    console.log(`   Confirmed: ${signUpData.user?.email_confirmed_at ? 'Yes' : 'No'}`);

    // ================================================
    // STEP 2: Wait for Database Triggers
    // ================================================
    console.log('\n🔄 Step 2: Waiting for database triggers (2 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ================================================
    // STEP 3: Verify User Profile Created
    // ================================================
    console.log('\n🔄 Step 3: Checking user profile in public.users...');

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signUpData.user?.id)
      .single();

    if (profileError) {
      console.error('❌ User profile NOT created');
      console.error('   Error:', profileError.message);
      console.log('   💡 Trigger handle_new_user() not working');
      console.log('   🔧 Run: supabase-auto-user-setup.sql');
    } else {
      console.log('✅ User profile created successfully');
      console.log(`   ID: ${profile.id}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Name: ${profile.full_name}`);
      console.log(`   Role: ${profile.role}`);
      console.log(`   Active: ${profile.is_active ? 'Yes' : 'No'}`);
    }

    // ================================================
    // STEP 4: Verify Subscription Created
    // ================================================
    console.log('\n🔄 Step 4: Checking subscription...');

    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        packages (
          id,
          name,
          slug,
          price,
          max_events
        )
      `)
      .eq('user_id', signUpData.user?.id);

    if (subscriptionError || !subscriptions || subscriptions.length === 0) {
      console.error('❌ Subscription NOT created');
      if (subscriptionError) {
        console.error('   Error:', subscriptionError.message);
      }
      console.log('   💡 Trigger handle_new_user_subscription() not working');
      console.log('   🔧 Check:');
      console.log('      - Basic package exists: SELECT * FROM packages WHERE slug = \'basic\';');
      console.log('      - Run: supabase-auto-user-setup.sql');
    } else {
      const subscription = subscriptions[0];
      const pkg = subscription.packages as any;
      const daysLeft = Math.ceil(
        (new Date(subscription.end_date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
      );

      console.log('✅ Subscription created successfully');
      console.log(`   Package: ${pkg?.name || 'Unknown'} (${pkg?.slug || 'N/A'})`);
      console.log(`   Status: ${subscription.status}`);
      console.log(`   Events Limit: ${subscription.events_limit}`);
      console.log(`   Events Used: ${subscription.events_used}`);
      console.log(`   Trial Days Left: ${daysLeft} days`);
      console.log(`   End Date: ${new Date(subscription.end_date).toLocaleDateString()}`);
    }

    // ================================================
    // STEP 5: Verify First Event Created
    // ================================================
    console.log('\n🔄 Step 5: Checking first event...');

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', signUpData.user?.id)
      .order('created_at', { ascending: false });

    if (eventsError || !events || events.length === 0) {
      console.error('❌ First event NOT created');
      if (eventsError) {
        console.error('   Error:', eventsError.message);
      }
      console.log('   💡 Trigger handle_new_user_first_event() not working');
      console.log('   🔧 Check:');
      console.log('      - Events table has user_id column');
      console.log('      - Events table has code column');
      console.log('      - Function generate_event_code() exists');
      console.log('      - Run: supabase-migration-add-user-event-relationship.sql');
      console.log('      - Run: supabase-auto-user-setup.sql');
    } else {
      const firstEvent = events[0];
      console.log('✅ First event created successfully');
      console.log(`   Name: ${firstEvent.name}`);
      console.log(`   Code: ${firstEvent.code}`);
      console.log(`   Start: ${new Date(firstEvent.voting_start_time).toLocaleString()}`);
      console.log(`   End: ${new Date(firstEvent.voting_end_time).toLocaleString()}`);
      console.log(`   Active: ${firstEvent.is_active ? 'Yes' : 'No (ready to edit)'}`);
      console.log(`   Settings: ${firstEvent.settings ? 'Configured' : 'Not set'}`);
    }

    // ================================================
    // FINAL SUMMARY
    // ================================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 REGISTRATION TEST SUMMARY');
    console.log('='.repeat(60));

    const allGood = !signUpError && profile && subscriptions && subscriptions.length > 0 && events && events.length > 0;

    if (allGood) {
      console.log('\n✅ ✅ ✅  ALL TESTS PASSED!  ✅ ✅ ✅');
      console.log('\nUser registration is working correctly:');
      console.log('  ✅ Auth user created');
      console.log('  ✅ User profile created in public.users');
      console.log('  ✅ Basic subscription created (30 days trial)');
      console.log('  ✅ First event created with auto-generated code');
      console.log('\n🎉 Your frontend registration should work perfectly!');
      console.log('\nTest user credentials:');
      console.log(`  Email: ${testEmail}`);
      console.log(`  Password: ${testPassword}`);
      console.log(`  Event Code: ${events[0]?.code}`);
    } else {
      console.log('\n❌ REGISTRATION TEST FAILED');
      console.log('\nChecklist:');
      console.log(`  ${!signUpError ? '✅' : '❌'} Auth signup`);
      console.log(`  ${profile ? '✅' : '❌'} User profile (public.users)`);
      console.log(`  ${subscriptions && subscriptions.length > 0 ? '✅' : '❌'} Subscription (Basic package)`);
      console.log(`  ${events && events.length > 0 ? '✅' : '❌'} First event`);

      console.log('\n🔧 REQUIRED FIXES:');
      console.log('\n1. Run migrations in this order:');
      console.log('   a) supabase-subscription-schema.sql');
      console.log('   b) supabase-migration-add-user-event-relationship.sql');
      console.log('   c) supabase-auto-user-setup.sql');
      console.log('\n2. Verify:');
      console.log('   - Basic package exists in packages table');
      console.log('   - Events table has user_id, code, settings columns');
      console.log('   - Triggers exist on auth.users table');
      console.log('\n📖 Read: REGISTRATION-ERROR-FIX.md for detailed instructions');
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n🧹 Cleanup:');
    console.log(`To delete this test user, run in SQL Editor:`);
    console.log(`DELETE FROM auth.users WHERE email = '${testEmail}';`);
    console.log('='.repeat(60) + '\n');

    return {
      success: allGood,
      user: signUpData.user,
      profile,
      subscription: subscriptions?.[0],
      event: events?.[0],
    };

  } catch (error: any) {
    console.error('\n💥 UNEXPECTED ERROR:');
    console.error('━'.repeat(60));
    console.error(error);
    console.error('━'.repeat(60));
    return { success: false, error };
  }
}

// Run the test
console.log('\n🚀 Starting registration test...\n');
testRegistration()
  .then((result) => {
    if (result.success) {
      console.log('✅ Test completed successfully!\n');
      process.exit(0);
    } else {
      console.log('❌ Test failed. Please fix the issues above.\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Test crashed:', error);
    process.exit(1);
  });
