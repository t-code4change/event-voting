import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface AdminLoadingProps {
  /**
   * Variant of loading display
   * - full: Full page centered loading
   * - card: Loading inside a card container
   * - inline: Small inline spinner
   */
  variant?: "full" | "card" | "inline"
  /**
   * Custom message to display below spinner
   */
  message?: string
  /**
   * Size of the spinner icon
   * - sm: 16px (w-4 h-4)
   * - md: 32px (w-8 h-8) - default
   * - lg: 48px (w-12 h-12)
   */
  size?: "sm" | "md" | "lg"
}

export function AdminLoading({
  variant = "card",
  message = "Đang tải...",
  size = "md"
}: AdminLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  }

  const iconClass = `${sizeClasses[size]} animate-spin text-[#FFD700]`

  // Inline variant - just a small spinner
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className={iconClass} strokeWidth={2} />
        {message && <span className="text-sm text-white/60">{message}</span>}
      </div>
    )
  }

  // Card variant - loading inside a card
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-12 text-center"
      >
        <Loader2 className={`${iconClass} mx-auto mb-4`} strokeWidth={2} />
        <p className="text-white/60">{message}</p>
      </motion.div>
    )
  }

  // Full variant - full page centered loading
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C0F15]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="text-center"
      >
        <Loader2 className={`${iconClass} mx-auto mb-4`} strokeWidth={2} />
        <p className="text-white/60">{message}</p>
      </motion.div>
    </div>
  )
}

/**
 * Empty state component for admin pages
 */
interface AdminEmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action
}: AdminEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-12 text-center space-y-6"
    >
      {Icon && <Icon className="w-12 h-12 text-[#FFD700] mx-auto opacity-50" />}

      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-white/60">
            {description}
          </p>
        )}
      </div>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107] transition-all mx-auto"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
