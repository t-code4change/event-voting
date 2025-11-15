/**
 * Admin Database Integration Test Script
 *
 * This script tests all admin helper functions to verify database connectivity
 * Run with: npx tsx scripts/test-admin-db.ts
 */

// Load environment variables from .env
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env') })

import {
  adminEvents,
  adminCategories,
  adminCandidates,
  adminGuests,
  adminCheckInConfigs,
  adminWaitingScreenConfigs,
  adminWelcomeLEDConfigs,
  adminResultLEDConfigs,
  adminMiniGames,
  adminEventSettings,
  adminPackages,
  adminSubscriptions,
  adminInvoices
} from '../lib/supabase/admin'

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [] as { name: string; status: 'pass' | 'fail' | 'skip'; message?: string }[]
}

function logTest(name: string, status: 'pass' | 'fail' | 'skip', message?: string) {
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️'
  console.log(`${icon} ${name}${message ? ': ' + message : ''}`)
  results.tests.push({ name, status, message })
  if (status === 'pass') results.passed++
  else if (status === 'fail') results.failed++
  else results.skipped++
}

// Test data
let testEventId: string
let testCategoryId: string
let testCandidateId: string
let testGuestId: string

async function main() {
  console.log('\n' + '='.repeat(80))
  console.log('🧪 ADMIN DATABASE INTEGRATION TESTS')
  console.log('='.repeat(80) + '\n')

  try {
    // ========================================================================
    // EVENTS TESTS
    // ========================================================================
    console.log('📦 Testing Events...')

    try {
      const { data, error } = await adminEvents.getAll()
      if (error) throw error
      logTest('Events.getAll()', 'pass', `Found ${data?.length || 0} events`)
    } catch (error: any) {
      logTest('Events.getAll()', 'fail', error.message)
    }

    try {
      const newEvent = {
        name: 'Test Event ' + Date.now(),
        description: 'Auto-generated test event',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        voting_close_time: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
      }
      const { data, error } = await adminEvents.create(newEvent)
      if (error) throw error
      testEventId = data!.id
      logTest('Events.create()', 'pass', `Created event ${data!.id}`)
    } catch (error: any) {
      logTest('Events.create()', 'fail', error.message)
    }

    if (testEventId) {
      try {
        const { data, error } = await adminEvents.getById(testEventId)
        if (error) throw error
        logTest('Events.getById()', 'pass', `Retrieved event: ${data?.name}`)
      } catch (error: any) {
        logTest('Events.getById()', 'fail', error.message)
      }

      try {
        const { data, error } = await adminEvents.update(testEventId, {
          description: 'Updated ' + Date.now()
        })
        if (error) throw error
        logTest('Events.update()', 'pass', 'Updated event description')
      } catch (error: any) {
        logTest('Events.update()', 'fail', error.message)
      }

      try {
        const { error } = await adminEvents.toggleActive(testEventId)
        if (error) throw error
        logTest('Events.toggleActive()', 'pass', 'Toggled active status')
      } catch (error: any) {
        logTest('Events.toggleActive()', 'fail', error.message)
      }
    } else {
      logTest('Events.getById()', 'skip', 'No test event created')
      logTest('Events.update()', 'skip', 'No test event created')
      logTest('Events.toggleActive()', 'skip', 'No test event created')
    }

    // ========================================================================
    // CATEGORIES TESTS
    // ========================================================================
    console.log('\n📦 Testing Categories...')

    try {
      const { data, error } = await adminCategories.getAll()
      if (error) throw error
      logTest('Categories.getAll()', 'pass', `Found ${data?.length || 0} categories`)
    } catch (error: any) {
      logTest('Categories.getAll()', 'fail', error.message)
    }

    if (testEventId) {
      try {
        const newCategory = {
          event_id: testEventId,
          name: 'Test Category ' + Date.now(),
          description: 'Auto-generated test category',
          order: 1,
        }
        const { data, error } = await adminCategories.create(newCategory)
        if (error) throw error
        testCategoryId = data!.id
        logTest('Categories.create()', 'pass', `Created category ${data!.id}`)
      } catch (error: any) {
        logTest('Categories.create()', 'fail', error.message)
      }

      try {
        const { data, error } = await adminCategories.getByEvent(testEventId)
        if (error) throw error
        logTest('Categories.getByEvent()', 'pass', `Found ${data?.length || 0} categories`)
      } catch (error: any) {
        logTest('Categories.getByEvent()', 'fail', error.message)
      }
    } else {
      logTest('Categories.create()', 'skip', 'No test event')
      logTest('Categories.getByEvent()', 'skip', 'No test event')
    }

    if (testCategoryId) {
      try {
        const { data, error } = await adminCategories.update(testCategoryId, {
          description: 'Updated ' + Date.now()
        })
        if (error) throw error
        logTest('Categories.update()', 'pass', 'Updated category')
      } catch (error: any) {
        logTest('Categories.update()', 'fail', error.message)
      }
    } else {
      logTest('Categories.update()', 'skip', 'No test category')
    }

    // ========================================================================
    // CANDIDATES TESTS
    // ========================================================================
    console.log('\n📦 Testing Candidates...')

    try {
      const { data, error } = await adminCandidates.getAll()
      if (error) throw error
      logTest('Candidates.getAll()', 'pass', `Found ${data?.length || 0} candidates`)
    } catch (error: any) {
      logTest('Candidates.getAll()', 'fail', error.message)
    }

    if (testCategoryId) {
      try {
        const newCandidate = {
          category_id: testCategoryId,
          name: 'Test Candidate ' + Date.now(),
          description: 'Auto-generated test candidate',
          photo_url: 'https://via.placeholder.com/300',
          order: 1,
        }
        const { data, error } = await adminCandidates.create(newCandidate)
        if (error) throw error
        testCandidateId = data!.id
        logTest('Candidates.create()', 'pass', `Created candidate ${data!.id}`)
      } catch (error: any) {
        logTest('Candidates.create()', 'fail', error.message)
      }

      try {
        const { data, error } = await adminCandidates.getByCategory(testCategoryId)
        if (error) throw error
        logTest('Candidates.getByCategory()', 'pass', `Found ${data?.length || 0} candidates`)
      } catch (error: any) {
        logTest('Candidates.getByCategory()', 'fail', error.message)
      }
    } else {
      logTest('Candidates.create()', 'skip', 'No test category')
      logTest('Candidates.getByCategory()', 'skip', 'No test category')
    }

    // ========================================================================
    // GUESTS TESTS
    // ========================================================================
    console.log('\n📦 Testing Guests...')

    if (testEventId) {
      try {
        const { data, error } = await adminGuests.getByEvent(testEventId)
        if (error) throw error
        logTest('Guests.getByEvent()', 'pass', `Found ${data?.length || 0} guests`)
      } catch (error: any) {
        logTest('Guests.getByEvent()', 'fail', error.message)
      }

      try {
        const newGuest = {
          event_id: testEventId,
          full_name: 'Test Guest ' + Date.now(),
          email: `test${Date.now()}@example.com`,
          phone: '0901234567',
          company: 'Test Company',
        }
        const { data, error } = await adminGuests.create(newGuest)
        if (error) throw error
        testGuestId = data!.id
        logTest('Guests.create()', 'pass', `Created guest ${data!.id}`)
      } catch (error: any) {
        logTest('Guests.create()', 'fail', error.message)
      }

      try {
        const stats = await adminGuests.getStats(testEventId)
        logTest('Guests.getStats()', 'pass', `Total: ${stats.total}, Checked-in: ${stats.checkedIn}`)
      } catch (error: any) {
        logTest('Guests.getStats()', 'fail', error.message)
      }
    } else {
      logTest('Guests.getByEvent()', 'skip', 'No test event')
      logTest('Guests.create()', 'skip', 'No test event')
      logTest('Guests.getStats()', 'skip', 'No test event')
    }

    // ========================================================================
    // CONFIG TABLES TESTS
    // ========================================================================
    console.log('\n📦 Testing Config Tables...')

    if (testEventId) {
      try {
        const { data, error } = await adminCheckInConfigs.getByEvent(testEventId)
        if (error) throw error
        logTest('CheckInConfigs.getByEvent()', 'pass', data ? 'Found config' : 'No config (OK)')
      } catch (error: any) {
        logTest('CheckInConfigs.getByEvent()', 'fail', error.message)
      }

      try {
        const { data, error } = await adminWaitingScreenConfigs.getByEvent(testEventId)
        if (error) throw error
        logTest('WaitingScreenConfigs.getByEvent()', 'pass', data ? 'Found config' : 'No config (OK)')
      } catch (error: any) {
        logTest('WaitingScreenConfigs.getByEvent()', 'fail', error.message)
      }

      try {
        const { data, error } = await adminWelcomeLEDConfigs.getByEvent(testEventId)
        if (error) throw error
        logTest('WelcomeLEDConfigs.getByEvent()', 'pass', data ? 'Found config' : 'No config (OK)')
      } catch (error: any) {
        logTest('WelcomeLEDConfigs.getByEvent()', 'fail', error.message)
      }

      try {
        const { data, error } = await adminResultLEDConfigs.getByEvent(testEventId)
        if (error) throw error
        logTest('ResultLEDConfigs.getByEvent()', 'pass', data ? 'Found config' : 'No config (OK)')
      } catch (error: any) {
        logTest('ResultLEDConfigs.getByEvent()', 'fail', error.message)
      }

      try {
        const { data, error } = await adminMiniGames.getByEvent(testEventId)
        if (error) throw error
        logTest('MiniGames.getByEvent()', 'pass', `Found ${data?.length || 0} games`)
      } catch (error: any) {
        logTest('MiniGames.getByEvent()', 'fail', error.message)
      }

      try {
        const { data, error } = await adminEventSettings.getByEvent(testEventId)
        if (error) throw error
        logTest('EventSettings.getByEvent()', 'pass', data ? 'Found settings' : 'No settings (OK)')
      } catch (error: any) {
        logTest('EventSettings.getByEvent()', 'fail', error.message)
      }
    } else {
      logTest('Config Tables', 'skip', 'No test event')
    }

    // ========================================================================
    // SUBSCRIPTION SYSTEM TESTS
    // ========================================================================
    console.log('\n📦 Testing Subscription System...')

    try {
      const { data, error } = await adminPackages.getAll()
      if (error) throw error
      logTest('Packages.getAll()', 'pass', `Found ${data?.length || 0} packages`)
    } catch (error: any) {
      logTest('Packages.getAll()', 'fail', error.message)
    }

    try {
      const { data, error } = await adminPackages.getActive()
      if (error) throw error
      logTest('Packages.getActive()', 'pass', `Found ${data?.length || 0} active packages`)
    } catch (error: any) {
      logTest('Packages.getActive()', 'fail', error.message)
    }

    try {
      const { data, error } = await adminSubscriptions.getAll()
      if (error) throw error
      logTest('Subscriptions.getAll()', 'pass', `Found ${data?.length || 0} subscriptions`)
    } catch (error: any) {
      logTest('Subscriptions.getAll()', 'fail', error.message)
    }

    try {
      const { data, error } = await adminInvoices.getAll()
      if (error) throw error
      logTest('Invoices.getAll()', 'pass', `Found ${data?.length || 0} invoices`)
    } catch (error: any) {
      logTest('Invoices.getAll()', 'fail', error.message)
    }

    // ========================================================================
    // CLEANUP
    // ========================================================================
    console.log('\n🧹 Cleanup...')

    if (testCandidateId) {
      try {
        const { error } = await adminCandidates.delete(testCandidateId)
        if (error) throw error
        logTest('Cleanup: Delete candidate', 'pass')
      } catch (error: any) {
        logTest('Cleanup: Delete candidate', 'fail', error.message)
      }
    }

    if (testGuestId) {
      try {
        const { error } = await adminGuests.delete(testGuestId)
        if (error) throw error
        logTest('Cleanup: Delete guest', 'pass')
      } catch (error: any) {
        logTest('Cleanup: Delete guest', 'fail', error.message)
      }
    }

    if (testCategoryId) {
      try {
        const { error } = await adminCategories.delete(testCategoryId)
        if (error) throw error
        logTest('Cleanup: Delete category', 'pass')
      } catch (error: any) {
        logTest('Cleanup: Delete category', 'fail', error.message)
      }
    }

    if (testEventId) {
      try {
        const { error } = await adminEvents.delete(testEventId)
        if (error) throw error
        logTest('Cleanup: Delete event', 'pass')
      } catch (error: any) {
        logTest('Cleanup: Delete event', 'fail', error.message)
      }
    }

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message)
  }

  // ========================================================================
  // SUMMARY
  // ========================================================================
  console.log('\n' + '='.repeat(80))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(80))
  console.log(`✅ Passed:  ${results.passed}`)
  console.log(`❌ Failed:  ${results.failed}`)
  console.log(`⚠️  Skipped: ${results.skipped}`)
  console.log(`📝 Total:   ${results.tests.length}`)
  console.log('='.repeat(80))

  if (results.failed > 0) {
    console.log('\n❌ FAILED TESTS:')
    results.tests
      .filter(t => t.status === 'fail')
      .forEach(t => console.log(`  - ${t.name}: ${t.message}`))
  }

  if (results.failed === 0 && results.passed > 0) {
    console.log('\n✨ ALL TESTS PASSED! Database integration is working correctly.')
  }

  console.log('\n' + '='.repeat(80) + '\n')

  // Exit with error code if tests failed
  process.exit(results.failed > 0 ? 1 : 0)
}

main()
