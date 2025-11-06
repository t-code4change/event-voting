import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/packages/[id] - Get specific package
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { data: packageData, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ package: packageData })
  } catch (error) {
    console.error('Error in GET /api/packages/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/packages/[id] - Update package (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Check user role
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

    const { data: updatedPackage, error } = await supabase
      .from('packages')
      .update({
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        currency: body.currency,
        billing_period: body.billing_period,
        max_events: body.max_events,
        max_participants_per_event: body.max_participants_per_event,
        max_categories_per_event: body.max_categories_per_event,
        max_candidates_per_category: body.max_candidates_per_category,
        features: body.features,
        is_active: body.is_active,
        is_popular: body.is_popular,
        is_highlighted: body.is_highlighted,
        display_order: body.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating package:', error)
      return NextResponse.json(
        { error: 'Failed to update package' },
        { status: 500 }
      )
    }

    return NextResponse.json({ package: updatedPackage })
  } catch (error) {
    console.error('Error in PUT /api/packages/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/packages/[id] - Delete package (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Check user role
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
      return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 })
    }

    // Check if package has active subscriptions
    const { data: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('package_id', params.id)
      .eq('status', 'active')
      .limit(1)

    if (activeSubscriptions && activeSubscriptions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete package with active subscriptions. Deactivate instead.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting package:', error)
      return NextResponse.json(
        { error: 'Failed to delete package' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Package deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/packages/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
