"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useSearchParams } from "next/navigation"
import { Crown, Sparkles, Trophy, Users, Vote, Maximize2, BarChart3, List, Play, Pause, Medal, Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AnimatedCounter from "@/components/AnimatedCounter"
import confetti from "canvas-confetti"
import { useRealtimeResults } from "@/hooks/useRealtimeResults"
import dynamic from "next/dynamic"

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

interface CandidateWithRank {
  id: string
  name: string
  description: string
  photo_url: string | null
  vote_count: number
  rank: number
  percentage: number
  previousRank?: number
}

interface CategoryData {
  id: string
  name: string
  candidates: CandidateWithRank[]
}

// Premium color palette for Year End Party
const COLORS = {
  gold: '#D4AF37',
  irisPurple: '#B57EDC',
  midnightNavy: '#221E3F',
  neonPink: '#FF4EC7',
  neonCyan: '#5DF0FF',
  darkBg: '#0A0A0F',
}

export default function LiveDisplayPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const eventId = params.eventId as string
  const isDemoMode = searchParams?.get('demo') === '1'

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list')
  const [previousTop1, setPreviousTop1] = useState<Record<string, string>>({})
  const prevCandidatesRef = useRef<Record<string, CandidateWithRank[]>>({})
  const [demoData, setDemoData] = useState<CategoryData[]>([])
  const [isAutoPlay, setIsAutoPlay] = useState(true) // Default is playing

  // Use realtime results hook
  const { categories: realCategories, stats: realStats, loading } = useRealtimeResults(eventId)

  // Choose data source: demo or real
  const categories = isDemoMode ? demoData : realCategories
  const stats = isDemoMode ? {
    totalVotes: demoData.reduce((sum, cat) => sum + cat.candidates.reduce((s, c) => s + c.vote_count, 0), 0),
    totalVoters: isDemoMode ? Math.floor(demoData.reduce((sum, cat) => sum + cat.candidates.reduce((s, c) => s + c.vote_count, 0), 0) / 2) : 0,
    totalCategories: demoData.length,
    totalCandidates: demoData.reduce((sum, cat) => sum + cat.candidates.length, 0),
  } : realStats

  // Demo mode: Generate initial data
  useEffect(() => {
    if (!isDemoMode) return

    const demoCategories: CategoryData[] = [
      {
        id: 'king',
        name: 'King of the Night',
        candidates: generateDemoCandidates('king', 7)
      },
      {
        id: 'queen',
        name: 'Queen of the Night',
        candidates: generateDemoCandidates('queen', 7)
      },
      {
        id: 'smile',
        name: 'Best Smile',
        candidates: generateDemoCandidates('smile', 6)
      },
      {
        id: 'creative',
        name: 'Most Creative',
        candidates: generateDemoCandidates('creative', 6)
      },
    ]

    setDemoData(demoCategories)
  }, [isDemoMode])

  // Demo mode: Update votes periodically
  useEffect(() => {
    if (!isDemoMode || demoData.length === 0) return

    const interval = setInterval(() => {
      setDemoData(prev => prev.map(category => ({
        ...category,
        candidates: category.candidates.map(candidate => {
          // Random vote change: -2 to +5
          const change = Math.floor(Math.random() * 8) - 2
          const newCount = Math.max(0, candidate.vote_count + change)
          return { ...candidate, vote_count: newCount }
        }).sort((a, b) => b.vote_count - a.vote_count)
          .map((c, i) => ({ ...c, rank: i + 1 }))
      })))
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isDemoMode, demoData.length])

  function generateDemoCandidates(prefix: string, count: number): CandidateWithRank[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `${prefix}-${i}`,
      name: `Candidate ${String.fromCharCode(65 + i)}`,
      description: `Department ${i + 1}`,
      photo_url: `https://i.pravatar.cc/200?img=${Math.floor(Math.random() * 70) + 1}`,
      vote_count: Math.floor(Math.random() * 100) + 20,
      rank: i + 1,
      percentage: 0,
    }))
  }

  // Demo voting end time: 21:00 today
  const votingEndTime = useMemo(() => {
    const end = new Date()
    end.setHours(21, 0, 0, 0)
    if (end.getTime() < Date.now()) {
      end.setDate(end.getDate() + 1)
    }
    return end
  }, [])

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = votingEndTime.getTime() - now

      if (distance < 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft({ hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [votingEndTime])

  // Process categories to add percentage and track changes
  const processedCategories = useMemo(() => {
    return categories.map(category => {
      const maxVotes = Math.max(...category.candidates.map(c => c.vote_count), 1)

      const candidatesWithPercentage = category.candidates.map(candidate => {
        const percentage = maxVotes > 0 ? (candidate.vote_count / maxVotes) * 100 : 0
        const prevCandidates = prevCandidatesRef.current[category.id]
        let previousRank: number | undefined = undefined

        if (prevCandidates) {
          const prevCandidate = prevCandidates.find(c => c.id === candidate.id)
          if (prevCandidate && prevCandidate.rank !== candidate.rank) {
            previousRank = prevCandidate.rank
          }
        }

        return {
          ...candidate,
          percentage,
          previousRank,
        }
      })

      return {
        ...category,
        candidates: candidatesWithPercentage,
      }
    })
  }, [categories])

  // Auto-switch categories every 10 seconds (20s in demo mode) - only when autoplay is enabled
  useEffect(() => {
    if (processedCategories.length === 0 || !isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % processedCategories.length)
    }, isDemoMode ? 20000 : 10000)

    return () => clearInterval(interval)
  }, [processedCategories.length, isDemoMode, isAutoPlay])

  // Track TOP 1 changes and trigger confetti
  useEffect(() => {
    if (processedCategories.length === 0) return

    processedCategories.forEach((category) => {
      const top1 = category.candidates[0]
      if (!top1) return

      const prevTop1Id = previousTop1[category.id]

      // Check if TOP 1 changed
      if (prevTop1Id && prevTop1Id !== top1.id) {
        // Trigger premium confetti for new TOP 1
        triggerTop1Confetti()
      }

      setPreviousTop1(prev => ({ ...prev, [category.id]: top1.id }))
      prevCandidatesRef.current[category.id] = category.candidates
    })
  }, [processedCategories, previousTop1])

  const triggerTop1Confetti = () => {
    const count = 120 // Lighter confetti
    const defaults = {
      origin: { y: 0.3 },
      spread: 100,
      ticks: 200,
      gravity: 0.7,
      decay: 0.94,
      startVelocity: 40,
      scalar: 1.2,
    }

    const fire = (particleRatio: number, opts: any) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    // Metallic gold 60%
    fire(0.35, {
      spread: 40,
      startVelocity: 55,
      colors: [COLORS.gold, '#FFD700', '#FFC107'],
    })

    // Iris Purple 20%
    setTimeout(() => {
      fire(0.15, {
        spread: 70,
        startVelocity: 45,
        colors: [COLORS.irisPurple, '#9B6FCC', '#D4A5E8'],
      })
    }, 100)

    // Neon accents 20%
    setTimeout(() => {
      fire(0.2, {
        spread: 90,
        startVelocity: 40,
        colors: [COLORS.neonPink, COLORS.neonCyan],
      })
    }, 200)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const currentCategory = processedCategories[currentCategoryIndex]
  const topCandidates = currentCategory?.candidates.slice(0, 7) || []

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bar: `from-[${COLORS.gold}] via-[#FFD700] to-[#FFC107]`,
          glow: `shadow-[0_0_30px_${COLORS.gold}80]`,
          border: `border-[${COLORS.gold}]`,
          text: `text-[${COLORS.gold}]`,
        }
      case 2:
        return {
          bar: 'from-[#CFD8DC] via-[#B0BEC5] to-[#90A4AE]',
          glow: 'shadow-[0_0_20px_rgba(207,216,220,0.4)]',
          border: 'border-[#CFD8DC]',
          text: 'text-[#CFD8DC]',
        }
      case 3:
        return {
          bar: `from-[${COLORS.irisPurple}] via-[#9B6FCC] to-[#D4A5E8]`,
          glow: `shadow-[0_0_20px_${COLORS.irisPurple}60]`,
          border: `border-[${COLORS.irisPurple}]`,
          text: `text-[${COLORS.irisPurple}]`,
        }
      default:
        return {
          bar: `from-[${COLORS.neonCyan}] via-[#4DC9E6] to-[#3DB8D6]`,
          glow: `shadow-[0_0_15px_${COLORS.neonCyan}40]`,
          border: `border-[${COLORS.neonCyan}]`,
          text: `text-[${COLORS.neonCyan}]`,
        }
    }
  }

  // ECharts configuration
  const getChartOption = () => {
    if (!currentCategory) return {}

    const data = topCandidates.map(c => ({
      name: c.name,
      value: c.vote_count,
      rank: c.rank,
    })).reverse() // Reverse for horizontal bar

    return {
      grid: {
        left: '25%',
        right: '15%',
        top: '5%',
        bottom: '5%',
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: COLORS.gold,
          fontSize: 24,
          fontWeight: 'bold',
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(212, 175, 55, 0.1)',
          }
        }
      },
      yAxis: {
        type: 'category',
        data: data.map(d => d.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#ffffff',
          fontSize: 28,
          fontWeight: 'bold',
          fontFamily: 'Playfair Display, serif',
        }
      },
      series: [{
        type: 'bar',
        data: data.map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: d.rank === 1 ? [
                { offset: 0, color: COLORS.gold },
                { offset: 0.5, color: '#FFD700' },
                { offset: 1, color: '#FFC107' }
              ] : d.rank === 2 ? [
                { offset: 0, color: '#CFD8DC' },
                { offset: 1, color: '#90A4AE' }
              ] : d.rank === 3 ? [
                { offset: 0, color: COLORS.irisPurple },
                { offset: 1, color: '#9B6FCC' }
              ] : [
                { offset: 0, color: COLORS.neonCyan },
                { offset: 1, color: '#3DB8D6' }
              ]
            },
            borderRadius: [0, 20, 20, 0],
            shadowColor: d.rank === 1 ? COLORS.gold : d.rank === 2 ? '#CFD8DC' : COLORS.irisPurple,
            shadowBlur: 20,
          }
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          color: COLORS.gold,
          fontSize: 32,
          fontWeight: 'bold',
          formatter: '{c} phiếu'
        },
        animationDuration: 1000,
        animationEasing: 'elasticOut',
      }]
    }
  }

  const pad = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${COLORS.midnightNavy} 0%, ${COLORS.darkBg} 50%, ${COLORS.midnightNavy} 100%)` }}>
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: i % 3 === 0 ? COLORS.gold : i % 3 === 1 ? COLORS.irisPurple : COLORS.neonCyan,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Neon glow overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ background: COLORS.neonPink }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ background: COLORS.neonCyan }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full blur-[120px] opacity-15" style={{ background: COLORS.irisPurple }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b shadow-lg" style={{ borderColor: `${COLORS.gold}33`, background: `${COLORS.midnightNavy}E6` }}>
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Crown className="w-16 h-16" style={{ color: COLORS.gold, filter: `drop-shadow(0 0 20px ${COLORS.gold})` }} />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    backgroundImage: `linear-gradient(90deg, ${COLORS.gold} 0%, #FFD700 50%, ${COLORS.gold} 100%)`,
                    textShadow: `0 0 30px ${COLORS.gold}80`,
                    letterSpacing: '0.02em'
                  }}>
                  Bright4Event
                </h1>
                <p className="text-sm tracking-wider" style={{ color: `${COLORS.gold}CC` }}>YEAR END PARTY 2025</p>
              </div>
            </div>

            {/* Title with LIVE badge */}
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-4 mb-2">
                {/* LIVE badge */}
                <motion.div
                  className="px-4 py-2 rounded-full border-2 flex items-center gap-2"
                  style={{
                    borderColor: isDemoMode ? COLORS.neonPink : '#ff0000',
                    background: `${isDemoMode ? COLORS.neonPink : '#ff0000'}20`,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 10px ${isDemoMode ? COLORS.neonPink : '#ff0000'}40`,
                      `0 0 25px ${isDemoMode ? COLORS.neonPink : '#ff0000'}80`,
                      `0 0 10px ${isDemoMode ? COLORS.neonPink : '#ff0000'}40`,
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ background: isDemoMode ? COLORS.neonPink : '#ff0000' }}
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span className="text-sm font-bold uppercase tracking-wider text-white">
                    {isDemoMode ? 'DEMO MODE' : 'LIVE DATA'}
                  </span>
                </motion.div>

                <h2 className="text-5xl font-bold text-white tracking-wide"
                  style={{ textShadow: `0 0 40px ${COLORS.gold}60, 0 2px 10px rgba(0,0,0,0.9)`, fontFamily: 'DM Serif Display, Playfair Display, serif' }}>
                  LEADERBOARD
                </h2>
              </div>
              <p className="text-2xl font-semibold tracking-wider"
                style={{ color: COLORS.gold, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                KẾT QUẢ REALTIME
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                {/* Play/Stop toggle */}
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="p-3 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: isAutoPlay ? `${COLORS.neonPink}80` : `${COLORS.gold}50`,
                    background: isAutoPlay ? `${COLORS.neonPink}20` : `${COLORS.gold}10`,
                    color: isAutoPlay ? COLORS.neonPink : COLORS.gold,
                  }}
                  title={isAutoPlay ? 'Dừng tự động chuyển' : 'Bật tự động chuyển'}
                >
                  {isAutoPlay ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                {/* View mode toggle */}
                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'chart' : 'list')}
                  className="p-3 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: `${COLORS.gold}50`,
                    background: `${COLORS.gold}10`,
                    color: COLORS.gold,
                  }}
                  title={viewMode === 'list' ? 'Chuyển sang biểu đồ' : 'Chuyển sang danh sách'}
                >
                  {viewMode === 'list' ? <BarChart3 className="w-6 h-6" /> : <List className="w-6 h-6" />}
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-3 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: `${COLORS.gold}50`,
                    background: `${COLORS.gold}10`,
                    color: COLORS.gold,
                  }}
                  title="Toàn màn hình"
                >
                  <Maximize2 className="w-6 h-6" />
                </button>
              </div>

              {/* Countdown */}
              <div className="border-2 rounded-xl px-4 py-2" style={{ background: COLORS.midnightNavy, borderColor: `${COLORS.gold}50` }}>
                <p className="text-xs text-center mb-1 uppercase tracking-wider" style={{ color: `${COLORS.gold}B3` }}>Thời gian còn lại</p>
                <div className="flex items-center gap-1 text-2xl font-bold font-mono" style={{ color: COLORS.gold }}>
                  <span>{pad(timeLeft.hours)}</span>
                  <span className="animate-pulse">:</span>
                  <span>{pad(timeLeft.minutes)}</span>
                  <span className="animate-pulse">:</span>
                  <span>{pad(timeLeft.seconds)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Award Selector - Centered */}
      <div className="relative z-10 py-12">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {processedCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className={`relative px-10 py-5 rounded-full cursor-pointer transition-all`}
                style={{
                  background: index === currentCategoryIndex
                    ? `linear-gradient(135deg, ${COLORS.gold}30, ${COLORS.irisPurple}30)`
                    : `${COLORS.midnightNavy}80`,
                  borderWidth: 3,
                  borderStyle: 'solid',
                  borderColor: index === currentCategoryIndex ? COLORS.gold : `${COLORS.gold}30`,
                }}
                onClick={() => setCurrentCategoryIndex(index)}
                animate={index === currentCategoryIndex ? {
                  boxShadow: [
                    `0 0 20px ${COLORS.gold}50`,
                    `0 0 40px ${COLORS.gold}90`,
                    `0 0 20px ${COLORS.gold}50`,
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-4xl font-bold text-center"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: index === currentCategoryIndex ? COLORS.gold : '#ffffff99',
                    textShadow: index === currentCategoryIndex ? `0 0 20px ${COLORS.gold}99` : 'none'
                  }}>
                  {category.name}
                </p>
                {index === currentCategoryIndex && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }}
                    layoutId="activeTab"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-8 pb-12">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <ListView
              key={`list-${currentCategoryIndex}`}
              topCandidates={topCandidates}
              getRankColor={getRankColor}
              isDemoMode={isDemoMode}
            />
          ) : (
            <ChartView
              key={`chart-${currentCategoryIndex}`}
              chartOption={getChartOption()}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer - Stats */}
      <footer className="relative z-10 border-t py-6 mt-auto backdrop-blur-sm"
        style={{ borderColor: `${COLORS.gold}30`, background: `${COLORS.midnightNavy}E6` }}>
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-3">
                <Users className="w-10 h-10" style={{ color: COLORS.gold }} />
                <div>
                  <p className="text-sm uppercase tracking-wider" style={{ color: '#ffffff99' }}>Người đã vote</p>
                  <p className="text-4xl font-bold" style={{ color: COLORS.gold }}>
                    <AnimatedCounter value={stats.totalVoters} duration={1.5} />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Vote className="w-10 h-10" style={{ color: COLORS.gold }} />
                <div>
                  <p className="text-sm uppercase tracking-wider" style={{ color: '#ffffff99' }}>Tổng số phiếu</p>
                  <p className="text-4xl font-bold" style={{ color: COLORS.gold }}>
                    <AnimatedCounter value={stats.totalVotes} duration={1.5} />
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm mb-1" style={{ color: '#ffffff99' }}>
                {isDemoMode ? 'Demo Mode - Simulated Data' : 'Dữ liệu realtime từ hệ thống'}
              </p>
              <p className="text-lg font-semibold" style={{ color: COLORS.gold }}>
                Bright4Event – Year End Party 2025
              </p>
              <p className="text-xs mt-1" style={{ color: '#ffffff66' }}>
                Dành cho trình chiếu sân khấu
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Premium Rank Icons with Metallic Effect
function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    // Top 1: Premium Gold Crown with metallic gradient
    return (
      <div className="relative w-14 h-14">
        {/* Specular highlight overlay */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />
        {/* Main crown icon with gold metallic effect */}
        <Crown
          className="w-14 h-14"
          style={{
            color: '#FFD700',
            filter: `
              drop-shadow(0 0 8px ${COLORS.gold})
              drop-shadow(0 4px 12px rgba(212,175,55,0.6))
              drop-shadow(0 0 20px rgba(255,215,0,0.4))
            `,
            strokeWidth: 2.5,
          }}
        />
        {/* Chrome reflection */}
        <div className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
            mixBlendMode: 'overlay',
          }}
        />
      </div>
    )
  } else if (rank === 2) {
    // Top 2: Silver Medal with chrome effect
    return (
      <div className="relative w-14 h-14">
        {/* Specular highlight */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.7) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        {/* Silver medal */}
        <Medal
          className="w-14 h-14"
          style={{
            color: '#E8E8E8',
            filter: `
              drop-shadow(0 0 6px rgba(207,216,220,0.8))
              drop-shadow(0 3px 10px rgba(176,190,197,0.5))
              drop-shadow(0 0 15px rgba(255,255,255,0.3))
            `,
            strokeWidth: 2.5,
          }}
        />
        {/* Chrome shine */}
        <div className="absolute inset-0 opacity-40"
          style={{
            background: 'linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.8) 50%, transparent 65%)',
            mixBlendMode: 'overlay',
          }}
        />
      </div>
    )
  } else if (rank === 3) {
    // Top 3: Bronze/Purple Award Star
    return (
      <div className="relative w-14 h-14">
        {/* Specular highlight */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.4) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />
        {/* Purple/bronze award */}
        <Award
          className="w-14 h-14"
          style={{
            color: '#C9A0DC',
            filter: `
              drop-shadow(0 0 6px ${COLORS.irisPurple})
              drop-shadow(0 3px 10px rgba(181,126,220,0.5))
              drop-shadow(0 0 15px rgba(181,126,220,0.3))
            `,
            strokeWidth: 2.5,
          }}
        />
        {/* Metallic reflection */}
        <div className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(140deg, transparent 40%, rgba(255,255,255,0.5) 52%, transparent 64%)',
            mixBlendMode: 'overlay',
          }}
        />
      </div>
    )
  }

  return null
}

// List View Component
function ListView({ topCandidates, getRankColor, isDemoMode }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {topCandidates.map((candidate: CandidateWithRank, index: number) => {
        const isTop1 = candidate.rank === 1
        const justPromoted = candidate.previousRank && candidate.previousRank > candidate.rank

        return (
          <motion.div
            key={candidate.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: justPromoted ? [1, 1.05, 1] : 1,
            }}
            transition={{
              layout: { type: "spring", stiffness: 200, damping: 25 },
              delay: index * 0.1
            }}
            className={`relative flex items-center gap-6 p-6 rounded-2xl border-4`}
            style={{
              borderColor: isTop1 ? COLORS.gold : candidate.rank === 2 ? '#CFD8DC' : candidate.rank === 3 ? COLORS.irisPurple : COLORS.neonCyan,
              background: `linear-gradient(90deg, ${COLORS.midnightNavy} 0%, ${COLORS.darkBg} 100%)`,
              boxShadow: isTop1 ? `0 0 30px ${COLORS.gold}60` : `0 0 20px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Rank Badge with Premium Icons */}
            <div className="relative">
              <motion.div
                className={`w-28 h-28 rounded-full flex items-center justify-center text-6xl font-bold border-4 relative overflow-hidden`}
                style={{
                  background: candidate.rank <= 3
                    ? candidate.rank === 1
                      ? `linear-gradient(135deg, ${COLORS.gold} 0%, #FFD700 50%, #FFA500 100%)`
                      : candidate.rank === 2
                        ? 'linear-gradient(135deg, #E8E8E8 0%, #CFD8DC 40%, #90A4AE 100%)'
                        : `linear-gradient(135deg, ${COLORS.irisPurple} 0%, #C9A0DC 50%, #9B6FCC 100%)`
                    : COLORS.midnightNavy,
                  borderColor: isTop1 ? COLORS.gold : candidate.rank === 2 ? '#E8E8E8' : candidate.rank === 3 ? COLORS.irisPurple : COLORS.neonCyan,
                  boxShadow: candidate.rank === 1
                    ? `0 0 35px ${COLORS.gold}, inset 0 0 20px rgba(255,215,0,0.3)`
                    : candidate.rank === 2
                      ? `0 0 25px rgba(232,232,232,0.6), inset 0 0 15px rgba(255,255,255,0.2)`
                      : candidate.rank === 3
                        ? `0 0 25px ${COLORS.irisPurple}60, inset 0 0 15px rgba(181,126,220,0.2)`
                        : '',
                }}
                animate={isTop1 ? {
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Metallic shine overlay for top 3 */}
                {candidate.rank <= 3 && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                )}

                {candidate.rank <= 3 ? (
                  <RankIcon rank={candidate.rank} />
                ) : (
                  <span style={{ color: COLORS.neonCyan }}>{candidate.rank}</span>
                )}
              </motion.div>

              {/* Crown for TOP 1 - Enhanced */}
              {isTop1 && (
                <motion.div
                  className="absolute -top-10 left-1/2 -translate-x-1/2"
                  initial={{ y: -50, opacity: 0, rotate: -20 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="relative">
                    {/* Crown with enhanced metallic effect */}
                    <Crown
                      className="w-20 h-20"
                      style={{
                        color: '#FFD700',
                        filter: `drop-shadow(0 0 20px ${COLORS.gold}) drop-shadow(0 5px 15px rgba(212,175,55,0.7))`,
                        strokeWidth: 2,
                      }}
                    />
                    {/* Specular highlight on crown */}
                    <div className="absolute inset-0 opacity-60"
                      style={{
                        background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Sparkles for TOP 1 */}
              {isTop1 && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      animate={{
                        x: [0, Math.cos(i * 60 * Math.PI / 180) * 50],
                        y: [0, Math.sin(i * 60 * Math.PI / 180) * 50],
                        opacity: [0, 1, 0],
                        scale: [0, 2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    >
                      <Sparkles className="w-5 h-5" style={{ color: COLORS.gold }} />
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Avatar */}
            <Avatar className={`w-36 h-36 border-4`}
              style={{
                borderColor: isTop1 ? COLORS.gold : candidate.rank === 2 ? '#CFD8DC' : candidate.rank === 3 ? COLORS.irisPurple : COLORS.neonCyan,
                boxShadow: isTop1 ? `0 0 20px ${COLORS.gold}` : '',
              }}>
              <AvatarImage
                src={candidate.photo_url || `https://i.pravatar.cc/200?img=${Math.floor(Math.random() * 70) + 1}`}
                alt={candidate.name}
              />
              <AvatarFallback className="text-5xl font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${COLORS.gold}50, ${COLORS.irisPurple}50)` }}>
                {candidate.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-6xl font-bold text-white mb-2 truncate"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  textShadow: isTop1 ? `0 0 20px ${COLORS.gold}99` : '0 2px 8px rgba(0,0,0,0.8)'
                }}>
                {candidate.name}
              </h3>
              <p className="text-3xl truncate" style={{ color: '#ffffffB3' }}>{candidate.description}</p>
            </div>

            {/* Vote Count */}
            <div className="text-right">
              <motion.p
                className="text-7xl font-bold mb-2"
                key={candidate.vote_count}
                initial={{ scale: 1.3, color: COLORS.neonPink }}
                animate={{ scale: 1, color: COLORS.gold }}
                transition={{ duration: 0.5 }}
                style={{ textShadow: `0 0 30px ${COLORS.gold}CC` }}
              >
                <AnimatedCounter value={candidate.vote_count} duration={1} />
              </motion.p>
              <p className="text-4xl font-semibold" style={{ color: '#ffffffCC' }}>phiếu</p>
              <p className="text-3xl font-bold mt-2"
                style={{
                  color: isTop1 ? COLORS.gold : candidate.rank === 2 ? '#CFD8DC' : candidate.rank === 3 ? COLORS.irisPurple : COLORS.neonCyan
                }}>
                {candidate.percentage.toFixed(1)}%
              </p>

              {/* Neon blink on vote change (demo mode) */}
              {isDemoMode && (
                <motion.div
                  className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: COLORS.neonPink,
                    color: '#fff',
                    boxShadow: `0 0 15px ${COLORS.neonPink}`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  +{Math.floor(Math.random() * 5) + 1}
                </motion.div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-4 rounded-b-xl overflow-hidden" style={{ background: COLORS.darkBg }}>
              <motion.div
                className="h-full"
                style={{
                  background: isTop1
                    ? `linear-gradient(90deg, ${COLORS.gold}, #FFD700)`
                    : candidate.rank === 2
                      ? 'linear-gradient(90deg, #CFD8DC, #90A4AE)'
                      : candidate.rank === 3
                        ? `linear-gradient(90deg, ${COLORS.irisPurple}, #9B6FCC)`
                        : `linear-gradient(90deg, ${COLORS.neonCyan}, #3DB8D6)`,
                  boxShadow: `0 0 20px ${isTop1 ? COLORS.gold : candidate.rank === 2 ? '#CFD8DC' : candidate.rank === 3 ? COLORS.irisPurple : COLORS.neonCyan}80`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${candidate.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// Chart View Component
function ChartView({ chartOption }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl p-8"
      style={{
        background: `${COLORS.midnightNavy}CC`,
        border: `2px solid ${COLORS.gold}40`,
        boxShadow: `0 0 40px ${COLORS.gold}30`,
      }}
    >
      <ReactECharts
        option={chartOption}
        style={{ height: '700px', width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </motion.div>
  )
}
