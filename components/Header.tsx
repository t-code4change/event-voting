"use client"

import { useEffect, useState } from "react"
import { usePathname as useNextPathname } from "next/navigation"
import { usePathname, useRouter, Link } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"
import MyButton from "@/components/MyButton"
import BrandLogo from "@/components/BrandLogo"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { BarChart3, Settings, BadgeDollarSign, Vote, Gift, LogOut } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"
import { logout } from "@/store/slices/authSlice"
import { LogoutConfirmPopup } from "@/components/admin"
import { logoutUser } from "@/lib/auth-utils"
import { ROUTES, EXTERNAL_ROUTES, isRouteActive } from "@/constants/routes"

export default function Header() {
  const t = useTranslations('Header.nav')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const nextPathname = useNextPathname()
  const pathname = usePathname()
  const { user, loading } = useAppSelector((state) => state.auth)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [logoGlow, setLogoGlow] = useState(false)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Check if current path is in event pages
  const isEventPage = nextPathname?.startsWith('/event/')

  // Extract eventId from pathname (e.g., /event/123 or /event/123/results)
  const eventId = isEventPage ? nextPathname.split('/')[2] : null

  // Helper function to check if a path is active using route constants
  const isActivePath = (path: string) => {
    return isRouteActive(pathname, path)
  }

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

  const handleLogoutClick = () => {
    setShowLogoutPopup(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)

    try {
      // Logout from Supabase and clear all auth data
      const { success, error } = await logoutUser()

      if (!success) {
        showErrorToast(error || "Đăng xuất thất bại")
        setIsLoggingOut(false)
        return
      }

      // Dispatch Redux logout action to clear state
      dispatch(logout())

      // Show success message
      showSuccessToast("Đã đăng xuất thành công")

      // Close popup
      setShowLogoutPopup(false)

      // Redirect to home page
      router.push(ROUTES.HOME)
    } catch (error: any) {
      console.error("Logout error:", error)
      showErrorToast("Có lỗi xảy ra khi đăng xuất")
    } finally {
      setIsLoggingOut(false)
    }
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
      router.push(ROUTES.HOME)
    }, 500)
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#FFD700]/20 transition-all duration-300"
      style={{
        background: 'rgba(13, 13, 26, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.25)' : 'none'
      }}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo with enhanced design and confetti effect */}
        <div className="relative group">
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

          <BrandLogo
            size="large"
            animated={true}
            onClick={handleLogoClick}
            className="relative z-10"
          />
        </div>

        <nav className="flex items-center gap-2">
          {/* Main navigation links - show on all pages except event pages */}
          {!isEventPage && (
            <>
              <Link href={ROUTES.ABOUT} className="hidden md:block">
                <MyButton
                  variant="ghost"
                  size="small"
                  className={`font-medium transition-all ${
                    isActivePath(ROUTES.ABOUT)
                      ? 'text-[#FFD700] bg-[#FFD700]/20 border border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/20'
                      : 'text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10'
                  }`}
                >
                  {t('about')}
                </MyButton>
              </Link>

              <Link href={ROUTES.BLOG} className="hidden md:block">
                <MyButton
                  variant="ghost"
                  size="small"
                  className={`font-medium transition-all ${
                    isActivePath(ROUTES.BLOG)
                      ? 'text-[#FFD700] bg-[#FFD700]/20 border border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/20'
                      : 'text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10'
                  }`}
                >
                  {t('blog')}
                </MyButton>
              </Link>

              <Link href={ROUTES.PRICING} className="hidden md:block">
                <MyButton
                  variant="ghost"
                  className={`font-medium transition-all ${
                    isActivePath(ROUTES.PRICING)
                      ? 'text-[#FFD700] bg-[#FFD700]/20 border border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/20'
                      : 'text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10'
                  }`}
                  icon={<BadgeDollarSign className="h-4 w-4" />}
                  iconPosition="left"
                >
                  {t('pricing')}
                </MyButton>
              </Link>

              <Link href={ROUTES.CONTACT} className="hidden lg:block">
                <MyButton
                  variant="ghost"
                  size="small"
                  className={`font-medium transition-all ${
                    isActivePath(ROUTES.CONTACT)
                      ? 'text-[#FFD700] bg-[#FFD700]/20 border border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/20'
                      : 'text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10'
                  }`}
                >
                  {t('contact')}
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
                  className={`hidden sm:flex transition-all ${
                    pathname === `/event/${eventId}` || pathname === `/event/${eventId}/vote`
                      ? 'text-[#FFD700] bg-[#FFD700]/20 border border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/20'
                      : 'text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10'
                  }`}
                  icon={<Vote className="h-4 w-4" />}
                  iconPosition="left"
                >
                  {t('vote')}
                </MyButton>
              </Link>

              {/* Vote button - mobile */}
              <Link href={`/event/${eventId}`}>
                <MyButton
                  variant="ghost"
                  size="small"
                  className={`sm:hidden px-2 transition-all ${
                    pathname === `/event/${eventId}` || pathname === `/event/${eventId}/vote`
                      ? 'text-[#FFD700] bg-[#FFD700]/20 border border-[#FFD700]/30'
                      : 'text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10'
                  }`}
                >
                  <Vote className="h-4 w-4" />
                </MyButton>
              </Link>

              {/* Results button - desktop */}
              <Link href={`/event/${eventId}/results`}>
                <MyButton
                  variant="ghost"
                  size="medium"
                  className={`hidden sm:flex transition-all ${
                    pathname === `/event/${eventId}/results`
                      ? 'text-[#FFD700] bg-[#FFD700]/20 border border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/20'
                      : 'text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10'
                  }`}
                  icon={<BarChart3 className="h-4 w-4" />}
                  iconPosition="left"
                >
                  {t('results')}
                </MyButton>
              </Link>

              {/* Results button - mobile */}
              <Link href={`/event/${eventId}/results`}>
                <MyButton
                  variant="ghost"
                  size="small"
                  className={`sm:hidden px-2 transition-all ${
                    pathname === `/event/${eventId}/results`
                      ? 'text-[#FFD700] bg-[#FFD700]/20 border border-[#FFD700]/30'
                      : 'text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </MyButton>
              </Link>

              {/* Lucky Draw button - desktop */}
              <a href={EXTERNAL_ROUTES.LUCKY_DRAW} target="_blank" rel="noopener noreferrer">
                <MyButton
                  variant="ghost"
                  size="medium"
                  className="hidden sm:flex text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10"
                  icon={<Gift className="h-4 w-4" />}
                  iconPosition="left"
                >
                  {t('luckyDraw')}
                </MyButton>
              </a>

              {/* Lucky Draw button - mobile */}
              <a href={EXTERNAL_ROUTES.LUCKY_DRAW} target="_blank" rel="noopener noreferrer">
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

          {/* Language Switcher */}
          {!isEventPage && <LanguageSwitcher />}

          {/* Admin Settings - show when logged in (go to dashboard) or not logged in (open login modal) */}
          {(user || isAdmin) ? (
            <>
              <Link href={ROUTES.ADMIN.DASHBOARD} className="inline-block">
                <button
                  className="inline-flex items-center justify-center h-9 px-2 text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 rounded-lg transition-all duration-200"
                  title="Dashboard"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </Link>
              <button
                onClick={handleLogoutClick}
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
                  redirectPath: ROUTES.ADMIN.DASHBOARD
                }))
              }}
              className="text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 px-2"
            >
              <Settings className="h-4 w-4" />
            </MyButton>
          )}
        </nav>
      </div>

      {/* Logout Confirmation Popup */}
      <LogoutConfirmPopup
        isOpen={showLogoutPopup}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutPopup(false)}
        isLoading={isLoggingOut}
      />
    </header>
  )
}
