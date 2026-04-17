"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Gamepad2,
  Play,
  Eye,
  ExternalLink,
  Brain,
  Zap,
  Vote as VoteIcon,
  Plus,
  Trophy,
  Medal,
  Award,
} from "lucide-react"
import { toast } from "sonner"
import { useActiveEvent } from "@/hooks/useActiveEvent"

const gameTypes = [
  { id: "quiz", name: "Quiz Game", icon: Brain, description: "Câu hỏi trắc nghiệm", color: "#3B82F6" },
  { id: "reaction", name: "Reaction Game", icon: Zap, description: "Game phản xạ nhanh", color: "#EF4444" },
  { id: "poll", name: "Poll Game", icon: VoteIcon, description: "Bình chọn theo nhóm", color: "#10B981" },
]

const leaderboard = [
  { rank: 1, name: "Nguyễn Văn A", score: 950, icon: Trophy },
  { rank: 2, name: "Trần Thị B", score: 880, icon: Medal },
  { rank: 3, name: "Lê Văn C", score: 820, icon: Award },
  { rank: 4, name: "Phạm Thị D", score: 780, icon: null },
  { rank: 5, name: "Hoàng Văn E", score: 750, icon: null },
]

export default function MiniGameModule() {
  const activeEvent = useActiveEvent()
  const [selectedGame, setSelectedGame] = useState(gameTypes[0])
  const [questions, setQuestions] = useState([
    { id: 1, text: "Câu hỏi 1: Bright4Event ra đời năm nào?", options: ["2023", "2024", "2025"], correct: 1 },
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-[#FFD700]" />
            Mini Game
          </h1>
          <p className="text-white/60 mt-2">Tạo mini game tương tác với khách</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            <Eye className="w-4 h-4" />
            Preview
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!activeEvent?.slug) { toast.error("Vui lòng chọn sự kiện trước"); return }
              window.open(`/event/${activeEvent.slug}/minigame`, '_blank')
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107]"
          >
            <ExternalLink className="w-4 h-4" />
            Open Mini Game
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left: Game Selection & Setup */}
        <div className="col-span-1 space-y-6">
          {/* Game Type Selection */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Chọn loại game</h2>

            <div className="space-y-3">
              {gameTypes.map((game) => {
                const Icon = game.icon
                return (
                  <motion.button
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedGame.id === game.id
                        ? 'border-[#FFD700] bg-[#FFD700]/10'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${game.color}20`, border: `2px solid ${game.color}40` }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: game.color }}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-white">{game.name}</p>
                        <p className="text-xs text-white/60">{game.description}</p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Question Setup (for Quiz) */}
          {selectedGame.id === "quiz" && (
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Câu hỏi</h2>
                <span className="text-sm text-white/60">{questions.length} câu</span>
              </div>

              <div className="space-y-3 mb-4">
                {questions.map((q, index) => (
                  <div key={q.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-white font-semibold mb-2">{q.text}</p>
                    <div className="flex gap-2">
                      {q.options.map((opt, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 text-xs rounded ${
                            i === q.correct
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-white/20 text-white/60 hover:border-[#FFD700]/50 hover:text-white transition-all"
              >
                <Plus className="w-5 h-5" />
                Thêm câu hỏi
              </motion.button>
            </div>
          )}
        </div>

        {/* Right: Preview & Leaderboard */}
        <div className="col-span-2 space-y-6">
          {/* Game Preview */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-[#FFD700]" />
              Preview - {selectedGame.name}
            </h2>

            {/* Preview Screen */}
            <div className="relative aspect-video rounded-xl bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 overflow-hidden">
              {/* Background Animation */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      backgroundColor: selectedGame.color,
                      opacity: 0.3,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Game Content */}
              <div className="absolute inset-0 flex items-center justify-center p-12">
                {selectedGame.id === "quiz" ? (
                  <div className="text-center w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-3xl font-bold text-white mb-8">
                        {questions[0].text}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {questions[0].options.map((opt, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-6 rounded-xl bg-white/10 border-2 border-white/20 hover:border-[#FFD700] text-white font-semibold text-lg transition-all"
                          >
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                ) : selectedGame.id === "reaction" ? (
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Zap className="w-32 h-32 text-red-500 mx-auto mb-6" />
                    </motion.div>
                    <p className="text-4xl font-bold text-white mb-4">BẤM NGAY!</p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-12 py-6 rounded-xl bg-red-500 text-white font-bold text-2xl"
                    >
                      TAP!
                    </motion.button>
                  </div>
                ) : (
                  <div className="text-center w-full">
                    <p className="text-3xl font-bold text-white mb-8">
                      Bạn thích màu nào nhất?
                    </p>
                    <div className="space-y-4">
                      {['Đỏ', 'Xanh', 'Vàng', 'Tím'].map((color, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02, x: 10 }}
                          className="w-full p-4 rounded-xl bg-white/10 border-2 border-white/20 hover:border-[#FFD700] text-white font-semibold text-xl text-left px-6 transition-all"
                        >
                          {color}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FFD700]" />
                Leaderboard Realtime
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-white/60">Live</span>
              </div>
            </div>

            <div className="space-y-3">
              {leaderboard.map((player, index) => {
                const Icon = player.icon
                return (
                  <motion.div
                    key={player.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, type: "spring" }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      player.rank <= 3
                        ? 'bg-gradient-to-r from-[#FFD700]/20 to-transparent border border-[#FFD700]/30'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] flex items-center justify-center">
                      {Icon ? (
                        <Icon className="w-6 h-6 text-black" />
                      ) : (
                        <span className="text-xl font-bold text-black">{player.rank}</span>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1">
                      <p className="text-white font-semibold">{player.name}</p>
                      <p className="text-xs text-white/60">Rank #{player.rank}</p>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#FFD700] tabular-nums">{player.score}</p>
                      <p className="text-xs text-white/60">điểm</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Live update animation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30"
            >
              <p className="text-sm text-green-400 text-center">
                🎮 Leaderboard cập nhật realtime khi có người chơi mới
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
