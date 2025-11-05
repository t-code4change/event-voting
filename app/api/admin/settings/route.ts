import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET active event settings
export async function GET() {
  try {
    const supabase = createClient()

    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return NextResponse.json({ event: event || null })
  } catch (error) {
    console.error("Error fetching event settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// UPDATE event settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, voting_start_time, voting_end_time, is_active } = body

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    const updateData: any = {}
    if (voting_start_time !== undefined) updateData.voting_start_time = voting_start_time
    if (voting_end_time !== undefined) updateData.voting_end_time = voting_end_time
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", eventId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ event: data })
  } catch (error) {
    console.error("Error updating event settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
