"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DEMO_EVENT_ID } from "@/lib/constants"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

/**
 * Redirect page for backward compatibility
 * Redirects /results to /event/[eventId]/results
 */
export default function ResultsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the demo event results page
    router.replace(`/event/${DEMO_EVENT_ID}/results`)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#1E1B13] to-[#0B0B0B] flex items-center justify-center">
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
