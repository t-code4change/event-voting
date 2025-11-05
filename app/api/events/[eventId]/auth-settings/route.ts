import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = createClient()

    const { data: event, error } = await supabase
      .from("events")
      .select("auth_settings")
      .eq("id", params.eventId)
      .single()

    if (error) {
      console.error("Error fetching event:", error)
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      auth_settings: event.auth_settings,
    })
  } catch (error) {
    console.error("Error in auth-settings route:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
