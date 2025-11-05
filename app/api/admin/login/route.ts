import { NextRequest, NextResponse } from "next/server"
import { setAdminSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      )
    }

    // Check against environment variable
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD not set in environment variables")
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      )
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { message: "Mật khẩu không đúng" },
        { status: 401 }
      )
    }

    // Set session cookie
    setAdminSession()

    return NextResponse.json({
      message: "Login successful",
      success: true,
    })
  } catch (error) {
    console.error("Error in admin login route:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
