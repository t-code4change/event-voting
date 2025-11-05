import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Event Voting - Hệ thống Bình chọn Sự kiện",
  description: "Hệ thống bình chọn sự kiện hiện đại, minh bạch và dễ sử dụng",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable} ${inter.className}`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
