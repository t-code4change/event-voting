"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"
import AdminSidebar from "@/components/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

    console.log('isAuthenticated', isAuthenticated)
  useEffect(() => {
    // Wait for auth state to load
    if (loading) return

    // If not authenticated, redirect to home and open login modal
    // if (!isAuthenticated) {
    //   router.push("/?action=login")
    //   dispatch(openLoginModal({
    //     postLoginAction: 'dashboard',
    //     redirectPath: '/admin/dashboard'
    //   }))
    // }
  }, [isAuthenticated, loading, router, dispatch])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFD700] border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden md:block">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container p-6 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
