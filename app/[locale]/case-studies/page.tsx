'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Sparkles, ArrowRight, Award, Users, TrendingUp, Clock, Target } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { caseStudies, caseStudiesDetail, benefits } from './constants/case-studies-data'
import { useTranslations } from 'next-intl'

export default function CaseStudiesPage() {
  const t = useTranslations('CaseStudies')
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FDB931', '#FFA500']
    })
  }

  // Get featured case study (TechViet)
  const featuredCase = caseStudiesDetail[0]

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#EAEAEA] relative overflow-hidden">
      <Header />

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D1A] via-[#1A1A2E] to-[#0D0D1A] opacity-60" />

      {/* Grid pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,215,0,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* 1. Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            {/* Crown icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="inline-block mb-8"
            >
              <Award className="w-20 h-20 text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>

            <p className="text-2xl md:text-3xl mb-4 text-[#FFD700] font-semibold">
              {t('hero.subtitle')}
            </p>

            <p className="text-lg md:text-xl text-[#B0B0B0] mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <motion.a
                href="#featured"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0D0D1A] text-lg font-bold rounded-full hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 inline-flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6" />
                <span>{t('hero.cta.featured')}</span>
              </motion.a>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-transparent border-2 border-[#FFD700] text-[#FFD700] text-lg font-bold rounded-full hover:bg-[#FFD700] hover:text-[#0D0D1A] transition-all duration-300"
                >
                  {t('hero.cta.contact')}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* 2. Featured Case Study Banner */}
        <section id="featured" className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="relative rounded-[20px] overflow-hidden border-2 border-[#FFD700]/30 hover:border-[#FFD700]/60 transition-all duration-500 group bg-[#0F0F1F]">
              {/* 16:9 Hero Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={featuredCase.heroImage}
                  alt={featuredCase.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1F] via-[#0F0F1F]/60 to-transparent" />

                {/* Company logo badge */}
                <div className="absolute top-6 left-6 z-10">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg">
                    <span className="text-[#0D0D1A] font-bold text-lg">{featuredCase.company}</span>
                  </div>
                </div>

                {/* Stats badges - Top right */}
                <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#FFD700] text-[#0D0D1A] px-5 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    <span>520+ khách</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#FFD700] text-[#0D0D1A] px-5 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>97.8% vote realtime</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#FFD700] text-[#0D0D1A] px-5 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    <span>3 giờ tiết kiệm</span>
                  </motion.div>
                </div>

                {/* Title and description - Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                    {featuredCase.title}
                  </h2>
                  <p className="text-lg text-[#E0E0E0] mb-6 max-w-3xl drop-shadow-md">
                    {featuredCase.summary}
                  </p>
                </div>
              </div>

              {/* Testimonial Card - Below image */}
              <div className="p-8 bg-gradient-to-br from-[#0F0F1F] to-[#1A1A2E]">
                <div className="flex items-start gap-6">
                  <Image
                    src={featuredCase.testimonial.avatar}
                    alt={featuredCase.testimonial.author}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-[#FFD700] shadow-lg flex-shrink-0"
                  />

                  <div className="flex-1">
                    <blockquote className="text-lg italic text-[#E0E0E0] mb-4 border-l-4 border-[#FFD700] pl-6">
                      "{featuredCase.testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className="text-[#FFD700] font-bold text-lg">{featuredCase.testimonial.author}</p>
                        <p className="text-[#B0B0B0] text-sm">{featuredCase.testimonial.role}</p>
                      </div>

                      <Link href={`/case-studies/${featuredCase.slug}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={fireConfetti}
                          className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0D0D1A] font-bold rounded-full hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 inline-flex items-center gap-2"
                        >
                          <span>Đọc case study đầy đủ</span>
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. Grid Case Studies */}
        <section id="case-studies" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                {t('grid.title')}
              </h2>
              <p className="text-xl text-[#B0B0B0] max-w-2xl mx-auto">
                {t('grid.subtitle')}
              </p>
            </motion.div>

            {/* Grid 3-4 cards per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudiesDetail.map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredCard(caseStudy.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="group"
                >
                  <Link href={`/case-studies/${caseStudy.slug}`}>
                    <div className="bg-[#0F0F1F] border-2 border-[#FFD700]/20 rounded-[16px] overflow-hidden hover:border-[#FFD700]/60 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] h-full flex flex-col">
                      {/* Thumbnail Image */}
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={caseStudy.thumbnail}
                          alt={caseStudy.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1F] via-transparent to-transparent" />

                        {/* Company Logo Badge */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                          <span className="text-[#0D0D1A] font-bold text-sm">{caseStudy.company}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-[#FFD700] mb-3 group-hover:text-[#FDB931] transition-colors leading-tight">
                          {caseStudy.title}
                        </h3>

                        <p className="text-[#B0B0B0] mb-5 text-sm leading-relaxed flex-1">
                          {caseStudy.summary}
                        </p>

                        {/* Stats Badges */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {Object.entries(caseStudy.stats).slice(0, 3).map(([key, value]) => (
                            <span
                              key={key}
                              className="px-3 py-1.5 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full text-xs text-[#FFD700] font-semibold"
                            >
                              {value}
                            </span>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3.5 bg-transparent border-2 border-[#FFD700]/40 text-[#FFD700] font-bold rounded-xl hover:bg-[#FFD700] hover:text-[#0D0D1A] transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Xem chi tiết</span>
                          <ArrowRight className="w-5 h-5 transition-transform duration-250 group-hover:translate-x-1" />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Benefits Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-transparent via-[#0D0D1A]/50 to-transparent">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                {t('benefits.title')}
              </h2>
              <p className="text-xl text-[#B0B0B0] max-w-2xl mx-auto">
                {t('benefits.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="bg-gradient-to-br from-[#0F0F1F] to-[#1A1A2E] border-2 border-[#FFD700]/20 rounded-[16px] p-8 text-center hover:border-[#FFD700]/60 hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-full mb-6 shadow-[0_0_25px_rgba(255,215,0,0.5)]"
                  >
                    <benefit.icon className="w-10 h-10 text-[#0D0D1A]" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-[#FFD700] mb-4 leading-tight">
                    {benefit.title}
                  </h3>

                  <p className="text-[#B0B0B0] text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Final CTA */}
        <section className="py-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center relative"
          >
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-[#FDB931]/20 to-[#FFD700]/20 blur-[100px] -z-10" />

            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="inline-block mb-8"
            >
              <Target className="w-24 h-24 text-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]" />
            </motion.div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                {t('cta.title')}
              </span>
            </h2>

            <p className="text-3xl md:text-4xl text-[#FFD700] mb-6 font-semibold">
              {t('cta.subtitle')}
            </p>

            <p className="text-lg md:text-xl text-[#B0B0B0] mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('cta.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/contact">
                <motion.button
                  onClick={fireConfetti}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-[#0D0D1A] text-xl font-bold rounded-full hover:shadow-[0_0_50px_rgba(255,215,0,0.7)] transition-all duration-300 inline-flex items-center gap-3"
                >
                  <Sparkles className="w-6 h-6" />
                  <span>{t('cta.button.primary')}</span>
                </motion.button>
              </Link>

              <Link href="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-transparent border-2 border-[#FFD700] text-[#FFD700] text-xl font-bold rounded-full hover:bg-[#FFD700] hover:text-[#0D0D1A] transition-all duration-300"
                >
                  {t('cta.button.secondary')}
                </motion.button>
              </Link>
            </div>

            {/* Floating particles animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-[#FFD700]"
                  style={{
                    left: `${5 + i * 4.5}%`,
                    top: '50%',
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  }}
                  animate={{
                    y: [-40, -80, -40],
                    rotate: [0, 180, 360],
                    opacity: [0.2, 0.9, 0.2],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
