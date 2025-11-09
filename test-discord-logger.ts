/**
 * Test Discord Logger
 * Run this to test Discord webhook integration
 *
 * Usage: npx tsx test-discord-logger.ts
 */

// Set environment variable for testing
process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1437116551575900311/GP56PD_a7eiC8qTa7HQuxhfl-d5rPOgg3iXLkfHxRIuvZ5JuIjh_oXP6D5wud7kqXk18'

import DiscordLogger from './lib/discord-logger'

async function testDiscordLogger() {
  console.log('🧪 Testing Discord Logger...\n')

  try {
    // Test 1: User Login
    console.log('1️⃣ Testing User Login event...')
    await DiscordLogger.userLogin('test@example.com', 'email')
    console.log('✅ User Login logged\n')
    await sleep(1000)

    // Test 2: User Register
    console.log('2️⃣ Testing User Register event...')
    await DiscordLogger.userRegister('newuser@example.com', 'google')
    console.log('✅ User Register logged\n')
    await sleep(1000)

    // Test 3: Page View
    console.log('3️⃣ Testing Page View event...')
    await DiscordLogger.pageView('/pricing', 'test@example.com')
    console.log('✅ Page View logged\n')
    await sleep(1000)

    // Test 4: Event Join
    console.log('4️⃣ Testing Event Join event...')
    await DiscordLogger.eventJoin('EVENT123', 'Gala Night 2025', 'test@example.com')
    console.log('✅ Event Join logged\n')
    await sleep(1000)

    // Test 5: Payment Initiated
    console.log('5️⃣ Testing Payment Initiated event...')
    await DiscordLogger.paymentInitiated('Pro', '15,000,000 VNĐ', 'test@example.com', true)
    console.log('✅ Payment Initiated logged\n')
    await sleep(1000)

    // Test 6: Payment Confirmed
    console.log('6️⃣ Testing Payment Confirmed event...')
    await DiscordLogger.paymentConfirmed('Pro', '15,000,000 VNĐ', 'test@example.com')
    console.log('✅ Payment Confirmed logged\n')
    await sleep(1000)

    // Test 7: Vote Submit
    console.log('7️⃣ Testing Vote Submit event...')
    await DiscordLogger.voteSubmit('EVENT123', 'Best Performance', 'John Doe', 'voter@example.com')
    console.log('✅ Vote Submit logged\n')
    await sleep(1000)

    // Test 8: Error
    console.log('8️⃣ Testing Error event...')
    await DiscordLogger.error('Test error message', {
      Component: 'TestScript',
      ErrorCode: '500',
    })
    console.log('✅ Error logged\n')
    await sleep(1000)

    // Test 9: Custom Event
    console.log('9️⃣ Testing Custom event...')
    await DiscordLogger.custom('Test Custom Event', {
      'Custom Field 1': 'Value 1',
      'Custom Field 2': 'Value 2',
      'Test Number': '12345',
    }, 'INFO')
    console.log('✅ Custom Event logged\n')

    console.log('\n🎉 All tests completed! Check your Discord channel for messages.\n')

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Run tests
testDiscordLogger()
