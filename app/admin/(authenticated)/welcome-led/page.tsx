"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MonitorPlay,
  Sparkles,
  Eye,
  ExternalLink,
  Palette,
  Zap,
  Play,
} from "lucide-react"

const templates = [
  { id: 1, name: "Classic Gold", gradient: "from-[#FFD700] via-[#FFC107] to-[#FFD700]", preview: "Chào mừng" },
  { id: 2, name: "Neon Purple", gradient: "from-purple-500 via-pink-500 to-purple-500", preview: "Welcome" },
  { id: 3, name: "Ocean Blue", gradient: "from-blue-500 via-cyan-500 to-blue-500", preview: "Xin chào" },
  { id: 4, name: "Sunset", gradient: "from-orange-500 via-red-500 to-pink-500", preview: "Hello" },
]

const nameEffects = [
  { id: "fade", name: "Fade", icon: Sparkles },
  { id: "glow", name: "Glow Pulse", icon: Zap },
  { id: "wave", name: "Wave", icon: Sparkles },
  { id: "slide", name: "Slide In", icon: Play },
]

export default function WelcomeLEDModule() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [selectedEffect, setSelectedEffect] = useState(nameEffects[0])
  const [guestName, setGuestName] = useState("Nguyễn Văn A")
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MonitorPlay className="w-8 h-8 text-[#FFD700]" />
            Welcome LED Display
          </h1>
          <p className="text-white/60 mt-2">Màn hình chào mừng khách mời</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            <Eye className="w-4 h-4" />
            {isPreviewMode ? "Exit Preview" : "Preview"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107]"
          >
            <ExternalLink className="w-4 h-4" />
            Open Welcome LED Now
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left: Settings */}
        <div className="col-span-1 space-y-6">
          {/* Template Selection */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-[#FFD700]" />
              Chọn Template
            </h2>

            <div className="space-y-3">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedTemplate.id === template.id
                      ? 'border-[#FFD700] bg-[#FFD700]/10'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`h-12 rounded-lg bg-gradient-to-r ${template.gradient} mb-2 flex items-center justify-center text-white font-bold text-lg`}>
                    {template.preview}
                  </div>
                  <p className="text-sm text-white font-semibold">{template.name}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Effect Selection */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#FFD700]" />
              Hiệu ứng tên
            </h2>

            <div className="space-y-2">
              {nameEffects.map((effect) => {
                const Icon = effect.icon
                return (
                  <motion.button
                    key={effect.id}
                    onClick={() => setSelectedEffect(effect)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedEffect.id === effect.id
                        ? 'border-[#FFD700] bg-[#FFD700]/10 text-white'
                        : 'border-white/20 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{effect.name}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Test Guest Name */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Test Guest Name</h2>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50"
              placeholder="Nhập tên khách..."
            />
          </div>
        </div>

        {/* Right: Preview */}
        <div className="col-span-2">
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#FFD700]" />
                Preview Full-Screen
              </h2>
              <span className="text-xs text-white/60">{selectedTemplate.name} • {selectedEffect.name}</span>
            </div>

            {/* LED Preview Screen */}
            <div className="relative aspect-video rounded-xl bg-black overflow-hidden">
              {/* Stage Light Shimmer Background */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 50%, rgba(255,215,0,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(255,215,0,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(255,215,0,0.1) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              {/* Spotlight effects */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full opacity-30"
                animate={{
                  background: [
                    'linear-gradient(180deg, rgba(255,215,0,0.2) 0%, transparent 40%)',
                    'linear-gradient(180deg, rgba(255,215,0,0.3) 0%, transparent 50%)',
                    'linear-gradient(180deg, rgba(255,215,0,0.2) 0%, transparent 40%)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Welcome Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
                <motion.h2
                  className="text-4xl font-bold text-white/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  CHÀO MỪNG
                </motion.h2>

                {/* Guest Name with Effect */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedEffect.id}-${guestName}`}
                    className={`text-6xl font-bold bg-gradient-to-r ${selectedTemplate.gradient} bg-clip-text text-transparent`}
                    initial={
                      selectedEffect.id === "fade" ? { opacity: 0 } :
                      selectedEffect.id === "slide" ? { opacity: 0, x: -100 } :
                      selectedEffect.id === "wave" ? { opacity: 0, y: 20 } :
                      { opacity: 0, scale: 0.8 }
                    }
                    animate={
                      selectedEffect.id === "fade" ? { opacity: 1 } :
                      selectedEffect.id === "slide" ? { opacity: 1, x: 0 } :
                      selectedEffect.id === "wave" ? { opacity: 1, y: 0 } :
                      { opacity: 1, scale: 1 }
                    }
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={
                      selectedEffect.id === "glow"
                        ? {
                            filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8))',
                          }
                        : {}
                    }
                  >
                    {selectedEffect.id === "glow" && (
                      <motion.span
                        animate={{
                          filter: [
                            'drop-shadow(0 0 20px rgba(255,215,0,0.6))',
                            'drop-shadow(0 0 40px rgba(255,215,0,1))',
                            'drop-shadow(0 0 20px rgba(255,215,0,0.6))',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {guestName}
                      </motion.span>
                    )}
                    {selectedEffect.id !== "glow" && guestName}
                  </motion.div>
                </AnimatePresence>

                <motion.p
                  className="text-2xl text-white/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  Tới sự kiện GLOW UP 2025
                </motion.p>
              </div>

              {/* Particle Effects */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[#FFD700]/40 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.2, 0.6, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/60">
                💡 <strong>Tip:</strong> LED screen sẽ tự động hiển thị tên khách khi họ check-in thành công.
                Màn hình sẽ tự động chuyển sau 5 giây.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
