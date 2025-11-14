"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Tv,
  Upload,
  Play,
  Pause,
  Eye,
  ExternalLink,
  Image as ImageIcon,
  Quote,
  Clock,
  Plus,
  X,
} from "lucide-react"

const defaultSlides = [
  { id: 1, url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800", type: "image" },
  { id: 2, url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800", type: "image" },
  { id: 3, url: "https://images.unsplash.com/photo-1519167758481-83f29da8c2f6?w=800", type: "image" },
]

const quotes = [
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "Your time is limited, don't waste it living someone else's life.",
]

export default function WaitingScreenModule() {
  const [slides, setSlides] = useState(defaultSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [speed, setSpeed] = useState(5) // seconds
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState(quotes[0])
  const [customQuote, setCustomQuote] = useState("")

  // Auto-play slideshow
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, speed * 1000)

    return () => clearInterval(timer)
  }, [isPlaying, speed, slides.length])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Tv className="w-8 h-8 text-[#FFD700]" />
            Waiting Screen
          </h1>
          <p className="text-white/60 mt-2">Màn hình chờ với slideshow và quote</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Play"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107]"
          >
            <ExternalLink className="w-4 h-4" />
            Open Waiting Screen
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left: Settings */}
        <div className="col-span-1 space-y-6">
          {/* Upload Images */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-[#FFD700]" />
              Slideshow Images
            </h2>

            <div className="space-y-3">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                    currentSlide === index
                      ? 'border-[#FFD700]'
                      : 'border-white/20'
                  }`}
                >
                  <img
                    src={slide.url}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {currentSlide === index && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-[#FFD700] text-black text-xs font-bold rounded">
                      Playing
                    </div>
                  )}
                </div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-white/20 text-white/60 hover:border-[#FFD700]/50 hover:text-white transition-all"
              >
                <Plus className="w-5 h-5" />
                Upload Image
              </motion.button>
            </div>
          </div>

          {/* Speed Control */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#FFD700]" />
              Slide Speed
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Duration per slide</span>
                <span className="text-white font-bold">{speed}s</span>
              </div>

              <input
                type="range"
                min="3"
                max="15"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFD700]"
              />

              <div className="flex justify-between text-xs text-white/40">
                <span>Fast (3s)</span>
                <span>Slow (15s)</span>
              </div>
            </div>
          </div>

          {/* Quote Editor */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Quote className="w-5 h-5 text-[#FFD700]" />
              Quote Display
            </h2>

            <div className="space-y-3">
              <textarea
                value={customQuote || selectedQuote}
                onChange={(e) => setCustomQuote(e.target.value)}
                placeholder="Nhập quote của bạn..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 resize-none"
                rows={4}
              />

              <p className="text-xs text-white/60">hoặc chọn quote có sẵn:</p>

              {quotes.map((quote, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedQuote(quote)
                    setCustomQuote("")
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedQuote === quote && !customQuote
                      ? 'border-[#FFD700] bg-[#FFD700]/10'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <p className="text-sm text-white/80 line-clamp-2">{quote}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="col-span-2">
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#FFD700]" />
                Preview Slideshow
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10">
                  {isPlaying && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                  <span className="text-xs text-white/60">
                    {currentSlide + 1} / {slides.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Slideshow Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <img
                    src={slides[currentSlide]?.url}
                    alt={`Slide ${currentSlide + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Quote Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute bottom-0 left-0 right-0 p-12"
                  >
                    <div className="max-w-4xl">
                      <Quote className="w-12 h-12 text-[#FFD700]/40 mb-4" />
                      <p className="text-3xl font-bold text-white leading-relaxed">
                        {customQuote || selectedQuote}
                      </p>
                    </div>
                  </motion.div>

                  {/* Event Logo/Name */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute top-8 left-8"
                  >
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFC107] bg-clip-text text-transparent">
                      GLOW UP 2025
                    </h3>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Bar */}
              {isPlaying && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-[#FFD700]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: speed, ease: "linear" }}
                  key={currentSlide}
                />
              )}
            </div>

            {/* Slide Thumbnails */}
            <div className="mt-6 flex gap-3 overflow-x-auto">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    currentSlide === index
                      ? 'border-[#FFD700] scale-110'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={slide.url}
                    alt={`Thumb ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
