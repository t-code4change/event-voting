import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_id, email, phone, otp } = body

    if (!event_id || !otp) {
      return NextResponse.json(
        { message: "Event ID and OTP are required" },
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

    // Find valid OTP
    let otpQuery = supabase
      .from("otp_codes")
      .select("*")
      .eq("event_id", event_id)
      .eq("code", otp)
      .eq("is_used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)

    if (email) {
      otpQuery = otpQuery.eq("email", email)
    }
    if (phone) {
      otpQuery = otpQuery.eq("phone", phone)
    }

    const { data: otpRecord, error: otpError } = await otpQuery.single()

    if (otpError || !otpRecord) {
      return NextResponse.json(
        { message: "Mã OTP không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      )
    }

    // Mark OTP as used
    await supabase
      .from("otp_codes")
      .update({ is_used: true })
      .eq("id", otpRecord.id)

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
      // Create new voter
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
      message: "Verification successful",
      voter_id: voterId,
    })
  } catch (error) {
    console.error("Error in verify-otp route:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
