"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DEMO_EVENT_ID } from "@/lib/constants"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

/**
 * Redirect page for backward compatibility
 * Redirects /vote to /event/[eventId]/vote
 */
export default function VoteRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the demo Bright4Event page
    router.replace(`/event/${DEMO_EVENT_ID}/vote`)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-4"
      >
        <Loader2 className="h-12 w-12 animate-spin text-[#FFD700] mx-auto" />
        <p className="text-[#FAF3E0]">Đang chuyển hướng...</p>
      </motion.div>
    </div>
  )
}
