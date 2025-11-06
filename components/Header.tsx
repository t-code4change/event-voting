import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Crown, BarChart3, Settings, DollarSign } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#FFD700]/20 bg-[#0B0B0B]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0B0B]/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <Crown className="h-6 w-6 text-[#FFD700] group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FDB931] bg-clip-text text-transparent">
            Event Voting
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            asChild
            className="hidden md:flex text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10"
          >
            <Link href="/pricing">
              <DollarSign className="mr-2 h-4 w-4" />
              Bảng giá
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="hidden sm:flex text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10"
          >
            <Link href="/results">
              <BarChart3 className="mr-2 h-4 w-4" />
              Kết quả
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="sm:hidden text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10"
          >
            <Link href="/results">
              <BarChart3 className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10"
          >
            <Link href="/admin/dashboard">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
