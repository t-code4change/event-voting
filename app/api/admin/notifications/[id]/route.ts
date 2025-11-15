import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// DELETE /api/admin/notifications/:id
export async function DELETE(
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

    // TODO: Replace with real delete when notifications table exists
    // const { error } = await supabase
    //   .from("notifications")
    //   .delete()
    //   .eq("id", notificationId)
    //
    // if (error) throw error

    // For now, just return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(
      `Error in DELETE /api/admin/notifications/${params.id}:`,
      error
    )
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
