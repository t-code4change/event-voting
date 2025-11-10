"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import MyButton from "@/components/MyButton"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Settings,
  Trophy,
  Users,
  BarChart3,
  LogOut,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Sự kiện",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Danh mục",
    href: "/admin/categories",
    icon: Trophy,
  },
  {
    title: "Ứng viên",
    href: "/admin/candidates",
    icon: Users,
  },
  {
    title: "Kết quả",
    href: "/admin/results",
    icon: BarChart3,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      toast.success("Đã đăng xuất")
      router.push("/")
    } catch (error) {
      toast.error("Có lỗi khi đăng xuất")
    }
  }

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground">GalaVote</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <MyButton
                variant={isActive ? "primary" : "ghost"}
                size="medium"
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-primary-foreground"
                )}
                icon={<Icon className="h-5 w-5" />}
                iconPosition="left"
              >
                {item.title}
              </MyButton>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <MyButton
          variant="ghost"
          size="medium"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
          icon={<LogOut className="h-5 w-5" />}
          iconPosition="left"
        >
          Đăng xuất
        </MyButton>
      </div>
    </div>
  )
}
