import { TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export function AdminTextarea({ className, ...props }: AdminTextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 resize-none",
        className
      )}
      {...props}
    />
  )
}
