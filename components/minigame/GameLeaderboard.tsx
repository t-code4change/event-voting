"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Crown, Star, Users, RefreshCw, Sparkles } from "lucide-react"
import ConfettiEffect from "@/components/ConfettiEffect"

export interface PlayerScore {
  id: string
  name: string
  score: number
  total: number
  isYou?: boolean
  avatar?: string // emoji
}

interface GameLeaderboardProps {
  gameName: string
  yourScore: number
  yourTotal: number
  onPlayAgain: () => void
  onChangeGame: () => void
}

const DEMO_PLAYERS = [
  { name: "Nguyễn Văn An", avatar: "👨" },
  { name: "Trần Thị Bình", avatar: "👩" },
  { name: "Lê Hoàng Cường", avatar: "🧑" },
  { name: "Phạm Thị Dung", avatar: "👧" },
  { name: "Hoàng Văn Đức", avatar: "👦" },
  { name: "Vũ Thị Hoa", avatar: "🧒" },
  { name: "Đặng Văn Hùng", avatar: "👨" },
  { name: "Bùi Thị Lan", avatar: "👩" },
  { name: "Đỗ Văn Long", avatar: "🧑" },
  { name: "Ngô Thị Mai", avatar: "👧" },
  { name: "Lý Văn Nam", avatar: "👦" },
  { name: "Phan Thị Ngọc", avatar: "👩" },
]

function generateDemoPlayers(yourScore: number, total: number): PlayerScore[] {
  const shuffled = [...DEMO_PLAYERS].sort(() => Math.random() - 0.5).slice(0, 8)
  return shuffled.map((p, i) => {
    // Spread scores naturally around the user's score
    const variance = Math.floor(Math.random() * (total + 1))
    return {
      id: `demo-${i}`,
      name: p.name,
      score: variance,
      total,
      avatar: p.avatar,
    }
  })
}

const MEDAL = ["🥇", "🥈", "🥉"]

export default function GameLeaderboard({ gameName, yourScore, yourTotal, onPlayAgain, onChangeGame }: GameLeaderboardProps) {
  const [players, setPlayers] = useState<PlayerScore[]>([])
  const [revealed, setRevealed] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    // Build full leaderboard: demo players + you
    const demo = generateDemoPlayers(yourScore, yourTotal)
    const you: PlayerScore = { id: "you", name: "Bạn", score: yourScore, total: yourTotal, isYou: true, avatar: "⭐" }
    const all = [...demo, you].sort((a, b) => b.score - a.score)
    setPlayers(all)

    // Simulate "online" counter climbing
    let count = 12
    setOnlineCount(count)
    const t = setInterval(() => {
      count += Math.floor(Math.random() * 3)
      setOnlineCount(count)
    }, 2500)

    // Reveal after short delay for drama
    const r = setTimeout(() => setRevealed(true), 600)
    return () => { clearInterval(t); clearTimeout(r) }
  }, [yourScore, yourTotal])

  const yourRank = players.findIndex(p => p.isYou) + 1
  const isTopThree = yourRank <= 3
  const winner = players[0]

  return (
    <div className="w-full max-w-lg mx-auto px-5">
      <ConfettiEffect show={isTopThree} duration={6000} />

      {/* Online indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-6">
        <motion.div className="w-2 h-2 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <span className="text-white/50 text-sm"><span className="text-green-400 font-bold">{onlineCount}</span> người đang chơi</span>
      </motion.div>

      {/* Your result banner */}
      <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.1, type: "spring" }}
        className="relative rounded-3xl p-6 mb-6 text-center overflow-hidden"
        style={{
          background: isTopThree
            ? "linear-gradient(135deg, rgba(255,215,0,0.18), rgba(255,107,53,0.12))"
            : "linear-gradient(135deg, rgba(91,123,255,0.15), rgba(155,89,182,0.1))",
          border: isTopThree ? "1.5px solid rgba(255,215,0,0.5)" : "1.5px solid rgba(91,123,255,0.35)",
          backdropFilter: "blur(20px)",
        }}>
        {/* Top shine */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: isTopThree ? "linear-gradient(90deg,transparent,rgba(255,215,0,0.6),transparent)" : "linear-gradient(90deg,transparent,rgba(91,123,255,0.5),transparent)" }} />

        <div className="text-5xl mb-2">{isTopThree ? MEDAL[yourRank - 1] : "🎯"}</div>
        <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Thứ hạng của bạn</p>
        <p className="text-5xl font-black mb-1" style={{ color: isTopThree ? "#FFD700" : "#5B7BFF" }}>#{yourRank}</p>
        <p className="text-white/70 text-sm">
          Điểm: <span className="font-black text-white">{yourScore}</span>/{yourTotal}
          {isTopThree && <span className="ml-2 text-yellow-400">🏆 Top {yourRank}!</span>}
        </p>
      </motion.div>

      {/* Leaderboard */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-white/70 text-sm font-semibold">Bảng xếp hạng · {gameName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-white/30" />
            <span className="text-white/30 text-xs">{players.length} người</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          <AnimatePresence>
            {revealed && players.slice(0, 10).map((player, i) => (
              <motion.div key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: player.isYou ? "rgba(91,123,255,0.12)" : i === 0 ? "rgba(255,215,0,0.06)" : "transparent" }}>

                {/* Rank */}
                <div className="w-7 text-center flex-shrink-0">
                  {i < 3 ? <span className="text-lg">{MEDAL[i]}</span>
                    : <span className="text-white/30 text-sm font-bold">#{i + 1}</span>}
                </div>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base"
                  style={{ background: player.isYou ? "rgba(91,123,255,0.3)" : "rgba(255,255,255,0.06)", border: player.isYou ? "1.5px solid rgba(91,123,255,0.6)" : "1px solid rgba(255,255,255,0.08)" }}>
                  {player.avatar}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${player.isYou ? "text-[#5B7BFF]" : i === 0 ? "text-yellow-300" : "text-white/80"}`}>
                    {player.name} {player.isYou && <span className="text-xs text-white/40">(bạn)</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="h-1 rounded-full flex-1 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(player.score / player.total) * 100}%` }}
                        transition={{ delay: i * 0.07 + 0.3, duration: 0.6, ease: "easeOut" }}
                        style={{ background: player.isYou ? "#5B7BFF" : i === 0 ? "#FFD700" : "rgba(255,255,255,0.25)" }} />
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <span className={`text-base font-black ${player.isYou ? "text-[#5B7BFF]" : i === 0 ? "text-yellow-300" : "text-white/70"}`}>
                    {player.score}
                  </span>
                  <span className="text-white/25 text-xs">/{player.total}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Winner spotlight */}
      {revealed && winner && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,107,53,0.08))", border: "1px solid rgba(255,215,0,0.3)", backdropFilter: "blur(12px)" }}>
          <Crown className="w-6 h-6 text-yellow-400 flex-shrink-0" />
          <div>
            <p className="text-yellow-400 font-black text-sm">🏆 Người chiến thắng</p>
            <p className="text-white font-semibold">{winner.name} · {winner.score}/{winner.total} điểm</p>
          </div>
          <motion.div className="ml-auto" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </motion.div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row gap-3">
        <motion.button onClick={onPlayAgain} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white"
          style={{ background: "linear-gradient(135deg, #5B7BFF, #9B59B6)", boxShadow: "0 0 30px rgba(91,123,255,0.35)" }}>
          <RefreshCw className="w-4 h-4" />Chơi lại
        </motion.button>
        <motion.button onClick={onChangeGame} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white/70"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <Star className="w-4 h-4" />Đổi game
        </motion.button>
      </motion.div>
    </div>
  )
}
