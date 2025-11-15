import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// POST /api/admin/notifications/:id/read
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notificationId = params.id

    // TODO: Replace with real update when notifications table exists
    // const { error } = await supabase
    //   .from("notifications")
    //   .update({ is_read: true })
    //   .eq("id", notificationId)
    //
    // if (error) throw error

    // For now, just return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(
      `Error in POST /api/admin/notifications/${params.id}/read:`,
      error
    )
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
