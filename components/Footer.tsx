import { Crown } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative border-t border-[#FDB931]/30 mt-16 bg-[#0B0B0B]">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FDB931] to-transparent opacity-50" />

      <div className="container px-4 py-12">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 group">
            <Crown className="h-6 w-6 text-[#FDB931] group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFE68A] bg-clip-text text-transparent">
              Bright4Event
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-base text-gray-400 font-medium">
              © 2025 Bright4Event by Code4Change Technology Solution
            </p>
            <p className="text-base text-gray-500">
              Email: <a href="mailto:code4change.co@gmail.com" className="hover:text-[#FDB931] transition-colors">code4change.co@gmail.com</a>
            </p>
            <p className="text-base text-gray-500">
              Hotline: <a href="tel:+84901333434" className="hover:text-[#FDB931] transition-colors">+84 901 333 434</a>
            </p>
          </div>

          <div className="max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-[#FDB931]/30 to-transparent" />
        </div>
      </div>
    </footer>
  )
}
