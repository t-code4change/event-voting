"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MyButton from "@/components/MyButton"
import { Sparkles, Play, Crown } from "lucide-react"
import { DEMO_EVENT_ID } from "@/lib/constants"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"
import { useTranslations } from "next-intl"

interface HomeHeroProps {
  onShowEventSearch?: () => void
  onShowConfetti: () => void
}

export default function HomeHero({ onShowEventSearch, onShowConfetti }: HomeHeroProps) {
  const t = useTranslations('Home')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const handleCreateEvent = () => {
    // Trigger confetti effect first
    onShowConfetti()

    // Check if user is authenticated (from Redux) or has admin token in cookies
    const cookies = document.cookie.split(";")
    const adminToken = cookies.find((cookie) => cookie.trim().startsWith("admin_token="))
    const hasAdminToken = !!adminToken && adminToken.split("=")[1]?.trim() !== ""

    if (isAuthenticated || user || hasAdminToken) {
      // User is logged in, redirect to dashboard
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 500)
    } else {
      // User not logged in, open login modal with redirect to dashboard after login
      setTimeout(() => {
        dispatch(openLoginModal({
          postLoginAction: 'dashboard',
          redirectPath: '/admin/dashboard'
        }))
      }, 300)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0D0D1A]" />
      </div>

      {/* Animated Spotlight Sweep */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating Gold Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#FFD700' : '#9C27FF',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative container px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* Logo/Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <Crown className="w-20 h-20 mx-auto text-[#FFD700]" />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 20px 10px rgba(255, 215, 0, 0.3)',
                    '0 0 40px 20px rgba(255, 215, 0, 0.1)',
                    '0 0 20px 10px rgba(255, 215, 0, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="block text-white mb-3" style={{ textShadow: '0 0 30px rgba(255,215,0,0.3)' }}>
              {t('hero.headline.line1')}
            </span>
            <span className="block bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent leading-[1.2]" style={{ textShadow: '0 0 50px rgba(255,215,0,0.5)' }}>
              {t('hero.headline.line2')}
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {t('hero.subtext')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <MyButton
                variant="primary"
                size="large"
                onClick={handleCreateEvent}
                className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold shadow-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 relative overflow-hidden group animate-pulse"
                icon={<Sparkles className="h-6 w-6" />}
                iconPosition="left"
              >
                <span className="flex items-center gap-2">
                  {t('hero.cta.primary')}
                </span>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </MyButton>
            </motion.div>

            <Link href={`/event/${DEMO_EVENT_ID}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <MyButton
                  variant="outline"
                  size="large"
                  className="text-lg px-10 py-7 rounded-full border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all duration-300"
                  icon={<Play className="h-6 w-6" />}
                  iconPosition="left"
                >
                  {t('hero.cta.secondary')}
                </MyButton>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#FFD700] flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#FFD700]"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
