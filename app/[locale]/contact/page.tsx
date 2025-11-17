import dynamic from 'next/dynamic'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Dynamic imports for client home to optimize bundle size
// Loading prop prevents layout shift during component load
const ContactHero = dynamic(() => import('./components/ContactHero'), {
  loading: () => <div className="h-[500px] bg-gradient-to-br from-[#4338CA] via-[#6D28D9] to-[#0EA5E9]" />,
})

const FeatureSection = dynamic(() => import('./components/FeatureSection'), {
  loading: () => <div className="h-[400px] bg-[#0B0B0B]" />,
})

const ContactInfoCards = dynamic(() => import('./components/ContactInfoCards'), {
  loading: () => <div className="h-[400px] bg-gradient-to-b from-white via-gray-50 to-white" />,
})

const ContactForm = dynamic(() => import('./components/ContactForm'), {
  loading: () => <div className="h-[600px] bg-gradient-to-b from-gray-50 to-white" />,
})

const ClosingCTA = dynamic(() => import('./components/ClosingCTA'), {
  loading: () => <div className="h-[500px] bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e3a8a]" />,
})

// SEO Metadata with translations
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Contact.seo')

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
    },
  }
}

/**
 * Contact Page - Server Component
 *
 * This is a Server Component that orchestrates the contact page layout.
 * All interactive home are dynamically imported as Client Components.
 *
 * Benefits:
 * - Faster initial page load (smaller JS bundle)
 * - Better SEO (server-rendered metadata)
 * - Optimized rendering (only client home have hydration overhead)
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B]">
      <Header />

      {/* Hero Section */}
      <ContactHero />

      {/* Feature Section */}
      <FeatureSection />

      {/* Contact Information Cards */}
      <ContactInfoCards />

      {/* Contact Form Section */}
      <section
        id="contact-form"
        className="relative py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-40 right-0 w-[350px] h-[350px] bg-blue-200/30 rounded-full blur-[120px]" />

        <div className="container px-4 relative z-10">
          <div className="mx-auto max-w-[650px]">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <ClosingCTA />

      <Footer />
    </div>
  )
}
