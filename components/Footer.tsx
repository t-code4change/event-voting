"use client"

import Link from "next/link"
import { useAppDispatch } from "@/store/hooks"
import { openLoginModal, openRegisterModal } from "@/store/slices/modalSlice"
import BrandLogo from "@/components/BrandLogo"

export default function Footer() {
  const dispatch = useAppDispatch()

  return (
    <footer className="relative border-t border-[#FDB931]/30 bg-[#0B0B0B]">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FDB931] to-transparent opacity-50" />

      <div className="container px-4 pt-12 pb-8 md:pt-16">
        {/* Main Footer Content - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Column 1: Sản phẩm */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold uppercase tracking-wider text-[#FDB931]">
              Sản phẩm
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/about"
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                Giới thiệu
              </Link>
              <Link
                href="/pricing"
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                Bảng giá
              </Link>
              <Link
                href="/guide"
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                Hướng dẫn
              </Link>
              <Link
                href="/case-studies"
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                Tình huống sử dụng
              </Link>
            </nav>
          </div>

          {/* Column 2: Hỗ trợ */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold uppercase tracking-wider text-[#FDB931]">
              Hỗ trợ
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/faq"
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                Câu hỏi thường gặp
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                Liên hệ
              </Link>
              <a
                href="mailto:code4change.co@gmail.com"
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                code4change.co@gmail.com
              </a>
              <a
                href="tel:+84901333434"
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                +84 901 333 434
              </a>
            </nav>
          </div>

          {/* Column 3: Pháp lý & Tài khoản */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold uppercase tracking-wider text-[#FDB931]">
              Pháp lý & Tài khoản
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/policy"
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                Điều khoản sử dụng
              </Link>
              <button
                onClick={() => dispatch(openRegisterModal())}
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm text-left"
              >
                Đăng ký
              </button>
              <button
                onClick={() => dispatch(openLoginModal({ postLoginAction: 'dashboard', redirectPath: '/admin/dashboard' }))}
                className="text-gray-400 hover:text-[#FDB931] transition-colors text-sm text-left"
              >
                Đăng nhập
              </button>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#FDB931]/30 to-transparent mb-8" />

        {/* Bottom Section: Brand & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <BrandLogo size="medium" showTagline={false} />

          <p className="text-sm text-gray-400/90 text-center md:text-right">
            © 2025 Bright4Event by Code4Change Technology Solution. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
