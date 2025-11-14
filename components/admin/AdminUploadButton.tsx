import { ReactNode } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminUploadButtonProps {
  children: ReactNode
  onClick?: () => void
  icon?: LucideIcon
  className?: string
}

export function AdminUploadButton({
  children,
  onClick,
  icon: Icon,
  className,
}: AdminUploadButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-white/20 text-white/60 hover:border-[#FFD700]/50 hover:text-white transition-all",
        className
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  )
}
