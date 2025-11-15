import { LabelHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface AdminLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
  required?: boolean
}

export function AdminLabel({ className, required, children, ...props }: AdminLabelProps) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-white/80 mb-2",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}
