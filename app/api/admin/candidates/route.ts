import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()

    // Get all candidates with their category info
    const { data: candidates, error } = await supabase
      .from("candidates")
      .select(`
        *,
        categories!inner (
          id,
          name,
          event_id,
          events!inner (
            id,
            name,
            is_active
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Group by category
    const groupedByCategory = candidates?.reduce((acc: any, candidate: any) => {
      const categoryId = candidate.categories.id
      const categoryName = candidate.categories.name
      const eventName = candidate.categories.events.name
      const isActive = candidate.categories.events.is_active

      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId,
          categoryName,
          eventName,
          isActive,
          candidates: []
        }
      }

      acc[categoryId].candidates.push({
        id: candidate.id,
        name: candidate.name,
        photo_url: candidate.photo_url,
        description: candidate.description,
        display_order: candidate.display_order,
        created_at: candidate.created_at
      })

      return acc
    }, {})

    return NextResponse.json({
      categories: Object.values(groupedByCategory || {})
    })
  } catch (error) {
    console.error("Error fetching candidates:", error)
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    )
  }
}
