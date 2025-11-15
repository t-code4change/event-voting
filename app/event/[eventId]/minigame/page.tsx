"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import {
  Sparkles,
  Clock,
  Trophy,
  Star,
  Zap,
  CheckCircle2,
  XCircle,
  Gift,
  Loader2
} from "lucide-react"
import ConfettiEffect from "@/components/ConfettiEffect"

// Types
interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  timeLimit: number // seconds
}

interface GameState {
  screen: "start" | "question" | "loading" | "result"
  currentQuestionIndex: number
  answers: (number | null)[]
  score: number
  timeLeft: number
}

// Mock data - replace with API call
const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    text: "Sự kiện Bright4Event được tổ chức lần đầu vào năm nào?",
    options: ["2020", "2021", "2022", "2023"],
    correctAnswer: 1,
    timeLimit: 15
  },
  {
    id: "2",
    text: "Đâu là slogan của sự kiện năm nay?",
    options: ["Glow Up 2025", "Shine Bright", "Light the Future", "Spark Joy"],
    correctAnswer: 0,
    timeLimit: 15
  },
  {
    id: "3",
    text: "Bao nhiêu hạng mục bình chọn trong sự kiện?",
    options: ["2 hạng mục", "3 hạng mục", "4 hạng mục", "5 hạng mục"],
    correctAnswer: 2,
    timeLimit: 15
  },
  {
    id: "4",
    text: "Thời gian bình chọn kết thúc vào lúc nào?",
    options: ["19:00", "20:00", "21:00", "22:00"],
    correctAnswer: 2,
    timeLimit: 15
  },
  {
    id: "5",
    text: "Giải thưởng lớn nhất của sự kiện là gì?",
    options: ["Chuyến du lịch", "Tiền mặt", "Thiết bị điện tử", "Voucher mua sắm"],
    correctAnswer: 0,
    timeLimit: 15
  }
]

// Particle Background Component
function ParticleBackground() {
  const particles = Array.from({ length: 30 }, (_, i) => i)

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#5B7BFF] rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Circular Timer Component
interface CircularTimerProps {
  timeLeft: number
  totalTime: number
}

function CircularTimer({ timeLeft, totalTime }: CircularTimerProps) {
  const percentage = (timeLeft / totalTime) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (percentage > 60) return "#5B7BFF" // blue
    if (percentage > 30) return "#FFD700" // yellow
    return "#ef4444" // red
  }

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="48"
          cy="48"
          r="45"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx="48"
          cy="48"
          r="45"
          stroke={getColor()}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
          style={{ filter: `drop-shadow(0 0 10px ${getColor()})` }}
        />
      </svg>

      {/* Time text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl font-bold"
          style={{ color: getColor() }}
          animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
        >
          {timeLeft}
        </motion.span>
      </div>
    </div>
  )
}

// Badge Component
interface BadgeProps {
  score: number
  total: number
}

function Badge({ score, total }: BadgeProps) {
  const percentage = (score / total) * 100

  const getBadge = () => {
    if (percentage >= 90) return { name: "TOP PLAYER", icon: Trophy, color: "#FFD700", glow: "rgba(255,215,0,0.6)" }
    if (percentage >= 70) return { name: "GOLD", icon: Star, color: "#FFD700", glow: "rgba(255,215,0,0.5)" }
    if (percentage >= 50) return { name: "SILVER", icon: Star, color: "#C0C0C0", glow: "rgba(192,192,192,0.5)" }
    return { name: "BRONZE", icon: Star, color: "#CD7F32", glow: "rgba(205,127,50,0.5)" }
  }

  const badge = getBadge()
  const Icon = badge.icon

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", duration: 1 }}
      className="relative"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
        className="w-32 h-32 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${badge.color}, ${badge.color}dd)`,
          boxShadow: `0 0 40px ${badge.glow}`
        }}
      >
        <Icon className="w-16 h-16 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <p className="text-xl font-bold" style={{ color: badge.color }}>
          {badge.name}
        </p>
      </motion.div>
    </motion.div>
  )
}

// Main Component
export default function MiniGamePage() {
  const params = useParams()

  const [gameState, setGameState] = useState<GameState>({
    screen: "start",
    currentQuestionIndex: 0,
    answers: Array(MOCK_QUESTIONS.length).fill(null),
    score: 0,
    timeLeft: MOCK_QUESTIONS[0]?.timeLimit || 15
  })

  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const currentQuestion = MOCK_QUESTIONS[gameState.currentQuestionIndex]
  const totalQuestions = MOCK_QUESTIONS.length
  const progress = ((gameState.currentQuestionIndex + 1) / totalQuestions) * 100

  // Timer effect
  useEffect(() => {
    if (gameState.screen !== "question") return

    if (gameState.timeLeft <= 0) {
      handleNextQuestion()
      return
    }

    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeLeft: prev.timeLeft - 1
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState.screen, gameState.timeLeft])

  const handleStart = () => {
    setGameState(prev => ({
      ...prev,
      screen: "question",
      timeLeft: MOCK_QUESTIONS[0].timeLimit
    }))
  }

  const handleSelectOption = (optionIndex: number) => {
    if (selectedOption !== null) return // Already selected
    setSelectedOption(optionIndex)

    // Update answers
    const newAnswers = [...gameState.answers]
    newAnswers[gameState.currentQuestionIndex] = optionIndex
    setGameState(prev => ({ ...prev, answers: newAnswers }))

    // Auto proceed after 1 second
    setTimeout(() => {
      handleNextQuestion()
    }, 1000)
  }

  const handleNextQuestion = () => {
    const isCorrect = selectedOption === currentQuestion.correctAnswer
    const newScore = gameState.score + (isCorrect ? 1 : 0)

    if (gameState.currentQuestionIndex < totalQuestions - 1) {
      // Next question
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        score: newScore,
        timeLeft: MOCK_QUESTIONS[prev.currentQuestionIndex + 1].timeLimit
      }))
      setSelectedOption(null)
    } else {
      // Game over - show loading then results
      setGameState(prev => ({
        ...prev,
        screen: "loading",
        score: newScore
      }))
      setSelectedOption(null)

      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          screen: "result"
        }))
        setShowConfetti(true)
      }, 2000)
    }
  }

  const handleRestart = () => {
    setGameState({
      screen: "start",
      currentQuestionIndex: 0,
      answers: Array(MOCK_QUESTIONS.length).fill(null),
      score: 0,
      timeLeft: MOCK_QUESTIONS[0]?.timeLimit || 15
    })
    setSelectedOption(null)
    setShowConfetti(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F2C] via-[#1B2A6B] to-[#0A0F2C] relative overflow-hidden">
      {/* Background Effects */}
      <ParticleBackground />

      {/* Spotlight effects */}
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#5B7BFF]/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[100px]"
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#FFD700]/10 rounded-full blur-[90px]"
        animate={{
          x: [0, -50, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Confetti */}
      <ConfettiEffect show={showConfetti} duration={5000} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {/* START SCREEN */}
          {gameState.screen === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl w-full text-center"
            >
              {/* Logo / Icon */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-8 inline-block"
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#5B7BFF] to-purple-600 rounded-3xl flex items-center justify-center"
                  style={{ boxShadow: "0 0 60px rgba(91,123,255,0.6)" }}
                >
                  <Zap className="w-16 h-16 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-[#5B7BFF] via-purple-400 to-[#FFD700] bg-clip-text text-transparent">
                  Mini Game
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl text-white/90 mb-2 font-semibold"
              >
                Sẵn sàng thử thách?
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/70 mb-8 max-w-xl mx-auto"
              >
                Trả lời thật nhanh và chính xác để nhận quà từ sự kiện!
              </motion.p>

              {/* Game Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-[#FFD700]" />
                      <p className="text-white/60 text-sm">Số câu hỏi</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{totalQuestions}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-[#5B7BFF]" />
                      <p className="text-white/60 text-sm">Thời gian/câu</p>
                    </div>
                    <p className="text-3xl font-bold text-white">15s</p>
                  </div>
                </div>
              </motion.div>

              {/* Start Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="relative px-12 py-5 rounded-full bg-gradient-to-r from-[#5B7BFF] to-purple-600 text-white text-xl font-bold shadow-lg overflow-hidden group"
              >
                {/* Pulse glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#5B7BFF] to-purple-600 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  BẮT ĐẦU NGAY
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* QUESTION SCREEN */}
          {gameState.screen === "question" && currentQuestion && (
            <motion.div
              key={`question-${gameState.currentQuestionIndex}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="max-w-4xl w-full"
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-white/70 text-sm mb-2">
                  <span>Câu hỏi {gameState.currentQuestionIndex + 1}/{totalQuestions}</span>
                  <span>{Math.round(progress)}% hoàn thành</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#5B7BFF] to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ boxShadow: "0 0 10px rgba(91,123,255,0.6)" }}
                  />
                </div>
              </div>

              {/* Timer */}
              <div className="flex justify-center mb-8">
                <CircularTimer
                  timeLeft={gameState.timeLeft}
                  totalTime={currentQuestion.timeLimit}
                />
              </div>

              {/* Question Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 mb-8"
                style={{ boxShadow: "0 0 40px rgba(91,123,255,0.2)" }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </motion.div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === index
                  const isCorrect = index === currentQuestion.correctAnswer
                  const showResult = selectedOption !== null

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={selectedOption === null ? { scale: 1.02, y: -2 } : {}}
                      whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                      onClick={() => handleSelectOption(index)}
                      disabled={selectedOption !== null}
                      className={`
                        relative p-6 rounded-2xl text-left text-lg font-semibold
                        transition-all duration-300 overflow-hidden
                        ${!showResult
                          ? "bg-white/10 hover:bg-white/15 border border-white/20 text-white"
                          : isSelected && isCorrect
                          ? "bg-green-500/20 border-2 border-green-500 text-green-300"
                          : isSelected && !isCorrect
                          ? "bg-red-500/20 border-2 border-red-500 text-red-300"
                          : isCorrect
                          ? "bg-green-500/20 border-2 border-green-500 text-green-300"
                          : "bg-white/5 border border-white/10 text-white/50"
                        }
                      `}
                    >
                      {/* Option letter */}
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 mr-3 text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>

                      {option}

                      {/* Result icon */}
                      {showResult && isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4"
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </motion.div>
                      )}

                      {showResult && !isSelected && isCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4"
                        >
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* LOADING SCREEN */}
          {gameState.screen === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-8 inline-block"
              >
                <Loader2 className="w-24 h-24 text-[#5B7BFF]" style={{ filter: "drop-shadow(0 0 20px rgba(91,123,255,0.6))" }} />
              </motion.div>

              <motion.h2
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl font-bold text-white mb-4"
              >
                Đang tính điểm...
              </motion.h2>

              {/* Particle burst */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#FFD700] rounded-full"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 100,
                    y: Math.sin((i / 12) * Math.PI * 2) * 100,
                    opacity: 0
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ))}
            </motion.div>
          )}

          {/* RESULT SCREEN */}
          {gameState.screen === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl w-full text-center"
            >
              {/* Congratulations */}
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-white mb-2"
              >
                Chúc mừng bạn! 🎉
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-white/70 mb-12"
              >
                Bạn đã hoàn thành thử thách!
              </motion.p>

              {/* Badge */}
              <div className="mb-16">
                <Badge score={gameState.score} total={totalQuestions} />
              </div>

              {/* Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <p className="text-white/70 text-lg mb-3">Điểm số của bạn</p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 }}
                  className="inline-block"
                >
                  <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-[#5B7BFF] via-purple-400 to-[#FFD700] bg-clip-text text-transparent">
                    {gameState.score}/{totalQuestions}
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-2xl text-white mt-4"
                >
                  Bạn đã trả lời đúng {gameState.score}/{totalQuestions} câu. Quá đỉnh!
                </motion.p>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {/* Gift Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-10 py-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black text-lg font-bold shadow-lg overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FDB931] rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  <span className="relative z-10 flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    NHẬN QUÀ NGAY
                  </span>
                </motion.button>

                {/* Play Again */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRestart}
                  className="px-10 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-lg font-semibold transition-all"
                >
                  Chơi lại
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
