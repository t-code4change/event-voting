'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { HelpCircle, Plus, Minus, Sparkles, MessageCircle, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function FAQPage() {
  const t = useTranslations('FAQ')

  // Build FAQ data from translations
  const faqData = [
    {
      icon: '🎯',
      title: t('categories.overview.title'),
      questions: [
        { question: t('categories.overview.questions.whatIs.q'), answer: t('categories.overview.questions.whatIs.a') },
        { question: t('categories.overview.questions.eventTypes.q'), answer: t('categories.overview.questions.eventTypes.a') },
        { question: t('categories.overview.questions.difference.q'), answer: t('categories.overview.questions.difference.a') },
      ]
    },
    {
      icon: '⚙️',
      title: t('categories.management.title'),
      questions: [
        { question: t('categories.management.questions.createEvent.q'), answer: t('categories.management.questions.createEvent.a') },
        { question: t('categories.management.questions.editEvent.q'), answer: t('categories.management.questions.editEvent.a') },
        { question: t('categories.management.questions.addAwards.q'), answer: t('categories.management.questions.addAwards.a') },
        { question: t('categories.management.questions.voteLimit.q'), answer: t('categories.management.questions.voteLimit.a') },
      ]
    },
    {
      icon: '💳',
      title: t('categories.payment.title'),
      questions: [
        { question: t('categories.payment.questions.plans.q'), answer: t('categories.payment.questions.plans.a') },
        { question: t('categories.payment.questions.invoice.q'), answer: t('categories.payment.questions.invoice.a') },
        { question: t('categories.payment.questions.refund.q'), answer: t('categories.payment.questions.refund.a') },
        { question: t('categories.payment.questions.trial.q'), answer: t('categories.payment.questions.trial.a') },
      ]
    },
    {
      icon: '🛠️',
      title: t('categories.technical.title'),
      questions: [
        { question: t('categories.technical.questions.ledDisplay.q'), answer: t('categories.technical.questions.ledDisplay.a') },
        { question: t('categories.technical.questions.connectionError.q'), answer: t('categories.technical.questions.connectionError.a') },
        { question: t('categories.technical.questions.support247.q'), answer: t('categories.technical.questions.support247.a') },
        { question: t('categories.technical.questions.api.q'), answer: t('categories.technical.questions.api.a') },
        { question: t('categories.technical.questions.security.q'), answer: t('categories.technical.questions.security.a') },
      ]
    }
  ]
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FDB931', '#FFA500']
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA] relative overflow-hidden">
      <Header />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] opacity-50" />

      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="inline-block mb-6"
            >
              <HelpCircle className="w-16 h-16 text-[#FFD700]" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-[#AAAAAA] mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </motion.div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {faqData.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{category.icon}</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700]">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((item, itemIndex) => {
                    const itemId = `${categoryIndex}-${itemIndex}`
                    const isOpen = openItems.includes(itemId)

                    return (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                        className="bg-[#111] border border-[#FFD700]/20 rounded-2xl overflow-hidden hover:border-[#FFD700]/50 transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#FFD700]/5 transition-colors"
                        >
                          <span className="text-lg font-semibold text-[#EAEAEA] pr-4">
                            {item.question}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                          >
                            {isOpen ? (
                              <Minus className="w-6 h-6 text-[#FFD700]" />
                            ) : (
                              <Plus className="w-6 h-6 text-[#FFD700]" />
                            )}
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-5 text-[#AAAAAA] leading-relaxed border-t border-[#FFD700]/10 pt-4">
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-[#0A0A0A]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#FDB931]/10 border border-[#FFD700]/30 rounded-3xl p-8 md:p-12 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="inline-block mb-6"
              >
                <MessageCircle className="w-16 h-16 text-[#FFD700]" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FFD700]">
                {t('support.title')}
              </h2>
              <p className="text-lg text-[#AAAAAA] mb-8 max-w-2xl mx-auto">
                {t('support.subtitle')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.a
                  href="tel:+84987654321"
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center gap-3 p-4 bg-[#111] border border-[#FFD700]/30 rounded-xl hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all"
                >
                  <Phone className="w-8 h-8 text-[#FFD700]" />
                  <div>
                    <div className="text-sm text-[#AAAAAA]">Hotline</div>
                    <div className="text-[#EAEAEA] font-semibold">(+84) 901 333 434</div>
                  </div>
                </motion.a>

                <motion.a
                  href="mailto:code4change.co@gmail.com"
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center gap-3 p-4 bg-[#111] border border-[#FFD700]/30 rounded-xl hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all"
                >
                  <Mail className="w-8 h-8 text-[#FFD700]" />
                  <div>
                    <div className="text-sm text-[#AAAAAA]">Email</div>
                    <div className="text-[#EAEAEA] font-semibold">code4change.co@gmail.com</div>
                  </div>
                </motion.a>

                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center gap-3 p-4 bg-[#111] border border-[#FFD700]/30 rounded-xl hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all"
                >
                  <MessageCircle className="w-8 h-8 text-[#FFD700]" />
                  <div>
                    <div className="text-sm text-[#AAAAAA]">Live Chat</div>
                    <div className="text-[#EAEAEA] font-semibold">{t('support.liveChat')}</div>
                  </div>
                </motion.a>
              </div>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0A0A0A] font-bold rounded-full hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300"
                >
                  {t('support.cta')}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-[#FDB931]/10 to-[#FFD700]/10 blur-3xl -z-10" />

            <h2 className="text-4xl !leading-[1.2] md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
              {t('final.title')}
            </h2>
            <p className="text-lg text-[#AAAAAA] mb-12 max-w-2xl mx-auto">
              {t('final.subtitle')}
            </p>

            <motion.button
              onClick={fireConfetti}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0A0A0A] text-xl font-bold rounded-full hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 inline-flex items-center gap-3"
            >
              <Sparkles className="w-6 w-6" />
              <span>{t('final.button')}</span>
            </motion.button>

            {/* Floating elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    left: `${10 + i * 8}%`,
                    top: '50%',
                  }}
                  animate={{
                    y: [-20, -40, -20],
                    rotate: [0, 10, -10, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  {['💬', '✨', '💡'][i % 3]}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqData.flatMap(category =>
              category.questions.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.answer
                }
              }))
            )
          })
        }}
      />

      <Footer />
    </div>
  )
}
