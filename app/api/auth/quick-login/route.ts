import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_id, email, phone } = body

    if (!event_id) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      )
    }

    if (!email && !phone) {
      return NextResponse.json(
        { message: "Email or phone is required" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Check if event exists and is active
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, name, voting_start_time, voting_end_time, auth_settings")
      .eq("id", event_id)
      .single()

    if (eventError || !event) {
      // Mock mode for demo - generate voter ID from email/phone
      console.log("Database not available, using mock login for demo")
      const mockVoterId = `mock-voter-${Buffer.from(email || phone || "guest").toString("base64").slice(0, 16)}`
      return NextResponse.json({
        message: "Login successful (demo mode)",
        voter_id: mockVoterId,
      })
    }

    // Verify that OTP is not required for this event
    const authSettings = event.auth_settings as { require_otp?: boolean }
    if (authSettings?.require_otp) {
      return NextResponse.json(
        { message: "OTP is required for this event" },
        { status: 400 }
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

    // Check if voter already exists
    let voterQuery = supabase
      .from("voters")
      .select("id")
      .eq("event_id", event_id)

    if (email) {
      voterQuery = voterQuery.eq("email", email)
    }
    if (phone) {
      voterQuery = voterQuery.eq("phone", phone)
    }

    const { data: existingVoter } = await voterQuery.single()

    let voterId: string

    if (existingVoter) {
      // Voter already exists
      voterId = existingVoter.id
    } else {
      // Create new voter (auto-verified for quick login)
      const { data: newVoter, error: voterError } = await supabase
        .from("voters")
        .insert({
          event_id,
          email,
          phone,
          is_verified: true,
        })
        .select("id")
        .single()

      if (voterError || !newVoter) {
        console.error("Error creating voter:", voterError)
        return NextResponse.json(
          { message: "Failed to create voter" },
          { status: 500 }
        )
      }

      voterId = newVoter.id
    }

    return NextResponse.json({
      message: "Login successful",
      voter_id: voterId,
    })
  } catch (error) {
    console.error("Error in quick-login route:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
