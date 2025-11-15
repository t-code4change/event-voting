"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MyButton from "@/components/MyButton"
import { Sparkles, TrendingUp, Trophy } from "lucide-react"
import { FINAL_CTA } from "@/app/constants/home.constants"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"

interface FinalCTAProps {
  onShowConfetti: () => void
}

export default function FinalCTA({ onShowConfetti }: FinalCTAProps) {
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
    <section className="relative py-32 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9C27FF] via-[#0D0D1A] to-[#FFD700]" />

      {/* Moving light particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <Sparkles className="w-20 h-20 mx-auto text-[#FFD700] mb-8" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {FINAL_CTA.headline}
          </h2>

          <p className="text-xl md:text-2xl text-gray-300">
            {FINAL_CTA.subtext} <strong className="text-[#FFD700]">{FINAL_CTA.brand}</strong> {FINAL_CTA.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <MyButton
                onClick={handleCreateEvent}
                variant="primary"
                size="large"
                className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold shadow-2xl hover:shadow-[0_0_50px_rgba(255,215,0,0.8)] transition-all duration-300 animate-pulse"
                icon={<TrendingUp className="h-6 w-6" />}
                iconPosition="left"
              >
                <span className="flex items-center gap-2">
                  {FINAL_CTA.buttons.primary.text}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                </span>
              </MyButton>
            </motion.div>

            <Link href="/guide">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <MyButton
                  variant="outline"
                  size="large"
                  className="text-lg px-10 py-7 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#9C27FF] font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300"
                  icon={<Trophy className="h-6 w-6" />}
                  iconPosition="left"
                >
                  {FINAL_CTA.buttons.secondary.text}
                </MyButton>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
