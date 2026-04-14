"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Gamepad2, Zap, Gift, Target, Bell } from "lucide-react"

import QuizGame from "@/components/minigame/QuizGame"
import LuckyBoxGame from "@/components/minigame/LuckyBoxGame"
import FastFingerGame from "@/components/minigame/FastFingerGame"
import RungChuongGame from "@/components/minigame/RungChuongGame"

// ─── Game registry ────────────────────────────────────────────────────────────
const GAMES = [
  { id: "quiz", label: "Quiz Game", desc: "Trắc nghiệm kiến thức", icon: Zap, color: "#5B7BFF", component: QuizGame },
  { id: "lucky-box", label: "Lucky Box", desc: "Hộp quà may mắn", icon: Gift, color: "#FF6B35", component: LuckyBoxGame },
  { id: "fast-finger", label: "Fast Finger", desc: "Nhanh tay chạm", icon: Target, color: "#10B981", component: FastFingerGame },
  { id: "rung-chuong", label: "Rung Chuông", desc: "Trả lời nhanh", icon: Bell, color: "#F59E0B", component: RungChuongGame },
] as const

type GameId = (typeof GAMES)[number]["id"]

// ─── Particle background ──────────────────────────────────────────────────────
function ParticleBackground() {
  const [dimensions, setDimensions] = useState({ w: 1200, h: 800 })
  useEffect(() => { setDimensions({ w: window.innerWidth, h: window.innerHeight }) }, [])
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 25 }, (_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`, background: i % 4 === 0 ? '#5B7BFF' : i % 4 === 1 ? '#B794F4' : i % 4 === 2 ? '#FFD700' : '#63B3ED' }}
          initial={{ x: Math.random() * dimensions.w, y: Math.random() * dimensions.h, opacity: 0 }}
          animate={{ x: Math.random() * dimensions.w, y: Math.random() * dimensions.h, opacity: [0, 0.6, 0] }}
          transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }} />
      ))}
    </div>
  )
}

// ─── Game selector dropdown ───────────────────────────────────────────────────
function GameSelector({ activeId, onChange }: { activeId: GameId; onChange: (id: GameId) => void }) {
  const [open, setOpen] = useState(false)
  const active = GAMES.find(g => g.id === activeId)!
  const ActiveIcon = active.icon

  return (
    <div className="fixed top-5 right-5 z-50">
      {/* Trigger */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-sm font-bold"
        style={{ background: "rgba(10,10,30,0.75)", border: `1.5px solid ${active.color}60`, backdropFilter: "blur(16px)", boxShadow: `0 0 18px ${active.color}30` }}>
        <ActiveIcon className="w-4 h-4" style={{ color: active.color }} />
        <span>{active.label}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden"
            style={{ background: "rgba(8,10,28,0.92)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
            {GAMES.map((game) => {
              const Icon = game.icon
              const isActive = game.id === activeId
              return (
                <motion.button
                  key={game.id}
                  onClick={() => { onChange(game.id); setOpen(false) }}
                  whileHover={{ x: 4 }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
                  style={{ background: isActive ? `${game.color}18` : "transparent", borderLeft: isActive ? `3px solid ${game.color}` : "3px solid transparent" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${game.color}22`, border: `1px solid ${game.color}40` }}>
                    <Icon className="w-4 h-4" style={{ color: game.color }} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{game.label}</p>
                    <p className="text-white/40 text-[11px]">{game.desc}</p>
                  </div>
                  {isActive && (
                    <motion.div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: game.color }} layoutId="dot" />
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close overlay */}
      {open && <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MiniGamePage() {
  const [activeGameId, setActiveGameId] = useState<GameId>("quiz")

  const handleChangeGame = (id: GameId) => {
    setActiveGameId(id)
  }

  const ActiveGame = GAMES.find(g => g.id === activeGameId)!.component

  return (
    <div className="min-h-screen bg-[#070B1A] relative overflow-hidden">
      <ParticleBackground />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div className="absolute top-[-10%] left-1/4 w-[700px] h-[700px] bg-[#5B7BFF]/15 rounded-full blur-[140px]"
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-purple-600/12 rounded-full blur-[120px]"
          animate={{ x: [0, -60, 0], y: [0, -50, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
        <motion.div className="absolute top-1/2 left-[-5%] w-[400px] h-[400px] bg-[#FFD700]/8 rounded-full blur-[100px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 6 }} />
      </div>

      {/* Company Logo — fixed top-left */}
      <div className="fixed top-5 left-5 z-50">
        <div className="flex items-center justify-center w-20 h-12 rounded-xl"
          style={{ border: "2px solid rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)" }}>
          <span className="text-white text-xs font-bold tracking-widest uppercase">LOGO</span>
        </div>
      </div>

      {/* Game selector — fixed top-right */}
      <GameSelector activeId={activeGameId} onChange={handleChangeGame} />

      {/* Game area */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGameId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex items-center justify-center">
            <ActiveGame />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
