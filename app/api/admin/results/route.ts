import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")

    const supabase = createClient()

    // Get event with categories and candidates
    let query = supabase
      .from("events")
      .select(`
        id,
        name,
        is_active,
        voting_start_time,
        voting_end_time,
        categories (
          id,
          name,
          emoji,
          max_votes_per_voter,
          display_order,
          candidates (
            id,
            name,
            photo_url,
            description,
            display_order
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (eventId) {
      query = query.eq("id", eventId)
    }

    const { data: events, error: eventsError } = await query

    if (eventsError) throw eventsError

    // Get vote counts for all candidates
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("candidate_id")

    if (votesError) throw votesError

    // Count votes per candidate
    const voteCounts = votes?.reduce((acc: Record<string, number>, vote) => {
      acc[vote.candidate_id] = (acc[vote.candidate_id] || 0) + 1
      return acc
    }, {}) || {}

    // Add vote counts to candidates
    const eventsWithVotes = events?.map(event => ({
      ...event,
      categories: event.categories?.map(category => ({
        ...category,
        candidates: category.candidates?.map(candidate => ({
          ...candidate,
          voteCount: voteCounts[candidate.id] || 0
        })).sort((a, b) => b.voteCount - a.voteCount) // Sort by votes desc
      }))
    }))

    // Get total stats
    const { data: voters } = await supabase
      .from("voters")
      .select("id", { count: "exact", head: true })

    return NextResponse.json({
      events: eventsWithVotes || [],
      totalVoters: voters || 0,
      totalVotes: votes?.length || 0
    })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    )
  }
}
