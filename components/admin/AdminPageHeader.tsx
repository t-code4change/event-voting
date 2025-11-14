import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminPageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: ReactNode
  className?: string
}

export function AdminPageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          {Icon && <Icon className="w-8 h-8 text-[#FFD700]" />}
          {title}
        </h1>
        {description && <p className="text-white/60 mt-2">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
