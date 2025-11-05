import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface VoteSubmission {
  category_id: string
  candidate_ids: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { voter_id, event_id, votes } = body as {
      voter_id: string
      event_id: string
      votes: VoteSubmission[]
    }

    if (!voter_id || !event_id || !votes || !Array.isArray(votes)) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Verify voter exists and belongs to this event
    const { data: voter, error: voterError } = await supabase
      .from("voters")
      .select("id, event_id")
      .eq("id", voter_id)
      .eq("event_id", event_id)
      .single()

    if (voterError || !voter) {
      // Mock mode for demo - allow mock voters
      if (voter_id.startsWith("mock-voter-")) {
        console.log("Mock voter detected, allowing vote submission in demo mode")
        return NextResponse.json({
          message: "Votes submitted successfully (demo mode - not saved to database)",
          success: true,
        })
      }

      return NextResponse.json(
        { message: "Voter not found" },
        { status: 404 }
      )
    }

    // Get event settings
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, voting_start_time, voting_end_time, allow_edit_before_deadline")
      .eq("id", event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      )
    }

    // Check if voting is active
    const now = new Date()
    const startTime = new Date(event.voting_start_time)
    const endTime = new Date(event.voting_end_time)

    if (now < startTime) {
      return NextResponse.json(
        { message: "Bình chọn chưa bắt đầu" },
        { status: 400 }
      )
    }

    if (now > endTime) {
      return NextResponse.json(
        { message: "Bình chọn đã kết thúc" },
        { status: 400 }
      )
    }

    // Check if voter already voted and if editing is allowed
    const { data: existingVotes } = await supabase
      .from("votes")
      .select("id")
      .eq("voter_id", voter_id)
      .limit(1)

    if (existingVotes && existingVotes.length > 0 && !event.allow_edit_before_deadline) {
      return NextResponse.json(
        { message: "Bạn đã bình chọn rồi và không thể sửa đổi" },
        { status: 400 }
      )
    }

    // Validate votes against category constraints
    for (const vote of votes) {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id, max_votes_per_voter")
        .eq("id", vote.category_id)
        .eq("event_id", event_id)
        .single()

      if (categoryError || !category) {
        return NextResponse.json(
          { message: `Category ${vote.category_id} not found` },
          { status: 400 }
        )
      }

      if (vote.candidate_ids.length > category.max_votes_per_voter) {
        return NextResponse.json(
          {
            message: `Bạn chỉ có thể chọn tối đa ${category.max_votes_per_voter} ứng viên cho danh mục này`,
          },
          { status: 400 }
        )
      }

      // Verify all candidates exist and belong to this category
      for (const candidateId of vote.candidate_ids) {
        const { data: candidate, error: candidateError } = await supabase
          .from("candidates")
          .select("id")
          .eq("id", candidateId)
          .eq("category_id", vote.category_id)
          .single()

        if (candidateError || !candidate) {
          return NextResponse.json(
            { message: `Candidate ${candidateId} not found in this category` },
            { status: 400 }
          )
        }
      }
    }

    // Delete existing votes if editing is allowed
    if (event.allow_edit_before_deadline) {
      await supabase.from("votes").delete().eq("voter_id", voter_id)
    }

    // Insert new votes
    const votesToInsert = votes.flatMap((vote) =>
      vote.candidate_ids.map((candidateId) => ({
        voter_id,
        event_id,
        category_id: vote.category_id,
        candidate_id: candidateId,
      }))
    )

    const { error: insertError } = await supabase
      .from("votes")
      .insert(votesToInsert)

    if (insertError) {
      console.error("Error inserting votes:", insertError)
      return NextResponse.json(
        { message: "Failed to submit votes" },
        { status: 500 }
      )
    }

    // Update voter's voted_at timestamp
    await supabase
      .from("voters")
      .update({ voted_at: new Date().toISOString() })
      .eq("id", voter_id)

    return NextResponse.json({
      message: "Votes submitted successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error in submit votes route:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
