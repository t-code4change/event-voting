"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import MyButton from "@/components/MyButton"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight } from "lucide-react"
import { EVENT_SEARCH } from "@/app/constants/home.constants"

interface EventSearchModalProps {
  show: boolean
  onClose: () => void
}

export default function EventSearchModal({ show, onClose }: EventSearchModalProps) {
  const router = useRouter()
  const [eventCode, setEventCode] = useState("")
  const [searching, setSearching] = useState(false)

  const handleJoinEvent = async () => {
    if (!eventCode.trim()) {
      alert("Vui lòng nhập mã hoặc tên sự kiện")
      return
    }

    setSearching(true)
    setTimeout(() => {
      router.push(`/event/${eventCode}`)
      setSearching(false)
    }, 800)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <Card className="border-2 border-[#FFD700] bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center">
                      <Search className="h-8 w-8 text-black" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{EVENT_SEARCH.title}</h2>
                    <p className="text-gray-400">{EVENT_SEARCH.subtitle}</p>
                  </div>

                  {/* Search Input */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        type="text"
                        placeholder={EVENT_SEARCH.placeholder}
                        value={eventCode}
                        onChange={(e) => setEventCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleJoinEvent()}
                        className="pl-12 h-14 text-lg bg-[#0D0D1A] border-2 border-[#FFD700]/30 focus:border-[#FFD700] text-white rounded-xl"
                        disabled={searching}
                      />
                    </div>

                    <div className="flex gap-3">
                      <MyButton
                        variant="primary"
                        size="large"
                        onClick={handleJoinEvent}
                        disabled={searching || !eventCode.trim()}
                        loading={searching}
                        className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-semibold rounded-xl h-14"
                        icon={<ArrowRight className="h-5 w-5" />}
                        iconPosition="right"
                      >
                        {searching ? EVENT_SEARCH.searchingText : EVENT_SEARCH.buttonText}
                      </MyButton>

                      <MyButton
                        variant="outline"
                        size="large"
                        onClick={() => {
                          onClose()
                          setEventCode("")
                        }}
                        disabled={searching}
                        className="px-6 border-2 border-[#FFD700]/30 hover:bg-[#FFD700]/10 text-[#FFD700] rounded-xl h-14"
                      >
                        {EVENT_SEARCH.cancelText}
                      </MyButton>
                    </div>
                  </div>

                  {/* Demo Event Suggestion */}
                  <div className="pt-6 border-t border-[#FFD700]/20">
                    <p className="text-sm text-gray-500 text-center mb-3">{EVENT_SEARCH.demoSuggestion.text}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEventCode("d112584a-4c6e-47fa-a4da-df1e3488d374")}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FFD700]/20 to-[#FDB931]/20 border border-[#FFD700]/30 hover:border-[#FFD700] transition-colors text-sm text-[#FFD700] font-medium"
                      >
                        {EVENT_SEARCH.demoSuggestion.eventName}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
