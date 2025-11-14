import { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface AdminRangeSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  className?: string
}

export function AdminRangeSlider({ className, ...props }: AdminRangeSliderProps) {
  return (
    <input
      type="range"
      className={cn(
        "w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer",
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFD700]",
        "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FFD700] [&::-moz-range-thumb]:border-0",
        className
      )}
      {...props}
    />
  )
}
