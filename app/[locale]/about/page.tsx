"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter, Link } from "@/i18n/routing"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  Sparkles, Target, Heart, Users, Zap,
  Award, Rocket, Shield, TrendingUp, Code
} from "lucide-react"
import confetti from "canvas-confetti"
import { ROUTES } from "@/constants/routes"

// Floating Confetti Component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? '#FFD700' : '#FFFFFF',
            boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

export default function AboutPage() {
  const t = useTranslations('About')
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FDB931', '#FFFFFF']
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const values = [
    {
      icon: Sparkles,
      title: t('coreValues.values.creativity.title'),
      description: t('coreValues.values.creativity.description')
    },
    {
      icon: Zap,
      title: t('coreValues.values.accuracy.title'),
      description: t('coreValues.values.accuracy.description')
    },
    {
      icon: Heart,
      title: t('coreValues.values.experience.title'),
      description: t('coreValues.values.experience.description')
    },
    {
      icon: Shield,
      title: t('coreValues.values.transparency.title'),
      description: t('coreValues.values.transparency.description')
    }
  ]

  const team = [
    {
      icon: Code,
      title: t('team.members.tech.title'),
      description: t('team.members.tech.description'),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Award,
      title: t('team.members.event.title'),
      description: t('team.members.event.description'),
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Rocket,
      title: t('team.members.design.title'),
      description: t('team.members.design.description'),
      color: "from-orange-500 to-red-500"
    }
  ]

  const milestones = t.raw('milestones.items') as Array<{year: string, event: string}>
  const milestonesHighlight = [true, false, false, true]

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden">
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0A0A] to-[#0A0A0A]" />
        <FloatingParticles />

        {/* Spotlight */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative container px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1 }}
            >
              <Sparkles className="w-20 h-20 mx-auto text-[#FFD700] mb-6" />
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold "
              style={{ textShadow: '0 0 40px rgba(255,215,0,0.4)' }}
            >
              <span className="block text-white mb-4">{t('hero.title.line1')}</span>
              <span className="block bg-gradient-to-r !leading-[1.2] from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                {t('hero.title.line2')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="relative py-24 bg-gradient-to-b from-[#0A0A0A] to-[#1a1a1a]">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A] border-2 border-[#FFD700]/20 hover:border-[#FFD700]/50 rounded-3xl p-8 transition-all">
                <Target className="w-16 h-16 text-[#FFD700] mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">{t('mission.title')}</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {t('mission.description')}
                </p>
                <div className="mt-6 space-y-3">
                  {(t.raw('mission.achievements') as string[]).map((achievement, index) => (
                    <p key={index} className="text-gray-400 flex items-start gap-3">
                      <span className="text-[#FFD700]">✓</span>
                      <span dangerouslySetInnerHTML={{ __html: achievement }} />
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative h-full bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A] border-2 border-[#FFD700]/20 hover:border-[#FFD700]/50 rounded-3xl p-8 transition-all">
                <TrendingUp className="w-16 h-16 text-[#FFD700] mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">{t('vision.title')}</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {t('vision.description')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#0A0A0A]" />

        <div className="container px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('coreValues.title')}
            </h2>
            <p className="text-xl text-gray-400">{t('coreValues.subtitle')}</p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#1a1a1a] border-2 h-full border-[#FFD700]/20 hover:border-[#FFD700] rounded-2xl p-6 text-center transition-all">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <value.icon className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY & MILESTONES */}
      <section className="relative py-24 bg-gradient-to-b from-[#0A0A0A] to-[#1a1a1a]">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('milestones.title')}
            </h2>
            <p className="text-xl text-gray-400">{t('milestones.subtitle')}</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative pl-8 pb-12 border-l-2 border-[#FFD700]/30 last:border-l-0 last:pb-0"
              >
                <motion.div
                  className={`absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px] ${
                    milestonesHighlight[index] ? 'bg-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.8)]' : 'bg-[#FFD700]/50'
                  }`}
                  whileHover={{ scale: 1.5 }}
                />
                <div className={`${
                  milestonesHighlight[index] ? 'bg-gradient-to-r from-[#FFD700]/20 to-transparent' : 'bg-[#1a1a1a]'
                } border-2 border-[#FFD700]/20 hover:border-[#FFD700] rounded-xl p-6 transition-all`}>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold text-[#FFD700]">{milestone.year}</span>
                    {milestonesHighlight[index] && (
                      <Sparkles className="w-5 h-5 text-[#FFD700]" />
                    )}
                  </div>
                  <p className="text-lg text-white">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="relative py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.rich('team.title', {
                highlight: (chunks) => <span className="text-[#FFD700]">{chunks}</span>
              })}
            </h2>
            <p className="text-xl text-gray-400">{t('team.subtitle')}</p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] rounded-2xl p-8 text-center transition-all">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                    <member.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{member.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9C27FF] via-[#0A0A0A] to-[#FFD700]" />

        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.3) 50%, transparent 70%)',
          }}
        />

        <div className="container px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white" dangerouslySetInnerHTML={{ __html: t.raw('cta.title') as string }} />
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <Link href={ROUTES.PRICING}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-6 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black text-lg font-bold rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all"
              >
                {t('cta.button')}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
