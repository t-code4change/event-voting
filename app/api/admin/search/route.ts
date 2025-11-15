import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// GET /api/admin/search?query=<keyword>
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query param
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        guests: [],
        events: [],
        categories: [],
        candidates: [],
        screens: [],
      })
    }

    const searchTerm = `%${query.toLowerCase()}%`

    // Search guests
    const { data: guests } = await supabase
      .from("guests")
      .select("id, name, phone, email, checked_in")
      .or(`name.ilike.${searchTerm},phone.ilike.${searchTerm},email.ilike.${searchTerm}`)
      .limit(5)

    // Search events
    const { data: events } = await supabase
      .from("events")
      .select("id, name, is_active, start_time, end_time")
      .ilike("name", searchTerm)
      .limit(5)

    // Search categories
    const { data: categories } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        event:events(name)
      `)
      .ilike("name", searchTerm)
      .limit(5)

    // Search candidates
    const { data: candidates } = await supabase
      .from("candidates")
      .select(`
        id,
        name,
        votes,
        category:categories(name)
      `)
      .ilike("name", searchTerm)
      .limit(5)

    // Static screens (no DB search needed)
    const allScreens = [
      { id: "welcome", name: "Welcome LED", route: "/admin/welcome-led" },
      { id: "waiting", name: "Waiting Screen", route: "/admin/waiting-screen" },
      { id: "voting", name: "Voting Page", route: "/admin/voting" },
      { id: "results", name: "Result LED", route: "/admin/result-led" },
      { id: "minigame", name: "Mini Game", route: "/admin/mini-game" },
    ]

    const screens = allScreens.filter((screen) =>
      screen.name.toLowerCase().includes(query.toLowerCase())
    )

    // Format results
    const formattedGuests = guests?.map((g: any) => ({
      id: g.id,
      name: g.name,
      phone: g.phone || "",
      email: g.email || "",
      checkedIn: g.checked_in || false,
    })) || []

    const formattedEvents = events?.map((e: any) => {
      const now = new Date()
      const start = e.start_time ? new Date(e.start_time) : null
      const end = e.end_time ? new Date(e.end_time) : null

      let status: "live" | "upcoming" | "ended" = "ended"
      if (e.is_active && start && end) {
        if (now >= start && now <= end) {
          status = "live"
        } else if (now < start) {
          status = "upcoming"
        }
      }

      return {
        id: e.id,
        name: e.name,
        status,
        checkins: 0, // TODO: Calculate from guests table
        totalGuests: 0, // TODO: Calculate from guests table
      }
    }) || []

    const formattedCategories = categories?.map((c: any) => ({
      id: c.id,
      name: c.name,
      eventName: c.event?.name || "Unknown Event",
    })) || []

    const formattedCandidates = candidates?.map((c: any) => ({
      id: c.id,
      name: c.name,
      votes: c.votes || 0,
      categoryName: c.category?.name || "Unknown Category",
    })) || []

    return NextResponse.json({
      guests: formattedGuests,
      events: formattedEvents,
      categories: formattedCategories,
      candidates: formattedCandidates,
      screens,
    })
  } catch (error) {
    console.error("Error in GET /api/admin/search:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
