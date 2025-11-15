import { Metadata } from "next"
import dynamic from "next/dynamic"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// ============================================
// DYNAMIC IMPORTS WITH LOADING STATES
// ============================================

const Confetti = dynamic(() => import('./components/Confetti'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 pointer-events-none z-50" />
})

const HomeHero = dynamic(() => import('./components/HomeHero'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-black/70 via-black/60 to-[#0D0D1A]" />
  )
})

const EventSearchModal = dynamic(() => import('./components/EventSearchModal'), {
  ssr: false,
  loading: () => null
})

const ImpactStats = dynamic(() => import('./components/ImpactStats'), {
  loading: () => (
    <div className="py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
      <div className="h-96" />
    </div>
  )
})

const FeaturesGrid = dynamic(() => import('./components/FeaturesGrid'), {
  loading: () => (
    <div className="py-24">
      <div className="h-[800px]" />
    </div>
  )
})

const PlatformTimeline = dynamic(() => import('./components/PlatformTimeline'), {
  loading: () => (
    <div className="py-24 bg-gradient-to-b from-[#1a1a1a] to-[#0D0D1A]">
      <div className="h-96" />
    </div>
  )
})

const SloganHighlight = dynamic(() => import('./components/SloganHighlight'), {
  loading: () => (
    <div className="py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
      <div className="h-80" />
    </div>
  )
})

const Testimonials = dynamic(() => import('./components/Testimonials'), {
  loading: () => (
    <div className="py-24 bg-gradient-to-b from-[#1a1a1a] to-[#0D0D1A]">
      <div className="h-96" />
    </div>
  )
})

const FinalCTA = dynamic(() => import('./components/FinalCTA'), {
  loading: () => (
    <div className="py-32">
      <div className="h-96" />
    </div>
  )
})

// ============================================
// METADATA (SEO OPTIMIZATION)
// ============================================

export const metadata: Metadata = {
  title: "Bright4Event - Nền tảng tổ chức sự kiện thông minh All-in-One",
  description: "Check-in, Màn hình chào mừng, Bình chọn, Quay số, Livestream & Báo cáo realtime — tất cả trong một nền tảng duy nhất. Được tin tưởng bởi hàng trăm sự kiện chuyên nghiệp.",
  keywords: ["sự kiện", "event management", "check-in", "voting", "lucky draw", "livestream", "analytics", "Bright4Event"],
  openGraph: {
    title: "Bright4Event - Nền tảng tổ chức sự kiện thông minh",
    description: "Giải pháp toàn diện cho mọi sự kiện - từ check-in đến analytics",
    type: "website",
  },
}

// ============================================
// HOMEPAGE WRAPPER (Client Component for state management)
// ============================================

const HomePageWrapper = dynamic(() => import('./components/HomePageWrapper'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0D0D1A]">
      <div className="h-screen" />
    </div>
  )
})

// ============================================
// MAIN PAGE COMPONENT (Server Component)
// ============================================

export default function Bright4EventPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] overflow-hidden">
      <Header />

      <HomePageWrapper />

      <Footer />
    </div>
  )
}
