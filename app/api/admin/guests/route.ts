import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/admin/guests
 *
 * Fetch guests with pagination, search, and filters
 *
 * Query params:
 * - page: Current page number (default: 1)
 * - limit: Items per page (default: 10)
 * - search: Search query for name, email, phone, company
 * - checkInStatus: Filter by check-in status (all, checked-in, pending)
 * - company: Filter by company name
 * - emailStatus: Filter by email status (all, sent, sending, not-sent, failed)
 * - dateFrom: Filter by created date (from)
 * - dateTo: Filter by created date (to)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const checkInStatus = searchParams.get("checkInStatus") || "all"
    const company = searchParams.get("company") || ""
    const emailStatus = searchParams.get("emailStatus") || "all"
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""
    const eventId = searchParams.get("eventId") || ""

    // Calculate offset
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("guests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    // Filter by event if provided
    if (eventId) {
      query = query.eq("event_id", eventId)
    }

    // Search filter (name, email, phone, company)
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%`
      )
    }

    // Check-in status filter
    if (checkInStatus !== "all") {
      if (checkInStatus === "checked-in") {
        query = query.eq("checked_in", true)
      } else if (checkInStatus === "pending") {
        query = query.eq("checked_in", false)
      }
    }

    // Company filter
    if (company) {
      query = query.ilike("company", `%${company}%`)
    }

    // Email status filter
    if (emailStatus !== "all") {
      query = query.eq("email_status", emailStatus)
    }

    // Date range filter
    if (dateFrom) {
      query = query.gte("created_at", dateFrom)
    }
    if (dateTo) {
      query = query.lte("created_at", dateTo)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    // Execute query
    const { data: guests, error, count } = await query

    if (error) {
      console.error("Error fetching guests:", error)
      return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
    }

    // Calculate pagination metadata
    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: guests,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
