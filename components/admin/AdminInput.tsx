import { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function AdminInput({ className, ...props }: AdminInputProps) {
  return (
    <input
      className={cn(
        "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50",
        className
      )}
      {...props}
    />
  )
}
