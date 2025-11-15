import { Crown } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative border-t border-[#FDB931]/30 mt-16 bg-[#0B0B0B]">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FDB931] to-transparent opacity-50" />

      <div className="container px-4 py-12 md:py-16">
        {/* Main Footer Content - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Column 1: Sản phẩm */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FDB931]">
              Sản phẩm
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/about"
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm"
              >
                Giới thiệu
              </Link>
              <Link
                href="/pricing"
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm"
              >
                Bảng giá
              </Link>
              <Link
                href="/guide"
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm"
              >
                Hướng dẫn
              </Link>
              <Link
                href="/case-studies"
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm"
              >
                Tình huống sử dụng
              </Link>
            </nav>
          </div>

          {/* Column 2: Hỗ trợ */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FDB931]">
              Hỗ trợ
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/faq"
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm"
              >
                Câu hỏi thường gặp
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm"
              >
                Liên hệ
              </Link>
              <a
                href="mailto:code4change.co@gmail.com"
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm"
              >
                code4change.co@gmail.com
              </a>
              <a
                href="tel:+84901333434"
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm"
              >
                +84 901 333 434
              </a>
            </nav>
          </div>

          {/* Column 3: Pháp lý */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FDB931]">
              Pháp lý
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/policy"
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm"
              >
                Điều khoản sử dụng
              </Link>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#FDB931]/30 to-transparent mb-8" />

        {/* Bottom Section: Brand & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 group">
            <Crown className="h-5 w-5 text-[#FDB931] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-lg font-bold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFE68A] bg-clip-text text-transparent">
              Bright4Event
            </span>
          </div>

          <p className="text-sm text-gray-500 text-center md:text-right">
            © 2025 Bright4Event by Code4Change Technology Solution. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
