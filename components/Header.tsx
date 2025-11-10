"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import MyButton from "@/components/MyButton"
import { Crown, BarChart3, Settings, BadgeDollarSign, Vote, Gift, LogOut } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"
import { logout } from "@/store/slices/authSlice"

export default function Header() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()

  // Check if current path is in event pages
  const isEventPage = pathname?.startsWith('/event/')

  // Extract eventId from pathname (e.g., /event/123 or /event/123/results)
  const eventId = isEventPage ? pathname.split('/')[2] : null

  useEffect(() => {
    // Check if admin is logged in by checking for admin token in cookies
    const checkAdminAuth = () => {
      const cookies = document.cookie.split(";")
      const adminToken = cookies.find((cookie) => cookie.trim().startsWith("admin_token="))
      const hasAdminToken = !!adminToken && adminToken.split("=")[1]?.trim() !== ""

      setIsAdmin(hasAdminToken)
    }

    // Only check auth after initial loading is complete
    if (!loading) {
      checkAdminAuth()
    }

    // Listen for changes in cookies/storage
    const intervalId = setInterval(checkAdminAuth, 2000) // Check every 2 seconds

    return () => clearInterval(intervalId)
  }, [user, loading])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#FFD700]/20 bg-[#0B0B0B]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0B0B]/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <Crown className="h-6 w-6 text-[#FFD700] group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FDB931] bg-clip-text text-transparent">
            GalaVote
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {/* Pricing - show on all pages except event pages */}
          {!isEventPage && (
            <Link href={`/pricing`}>
              <MyButton
                variant="ghost"
                size="medium"
                className="hidden sm:flex text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10"
                icon={<BadgeDollarSign className="h-4 w-4" />}
                iconPosition="left"
              >
                Bảng giá
              </MyButton>
            </Link>
          )}

          {/* Event page menus - only show when in /event/[eventId] path */}
          {isEventPage && eventId && (
            <>
              {/* Vote button - desktop */}
              <Link href={`/event/${eventId}`}>
                <MyButton
                  variant="ghost"
                  size="medium"
                  className="hidden sm:flex text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10"
                  icon={<Vote className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Bình chọn
                </MyButton>
              </Link>

              {/* Vote button - mobile */}
              <Link href={`/event/${eventId}`}>
                <MyButton
                  variant="ghost"
                  size="small"
                  className="sm:hidden text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 px-2"
                >
                  <Vote className="h-4 w-4" />
                </MyButton>
              </Link>

              {/* Results button - desktop */}
              <Link href={`/event/${eventId}/results`}>
                <MyButton
                  variant="ghost"
                  size="medium"
                  className="hidden sm:flex text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10"
                  icon={<BarChart3 className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Kết quả
                </MyButton>
              </Link>

              {/* Results button - mobile */}
              <Link href={`/admin/dashboard`}>
                <MyButton
                  variant="ghost"
                  size="small"
                  className="sm:hidden text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 px-2"
                >
                  <BarChart3 className="h-4 w-4" />
                </MyButton>
              </Link>

              {/* Lucky Draw button - desktop */}
              <a href="https://quaysotrungthuong.vn/app" target="_blank" rel="noopener noreferrer">
                <MyButton
                  variant="ghost"
                  size="medium"
                  className="hidden sm:flex text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10"
                  icon={<Gift className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Quay số
                </MyButton>
              </a>

              {/* Lucky Draw button - mobile */}
              <a href="https://quaysotrungthuong.vn/app" target="_blank" rel="noopener noreferrer">
                <MyButton
                  variant="ghost"
                  size="small"
                  className="sm:hidden text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 px-2"
                >
                  <Gift className="h-4 w-4" />
                </MyButton>
              </a>
            </>
          )}

          {/* Admin Settings - show when logged in (go to dashboard) or not logged in (open login modal) */}
          {(user || isAdmin) ? (
            <>
              <Link href="/admin/dashboard" className="inline-block">
                <button
                  className="inline-flex items-center justify-center h-9 px-2 text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 rounded-lg transition-all duration-200"
                  title="Dashboard"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center h-9 px-2 text-[#FAF3E0] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <MyButton
              variant="ghost"
              size="small"
              onClick={() => {
                dispatch(openLoginModal({
                  postLoginAction: 'dashboard',
                  redirectPath: '/admin/dashboard'
                }))
              }}
              className="text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 px-2"
            >
              <Settings className="h-4 w-4" />
            </MyButton>
          )}
        </nav>
      </div>
    </header>
  )
}
