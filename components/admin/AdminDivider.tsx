import { cn } from "@/lib/utils"

interface AdminDividerProps {
  className?: string
  label?: string
}

export function AdminDivider({ className, label }: AdminDividerProps) {
  if (label) {
    return (
      <div className={cn("relative my-6", className)}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#0C0F15] px-4 text-sm text-white/60">{label}</span>
        </div>
      </div>
    )
  }

  return <div className={cn("border-t border-white/20 my-6", className)} />
}
