"use client"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LucideIcon } from "lucide-react"
import { COLORS } from "@/constants/colors"

interface AuthInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  icon?: LucideIcon
  disabled?: boolean
  delay?: number
}

export default function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled = false,
  delay = 0,
}: AuthInputProps) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <Label
        htmlFor={id}
        className="text-[#FAF3E0]/80 text-sm font-medium mb-2.5 flex items-center gap-2"
      >
        {Icon && <Icon className="h-4 w-4 text-[#FFD76A]" />}
        {label}
      </Label>
      <div className="relative group">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="bg-[#1a1a1a] border-[#FFD76A]/20 text-white h-12 rounded-xl transition-all duration-300 focus:border-[#FFD76A] focus:bg-[#1F1F1F] focus:shadow-[0_0_20px_rgba(255,215,106,0.15)]"
          placeholder={placeholder}
          disabled={disabled}
        />
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileFocus={{ opacity: 1 }}
          style={{
            boxShadow: '0 0 0 3px rgba(255, 215, 106, 0.1)',
          }}
        />
      </div>
    </motion.div>
  )
}
