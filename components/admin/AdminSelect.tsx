import { SelectHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
  options: { value: string; label: string }[]
}

export function AdminSelect({ className, options, ...props }: AdminSelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full px-4 py-3 pr-10 rounded-xl bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-[#FFD700]/50",
          "[&>option]:bg-[#0C0F15] [&>option]:text-white",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
    </div>
  )
}
