"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import MyButton from "@/components/MyButton"
import { Crown, BarChart3, Settings, BadgeDollarSign, Vote, Gift, LogOut, Sparkles, Zap } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"
import { logout } from "@/store/slices/authSlice"

export default function Header() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, loading } = useAppSelector((state) => state.auth)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [logoGlow, setLogoGlow] = useState(false)
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

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  // Confetti effect when clicking logo
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Trigger confetti burst
    const duration = 1500
    const animationEnd = Date.now() + duration

    const fireConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { x: 0.15, y: 0.3 },
        colors: ['#FFD700', '#FDB931', '#FFFFFF', '#C0C0C0'],
        gravity: 0.6,
        scalar: 1.2,
        drift: 0,
        ticks: 200
      })
    }

    fireConfetti()

    // Additional burst after slight delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.15, y: 0.3 },
        colors: ['#FFD700', '#FDB931'],
        gravity: 0.5,
        scalar: 0.8
      })
    }, 150)

    // Trigger logo glow effect
    setLogoGlow(true)
    setTimeout(() => setLogoGlow(false), 1000)

    // Navigate to home after animation
    setTimeout(() => {
      router.push('/')
    }, 500)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-[#FFD700]/20 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0A0A]/95 backdrop-blur-lg shadow-lg shadow-[#FFD700]/5'
          : 'bg-[#0A0A0A]/80 backdrop-blur'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo with enhanced design and confetti effect */}
        <motion.div
          onClick={handleLogoClick}
          className="flex items-center space-x-2 cursor-pointer group relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Bright4Event – Tỏa sáng cho sự kiện của bạn ✨"
        >
          {/* Glow effect behind logo */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
            }}
            animate={logoGlow ? {
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ duration: 0.6 }}
          />

            <div className="flex items-center gap-4">
                <motion.div
                    animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Crown className="w-10 h-10 text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))' }} />
                </motion.div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFD700] bg-clip-text text-transparent"
                        style={{
                            fontFamily: 'Playfair Display, serif',
                            textShadow: '0 0 30px rgba(255,215,0,0.5)',
                            letterSpacing: '0.02em'
                        }}>
                        Bright4Event
                    </h1>
                    <p className="text-[#FFD700]/80 text-xs tracking-wider">All-in-One for Event</p>
                </div>
            </div>

        </motion.div>

        <nav className="flex items-center gap-2">
          {/* Main navigation links - show on all pages except event pages */}
          {!isEventPage && (
            <>
              <Link href="/about" className="hidden md:block">
                <MyButton
                  variant="ghost"
                  size="small"
                  className="text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 font-medium"
                >
                  Giới thiệu
                </MyButton>
              </Link>

              <Link href="/blog" className="hidden md:block">
                <MyButton
                  variant="ghost"
                  size="small"
                  className="text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 font-medium"
                >
                  Blog
                </MyButton>
              </Link>

              <Link href="/pricing" className="hidden md:block">
                <MyButton
                  variant="ghost"
                  size="small"
                  className="text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 font-medium"
                  icon={<BadgeDollarSign className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Bảng giá
                </MyButton>
              </Link>

              <Link href="/contact" className="hidden lg:block">
                <MyButton
                  variant="ghost"
                  size="small"
                  className="text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 font-medium"
                >
                  Liên hệ
                </MyButton>
              </Link>
            </>
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
              <Link href={`/event/${eventId}/results`}>
                <MyButton
                  variant="ghost"
                  size="small"
                  className="sm:hidden text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 px-2"
                >
                  <BarChart3 className="h-4 w-4" />
                </MyButton>
              </Link>

              {/* Lucky Draw button - desktop */}
              <a href="https://bright4event.com/app" target="_blank" rel="noopener noreferrer">
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
              <a href="https://bright4event.com/app" target="_blank" rel="noopener noreferrer">
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
