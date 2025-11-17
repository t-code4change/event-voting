import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { FileText, CheckCircle2, XCircle, AlertTriangle, Scale } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | Bright4Event",
  description: "Điều khoản và điều kiện sử dụng nền tảng Bright4Event - Quyền và trách nhiệm của người dùng",
  keywords: ["điều khoản sử dụng", "terms of service", "quy định sử dụng", "điều kiện dịch vụ"],
}

export default async function TermsOfServicePage() {
  const t = await getTranslations('Terms')
  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#FDB931]/10 border border-[#FFD700]/30 mb-6">
            <Scale className="w-8 h-8 text-[#FFD700]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-gray-400">
            {t('hero.lastUpdated')}: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section 1 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.acceptance.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                {t('sections.acceptance.description')}
              </p>
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4">
                <p className="text-sm">
                  <strong className="text-[#FFD700]">{t('sections.acceptance.note')}</strong> {t('sections.acceptance.effective')}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.userRights.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>{t('sections.userRights.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {(t.raw('sections.userRights.items') as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.userResponsibilities.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>{t('sections.userResponsibilities.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  {t.rich('sections.userResponsibilities.accuracy.title', {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>
                  })}{' '}
                  {t('sections.userResponsibilities.accuracy.description')}
                </li>
                <li>
                  {t.rich('sections.userResponsibilities.security.title', {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>
                  })}{' '}
                  {t('sections.userResponsibilities.security.description')}
                </li>
                <li>
                  {t.rich('sections.userResponsibilities.compliance.title', {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>
                  })}{' '}
                  {t('sections.userResponsibilities.compliance.description')}
                </li>
                <li>
                  {t.rich('sections.userResponsibilities.content.title', {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>
                  })}{' '}
                  {t('sections.userResponsibilities.content.description')}
                </li>
                <li>
                  {t.rich('sections.userResponsibilities.payment.title', {
                    strong: (chunks) => <strong className="text-white">{chunks}</strong>
                  })}{' '}
                  {t('sections.userResponsibilities.payment.description')}
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.prohibited.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>{t('sections.prohibited.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {(t.raw('sections.prohibited.items') as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
                <p className="text-sm text-red-400">
                  <strong>{t('sections.prohibited.consequence')}</strong> {t('sections.prohibited.warning')}
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.intellectual.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                {t.rich('sections.intellectual.description', {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>
                })}
              </p>
              <div className="space-y-2">
                <p className="text-white font-semibold">{t('sections.intellectual.userContent')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {(t.raw('sections.intellectual.items') as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.payment.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <p className="text-white font-semibold mb-2">{t('sections.payment.plans.title')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    {t.rich('sections.payment.plans.free', {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>
                    })}
                  </li>
                  <li>
                    {t.rich('sections.payment.plans.standard', {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>
                    })}
                  </li>
                  <li>
                    {t.rich('sections.payment.plans.enterprise', {
                      strong: (chunks) => <strong className="text-white">{chunks}</strong>
                    })}
                  </li>
                </ul>
              </div>
              <div className="mt-4">
                <p className="text-white font-semibold mb-2">{t('sections.payment.refund.title')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {(t.raw('sections.payment.refund.items') as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.liability.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                {t('sections.liability.intro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {(t.raw('sections.liability.items') as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4 mt-4">
                <p className="text-sm">
                  <strong className="text-[#FFD700]">{t('sections.liability.commitment')}</strong> {t('sections.liability.uptime')}
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.termination.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>{t('sections.termination.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {(t.raw('sections.termination.items') as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="mt-4">
                {t.rich('sections.termination.userRight', {
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>
                })}{' '}
                {t('sections.termination.cancel')}
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.law.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                {t('sections.law.description')}
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.contact.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                {t('sections.contact.intro')}
              </p>
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-6 space-y-2">
                <p className="text-white">
                  <strong>{t('sections.contact.company')}</strong>
                </p>
                <p>{t('sections.contact.email')}</p>
                <p>{t('sections.contact.phone')}</p>
                <p>{t('sections.contact.website')}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Acceptance Notice */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FDB931]/10 border-2 border-[#FFD700]/50 rounded-2xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
            <p className="text-white text-lg">
              {t('sections.acceptance_notice')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
