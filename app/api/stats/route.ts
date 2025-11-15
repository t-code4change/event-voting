import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()

    // Get active event
    const { data: event } = await supabase
      .from("events")
      .select("id, voting_end_time")
      .eq("is_active", true)
      .single()

    if (!event) {
      return NextResponse.json({
        totalVoters: 0,
        totalCategories: 0,
        totalVotes: 0,
        timeRemaining: null,
      })
    }

    // Get counts
    const [
      { count: votersCount },
      { count: categoriesCount },
      { count: votesCount },
    ] = await Promise.all([
      supabase
        .from("voters")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id),
      supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id),
    ])

    // Calculate time remaining
    const now = new Date()
    const endTime = new Date(event.voting_end_time)
    const timeRemaining = endTime > now ? endTime.getTime() - now.getTime() : 0

    return NextResponse.json({
      totalVoters: votersCount || 0,
      totalCategories: categoriesCount || 0,
      totalVotes: votesCount || 0,
      timeRemaining,
      votingEndTime: event.voting_end_time,
    })
  } catch (error) {
    console.error("Error in stats route:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
