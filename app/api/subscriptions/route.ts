import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/subscriptions - Get user's subscriptions or all subscriptions (admin)
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
      .from('subscriptions')
      .select(`
        *,
        package:packages(*),
        user:users(id, email, full_name, company_name),
        invoice:invoices(*)
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
      // Regular user - only show their subscriptions
      query = query.eq('user_id', user.id)
    }

    const { data: subscriptions, error } = await query

    if (error) {
      console.error('Error fetching subscriptions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('Error in GET /api/subscriptions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/subscriptions - Create new subscription
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { package_id, requires_invoice, invoice_details } = body

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      )
    }

    // Get package details
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', package_id)
      .single()

    if (packageError || !packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Calculate end date based on billing period
    let endDate = null
    if (packageData.billing_period === 'monthly') {
      const date = new Date()
      date.setMonth(date.getMonth() + 1)
      endDate = date.toISOString()
    } else if (packageData.billing_period === 'yearly') {
      const date = new Date()
      date.setFullYear(date.getFullYear() + 1)
      endDate = date.toISOString()
    }

    // Create subscription
    const { data: newSubscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        package_id: package_id,
        status: 'pending',
        amount_paid: packageData.price,
        currency: packageData.currency,
        start_date: new Date().toISOString(),
        end_date: endDate,
        events_used: 0,
        events_limit: packageData.max_events,
        requires_invoice: requires_invoice || false,
        metadata: {},
      })
      .select()
      .single()

    if (subError) {
      console.error('Error creating subscription:', subError)
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    // Create invoice if required
    let invoice = null
    if (requires_invoice && invoice_details) {
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          subscription_id: newSubscription.id,
          user_id: user.id,
          invoice_date: new Date().toISOString().split('T')[0],
          company_name: invoice_details.company_name,
          company_tax_code: invoice_details.company_tax_code,
          company_address: invoice_details.company_address,
          company_email: invoice_details.company_email,
          company_phone: invoice_details.company_phone,
          items: [
            {
              description: `${packageData.name} - ${packageData.billing_period}`,
              quantity: 1,
              unit_price: packageData.price,
              total: packageData.price,
            },
          ],
          subtotal: packageData.price,
          vat_rate: 10,
          vat_amount: packageData.price * 0.1,
          total_amount: packageData.price * 1.1,
          currency: packageData.currency,
          payment_status: 'unpaid',
          metadata: {},
        })
        .select()
        .single()

      if (!invoiceError) {
        invoice = invoiceData

        // Update subscription with invoice_id
        await supabase
          .from('subscriptions')
          .update({ invoice_id: invoice.id })
          .eq('id', newSubscription.id)
      }
    }

    // Create subscription history
    await supabase
      .from('subscription_history')
      .insert({
        subscription_id: newSubscription.id,
        user_id: user.id,
        action: 'created',
        new_package_id: package_id,
        new_status: 'pending',
        description: `Subscription created for ${packageData.name}`,
        metadata: {},
      })

    return NextResponse.json(
      {
        subscription: newSubscription,
        invoice,
        payment_url: null, // TODO: Generate payment gateway URL
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/subscriptions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
