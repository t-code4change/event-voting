import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/invoices/[id] - Get invoice details
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

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        subscription:subscriptions(*, package:packages(*)),
        user:users(id, email, full_name, company_name)
      `)
      .eq('id', params.id)
      .single()

    if (error || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Check permission - user can only view their own invoice
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = userData && ['admin', 'super_admin'].includes(userData.role)
    if (invoice.user_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error('Error in GET /api/invoices/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/invoices/[id] - Update invoice (admin only)
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

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const { data: updatedInvoice, error } = await supabase
      .from('invoices')
      .update({
        payment_status: body.payment_status,
        payment_method: body.payment_method,
        payment_date: body.payment_date,
        payment_reference: body.payment_reference,
        notes: body.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating invoice:', error)
      return NextResponse.json(
        { error: 'Failed to update invoice' },
        { status: 500 }
      )
    }

    // If invoice is marked as paid, activate the subscription
    if (body.payment_status === 'paid') {
      const { data: invoice } = await supabase
        .from('invoices')
        .select('subscription_id')
        .eq('id', params.id)
        .single()

      if (invoice?.subscription_id) {
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', invoice.subscription_id)

        // Create history entry
        await supabase
          .from('subscription_history')
          .insert({
            subscription_id: invoice.subscription_id,
            user_id: user.id,
            action: 'activated',
            old_status: 'pending',
            new_status: 'active',
            description: 'Subscription activated after payment confirmation',
            metadata: {},
          })
      }
    }

    return NextResponse.json({ invoice: updatedInvoice })
  } catch (error) {
    console.error('Error in PUT /api/invoices/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
