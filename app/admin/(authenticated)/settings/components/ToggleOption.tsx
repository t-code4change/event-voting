"use client"

import { motion } from "framer-motion"

interface ToggleOptionProps {
  label: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
}

export function ToggleOption({
  label,
  description,
  enabled,
  onChange,
  disabled = false
}: ToggleOptionProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 border border-white/20">
      <div className="flex-1">
        <p className="text-base font-semibold text-white/85">
          {label}
        </p>
        <p className="text-sm text-white/60">
          {description}
        </p>
      </div>
      <div
        onClick={() => !disabled && onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-all ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
        style={{
          background: enabled ? '#FFD700' : 'rgba(255,255,255,0.1)',
        }}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 0 }}
          className="absolute top-1 left-1 w-4 h-4 rounded-full"
          style={{
            background: enabled ? '#000' : 'rgba(255,255,255,0.4)',
          }}
        />
      </div>
    </div>
  )
}
