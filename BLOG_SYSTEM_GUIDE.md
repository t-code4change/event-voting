# Blog System Enhancement Guide - GalaVote

## ✅ Đã Hoàn Thành

### 1. Blog Data Structure ✅
**File:** `lib/blog-data.ts`

Đã tạo:
- Interface `BlogPost` với đầy đủ fields
- 6 blog posts mẫu với content đầy đủ
- Helper functions: `getPostBySlug()`, `getRelatedPosts()`, `getAllPosts()`

### 2. Blog Detail Layout ✅
**File:** `app/blog/[slug]/layout.tsx`

- Dynamic metadata generation
- SEO optimized
- Open Graph tags

---

## 📝 Cần Tạo: Blog Detail Page

### File: `app/blog/[slug]/page.tsx`

```tsx
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
  Linkedin, Link as LinkIcon, Sparkles, Check
} from "lucide-react"
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data"

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const post = getPostBySlug(slug)

  const [copied, setCopied] = useState(false)
  const [confettiTriggered, setConfettiTriggered] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Parallax effect for hero
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  // Confetti trigger when scroll to 90%
  useEffect(() => {
    const handleScroll = () => {
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

  return (
    <div className="min-h-screen bg-[#0A0A0A]" ref={contentRef}>
      <Header />

      {/* HERO SECTION WITH PARALLAX */}
      <motion.section className="relative h-[60vh] overflow-hidden">
        <motion.div
          style={{ y }}
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
            className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-black font-bold rounded-full hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Blog
          </motion.button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4 text-sm">
                <span className="px-4 py-1 bg-[#FFD700] text-black font-bold rounded-full">
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

              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                {post.title}
              </h1>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold">
                  {post.author.avatar}
                </div>
                <span className="text-gray-300">{post.author.name}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ARTICLE CONTENT */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Share Buttons Sticky */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 space-y-4"
          >
            <p className="text-gray-400 text-sm mb-4">Chia sẻ ✨</p>
            <button
              onClick={() => handleShare('facebook')}
              className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] flex items-center justify-center text-[#FFD700] hover:scale-110 transition-all"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] flex items-center justify-center text-[#FFD700] hover:scale-110 transition-all"
            >
              <Linkedin className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopyLink}
              className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] flex items-center justify-center text-[#FFD700] hover:scale-110 transition-all relative"
            >
              {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
            </button>
          </motion.div>

          {/* Content with fade-up animations */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-[#FFD700]
              prose-headings:font-bold
              prose-p:text-gray-300
              prose-p:leading-relaxed
              prose-a:text-[#FFD700]
              prose-a:no-underline
              prose-a:hover:underline
              prose-strong:text-white
              prose-blockquote:border-l-4
              prose-blockquote:border-[#FFD700]
              prose-blockquote:bg-[#FFD700]/10
              prose-blockquote:py-4
              prose-blockquote:px-6
              prose-blockquote:rounded-r-xl
              prose-blockquote:italic
              prose-code:text-[#FFD700]
              prose-code:bg-[#1a1a1a]
              prose-code:px-2
              prose-code:py-1
              prose-code:rounded
              prose-table:border-2
              prose-table:border-[#FFD700]/20
              prose-th:bg-[#FFD700]/20
              prose-th:text-[#FFD700]
              prose-td:border
              prose-td:border-[#FFD700]/10
            "
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
          />

          {/* Share Buttons Mobile */}
          <div className="lg:hidden mt-12 p-6 bg-[#1a1a1a] border-2 border-[#FFD700]/20 rounded-2xl">
            <p className="text-gray-300 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#FFD700]" />
              Chia sẻ bài viết
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleShare('facebook')}
                className="flex-1 py-3 bg-[#0A0A0A] border-2 border-[#FFD700]/20 hover:border-[#FFD700] rounded-xl text-white flex items-center justify-center gap-2 transition-all"
              >
                <Facebook className="w-5 h-5" />
                Facebook
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex-1 py-3 bg-[#0A0A0A] border-2 border-[#FFD700]/20 hover:border-[#FFD700] rounded-xl text-white flex items-center justify-center gap-2 transition-all"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 py-3 bg-[#0A0A0A] border-2 border-[#FFD700]/20 hover:border-[#FFD700] rounded-xl text-white flex items-center justify-center gap-2 transition-all"
              >
                {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
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
                    <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] transition-all cursor-pointer group">
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
        <p>© 2025 GalaVote by Code4Change Media</p>
      </footer>
    </div>
  )
}
```

---

## 📝 Cần Update: Blog List Page

### File: `app/blog/page.tsx`

Update phần blog cards để link đến detail page:

```tsx
// Replace the blog card content with:
<Link href={`/blog/${post.slug}`}>
  <motion.article
    // ... existing props
  >
    {/* ... existing card content ... */}

    <button className="flex items-center gap-2 text-[#FFD700] font-semibold group-hover:gap-4 transition-all">
      Đọc thêm
      <ArrowRight className="w-4 h-4" />
    </button>
  </motion.article>
</Link>
```

**Import thêm:**
```tsx
import Link from "next/link"
import { getAllPosts } from "@/lib/blog-data"

// Replace blogPosts array with:
const blogPosts = getAllPosts()
```

---

## 🎨 Key Features

### 1. Parallax Hero ✨
- Hero image moves slower than scroll
- Creates depth effect
- Gold gradient title

### 2. Confetti Trigger 🎉
- Triggers at 90% scroll
- White-gold particles
- One-time only

### 3. Share Buttons 📤
- Desktop: Sticky sidebar
- Mobile: Bottom card
- Facebook, LinkedIn, Copy link
- Copy confirmation

### 4. Related Posts 🔗
- Shows 3 related articles
- Staggered animation
- Hover effects

### 5. Rich Content 📝
- Markdown-like styling
- Quote blocks with gold border
- Code blocks
- Tables
- Responsive typography

---

## 🎯 Animations Summary

| Element | Animation |
|---------|-----------|
| Hero | Parallax scroll |
| Back button | Fade + slide from left |
| Title | Fade up + gold gradient |
| Content | Progressive fade-up |
| Share buttons | Pulse on hover |
| Related posts | Stagger slide-in |
| Confetti | Triggered at 90% scroll |

---

## 📱 Responsive

- **Desktop:** Sidebar share buttons
- **Tablet:** 2-column related posts
- **Mobile:**
  - 1-column layout
  - Share buttons at bottom
  - Horizontal scroll for related

---

## ✅ Checklist

- [x] Blog data structure
- [x] Blog detail layout
- [ ] Blog detail page (code above)
- [ ] Update blog list with links
- [ ] Test all animations
- [ ] Test confetti trigger
- [ ] Test share buttons
- [ ] Mobile responsive check

---

## 🚀 Deployment

1. Create `app/blog/[slug]/page.tsx` with code above
2. Update `app/blog/page.tsx` with links
3. Test locally: `npm run dev`
4. Check all 6 blog posts work
5. Test share buttons
6. Test confetti at 90% scroll
7. Deploy!

**All code follows GalaVote dark-gold premium theme!** 🌟
