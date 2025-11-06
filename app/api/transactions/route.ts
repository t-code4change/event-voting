import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/transactions - Get user's transactions or all transactions (admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase
      .from('transactions')
      .select(`
        *,
        subscription:subscriptions(id, package:packages(name)),
        invoice:invoices(invoice_number),
        user:users(id, email, full_name)
      `)
      .order('created_at', { ascending: false })

    // If admin mode, check role
    if (isAdmin) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else {
      // Regular user - only show their transactions
      query = query.eq('user_id', user.id)
    }

    const { data: transactions, error } = await query

    if (error) {
      console.error('Error fetching transactions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error in GET /api/transactions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/transactions - Create transaction (for payment callback)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const body = await request.json()

    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id: body.user_id,
        subscription_id: body.subscription_id,
        invoice_id: body.invoice_id,
        transaction_type: body.transaction_type || 'payment',
        amount: body.amount,
        currency: body.currency || 'VND',
        payment_method: body.payment_method,
        payment_gateway: body.payment_gateway,
        payment_gateway_transaction_id: body.payment_gateway_transaction_id,
        status: body.status || 'pending',
        description: body.description,
        metadata: body.metadata || {},
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      )
    }

    // If transaction is completed, update subscription and invoice
    if (body.status === 'completed') {
      if (body.subscription_id) {
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', body.subscription_id)

        // Create history entry
        await supabase
          .from('subscription_history')
          .insert({
            subscription_id: body.subscription_id,
            user_id: body.user_id,
            action: 'activated',
            new_status: 'active',
            description: 'Payment received and subscription activated',
            metadata: {},
          })
      }

      if (body.invoice_id) {
        await supabase
          .from('invoices')
          .update({
            payment_status: 'paid',
            payment_date: new Date().toISOString(),
            payment_method: body.payment_method,
            payment_reference: body.payment_gateway_transaction_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', body.invoice_id)
      }
    }

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/transactions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
