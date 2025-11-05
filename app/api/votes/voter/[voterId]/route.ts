import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { voterId: string } }
) {
  try {
    const supabase = createClient()

    // Get all votes for this voter
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select(`
        id,
        category_id,
        candidate_id,
        created_at
      `)
      .eq("voter_id", params.voterId)

    if (votesError) {
      console.error("Error fetching votes:", votesError)
      return NextResponse.json(
        { message: "Failed to fetch votes" },
        { status: 500 }
      )
    }

    // Group votes by category
    const votesByCategory = votes.reduce((acc, vote) => {
      if (!acc[vote.category_id]) {
        acc[vote.category_id] = []
      }
      acc[vote.category_id].push(vote.candidate_id)
      return acc
    }, {} as Record<string, string[]>)

    return NextResponse.json({
      votes: votesByCategory,
      raw_votes: votes,
    })
  } catch (error) {
    console.error("Error in voter votes route:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
