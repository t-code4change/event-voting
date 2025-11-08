/**
 * Test User Registration via Supabase API
 * This simulates frontend registration to debug the error
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://xicdommyxzsschupzvsx.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual anon key

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testUserRegistration() {
  console.log('🧪 Testing User Registration via Supabase API\n');
  console.log('='.repeat(50));

  // Generate random test user
  const randomNum = Math.floor(Math.random() * 100000);
  const testEmail = `testuser${randomNum}@example.com`;
  const testPassword = 'Admin@123';

  console.log(`\n📧 Test User:`);
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password: ${testPassword}`);
  console.log('='.repeat(50));

  try {
    // Step 1: Sign up
    console.log('\n🔄 Step 1: Signing up user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: `Test User ${randomNum}`,
        },
        emailRedirectTo: undefined, // Skip email confirmation for testing
      },
    });

    if (signUpError) {
      console.error('\n❌ SIGNUP ERROR:');
      console.error(signUpError);
      console.log('\n🔍 Error Details:');
      console.log(`   Code: ${signUpError.status}`);
      console.log(`   Message: ${signUpError.message}`);

      if (signUpError.message.includes('Database error')) {
        console.log('\n💡 This is the error you reported!');
        console.log('   Possible causes:');
        console.log('   1. Triggers not installed (run supabase-auto-user-setup.sql)');
        console.log('   2. Basic package missing (run supabase-subscription-schema.sql)');
        console.log('   3. Events table missing columns (run migration 2)');
        console.log('   4. RLS policies blocking (check SECURITY DEFINER)');
      }

      return;
    }

    console.log('✅ User signed up successfully!');
    console.log(`   User ID: ${signUpData.user?.id}`);
    console.log(`   Email: ${signUpData.user?.email}`);

    // Step 2: Wait for triggers to complete
    console.log('\n🔄 Step 2: Waiting for triggers to complete (2 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Check user profile
    console.log('\n🔄 Step 3: Checking user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signUpData.user?.id)
      .single();

    if (profileError) {
      console.error('❌ Profile not found:', profileError.message);
    } else {
      console.log('✅ User profile created:');
      console.log(`   ID: ${profile.id}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Name: ${profile.full_name}`);
      console.log(`   Role: ${profile.role}`);
      console.log(`   Active: ${profile.is_active}`);
    }

    // Step 4: Check subscription
    console.log('\n🔄 Step 4: Checking subscription...');
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*, packages(*)')
      .eq('user_id', signUpData.user?.id)
      .single();

    if (subscriptionError) {
      console.error('❌ Subscription not found:', subscriptionError.message);
    } else {
      console.log('✅ Subscription created:');
      console.log(`   Package: ${subscription.packages?.name}`);
      console.log(`   Status: ${subscription.status}`);
      console.log(`   Events Limit: ${subscription.events_limit}`);
      console.log(`   Events Used: ${subscription.events_used}`);

      const daysLeft = Math.ceil(
        (new Date(subscription.end_date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
      );
      console.log(`   Trial Days Left: ${daysLeft}`);
    }

    // Step 5: Check first event
    console.log('\n🔄 Step 5: Checking first event...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', signUpData.user?.id);

    if (eventsError) {
      console.error('❌ Events not found:', eventsError.message);
    } else if (!events || events.length === 0) {
      console.error('❌ No events created for user');
    } else {
      const firstEvent = events[0];
      console.log('✅ First event created:');
      console.log(`   Name: ${firstEvent.name}`);
      console.log(`   Code: ${firstEvent.code}`);
      console.log(`   Start: ${new Date(firstEvent.voting_start_time).toLocaleString()}`);
      console.log(`   End: ${new Date(firstEvent.voting_end_time).toLocaleString()}`);
      console.log(`   Active: ${firstEvent.is_active}`);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));

    if (!signUpError && profile && subscription && events && events.length > 0) {
      console.log('✅ ALL TESTS PASSED!');
      console.log('\nUser registration is working correctly:');
      console.log('  ✅ User account created');
      console.log('  ✅ User profile created');
      console.log('  ✅ Subscription created (Basic, 30 days)');
      console.log('  ✅ First event created with code');
      console.log('\n🎉 Registration flow is working perfectly!');
    } else {
      console.log('❌ REGISTRATION INCOMPLETE');
      console.log('\nChecklist:');
      console.log(`  ${!signUpError ? '✅' : '❌'} User signup`);
      console.log(`  ${profile ? '✅' : '❌'} User profile`);
      console.log(`  ${subscription ? '✅' : '❌'} Subscription`);
      console.log(`  ${events && events.length > 0 ? '✅' : '❌'} First event`);

      console.log('\n💡 Required migrations (in order):');
      console.log('  1. supabase-subscription-schema.sql');
      console.log('  2. supabase-migration-add-user-event-relationship.sql');
      console.log('  3. supabase-auto-user-setup.sql');
    }

    console.log('\n' + '='.repeat(50));

    // Cleanup option
    console.log('\n🧹 To delete this test user, run:');
    console.log(`   DELETE FROM auth.users WHERE email = '${testEmail}';`);

  } catch (error) {
    console.error('\n💥 UNEXPECTED ERROR:');
    console.error(error);
  }
}

// Run the test
testUserRegistration()
  .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
