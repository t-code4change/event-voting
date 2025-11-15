import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// GET - Get account settings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get settings from user metadata
    const settings = user.user_metadata?.settings || {
      language: "vi",
      timezone: "Asia/Ho_Chi_Minh",
      timeFormat: "24h",
      autosave: true,
      pushNotifications: true,
      emailNotifications: true,
      eventAlerts: true,
      theme: "dark",
      primaryColor: "#FFD700",
      twoFactorAuth: false,
    }

    return NextResponse.json({ settings })
  } catch (error: any) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Update account settings
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { settings } = body

    // Update user metadata with new settings
    const { data, error: updateError } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        settings: settings,
      },
    })

    if (updateError) {
      console.error("Error updating settings:", updateError)
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      settings: data.user?.user_metadata?.settings,
    })
  } catch (error: any) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
