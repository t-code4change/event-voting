import { Metadata } from "next"
import dynamic from "next/dynamic"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// ============================================
// METADATA (SEO OPTIMIZATION)
// ============================================

import { getMetadata } from "@/lib/seo"

export const metadata: Metadata = getMetadata({
  title: "Bright4Event - Nền tảng Tổ Chức Sự Kiện Thông Minh All-in-One",
  description: "Check-in QR Code thông minh, Bình chọn realtime, Màn hình LED 3D, Quay số may mắn, Livestream & Báo cáo analytics — Giải pháp toàn diện cho Year-end Party, Gala Dinner, Team Building. Được tin tưởng bởi 200+ sự kiện chuyên nghiệp.",
  keywords: [
    "Year-end Party",
    "Gala Dinner",
    "Team Building",
    "check-in QR code",
    "màn hình LED sự kiện",
    "bình chọn realtime",
    "mini game sự kiện",
    "lucky draw online",
    "quay số trúng thưởng",
  ],
  canonicalUrl: "https://bright4event.com",
})

// ============================================
// HOMEPAGE WRAPPER (Client Component for state management)
// ============================================

const HomePageWrapper = dynamic(() => import('./home/HomePageWrapper'), {
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
