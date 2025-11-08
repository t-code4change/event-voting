"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import MyButton from "@/components/MyButton"
import {Crown, BarChart3, Settings, BadgeDollarSign} from "lucide-react"
import { DEMO_EVENT_ID } from "@/lib/constants"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

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
          {/* Results button - only show when user is logged in (voter or admin) */}
          {(user || isAdmin) && (
            <>
              {/* Results button - desktop */}
              <Link href={`/event/${DEMO_EVENT_ID}/results`}>
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
              <Link href={`/event/${DEMO_EVENT_ID}/results`}>
                <MyButton
                  variant="ghost"
                  size="small"
                  className="sm:hidden text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 px-2"
                >
                  <BarChart3 className="h-4 w-4" />
                </MyButton>
              </Link>
            </>
          )}

          {/* Admin Settings - only show when admin is logged in */}
          {isAdmin && (
            <Link href="/admin/dashboard">
              <MyButton
                variant="ghost"
                size="small"
                className="text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 px-2"
              >
                <Settings className="h-4 w-4" />
              </MyButton>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
