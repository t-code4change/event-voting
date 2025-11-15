import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/subscriptions/active - Get user's active subscription
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        package:packages(*),
        invoice:invoices(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (error) {
      // No active subscription found
      return NextResponse.json({
        has_active_subscription: false,
        subscription: null,
        can_create_event: false,
      })
    }

    // Check if user can create more events
    const canCreateEvent = subscription.events_limit === null ||
      subscription.events_used < subscription.events_limit

    // Calculate events remaining
    const eventsRemaining = subscription.events_limit === null
      ? null
      : subscription.events_limit - subscription.events_used

    // Check if subscription is expired
    const isExpired = subscription.end_date
      ? new Date(subscription.end_date) < new Date()
      : false

    return NextResponse.json({
      has_active_subscription: !isExpired,
      subscription,
      can_create_event: canCreateEvent && !isExpired,
      events_remaining: eventsRemaining,
      subscription_expires_at: subscription.end_date,
    })
  } catch (error) {
    console.error('Error in GET /api/subscriptions/active:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
