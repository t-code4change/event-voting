import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "GalaVote - Hệ thống Bình chọn Sự kiện",
  description: "Hệ thống bình chọn sự kiện hiện đại, minh bạch và dễ sử dụng",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${playfair.variable} font-sans`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}
