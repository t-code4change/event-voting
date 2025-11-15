"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamic imports for all sections
const Confetti = dynamic(() => import('./Confetti'))
const HomeHero = dynamic(() => import('./HomeHero'))
const EventSearchModal = dynamic(() => import('./EventSearchModal'))
const ImpactStats = dynamic(() => import('./ImpactStats'))
const FeaturesGrid = dynamic(() => import('./FeaturesGrid'))
const PlatformTimeline = dynamic(() => import('./PlatformTimeline'))
const SloganHighlight = dynamic(() => import('./SloganHighlight'))
const Testimonials = dynamic(() => import('./Testimonials'))
const FinalCTA = dynamic(() => import('./FinalCTA'))

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
