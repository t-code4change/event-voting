import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSectionHeaderProps {
  title: string
  icon?: LucideIcon
  className?: string
}

export function AdminSectionHeader({
  title,
  icon: Icon,
  className,
}: AdminSectionHeaderProps) {
  return (
    <h2 className={cn("text-lg font-bold text-white flex items-center gap-2 mb-4", className)}>
      {Icon && <Icon className="w-5 h-5 text-[#FFD700]" />}
      {title}
    </h2>
  )
}
