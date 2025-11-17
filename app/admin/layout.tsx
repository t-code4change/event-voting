"use client"

import "../globals.css"
import { Toaster } from "@/components/ui/toaster"
import ReduxProvider from "@/components/ReduxProvider"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  )
}
