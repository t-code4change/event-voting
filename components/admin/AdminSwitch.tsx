import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AdminSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

export function AdminSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: AdminSwitchProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:ring-offset-2 focus:ring-offset-[#0C0F15]",
          checked ? "bg-[#FFD700]" : "bg-white/20",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "inline-block h-4 w-4 transform rounded-full shadow-lg transition-transform",
            checked ? "translate-x-6 bg-black" : "translate-x-1 bg-white"
          )}
        />
      </button>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <p className="text-sm font-medium text-white">{label}</p>
          )}
          {description && (
            <p className="text-sm text-white/60 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}
