import React, { ButtonHTMLAttributes, ReactNode } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   * - primary: Main CTA, gradient yellow, black text
   * - secondary: Supporting action, light background, yellow text
   * - outline: Additional action, transparent bg, yellow border
   * - ghost: Minimal button, no border, light interaction
   * - vip: Premium/Enterprise CTA, enhanced gradient with glow
   */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "vip"

  /**
   * Button size
   * - large: 56px height, for hero CTAs
   * - medium: 44px height, standard buttons
   * - small: 36px height, compact buttons in forms/lists
   */
  size?: "large" | "medium" | "small"

  /**
   * Icon to display (left or right of text)
   */
  icon?: ReactNode

  /**
   * Icon position
   */
  iconPosition?: "left" | "right"

  /**
   * Loading state
   */
  loading?: boolean

  /**
   * Button content
   */
  children: ReactNode

  /**
   * Additional className
   */
  className?: string
}

const MyButton = React.forwardRef<HTMLButtonElement, MyButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      icon,
      iconPosition = "left",
      loading = false,
      disabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = "inline-flex flex-row items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] disabled:opacity-40 disabled:pointer-events-none relative overflow-hidden group"

    // Variant styles
    const variantStyles = {
      primary: "bg-gradient-to-r from-[#FFD166] to-[#FFB703] text-[#111] hover:brightness-110 shadow-lg hover:shadow-[0_0_20px_rgba(255,209,102,0.6)] active:scale-[0.98]",
      secondary: "bg-[#FFFFFF1A] border border-[#FFD16680] text-[#FFD166] hover:bg-[#FFD16620] hover:border-[#FFD166] active:scale-[0.98]",
      outline: "bg-transparent border-2 border-[#FFD166] text-white hover:bg-[#FFD16620] hover:border-[#FFB703] hover:shadow-[0_0_12px_rgba(255,209,102,0.4)] active:scale-[0.98]",
      ghost: "bg-transparent text-[#FFCB69] hover:text-[#FFD166] hover:bg-[#FFD16610] active:scale-[0.98]",
      vip: "bg-gradient-to-r from-[#FFD166] via-[#FFB703] to-[#FF9500] text-[#111] border-2 border-[#FFD166] hover:brightness-110 shadow-xl hover:shadow-[0_0_24px_rgba(255,209,102,0.8)] active:scale-[0.98]",
    }

    // Size styles
    const sizeStyles = {
      large: "h-10 px-8 text-lg",
      medium: "h-11 px-6 text-base",
      small: "h-9 px-4 text-sm",
    }

    // Combine styles
    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    )

    // Shimmer effect for primary and vip variants
    const showShimmer = (variant === "primary" || variant === "vip") && !disabled && !loading
      return (

    // @ts-ignore
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
        {...props}
      >
        {/* Shimmer effect */}
        {showShimmer && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Content */}
        <span className="relative flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : icon && iconPosition === "left" ? (
            icon
          ) : null}

          {children}

          {!loading && icon && iconPosition === "right" ? icon : null}
        </span>

        {/* Hover glow effect for primary/vip */}
        {(variant === "primary" || variant === "vip") && !disabled && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl bg-gradient-to-r from-[#FFD166]/50 to-[#FFB703]/50 -z-10" />
        )}
      </motion.button>
    )
  }
)

MyButton.displayName = "MyButton"

export default MyButton
