import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/packages - Get all active packages
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: packages, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching packages:', error)
      return NextResponse.json(
        { error: 'Failed to fetch packages' },
        { status: 500 }
      )
    }

    return NextResponse.json({ packages })
  } catch (error) {
    console.error('Error in GET /api/packages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/packages - Create new package (admin only)
export async function POST(request: NextRequest) {
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

    const { data: newPackage, error } = await supabase
      .from('packages')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        currency: body.currency || 'VND',
        billing_period: body.billing_period || 'one_time',
        max_events: body.max_events,
        max_participants_per_event: body.max_participants_per_event,
        max_categories_per_event: body.max_categories_per_event,
        max_candidates_per_category: body.max_candidates_per_category,
        features: body.features || {},
        is_active: body.is_active ?? true,
        is_popular: body.is_popular ?? false,
        is_highlighted: body.is_highlighted ?? false,
        display_order: body.display_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating package:', error)
      return NextResponse.json(
        { error: 'Failed to create package' },
        { status: 500 }
      )
    }

    return NextResponse.json({ package: newPackage }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/packages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
