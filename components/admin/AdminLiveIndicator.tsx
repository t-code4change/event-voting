import { cn } from "@/lib/utils"

interface AdminLiveIndicatorProps {
  text?: string
  className?: string
}

export function AdminLiveIndicator({ text = "Live", className }: AdminLiveIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10", className)}>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-xs text-white/60">{text}</span>
    </div>
  )
}
