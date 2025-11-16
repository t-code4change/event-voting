"use client"

import { motion } from "framer-motion"
import { Crown } from "lucide-react"

interface BrandLogoProps {
  size?: "small" | "medium" | "large"
  showTagline?: boolean
  animated?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

/**
 * Shared Brand Logo Component for Header and Footer
 * Ensures consistent branding across the application
 */
export default function BrandLogo({
  size = "medium",
  showTagline = true,
  animated = false,
  onClick,
  className = "",
}: BrandLogoProps) {
  // Size configurations following DESIGN_SYSTEM.md
  const sizeConfig = {
    small: {
      crown: "w-7 h-7",
      text: "text-lg", // 18px
      tagline: "text-[10px]",
      gap: "gap-2.5",
    },
    medium: {
      crown: "w-9 h-9",
      text: "text-xl", // 20px
      tagline: "text-xs",
      gap: "gap-3",
    },
    large: {
      crown: "w-10 h-10",
      text: "text-2xl", // 24px
      tagline: "text-xs",
      gap: "gap-4",
    },
  }

  const config = sizeConfig[size]

  const CrownIcon = animated ? (
    <motion.div
      animate={{
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <Crown
        className={`${config.crown} text-[#FFD700]`}
        style={{ filter: "drop-shadow(0 0 20px rgba(255,215,0,0.8))" }}
      />
    </motion.div>
  ) : (
    <Crown
      className={`${config.crown} text-[#FFD700]`}
      style={{ filter: "drop-shadow(0 0 15px rgba(255,215,0,0.6))" }}
    />
  )

  return (
    <div
      className={`flex items-center ${config.gap} ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {CrownIcon}
      <div className="flex flex-col">
        <h1
          className={`${config.text} font-bold leading-tight bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFD700] bg-clip-text text-transparent`}
          style={{
            fontFamily: "Playfair Display, serif",
            textShadow: "0 0 30px rgba(255,215,0,0.5)",
            letterSpacing: "0.02em",
            fontWeight: 700,
          }}
        >
          Bright4Event
        </h1>
        {showTagline && (
          <p className={`${config.tagline} text-[#FFD700]/80 tracking-wider uppercase leading-tight`}>
            All-in-One for Event
          </p>
        )}
      </div>
    </div>
  )
}
