"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import MyButton from "@/components/MyButton"

const images = [
  {
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069",
    caption: "Sân khấu ánh vàng rực rỡ",
  },
  {
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070",
    caption: "Khán giả vỗ tay nhiệt liệt",
  },
  {
    url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=2070",
    caption: "Champagne celebration",
  },
  {
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070",
    caption: "Đêm tiệc hoành tráng",
  },
  {
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070",
    caption: "Những khoảnh khắc đáng nhớ",
  },
]

export default function PhotoCarousel() {
  const [[page, direction], setPage] = useState([0, 0])

  const imageIndex = ((page % images.length) + images.length) % images.length

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      }
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      }
    },
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-[#0B0B0B] border-2 border-[#FFD700]/20">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${images[imageIndex].url}')`,
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-transparent to-transparent" />

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
            <p
              className="text-xl md:text-2xl font-playfair font-bold text-white"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
            >
              {images[imageIndex].caption}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <MyButton
        variant="ghost"
        size="small"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-[#0B0B0B]/50 hover:bg-[#FFD700]/20 text-[#FFD700] backdrop-blur-sm px-2"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="h-8 w-8" />
      </MyButton>
      <MyButton
        variant="ghost"
        size="small"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-[#0B0B0B]/50 hover:bg-[#FFD700]/20 text-[#FFD700] backdrop-blur-sm px-2"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="h-8 w-8" />
      </MyButton>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === imageIndex
                ? "bg-[#FFD700] w-8"
                : "bg-[#FFD700]/30 hover:bg-[#FFD700]/50"
            }`}
            onClick={() => setPage([index, index > imageIndex ? 1 : -1])}
          />
        ))}
      </div>
    </div>
  )
}
