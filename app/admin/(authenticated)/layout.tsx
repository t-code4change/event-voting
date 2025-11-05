import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/auth"
import AdminSidebar from "@/components/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication
  if (!isAdminAuthenticated()) {
    redirect("/admin/login")
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
