import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()

    const { data: event, error } = await supabase
      .from("events")
      .select("id, name, description, voting_start_time, voting_end_time, auth_settings")
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching active event:", error)
      return NextResponse.json(
        { message: "No active event found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      event,
    })
  } catch (error) {
    console.error("Error in active event route:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
