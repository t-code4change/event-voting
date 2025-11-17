import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Shield, Lock, Eye, FileText, Mail, Database } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Bright4Event",
  description: "Chính sách bảo mật dữ liệu và quyền riêng tư của người dùng trên nền tảng Bright4Event",
  keywords: ["chính sách bảo mật", "privacy policy", "bảo mật dữ liệu", "quyền riêng tư"],
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('Policy')
  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#FDB931]/10 border border-[#FFD700]/30 mb-6">
            <Shield className="w-8 h-8 text-[#FFD700]" />
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
              <Eye className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.collection.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                {t('sections.collection.intro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">{t('sections.collection.personal.title')}</strong> {t('sections.collection.personal.description')}
                </li>
                <li>
                  <strong className="text-white">{t('sections.collection.event.title')}</strong> {t('sections.collection.event.description')}
                </li>
                <li>
                  <strong className="text-white">{t('sections.collection.technical.title')}</strong> {t('sections.collection.technical.description')}
                </li>
                <li>
                  <strong className="text-white">{t('sections.collection.cookie.title')}</strong> {t('sections.collection.cookie.description')}
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.usage.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>{t('sections.usage.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {(t.raw('sections.usage.items') as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="mt-4">
                <strong className="text-white">{t('sections.usage.commitment')}</strong> <span className="text-[#FFD700]">{t('sections.usage.noSell')}</span>
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.security.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                {t('sections.security.intro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {Object.entries(t.raw('sections.security.measures') as Record<string, {title: string, description: string}>).map(([key, measure]) => (
                  <li key={key}>
                    <strong className="text-white">{measure.title}:</strong> {measure.description}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.sharing.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                {t('sections.sharing.intro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {Object.entries(t.raw('sections.sharing') as Record<string, any>).filter(([key]) => !['title', 'intro'].includes(key)).map(([key, case_]) => (
                  <li key={key}>
                    <strong className="text-white">{case_.title}</strong> {case_.description}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.rights.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>{t('sections.rights.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {Object.entries(t.raw('sections.rights') as Record<string, any>).filter(([key]) => !['title', 'intro'].includes(key)).map(([key, right]) => (
                  <li key={key}>
                    <strong className="text-white">{right.title}:</strong> {right.description}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-[#FFD700]" />
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

          {/* Section 7 */}
          <section className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">{t('sections.changes.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                {t('sections.changes.description')}
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
