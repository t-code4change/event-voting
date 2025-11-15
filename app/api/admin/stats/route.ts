import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET /api/admin/stats - Get subscription analytics (admin only)
export async function GET(request: NextRequest) {
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

    // Total revenue
    const { data: revenueData } = await supabase
      .from('subscriptions')
      .select('amount_paid')
      .eq('status', 'active')

    const totalRevenue = revenueData?.reduce((sum, sub) => sum + sub.amount_paid, 0) || 0

    // Active subscriptions count
    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Revenue by package
    const { data: packageRevenue } = await supabase
      .from('subscriptions')
      .select(`
        amount_paid,
        package:packages(name)
      `)
      .eq('status', 'active')

    const revenueByPackage: Record<string, number> = {}
    packageRevenue?.forEach((sub: any) => {
      const packageName = sub.package?.name || 'Unknown'
      revenueByPackage[packageName] = (revenueByPackage[packageName] || 0) + sub.amount_paid
    })

    // Subscriptions by status
    const { data: statusData } = await supabase
      .from('subscriptions')
      .select('status')

    const subscriptionsByStatus: Record<string, number> = {
      pending: 0,
      active: 0,
      expired: 0,
      cancelled: 0,
    }

    statusData?.forEach((sub) => {
      subscriptionsByStatus[sub.status] = (subscriptionsByStatus[sub.status] || 0) + 1
    })

    // Recent subscriptions (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: recentSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Expiring soon (next 7 days)
    const sevenDaysLater = new Date()
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

    const { data: expiringSoon } = await supabase
      .from('subscriptions')
      .select(`
        id,
        end_date,
        user:users(email, full_name),
        package:packages(name)
      `)
      .eq('status', 'active')
      .not('end_date', 'is', null)
      .lte('end_date', sevenDaysLater.toISOString())
      .gte('end_date', new Date().toISOString())

    // Unpaid invoices count
    const { count: unpaidInvoices } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'unpaid')

    return NextResponse.json({
      total_revenue: totalRevenue,
      active_subscriptions: activeSubscriptions || 0,
      total_users: totalUsers || 0,
      revenue_by_package: revenueByPackage,
      subscriptions_by_status: subscriptionsByStatus,
      recent_subscriptions: recentSubscriptions || 0,
      expiring_soon: expiringSoon || [],
      unpaid_invoices: unpaidInvoices || 0,
    })
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
