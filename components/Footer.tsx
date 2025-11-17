"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
import { useAppDispatch } from "@/store/hooks"
import { openLoginModal, openRegisterModal } from "@/store/slices/modalSlice"
import BrandLogo from "@/components/BrandLogo"
import { ROUTES } from "@/constants/routes"

export default function Footer() {
  const t = useTranslations('Footer')
  const dispatch = useAppDispatch()

  return (
    <footer className="relative border-t border-[#FDB931]/30 mt-16 bg-[#0B0B0B]">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FDB931] to-transparent opacity-50" />

      <div className="container px-4 py-12 md:py-16">
        {/* Main Footer Content - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Column 1: Product */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold uppercase tracking-wider text-[#FDB931]">
              {t('product.title')}
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href={ROUTES.ABOUT}
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                {t('product.about')}
              </Link>
              <Link
                href={ROUTES.PRICING}
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                {t('product.pricing')}
              </Link>
              <Link
                href={ROUTES.GUIDE}
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                {t('product.guide')}
              </Link>
              <Link
                href={ROUTES.CASE_STUDIES}
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                {t('product.caseStudies')}
              </Link>
            </nav>
          </div>

          {/* Column 2: Support */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold uppercase tracking-wider text-[#FDB931]">
              {t('support.title')}
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href={ROUTES.FAQ}
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                {t('support.faq')}
              </Link>
              <Link
                href={ROUTES.CONTACT}
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                {t('support.contact')}
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

          {/* Column 3: Legal & Account */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold uppercase tracking-wider text-[#FDB931]">
              {t('legal.title')}
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href={ROUTES.POLICY}
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                {t('legal.privacy')}
              </Link>
              <Link
                href={ROUTES.TERMS}
                className="text-gray-400 hover:text-[#FDB931] transition-all duration-200 hover:translate-x-1 text-[15px] leading-relaxed"
              >
                {t('legal.terms')}
              </Link>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#FDB931]/30 to-transparent mb-8" />

        {/* Bottom Section: Brand & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <BrandLogo size="medium" showTagline={false} />

          <p className="text-sm text-gray-400/90 text-center md:text-right">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
