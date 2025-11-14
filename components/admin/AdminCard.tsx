import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AdminCardProps {
  children: ReactNode
  className?: string
}

export function AdminCard({ children, className }: AdminCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6",
        className
      )}
    >
      {children}
    </div>
  )
}
