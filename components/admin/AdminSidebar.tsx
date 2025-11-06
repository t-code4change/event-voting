"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  CreditCard,
  FileText,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserRole } from "@/types/subscription"

interface AdminSidebarProps {
  userRole: UserRole
}

export default function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      roles: ["admin", "super_admin"],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      roles: ["admin", "super_admin"],
    },
    {
      title: "Packages",
      icon: Package,
      href: "/admin/packages",
      roles: ["admin", "super_admin"],
    },
    {
      title: "Subscriptions",
      icon: CreditCard,
      href: "/admin/subscriptions-list",
      roles: ["admin", "super_admin"],
    },
    {
      title: "Invoices",
      icon: FileText,
      href: "/admin/invoices-list",
      roles: ["admin", "super_admin"],
    },
    {
      title: "Transactions",
      icon: DollarSign,
      href: "/admin/transactions",
      roles: ["admin", "super_admin"],
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users",
      roles: ["super_admin"],
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      roles: ["admin", "super_admin"],
    },
  ]

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  )

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1a1a1a] border-r border-[#FFD700]/20 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-[#FFD700]/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-gray-400 text-xs mt-1">{userRole}</p>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Home Link */}
        <Link href="/">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-[#FFD700]/10 ${
              isCollapsed ? "px-3" : ""
            }`}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Về Trang Chủ</span>}
          </Button>
        </Link>

        <div className="h-px bg-[#FFD700]/10 my-4" />

        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-gradient-to-r from-[#FFD700]/20 to-[#FF9E00]/10 text-[#FFD700] hover:from-[#FFD700]/30 hover:to-[#FF9E00]/20"
                    : "text-gray-400 hover:text-white hover:bg-[#FFD700]/10"
                } ${isCollapsed ? "px-3" : ""}`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#FFD700]/20">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 ${
            isCollapsed ? "px-3" : ""
          }`}
          onClick={() => {
            // TODO: Implement logout
            window.location.href = "/api/auth/logout"
          }}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Đăng Xuất</span>}
        </Button>
      </div>
    </motion.div>
  )
}
