import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

interface Notification {
  id: string
  type: "checkin" | "vote" | "minigame" | "system"
  guestName?: string
  message: string
  timestamp: string
  link: string
  isRead: boolean
}

// TODO: Replace with real database queries when notifications table is created
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "checkin",
    guestName: "Nguyễn Văn A",
    message: "đã check-in thành công",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(), // 2 mins ago
    link: "/admin/guests",
    isRead: false,
  },
  {
    id: "2",
    type: "vote",
    guestName: "Trần Thị B",
    message: "đã bình chọn cho 3 hạng mục",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
    link: "/admin/results",
    isRead: false,
  },
  {
    id: "3",
    type: "checkin",
    guestName: "Phạm Minh C",
    message: "đã check-in thành công",
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(), // 8 mins ago
    link: "/admin/guests",
    isRead: false,
  },
  {
    id: "4",
    type: "minigame",
    message: "Lucky Draw có 5 người tham gia mới",
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(), // 12 mins ago
    link: "/admin/mini-game",
    isRead: true,
  },
  {
    id: "5",
    type: "vote",
    guestName: "Hoàng Thị D",
    message: "đã bình chọn cho 2 hạng mục",
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(), // 18 mins ago
    link: "/admin/results",
    isRead: true,
  },
  {
    id: "6",
    type: "system",
    message: "Sự kiện GLOW UP 2025 đã bắt đầu",
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
    link: "/admin/events",
    isRead: true,
  },
  {
    id: "7",
    type: "checkin",
    guestName: "Vũ Văn E",
    message: "đã check-in thành công",
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(), // 35 mins ago
    link: "/admin/guests",
    isRead: true,
  },
  {
    id: "8",
    type: "vote",
    guestName: "Đỗ Thị F",
    message: "đã bình chọn cho 4 hạng mục",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
    link: "/admin/results",
    isRead: true,
  },
  {
    id: "9",
    type: "minigame",
    message: "Spin The Wheel có 10 người tham gia mới",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    link: "/admin/mini-game",
    isRead: true,
  },
  {
    id: "10",
    type: "checkin",
    guestName: "Lý Văn G",
    message: "đã check-in thành công",
    timestamp: new Date(Date.now() - 75 * 60000).toISOString(), // 1h 15m ago
    link: "/admin/guests",
    isRead: true,
  },
  {
    id: "11",
    type: "system",
    message: "Đã cập nhật cấu hình Welcome LED",
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(), // 1h 30m ago
    link: "/admin/welcome-led",
    isRead: true,
  },
  {
    id: "12",
    type: "vote",
    guestName: "Mai Thị H",
    message: "đã bình chọn cho 3 hạng mục",
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    link: "/admin/results",
    isRead: true,
  },
  {
    id: "13",
    type: "checkin",
    guestName: "Cao Văn I",
    message: "đã check-in thành công",
    timestamp: new Date(Date.now() - 2.5 * 60 * 60000).toISOString(), // 2.5 hours ago
    link: "/admin/guests",
    isRead: true,
  },
  {
    id: "14",
    type: "minigame",
    message: "Quiz Game có 8 người tham gia mới",
    timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(), // 3 hours ago
    link: "/admin/mini-game",
    isRead: true,
  },
  {
    id: "15",
    type: "vote",
    guestName: "Bùi Thị K",
    message: "đã bình chọn cho 5 hạng mục",
    timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString(), // 4 hours ago
    link: "/admin/results",
    isRead: true,
  },
  {
    id: "16",
    type: "system",
    message: "Đã kích hoạt Result LED Display",
    timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(), // 5 hours ago
    link: "/admin/result-led",
    isRead: true,
  },
  {
    id: "17",
    type: "checkin",
    guestName: "Đinh Văn L",
    message: "đã check-in thành công",
    timestamp: new Date(Date.now() - 6 * 60 * 60000).toISOString(), // 6 hours ago
    link: "/admin/guests",
    isRead: true,
  },
  {
    id: "18",
    type: "vote",
    guestName: "Phan Thị M",
    message: "đã bình chọn cho 2 hạng mục",
    timestamp: new Date(Date.now() - 7 * 60 * 60000).toISOString(), // 7 hours ago
    link: "/admin/results",
    isRead: true,
  },
  {
    id: "19",
    type: "minigame",
    message: "Lucky Draw đã kết thúc với 25 người tham gia",
    timestamp: new Date(Date.now() - 8 * 60 * 60000).toISOString(), // 8 hours ago
    link: "/admin/mini-game",
    isRead: true,
  },
  {
    id: "20",
    type: "system",
    message: "Đã xuất báo cáo Analytics cho sự kiện",
    timestamp: new Date(Date.now() - 10 * 60 * 60000).toISOString(), // 10 hours ago
    link: "/admin/analytics",
    isRead: true,
  },
  {
    id: "21",
    type: "checkin",
    guestName: "Trương Văn N",
    message: "đã check-in thành công",
    timestamp: new Date(Date.now() - 12 * 60 * 60000).toISOString(), // 12 hours ago
    link: "/admin/guests",
    isRead: true,
  },
  {
    id: "22",
    type: "vote",
    guestName: "Lâm Thị O",
    message: "đã bình chọn cho 4 hạng mục",
    timestamp: new Date(Date.now() - 15 * 60 * 60000).toISOString(), // 15 hours ago
    link: "/admin/results",
    isRead: true,
  },
  {
    id: "23",
    type: "system",
    message: "Đã tạo mới 3 hạng mục bình chọn",
    timestamp: new Date(Date.now() - 18 * 60 * 60000).toISOString(), // 18 hours ago
    link: "/admin/voting",
    isRead: true,
  },
  {
    id: "24",
    type: "minigame",
    message: "Photo Booth có 15 người tham gia mới",
    timestamp: new Date(Date.now() - 20 * 60 * 60000).toISOString(), // 20 hours ago
    link: "/admin/mini-game",
    isRead: true,
  },
  {
    id: "25",
    type: "checkin",
    guestName: "Hồ Văn P",
    message: "đã check-in thành công",
    timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
    link: "/admin/guests",
    isRead: true,
  },
]

// GET /api/admin/notifications?limit=10&offset=0
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    // TODO: Replace with real query when notifications table exists
    // const { data: notifications, error, count } = await supabase
    //   .from("notifications")
    //   .select("*", { count: "exact" })
    //   .order("timestamp", { ascending: false })
    //   .range(offset, offset + limit - 1)
    //
    // if (error) throw error

    // For now, return paginated mock data
    const paginatedNotifications = mockNotifications.slice(offset, offset + limit)
    const total = mockNotifications.length
    const hasMore = offset + limit < total

    return NextResponse.json({
      notifications: paginatedNotifications,
      total,
      hasMore,
      offset,
      limit,
    })
  } catch (error) {
    console.error("Error in GET /api/admin/notifications:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
