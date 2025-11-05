import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Fetch all counts in parallel
    const [
      eventsResult,
      categoriesResult,
      candidatesResult,
      votersResult,
      votesResult,
    ] = await Promise.all([
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("candidates").select("*", { count: "exact", head: true }),
      supabase.from("voters").select("*", { count: "exact", head: true }),
      supabase.from("votes").select("*", { count: "exact", head: true }),
    ])

    // Check for errors
    if (eventsResult.error) throw eventsResult.error
    if (categoriesResult.error) throw categoriesResult.error
    if (candidatesResult.error) throw candidatesResult.error
    if (votersResult.error) throw votersResult.error
    if (votesResult.error) throw votesResult.error

    const stats = {
      totalEvents: eventsResult.count || 0,
      totalCategories: categoriesResult.count || 0,
      totalCandidates: candidatesResult.count || 0,
      totalVoters: votersResult.count || 0,
      totalVotes: votesResult.count || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
