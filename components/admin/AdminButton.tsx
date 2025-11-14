import { ReactNode } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminButtonProps {
  children?: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "icon"
  icon?: LucideIcon
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  icon: Icon,
  className,
  disabled = false,
  type = "button",
}: AdminButtonProps) {
  const baseClasses = "flex items-center gap-2 rounded-xl font-semibold transition-all"

  const variantClasses = {
    primary: "px-4 py-2 bg-[#FFD700] text-black hover:bg-[#FFC107]",
    secondary: "px-4 py-2 bg-white/10 text-white border border-white/20 hover:bg-white/20",
    icon: "p-2 bg-red-500 text-white hover:bg-red-600 rounded-lg",
  }

  if (variant === "icon") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(baseClasses, variantClasses.icon, disabled && "opacity-50 cursor-not-allowed", className)}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </button>
    )
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  )
}
