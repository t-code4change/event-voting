import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = createClient()

    // Get all categories for the event with their candidates
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        description,
        emoji,
        max_votes_per_voter,
        display_order,
        candidates (
          id,
          name,
          description,
          photo_url,
          display_order
        )
      `)
      .eq("event_id", params.eventId)
      .order("display_order", { ascending: true })

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      return NextResponse.json(
        { message: "Failed to fetch categories" },
        { status: 500 }
      )
    }

    // Sort candidates within each category
    const categoriesWithSortedCandidates = categories.map((category) => ({
      ...category,
      candidates: (category.candidates || []).sort(
        (a, b) => a.display_order - b.display_order
      ),
    }))

    return NextResponse.json({
      categories: categoriesWithSortedCandidates,
    })
  } catch (error) {
    console.error("Error in categories route:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
