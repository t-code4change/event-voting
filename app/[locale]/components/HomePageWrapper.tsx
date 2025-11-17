"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamic imports for all sections with loading states
const Confetti = dynamic(() => import('./Confetti'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 pointer-events-none z-50" />
})

const HomeHero = dynamic(() => import('./HomeHero'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-black/70 via-black/60 to-[#0D0D1A]" />
  )
})

const EventSearchModal = dynamic(() => import('./EventSearchModal'), {
  ssr: false,
  loading: () => null
})

const ImpactStats = dynamic(() => import('./ImpactStats'), {
  loading: () => (
    <div className="py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
      <div className="h-96" />
    </div>
  )
})

const FeaturesGrid = dynamic(() => import('./FeaturesGrid'), {
  loading: () => (
    <div className="py-24">
      <div className="h-[800px]" />
    </div>
  )
})

const PlatformTimeline = dynamic(() => import('./PlatformTimeline'), {
  loading: () => (
    <div className="py-24 bg-gradient-to-b from-[#1a1a1a] to-[#0D0D1A]">
      <div className="h-96" />
    </div>
  )
})

const SloganHighlight = dynamic(() => import('./SloganHighlight'), {
  loading: () => (
    <div className="py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
      <div className="h-80" />
    </div>
  )
})

const Testimonials = dynamic(() => import('./Testimonials'), {
  loading: () => (
    <div className="py-24 bg-gradient-to-b from-[#1a1a1a] to-[#0D0D1A]">
      <div className="h-96" />
    </div>
  )
})

const FinalCTA = dynamic(() => import('./FinalCTA'), {
  loading: () => (
    <div className="py-32">
      <div className="h-96" />
    </div>
  )
})

export default function HomePageWrapper() {
  const [showEventSearch, setShowEventSearch] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Trigger confetti on page load
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleShowConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <>
      <Confetti show={showConfetti} />

      <HomeHero
        onShowEventSearch={() => setShowEventSearch(true)}
        onShowConfetti={handleShowConfetti}
      />

      <EventSearchModal
        show={showEventSearch}
        onClose={() => setShowEventSearch(false)}
      />

      <ImpactStats />

      <FeaturesGrid />

      <PlatformTimeline />

      <SloganHighlight />

      <Testimonials />

      <FinalCTA onShowConfetti={handleShowConfetti} />
    </>
  )
}
