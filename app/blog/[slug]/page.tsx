"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import Header from "@/components/Header"
import Image from "next/image"
import Link from "next/link"
import confetti from "canvas-confetti"
import {
  ArrowLeft, Calendar, Clock, Share2, Facebook,
  Linkedin, Link as LinkIcon, Sparkles, Check, ChevronDown, ChevronUp
} from "lucide-react"
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data"

interface Heading {
  id: string
  text: string
  level: number
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const post = getPostBySlug(slug)

  const [copied, setCopied] = useState(false)
  const [confettiTriggered, setConfettiTriggered] = useState(false)
  const [activeHeading, setActiveHeading] = useState<string>("")
  const [headings, setHeadings] = useState<Heading[]>([])
  const [tocOpen, setTocOpen] = useState(false)
  const [expandedHeadings, setExpandedHeadings] = useState<Set<string>>(new Set())
  const contentRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLDivElement>(null)

  // Reading progress bar
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Extract headings from content and format checkboxes
  useEffect(() => {
    if (post?.content && articleRef.current) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(post.content, 'text/html')
      const headingElements = doc.querySelectorAll('h2, h3')

      const extractedHeadings: Heading[] = Array.from(headingElements).map((heading, index) => {
        let text = heading.textContent || ''
        // Remove emojis and special symbols from TOC text
        // Keep Vietnamese, English letters, numbers, spaces and basic punctuation
        text = text.replace(/[^\u0000-\u007F\u00C0-\u1EF9\s]/g, '').replace(/\s+/g, ' ').trim()
        const id = `heading-${index}`
        heading.id = id
        return {
          id,
          text,
          level: parseInt(heading.tagName.substring(1))
        }
      })

      setHeadings(extractedHeadings)

      // Update the content with IDs and format checkboxes
      setTimeout(() => {
        const articleHeadings = articleRef.current?.querySelectorAll('h2, h3')
        articleHeadings?.forEach((heading, index) => {
          heading.id = `heading-${index}`
        })

        // Replace [ ] with - in list items
        const listItems = articleRef.current?.querySelectorAll('li')
        listItems?.forEach((li) => {
          let html = li.innerHTML.trim()
          // Remove [ ] prefix if exists
          if (html.startsWith('[ ]')) {
            li.innerHTML = html.substring(3).trim()
          }
        })
      }, 100)
    }
  }, [post])

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = articleRef.current?.querySelectorAll('h2, h3')
      if (!headingElements) return

      let current = ""
      headingElements.forEach((heading) => {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= 150 && rect.top >= 0) {
          current = heading.id
        }
      })

      if (current) {
        setActiveHeading(current)
      }

      // Confetti trigger when scroll to 90%
      if (!confettiTriggered && contentRef.current) {
        const scrolled = window.scrollY + window.innerHeight
        const total = contentRef.current.scrollHeight
        if (scrolled / total > 0.9) {
          setConfettiTriggered(true)
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FDB931', '#FFFFFF']
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [confettiTriggered])

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Header />
        <div className="text-center">
          <h1 className="text-4xl text-white mb-4">Bài viết không tồn tại</h1>
          <Link href="/blog">
            <button className="px-6 py-3 bg-[#FFD700] text-black rounded-xl">
              ← Quay lại Blog
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const relatedPosts = post.relatedPosts ? getRelatedPosts(post.relatedPosts) : []
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(post.title)

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400')
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: 'smooth' })
      setTocOpen(false)
    }
  }

  const toggleHeading = (id: string) => {
    const newExpanded = new Set(expandedHeadings)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedHeadings(newExpanded)
  }

  // Group headings by parent (h2) and children (h3)
  const groupedHeadings = headings.reduce((acc, heading) => {
    if (heading.level === 2) {
      acc.push({ parent: heading, children: [] })
    } else if (heading.level === 3 && acc.length > 0) {
      acc[acc.length - 1].children.push(heading)
    }
    return acc
  }, [] as Array<{ parent: Heading; children: Heading[] }>)

  return (
    <div className="min-h-screen bg-[#0A0A0A]" ref={contentRef}>
      <Header />

      {/* READING PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] origin-left z-50"
        style={{ scaleX }}
      />

      {/* HERO SECTION WITH PARALLAX */}
      <motion.section className="relative h-[60vh] overflow-hidden">
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 0.3], [0, 150]) }}
          className="absolute inset-0"
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        </motion.div>

        {/* Back Button */}
        <div className="absolute top-24 left-4 z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/blog')}
            className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-black font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-[#FFD700]/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Blog
          </motion.button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <span className="px-4 py-1 bg-[#FFD700] text-black font-bold rounded-full shadow-lg shadow-[#FFD700]/30">
                  {post.category}
                </span>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                {post.title}
              </h1>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center text-black font-bold shadow-lg shadow-[#FFD700]/30">
                  {post.author.avatar}
                </div>
                <span className="text-gray-300">{post.author.name}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ARTICLE CONTENT WITH TOC */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex gap-8">
            {/* Share Buttons Sticky */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden xl:block fixed left-8 top-1/2 -translate-y-1/2 space-y-4 z-40"
            >
              <p className="text-gray-400 text-sm mb-4">Chia sẻ ✨</p>
              <button
                onClick={() => handleShare('facebook')}
                className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD700]/20 flex items-center justify-center text-[#FFD700] hover:scale-110 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD700]/20 flex items-center justify-center text-[#FFD700] hover:scale-110 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button
                onClick={handleCopyLink}
                className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD700]/20 flex items-center justify-center text-[#FFD700] hover:scale-110 transition-all relative"
              >
                {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
              </button>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 max-w-[800px] mx-auto">
              <motion.article
                ref={articleRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="prose prose-invert prose-lg max-w-none blog-content
                  [&>*]:text-white
                  [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-12
                  [&_h1]:bg-gradient-to-r [&_h1]:from-[#FFD700] [&_h1]:via-[#FDB931] [&_h1]:to-[#FFD700]
                  [&_h1]:bg-clip-text [&_h1]:text-transparent
                  [&_h1]:drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]
                  [&_h1]:leading-tight

                  [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:mb-6 [&_h2]:mt-12
                  [&_h2]:bg-gradient-to-r [&_h2]:from-[#FFD700] [&_h2]:to-[#FDB931]
                  [&_h2]:bg-clip-text [&_h2]:text-transparent
                  [&_h2]:drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]
                  [&_h2]:border-b-2 [&_h2]:border-[#FFD700]/20 [&_h2]:pb-3
                  [&_h2]:leading-tight

                  [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:mt-8
                  [&_h3]:text-[#FFD700]
                  [&_h3]:leading-tight

                  [&_p]:text-gray-300 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6

                  [&_strong]:text-white [&_strong]:font-bold [&_strong]:text-[#FFD700]

                  [&_a]:text-[#FFD700] [&_a]:no-underline [&_a]:hover:underline [&_a]:transition-all

                  [&_ul]:space-y-3 [&_ul]:my-6
                  [&_ol]:space-y-3 [&_ol]:my-6
                  [&_li]:text-gray-300 [&_li]:text-lg [&_li]:leading-relaxed
                  [&_li]:marker:text-[#FFD700]

                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#FFD700]
                  [&_blockquote]:bg-gradient-to-r [&_blockquote]:from-[#FFD700]/10 [&_blockquote]:to-transparent
                  [&_blockquote]:py-6 [&_blockquote]:px-8 [&_blockquote]:my-8
                  [&_blockquote]:rounded-r-2xl [&_blockquote]:italic
                  [&_blockquote]:shadow-lg [&_blockquote]:shadow-[#FFD700]/10
                  [&_blockquote]:text-gray-200 [&_blockquote]:text-lg

                  [&_code]:text-[#FFD700] [&_code]:bg-[#1a1a1a]
                  [&_code]:px-2 [&_code]:py-1 [&_code]:rounded
                  [&_code]:border [&_code]:border-[#FFD700]/20
                  [&_code]:text-base

                  [&_table]:w-full [&_table]:border-2 [&_table]:border-[#FFD700]/20
                  [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:my-8
                  [&_table]:shadow-lg [&_table]:shadow-[#FFD700]/10
                  [&_th]:bg-gradient-to-r [&_th]:from-[#FFD700]/20 [&_th]:to-[#FDB931]/20
                  [&_th]:text-[#FFD700] [&_th]:font-bold [&_th]:p-4
                  [&_td]:border [&_td]:border-[#FFD700]/10 [&_td]:p-4
                  [&_td]:text-gray-300

                  [&_img]:rounded-2xl [&_img]:shadow-2xl [&_img]:shadow-[#FFD700]/20
                  [&_img]:my-8 [&_img]:border-2 [&_img]:border-[#FFD700]/20

                  [&_hr]:border-[#FFD700]/20 [&_hr]:my-12

                  [&_div]:rounded-2xl
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />


              {/* Share Buttons Mobile */}
              <div className="xl:hidden mt-12 p-6 bg-[#1a1a1a] border-2 border-[#FFD700]/20 rounded-2xl shadow-lg shadow-[#FFD700]/10">
                <p className="text-gray-300 mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#FFD700]" />
                  Chia sẻ bài viết
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex-1 py-3 bg-[#0A0A0A] border-2 border-[#FFD700]/20 hover:border-[#FFD700] rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#FFD700]/20"
                  >
                    <Facebook className="w-5 h-5" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex-1 py-3 bg-[#0A0A0A] border-2 border-[#FFD700]/20 hover:border-[#FFD700] rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#FFD700]/20"
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-3 bg-[#0A0A0A] border-2 border-[#FFD700]/20 hover:border-[#FFD700] rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#FFD700]/20"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 p-8 md:p-12 bg-gradient-to-br from-[#FFD700]/10 via-[#FDB931]/5 to-transparent border-2 border-[#FFD700]/30 rounded-3xl shadow-2xl shadow-[#FFD700]/20 text-center"
              >
                <Sparkles className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FDB931] bg-clip-text text-transparent mb-4">
                  Bạn đã sẵn sàng cho sự kiện của mình?
                </h3>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Hãy để Bright4Event giúp bạn tổ chức một sự kiện hoàn hảo với công nghệ bình chọn hiện đại nhất!
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/pricing">
                    <button className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold rounded-full hover:scale-105 transition-all shadow-xl shadow-[#FFD700]/30 hover:shadow-[#FFD700]/50">
                      Xem gói dịch vụ →
                    </button>
                  </Link>
                  <Link href="/">
                    <button className="px-8 py-4 bg-[#1a1a1a] border-2 border-[#FFD700]/30 text-white font-bold rounded-full hover:scale-105 transition-all hover:border-[#FFD700]">
                      Tư vấn miễn phí
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* TABLE OF CONTENTS - Desktop */}
            {groupedHeadings.length > 0 && (
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:block w-80 sticky top-24 self-start"
              >
                <div className="bg-[#1a1a1a] border-2 border-[#FFD700]/20 rounded-2xl p-6 shadow-lg shadow-[#FFD700]/10">
                  <h3 className="text-[#FFD700] font-bold text-xl mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Mục lục
                  </h3>
                  <nav className="space-y-1">
                    {groupedHeadings.map((group) => (
                      <div key={group.parent.id}>
                        {/* Parent Heading (h2) */}
                        <div className="flex items-center">
                          <button
                            onClick={() => scrollToHeading(group.parent.id)}
                            className={`
                              flex-1 text-left px-4 py-2 rounded-lg transition-all text-sm
                              ${activeHeading === group.parent.id
                                ? 'bg-[#FFD700]/20 text-[#FFD700] border-l-4 border-[#FFD700] shadow-lg shadow-[#FFD700]/20'
                                : 'text-gray-400 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
                              }
                            `}
                          >
                            {group.parent.text}
                          </button>
                          {group.children.length > 0 && (
                            <button
                              onClick={() => toggleHeading(group.parent.id)}
                              className="p-2 text-gray-400 hover:text-[#FFD700] transition-colors"
                            >
                              {expandedHeadings.has(group.parent.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Children Headings (h3) */}
                        {group.children.length > 0 && expandedHeadings.has(group.parent.id) && (
                          <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#FFD700]/10 pl-2">
                            {group.children.map((child) => (
                              <button
                                key={child.id}
                                onClick={() => scrollToHeading(child.id)}
                                className={`
                                  w-full text-left px-3 py-1.5 rounded-lg transition-all text-xs
                                  ${activeHeading === child.id
                                    ? 'bg-[#FFD700]/10 text-[#FFD700]'
                                    : 'text-gray-500 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
                                  }
                                `}
                              >
                                {child.text}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              </motion.aside>
            )}

            {/* TABLE OF CONTENTS - Mobile Accordion */}
            {groupedHeadings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:hidden fixed top-20 left-4 right-4 z-40"
              >
                <div className="bg-[#1a1a1a] border-2 border-[#FFD700]/20 rounded-2xl shadow-xl shadow-[#FFD700]/20">
                  <button
                    onClick={() => setTocOpen(!tocOpen)}
                    className="w-full px-6 py-4 flex items-center justify-between text-[#FFD700] font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Mục lục
                    </span>
                    {tocOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {tocOpen && (
                    <motion.nav
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      className="px-4 pb-4 space-y-1 max-h-[60vh] overflow-y-auto"
                    >
                      {groupedHeadings.map((group) => (
                        <div key={group.parent.id}>
                          {/* Parent Heading (h2) */}
                          <div className="flex items-center">
                            <button
                              onClick={() => scrollToHeading(group.parent.id)}
                              className={`
                                flex-1 text-left px-4 py-2 rounded-lg transition-all text-sm
                                ${activeHeading === group.parent.id
                                  ? 'bg-[#FFD700]/20 text-[#FFD700] border-l-4 border-[#FFD700]'
                                  : 'text-gray-400 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
                                }
                              `}
                            >
                              {group.parent.text}
                            </button>
                            {group.children.length > 0 && (
                              <button
                                onClick={() => toggleHeading(group.parent.id)}
                                className="p-2 text-gray-400 hover:text-[#FFD700] transition-colors"
                              >
                                {expandedHeadings.has(group.parent.id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Children Headings (h3) */}
                          {group.children.length > 0 && expandedHeadings.has(group.parent.id) && (
                            <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#FFD700]/10 pl-2">
                              {group.children.map((child) => (
                                <button
                                  key={child.id}
                                  onClick={() => scrollToHeading(child.id)}
                                  className={`
                                    w-full text-left px-3 py-1.5 rounded-lg transition-all text-xs
                                    ${activeHeading === child.id
                                      ? 'bg-[#FFD700]/10 text-[#FFD700]'
                                      : 'text-gray-500 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
                                    }
                                  `}
                                >
                                  {child.text}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.nav>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* RELATED POSTS */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-[#0A0A0A] to-[#1a1a1a]">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Sparkles className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Bài viết liên quan
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all cursor-pointer group">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold rounded-full">
                          {relatedPost.category}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-[#FFD700] transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{relatedPost.excerpt.slice(0, 100)}...</p>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] border-t border-[#FFD700]/20 py-12 text-center text-gray-500">
        <p>© 2025 Bright4Event by Code4Change Media</p>
      </footer>
    </div>
  )
}
