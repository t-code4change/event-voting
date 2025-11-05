import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

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
      .select("id, name, voting_start_time, voting_end_time")
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

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Store OTP in database
    const { error: otpError } = await supabase
      .from("otp_codes")
      .insert({
        event_id,
        email,
        phone,
        code: otp,
        expires_at: expiresAt.toISOString(),
      })

    if (otpError) {
      console.error("Error storing OTP:", otpError)
      return NextResponse.json(
        { message: "Failed to generate OTP" },
        { status: 500 }
      )
    }

    // TODO: Send OTP via email/SMS
    // For now, we'll just log it (in production, integrate with email/SMS service)
    console.log(`OTP for ${email || phone}: ${otp}`)

    // In development, return the OTP in the response
    // IMPORTANT: Remove this in production!
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        message: "OTP sent successfully",
        otp, // Only for development/testing
      })
    }

    return NextResponse.json({
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("Error in send-otp route:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
