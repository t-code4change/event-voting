import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/subscriptions/[id] - Get subscription details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        user:users(id, email, full_name, company_name),
        invoice:invoices(*)
      `)
      .eq('id', params.id)
      .single()

    if (error || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Check permission - user can only view their own subscription
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = userData && ['admin', 'super_admin'].includes(userData.role)
    if (subscription.user_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get subscription history
    const { data: history } = await supabase
      .from('subscription_history')
      .select(`
        *,
        old_package:packages!subscription_history_old_package_id_fkey(name),
        new_package:packages!subscription_history_new_package_id_fkey(name)
      `)
      .eq('subscription_id', params.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      subscription,
      history: history || [],
    })
  } catch (error) {
    console.error('Error in GET /api/subscriptions/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/subscriptions/[id] - Update subscription (admin or user for cancel)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    // Get subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', params.id)
      .single()

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = userData && ['admin', 'super_admin'].includes(userData.role)
    const isOwner = subscription.user_id === user.id

    if (action === 'cancel') {
      // User can cancel their own subscription
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const { data: updated, error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to cancel subscription' },
          { status: 500 }
        )
      }

      // Create history entry
      await supabase
        .from('subscription_history')
        .insert({
          subscription_id: params.id,
          user_id: user.id,
          action: 'cancelled',
          old_status: subscription.status,
          new_status: 'cancelled',
          description: 'Subscription cancelled by user',
          metadata: {},
        })

      return NextResponse.json({ subscription: updated })
    } else if (action === 'activate' || action === 'renew') {
      // Only admin can activate/renew
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const updates: any = {
        status: 'active',
        updated_at: new Date().toISOString(),
      }

      if (action === 'renew') {
        const startDate = new Date()
        updates.start_date = startDate.toISOString()

        // Calculate new end date
        if (subscription.end_date) {
          const { data: pkg } = await supabase
            .from('packages')
            .select('billing_period')
            .eq('id', subscription.package_id)
            .single()

          if (pkg?.billing_period === 'monthly') {
            startDate.setMonth(startDate.getMonth() + 1)
            updates.end_date = startDate.toISOString()
          } else if (pkg?.billing_period === 'yearly') {
            startDate.setFullYear(startDate.getFullYear() + 1)
            updates.end_date = startDate.toISOString()
          }
        }

        updates.events_used = 0 // Reset usage on renewal
      }

      const { data: updated, error: updateError } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', params.id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update subscription' },
          { status: 500 }
        )
      }

      // Create history entry
      await supabase
        .from('subscription_history')
        .insert({
          subscription_id: params.id,
          user_id: user.id,
          action: action === 'renew' ? 'renewed' : 'activated',
          old_status: subscription.status,
          new_status: 'active',
          description: `Subscription ${action}d by admin`,
          metadata: {},
        })

      return NextResponse.json({ subscription: updated })
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in PUT /api/subscriptions/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/subscriptions/[id] - Delete subscription (super admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || userData.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden - Super admin only' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting subscription:', error)
      return NextResponse.json(
        { error: 'Failed to delete subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Subscription deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/subscriptions/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
