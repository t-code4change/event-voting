"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import Image from "next/image"
import confetti from "canvas-confetti"
import { Sparkles } from "lucide-react"

// Floating particles with bokeh effect
function FloatingBokeh() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-xl"
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${
              i % 3 === 0 ? 'rgba(255, 211, 106, 0.3)' :
              i % 3 === 1 ? 'rgba(255, 215, 0, 0.25)' :
              'rgba(253, 185, 49, 0.2)'
            } 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Light rays effect
function LightRays() {
  return (
    <>
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        animate={{
          background: [
            'linear-gradient(135deg, rgba(255, 211, 106, 0.3) 0%, transparent 40%, transparent 60%, rgba(255, 215, 0, 0.3) 100%)',
            'linear-gradient(225deg, rgba(255, 211, 106, 0.3) 0%, transparent 40%, transparent 60%, rgba(255, 215, 0, 0.3) 100%)',
            'linear-gradient(135deg, rgba(255, 211, 106, 0.3) 0%, transparent 40%, transparent 60%, rgba(255, 215, 0, 0.3) 100%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255, 211, 106, 0.5) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </>
  )
}

// Golden particles
function GoldenParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: 'rgba(255, 215, 0, 0.8)',
            boxShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
          }}
          animate={{
            y: [0, -150, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

// Slow falling confetti
function SlowConfetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            background: i % 2 === 0 ? '#FFD700' : '#FFFFFF',
            opacity: 0.6,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Transition types
type TransitionType = 'kenBurns' | 'crossfade' | 'parallax' | 'glow' | 'confettiBurst'

// Photo slide component
interface PhotoSlideProps {
  image: string
  caption: string
  transition: TransitionType
  isActive: boolean
}

function PhotoSlide({ image, caption, transition, isActive }: PhotoSlideProps) {
  const getAnimationProps = () => {
    switch (transition) {
      case 'kenBurns':
        return {
          initial: { opacity: 0, scale: 1 } as const,
          animate: isActive ? { opacity: 1, scale: 1.1 } : { opacity: 0, scale: 1 },
          transition: { duration: 6, ease: "easeInOut" as const }
        }
      case 'crossfade':
        return {
          initial: { opacity: 0 } as const,
          animate: isActive ? { opacity: 1 } : { opacity: 0 },
          transition: { duration: 1.5 }
        }
      case 'parallax':
        return {
          initial: { opacity: 0, x: 100 } as const,
          animate: isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 },
          transition: { duration: 1.5, ease: "easeOut" as const }
        }
      case 'glow':
        return {
          initial: { opacity: 0 } as const,
          animate: isActive ? { opacity: 1 } : { opacity: 0 },
          transition: { duration: 1.2 }
        }
      default:
        return {
          initial: { opacity: 0 } as const,
          animate: isActive ? { opacity: 1 } : { opacity: 0 },
          transition: { duration: 1.5 }
        }
    }
  }

  return (
    <motion.div
      {...getAnimationProps()}
      className="absolute inset-0"
    >
      {/* Image */}
      <div className="relative w-full h-full">
        <Image
          src={image}
          alt={caption}
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Caption */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center px-8 w-full max-w-4xl"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white drop-shadow-lg"
            style={{
              textShadow: '0 0 30px rgba(255, 211, 106, 0.5), 0 2px 10px rgba(0,0,0,0.8)',
              fontFamily: 'Outfit, Montserrat, sans-serif'
            }}
          >
            {caption}
          </h2>
        </motion.div>
      )}

      {/* Glow transition effect */}
      {transition === 'glow' && isActive && (
        <motion.div
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: [0, 1, 0], x: '100%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 211, 106, 0.6) 50%, transparent 100%)',
            width: '50%',
          }}
        />
      )}
    </motion.div>
  )
}

// Main Waiting Screen
export default function WaitingPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentTransition, setCurrentTransition] = useState<TransitionType>('kenBurns')

  // Photo data - High quality corporate event photos
  const photos = [
    {
      image: "/gallery/waiting-1.jpg",
      caption: "Khoảnh khắc đáng nhớ của Code4Change Media ✨"
    },
    {
      image: "/gallery/waiting-2.jpg",
      caption: "Một năm rực rỡ, một hành trình tỏa sáng 💛"
    },
    {
      image: "/gallery/waiting-3.jpg",
      caption: "Together We Create. Together We Shine."
    },
    {
      image: "/gallery/waiting-4.jpg",
      caption: "Những khoảnh khắc tuyệt vời cùng nhau 🌟"
    },
    {
      image: "/gallery/waiting-5.jpg",
      caption: "Code4Change – Bứt phá cùng công nghệ & sáng tạo"
    },
    {
      image: "/gallery/waiting-6.jpg",
      caption: "Gắn kết - Sẻ chia - Cùng nhau tỏa sáng ✨"
    },
    {
      image: "/gallery/waiting-7.jpg",
      caption: "Bright4Event – Light up your event 🎭"
    },
    {
      image: "/gallery/waiting-8.jpg",
      caption: "Year End Party 2025 - GLOW UP 💫"
    },
    {
      image: "/gallery/waiting-9.jpg",
      caption: "Mỗi khoảnh khắc đều là một kỷ niệm đẹp 🎉"
    },
    {
      image: "/gallery/waiting-10.jpg",
      caption: "Together we shine – Cùng nhau tỏa sáng 🌟"
    },
  ]

  const transitions: TransitionType[] = ['kenBurns', 'crossfade', 'parallax', 'glow', 'confettiBurst']

  // Fire confetti
  const fireConfetti = (intensity: 'light' | 'heavy') => {
    if (intensity === 'heavy') {
      // Heavy confetti at start and end of loop
      const duration = 2000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.6 },
          colors: ['#FFD700', '#FFD36A', '#FFFFFF']
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.6 },
          colors: ['#FFD700', '#FFD36A', '#FFFFFF']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    } else {
      // Light confetti on regular transitions
      confetti({
        particleCount: 10,
        spread: 60,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#FFD700', '#FFFFFF'],
        ticks: 150
      })
    }
  }

  // Slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % photos.length

        // Fire heavy confetti at start and end of loop
        if (next === 0 || prev === 0) {
          fireConfetti('heavy')
        } else {
          // Light confetti on regular transitions
          fireConfetti('light')
        }

        // Rotate through transition types
        setCurrentTransition(transitions[next % transitions.length])

        return next
      })
    }, 6000) // 6 seconds per photo

    return () => clearInterval(interval)
  }, [])

  // Fire heavy confetti on first load
  useEffect(() => {
    setTimeout(() => {
      fireConfetti('heavy')
    }, 500)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#1E1A33] to-[#2A2440] overflow-hidden">
      {/* Background effects */}
      <LightRays />
      <FloatingBokeh />
      <GoldenParticles />
      <SlowConfetti />

      {/* Photo slideshow - 80% of screen */}
      <div className="relative h-[80vh]">
        {photos.map((photo, index) => (
          <PhotoSlide
            key={index}
            image={photo.image}
            caption={photo.caption}
            transition={index === currentSlide ? currentTransition : 'crossfade'}
            isActive={index === currentSlide}
          />
        ))}
      </div>

      {/* Bottom section - 20% */}
      <div className="relative h-[20vh] flex items-center justify-between px-12 bg-gradient-to-t from-[#0B0B0F] via-[#1E1A33]/80 to-transparent">
        {/* Left: Tagline */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="flex-1"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#FFD36A] italic"
            style={{
              textShadow: '0 0 20px rgba(255, 211, 106, 0.6)',
              fontFamily: 'Outfit, Montserrat, sans-serif'
            }}
          >
            "Chào đón những khoảnh khắc rực rỡ sắp tới..."
          </p>
        </motion.div>

        {/* Right: Bright4Event Logo */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 10px rgba(255, 211, 106, 0.6))',
                'drop-shadow(0 0 25px rgba(255, 211, 106, 0.9))',
                'drop-shadow(0 0 10px rgba(255, 211, 106, 0.6))',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-10 h-10 text-[#FFD36A]" />
          </motion.div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white"
              style={{
                textShadow: '0 0 15px rgba(255, 211, 106, 0.5)',
              }}
            >
              Bright4Event
            </div>
            <div className="text-sm text-[#FFD36A] italic">Light up your event</div>
          </div>
        </motion.div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {photos.map((_, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{
              background: index === currentSlide ? '#FFD700' : 'rgba(255, 255, 255, 0.3)',
            }}
            animate={{
              scale: index === currentSlide ? 1.5 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  )
}
