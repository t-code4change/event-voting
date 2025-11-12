# PAGES SPECIFICATION - Bright4Event

> Mô tả chi tiết tất cả pages, layouts và navigation flows

---

## 📋 MỤC LỤC

1. [Tổng quan Pages](#1-tổng-quan-pages)
2. [Public Pages](#2-public-pages)
3. [Admin Pages](#3-admin-pages)
4. [Navigation & Routing](#4-navigation--routing)

---

## 1. TỔNG QUAN PAGES

### 1.1. Site Map

```
event-voting/
│
├── Public Area (/)
│   ├── Landing Page (/)
│   ├── Voting Page (/vote) - có AuthModal
│   └── Results Page (/results) - Realtime
│
└── Admin Area (/admin)
    ├── Dashboard (/admin) - Tổng quan
    ├── Event Settings (/admin/events) - Config event
    ├── Categories Management (/admin/categories)
    ├── Candidates Management (/admin/candidates)
    ├── Voters List (/admin/voters)
    └── Results Analytics (/admin/results) - Chi tiết
```

### 1.2. Pages Summary

| Page | Route | Auth Required | Purpose |
|------|-------|---------------|---------|
| **Landing** | `/` | ❌ | Giới thiệu event, QR target |
| **Voting** | `/vote` | ✅ (Modal) | Vote cho ứng viên |
| **Results** | `/results` | ❌ | Xem kết quả realtime |
| **Admin Dashboard** | `/admin` | ✅ | Tổng quan stats |
| **Event Settings** | `/admin/events` | ✅ | Config event & voting settings |
| **Categories** | `/admin/categories` | ✅ | Quản lý danh hiệu |
| **Candidates** | `/admin/candidates` | ✅ | Quản lý ứng viên |
| **Voters** | `/admin/voters` | ✅ | Danh sách người vote |
| **Results Admin** | `/admin/results` | ✅ | Analytics chi tiết |

---

## 2. PUBLIC PAGES

### 2.1. Landing Page (`/`)

**Purpose**: Trang chủ, target của QR code, giới thiệu event

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Header                                      │
│ [Logo] Bright4Event      [Results] [Admin] │
├─────────────────────────────────────────────┤
│                                             │
│           🎉 HERO SECTION                   │
│                                             │
│     King & Queen of the Night 2025          │
│     Annual Gala Celebration                 │
│                                             │
│     [🗳️ Bắt đầu bình chọn] (CTA)           │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│         📊 STATS CARDS                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ ⏰ Còn    │ │ 👥 Người  │ │ 🏆 Danh  │   │
│  │ 2 giờ    │ │ đã vote  │ │ hiệu     │   │
│  │          │ │ 150      │ │ 3        │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│       📋 EVENT INFORMATION                  │
│                                             │
│  • Thời gian: 31/12/2025, 6PM - 11PM       │
│  • Địa điểm: Grand Ballroom                │
│  • Bình chọn đóng: 10PM                    │
│                                             │
│  [Xem kết quả realtime →]                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Components**:
```typescript
// app/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import EventCountdown from '@/components/EventCountdown'
import VoteStats from '@/components/VoteStats'
import Link from 'next/link'

export default async function LandingPage() {
  const supabase = createClient()

  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
      categories (count)
    `)
    .eq('is_active', true)
    .single()

  const { count: votersCount } = await supabase
    .from('voters')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">{event.name}</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {event.description}
        </p>
        <Button asChild size="lg" className="text-lg px-8 py-6">
          <Link href="/vote">
            🗳️ Bắt đầu bình chọn
          </Link>
        </Button>
      </section>

      {/* Stats Cards */}
      <section className="container py-10">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">⏰</div>
              <EventCountdown deadline={event.voting_close_time} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-sm text-muted-foreground">Người đã vote</p>
              <p className="text-3xl font-bold">{votersCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-sm text-muted-foreground">Danh hiệu</p>
              <p className="text-3xl font-bold">
                {event.categories[0]?.count || 0}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Event Info */}
      <section className="container py-10 max-w-2xl">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Thông tin sự kiện</h2>
            <ul className="space-y-3">
              <li>• Thời gian: {formatDate(event.start_time)} - {formatDate(event.end_time)}</li>
              <li>• Bình chọn đóng: {formatDate(event.voting_close_time)}</li>
              <li>• Mỗi người vote tối đa: {event.max_votes_per_voter} ứng viên/danh hiệu</li>
            </ul>
            <Button asChild variant="outline" className="w-full mt-6">
              <Link href="/results">
                Xem kết quả realtime →
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
```

**Features**:
- ✅ Hero section với event name
- ✅ CTA button "Bắt đầu bình chọn" → `/vote`
- ✅ Stats cards: Countdown, Voters count, Categories count
- ✅ Event information
- ✅ Link to results page

---

### 2.2. Voting Page (`/vote`)

**Purpose**: Trang vote chính, có AuthModal popup nếu chưa auth

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Header                    ⏰ Còn 2h | 👤 User│
├─────────────────────────────────────────────┤
│                                             │
│  King & Queen of the Night 2025             │
│  Vote tối đa: 3 ứng viên mỗi danh hiệu      │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  📋 CATEGORY 1: King of the Night           │
│  ─────────────────────────────────────────  │
│  Đã chọn: 2/3                               │
│                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  Photo  │ │  Photo  │ │  Photo  │       │
│  │ [✓]     │ │ [✓]     │ │ [ ]     │       │
│  │ John    │ │ Michael │ │ David   │       │
│  │ Doe     │ │ Smith   │ │ Lee     │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  📋 CATEGORY 2: Queen of the Night          │
│  ─────────────────────────────────────────  │
│  Đã chọn: 1/3                               │
│                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  Photo  │ │  Photo  │ │  Photo  │       │
│  │ [ ]     │ │ [✓]     │ │ [ ]     │       │
│  │ Jane    │ │ Sarah   │ │ Emily   │       │
│  │ Doe     │ │ Johnson │ │ Davis   │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│         [Xác nhận bình chọn] (Disabled)     │
│         Enable khi chọn đủ ít nhất 1        │
│                                             │
└─────────────────────────────────────────────┘
```

**Vote Selection Logic**:
```typescript
// Multiple selection per category
interface VoteState {
  [categoryId: string]: string[] // Array of candidate IDs
}

const [votes, setVotes] = useState<VoteState>({})
const maxVotes = event.max_votes_per_voter // e.g., 3

function handleToggleCandidate(categoryId: string, candidateId: string) {
  setVotes(prev => {
    const categoryVotes = prev[categoryId] || []

    // Toggle selection
    if (categoryVotes.includes(candidateId)) {
      // Deselect
      return {
        ...prev,
        [categoryId]: categoryVotes.filter(id => id !== candidateId)
      }
    } else {
      // Select (if not exceeding max)
      if (categoryVotes.length >= maxVotes) {
        toast.error(`Bạn chỉ có thể chọn tối đa ${maxVotes} ứng viên`)
        return prev
      }
      return {
        ...prev,
        [categoryId]: [...categoryVotes, candidateId]
      }
    }
  })
}
```

**Components**:
```typescript
// app/vote/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AuthModal from '@/components/auth/AuthModal'
import CategoryVotingCard from '@/components/voting/CategoryVotingCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function VotingPage() {
  const [event, setEvent] = useState<any>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [votes, setVotes] = useState<VoteState>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEvent()
    checkAuth()
  }, [])

  async function checkAuth() {
    const hasSession = document.cookie.includes('voter_id')
    setIsAuthenticated(hasSession)

    if (!hasSession) {
      // Auto-open modal after 2s if not authenticated
      setTimeout(() => setIsAuthModalOpen(true), 2000)
    } else {
      // Load existing votes
      await loadExistingVotes()
    }
  }

  async function loadExistingVotes() {
    const response = await fetch('/api/votes/my-votes')
    const data = await response.json()

    if (data.success) {
      // Group by category
      const voteState: VoteState = {}
      data.data.votes.forEach((vote: any) => {
        if (!voteState[vote.category_id]) {
          voteState[vote.category_id] = []
        }
        voteState[vote.category_id].push(vote.candidate_id)
      })
      setVotes(voteState)
    }
  }

  async function handleSubmit() {
    // Check if voting is closed
    const now = new Date()
    const closeTime = new Date(event.voting_close_time)

    if (now >= closeTime) {
      toast.error('Thời gian bình chọn đã kết thúc')
      return
    }

    // Check if can edit
    if (!event.allow_edit_before_deadline && hasExistingVotes()) {
      toast.error('Bạn đã vote rồi và không thể chỉnh sửa')
      return
    }

    setIsSubmitting(true)
    try {
      // Convert votes to array format
      const votesToSubmit = Object.entries(votes).flatMap(
        ([categoryId, candidateIds]) =>
          candidateIds.map(candidateId => ({
            category_id: categoryId,
            candidate_id: candidateId,
          }))
      )

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votes: votesToSubmit }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error)
        return
      }

      toast.success('Phiếu bầu đã được ghi nhận!')
      // Redirect to success page or results
      window.location.href = '/results'
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!event) return <div>Loading...</div>

  const isVotingClosed = new Date() >= new Date(event.voting_close_time)
  const hasExistingVotes = () => Object.values(votes).some(v => v.length > 0)

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">{event.name}</h1>
          <p className="text-muted-foreground mt-2">
            Vote tối đa: {event.max_votes_per_voter} ứng viên mỗi danh hiệu
          </p>
        </div>
        <Badge variant="destructive">
          ⏰ Còn {getTimeLeft(event.voting_close_time)}
        </Badge>
      </div>

      {/* Voting interface */}
      {!isAuthenticated ? (
        <div className="text-center py-20">
          <p className="text-xl mb-6">
            Vui lòng đăng nhập để bắt đầu bình chọn
          </p>
          <Button size="lg" onClick={() => setIsAuthModalOpen(true)}>
            Đăng nhập
          </Button>
        </div>
      ) : isVotingClosed ? (
        <div className="text-center py-20">
          <p className="text-xl">Thời gian bình chọn đã kết thúc</p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/results">Xem kết quả</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Categories */}
          <div className="space-y-12">
            {event.categories.map((category: any) => (
              <CategoryVotingCard
                key={category.id}
                category={category}
                selectedCandidates={votes[category.id] || []}
                maxVotes={event.max_votes_per_voter}
                onToggle={(candidateId) =>
                  handleToggleCandidate(category.id, candidateId)
                }
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !hasExistingVotes() ||
                (!event.allow_edit_before_deadline && hasExistingVotes())
              }
            >
              {isSubmitting ? 'Đang gửi...' : 'Xác nhận bình chọn'}
            </Button>
          </div>

          {!event.allow_edit_before_deadline && hasExistingVotes() && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              ⚠️ Bạn đã vote và không thể chỉnh sửa
            </p>
          )}
        </>
      )}

      {/* Auth Modal */}
      {event.auth_settings && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          authSettings={event.auth_settings}
          onSuccess={() => {
            setIsAuthenticated(true)
            loadExistingVotes()
          }}
        />
      )}
    </div>
  )
}
```

**Features**:
- ✅ AuthModal tự động mở nếu chưa auth
- ✅ Multiple selection (checkbox) theo `max_votes_per_voter`
- ✅ Show count: "Đã chọn: 2/3"
- ✅ Disable submit nếu đã vote và `allow_edit_before_deadline = false`
- ✅ Load existing votes khi vào lại
- ✅ Countdown timer

---

### 2.3. Results Page (`/results`)

**Purpose**: Hiển thị kết quả realtime, cập nhật live khi có vote mới

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Header              🔴 LIVE - Realtime      │
├─────────────────────────────────────────────┤
│                                             │
│  📊 Kết quả bình chọn                       │
│  King & Queen of the Night 2025             │
│                                             │
│  Tổng số phiếu: 450 | Người vote: 150      │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  🏆 KING OF THE NIGHT                       │
│  ─────────────────────────────────────────  │
│                                             │
│  🥇 #1  [👤] John Doe         150 votes    │
│         ████████████████████ 100%          │
│                                             │
│  🥈 #2  [👤] Michael Smith    120 votes    │
│         ████████████████░░░░  80%          │
│                                             │
│  🥉 #3  [👤] David Lee         90 votes    │
│         ████████████░░░░░░░░  60%          │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  👑 QUEEN OF THE NIGHT                      │
│  ─────────────────────────────────────────  │
│                                             │
│  🥇 #1  [👤] Sarah Johnson    180 votes    │
│         ████████████████████ 100%          │
│                                             │
│  🥈 #2  [👤] Jane Doe         160 votes    │
│         ██████████████████░░  89%          │
│                                             │
│  🥉 #3  [👤] Emily Davis      140 votes    │
│         ████████████████░░░░  78%          │
│                                             │
└─────────────────────────────────────────────┘
```

**Realtime Implementation**:
```typescript
// app/results/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [isLive, setIsLive] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchResults()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('votes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => {
          setIsLive(true)
          fetchResults()
          setTimeout(() => setIsLive(false), 2000)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  async function fetchResults() {
    const response = await fetch('/api/results')
    const data = await response.json()

    if (data.success) {
      setResults(data.data.categories)
      setTotalVotes(data.data.total_votes)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Kết quả bình chọn</h1>
          <p className="text-muted-foreground mt-2">
            Tổng số phiếu: {totalVotes}
          </p>
        </div>
        {isLive && (
          <Badge variant="destructive" className="animate-pulse">
            🔴 LIVE UPDATE
          </Badge>
        )}
      </div>

      <div className="space-y-12">
        {results.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-2xl">
                {getCategoryIcon(category.name)} {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.results.map((result: any, index: number) => {
                const maxVotes = category.results[0]?.vote_count || 1
                const percentage = (result.vote_count / maxVotes) * 100

                return (
                  <div
                    key={result.candidate_id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition"
                  >
                    <div className="text-3xl font-bold w-12">
                      {getRankEmoji(index)}
                    </div>

                    <Avatar className="w-16 h-16">
                      <AvatarImage src={result.photo_url} />
                      <AvatarFallback>
                        {result.candidate_name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">
                          {result.candidate_name}
                        </h3>
                        <Badge variant="secondary">
                          {result.vote_count} phiếu
                        </Badge>
                      </div>
                      <Progress value={percentage} className="h-3" />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function getRankEmoji(index: number) {
  const emojis = ['🥇', '🥈', '🥉']
  return emojis[index] || `#${index + 1}`
}

function getCategoryIcon(name: string) {
  if (name.toLowerCase().includes('king')) return '🏆'
  if (name.toLowerCase().includes('queen')) return '👑'
  return '🎖️'
}
```

**Features**:
- ✅ Realtime updates với WebSocket
- ✅ Live indicator khi có vote mới
- ✅ Progress bars với percentage
- ✅ Rank emojis (🥇🥈🥉)
- ✅ Avatar photos
- ✅ Total votes count

---

## 3. ADMIN PAGES

### 3.1. Admin Dashboard (`/admin`)

**Purpose**: Tổng quan stats và quick actions

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Admin Dashboard          [Logout] [Profile] │
├─────────────────────────────────────────────┤
│                                             │
│  📊 TỔNG QUAN                               │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 👥       │ │ 🗳️       │ │ 🏆       │   │
│  │ Voters   │ │ Votes    │ │ Categories│   │
│  │ 150      │ │ 450      │ │ 3        │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 👤       │ │ ⏰       │ │ 📊       │   │
│  │Candidates│ │ Time Left│ │ Status   │   │
│  │ 12       │ │ 2h 30m   │ │ Active   │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ⚡ QUICK ACTIONS                           │
│                                             │
│  [📋 Manage Event Settings]                 │
│  [👥 View Voters]                           │
│  [📊 View Results]                          │
│  [🏆 Manage Categories]                     │
│  [👤 Manage Candidates]                     │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  📈 RECENT ACTIVITY                         │
│                                             │
│  • New vote: John Doe voted in King...     │
│  • New voter: sarah@example.com            │
│  • Vote updated: jane@example.com          │
│                                             │
└─────────────────────────────────────────────┘
```

**Code**:
```typescript
// app/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createClient()

  // Fetch stats
  const [
    { count: votersCount },
    { count: votesCount },
    { count: categoriesCount },
    { count: candidatesCount },
    { data: event }
  ] = await Promise.all([
    supabase.from('voters').select('*', { count: 'exact', head: true }),
    supabase.from('votes').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('candidates').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*').eq('is_active', true).single()
  ])

  const stats = [
    { icon: '👥', label: 'Voters', value: votersCount, href: '/admin/voters' },
    { icon: '🗳️', label: 'Votes', value: votesCount, href: '/admin/results' },
    { icon: '🏆', label: 'Categories', value: categoriesCount, href: '/admin/categories' },
    { icon: '👤', label: 'Candidates', value: candidatesCount, href: '/admin/candidates' },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-3">{stat.icon}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>⚡ Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/admin/events">📋 Manage Event Settings</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/admin/voters">👥 View Voters</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/admin/results">📊 View Results</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/admin/categories">🏆 Manage Categories</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### 3.2. Event Settings Page (`/admin/events`)

**Purpose**: Config event settings - QUAN TRỌNG NHẤT!

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Event Settings                   [Save]     │
├─────────────────────────────────────────────┤
│                                             │
│  📋 BASIC INFORMATION                       │
│  ┌─────────────────────────────────────┐   │
│  │ Event Name: [________________]      │   │
│  │ Description: [________________]     │   │
│  │ Start Time:  [Date Picker]          │   │
│  │ End Time:    [Date Picker]          │   │
│  │ Voting Close: [Date Picker]  ⏰     │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  🔐 AUTHENTICATION SETTINGS                 │
│  ┌─────────────────────────────────────┐   │
│  │ [✓] Require Email                   │   │
│  │ [✓] Require Phone Number            │   │
│  │ [✓] Require OTP Verification        │   │
│  │     • OTP Method: (•) Email         │   │
│  │                   ( ) SMS           │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  🗳️ VOTING RULES                            │
│  ┌─────────────────────────────────────┐   │
│  │ Max votes per voter: [3] ▲▼         │   │
│  │ (per category)                      │   │
│  │                                     │   │
│  │ [✓] Allow edit before deadline      │   │
│  │     Voters can change votes         │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  [Cancel]                [Save Settings]    │
│                                             │
└─────────────────────────────────────────────┘
```

**Code**:
```typescript
// app/admin/events/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'

interface EventSettings {
  name: string
  description: string
  start_time: string
  end_time: string
  voting_close_time: string
  auth_settings: {
    require_email: boolean
    require_phone: boolean
    require_otp: boolean
    otp_method: 'email' | 'sms'
  }
  max_votes_per_voter: number
  allow_edit_before_deadline: boolean
}

export default function EventSettingsPage() {
  const [event, setEvent] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, watch, setValue } = useForm<EventSettings>()

  const requireEmail = watch('auth_settings.require_email')
  const requirePhone = watch('auth_settings.require_phone')
  const requireOtp = watch('auth_settings.require_otp')

  useEffect(() => {
    fetchEvent()
  }, [])

  async function fetchEvent() {
    const response = await fetch('/api/events/active')
    const data = await response.json()

    if (data.success) {
      const eventData = data.data.event
      setEvent(eventData)

      // Set form values
      setValue('name', eventData.name)
      setValue('description', eventData.description)
      setValue('start_time', eventData.start_time)
      setValue('end_time', eventData.end_time)
      setValue('voting_close_time', eventData.voting_close_time)
      setValue('auth_settings', eventData.auth_settings)
      setValue('max_votes_per_voter', eventData.max_votes_per_voter)
      setValue('allow_edit_before_deadline', eventData.allow_edit_before_deadline)
    }
  }

  async function onSubmit(data: EventSettings) {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error)
        return
      }

      toast.success('Event settings saved!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (!event) return <div>Loading...</div>

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-4xl font-bold mb-8">Event Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Event Name</Label>
              <Input {...register('name')} />
            </div>

            <div>
              <Label>Description</Label>
              <Input {...register('description')} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input type="datetime-local" {...register('start_time')} />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="datetime-local" {...register('end_time')} />
              </div>
              <div>
                <Label>Voting Close ⏰</Label>
                <Input type="datetime-local" {...register('voting_close_time')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Settings */}
        <Card>
          <CardHeader>
            <CardTitle>🔐 Authentication Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Require Email</Label>
              <Switch {...register('auth_settings.require_email')} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Require Phone Number</Label>
              <Switch {...register('auth_settings.require_phone')} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Require OTP Verification</Label>
              <Switch
                {...register('auth_settings.require_otp')}
                disabled={!requireEmail && !requirePhone}
              />
            </div>

            {requireOtp && (requireEmail || requirePhone) && (
              <div className="pl-6">
                <Label className="mb-3 block">OTP Method</Label>
                <RadioGroup {...register('auth_settings.otp_method')}>
                  {requireEmail && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                  )}
                  {requirePhone && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="sms" />
                      <Label htmlFor="sms">SMS</Label>
                    </div>
                  )}
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voting Rules */}
        <Card>
          <CardHeader>
            <CardTitle>🗳️ Voting Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Max votes per voter (per category)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                {...register('max_votes_per_voter')}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Ví dụ: 3 = Mỗi người vote tối đa 3 ứng viên cho mỗi danh hiệu
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Allow edit before deadline</Label>
                <p className="text-sm text-muted-foreground">
                  Voters can change their votes before voting closes
                </p>
              </div>
              <Switch {...register('allow_edit_before_deadline')} />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
```

---

### 3.3. Categories Management (`/admin/categories`)

**Purpose**: CRUD categories (danh hiệu)

**Layout**: Table với columns: Name, Description, Order, Candidates Count, Actions

---

### 3.4. Candidates Management (`/admin/candidates`)

**Purpose**: CRUD candidates với upload photo

**Features**:
- Upload photo to Supabase Storage
- Assign to category
- Set display order
- Edit/Delete

---

### 3.5. Voters List (`/admin/voters`)

**Purpose**: Xem danh sách người đã vote

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Voters List                   [Export CSV]  │
├─────────────────────────────────────────────┤
│                                             │
│  Search: [___________]    Filter: [All ▼]  │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Email           Phone      Voted   At │ │
│  ├───────────────────────────────────────┤ │
│  │ john@ex.com   0901...  ✅  10:30 AM  │ │
│  │ jane@ex.com   0902...  ✅  10:32 AM  │ │
│  │ mike@ex.com   0903...  ✅  10:35 AM  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Showing 1-50 of 150    [< Prev] [Next >]  │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 3.6. Results Analytics (`/admin/results`)

**Purpose**: Kết quả chi tiết hơn trang public

**Additional Features**:
- Export to Excel
- Vote timeline graph
- Breakdown by time
- Export raw data

---

## 4. NAVIGATION & ROUTING

### 4.1. Sitemap
```
/                        Landing Page
/vote                    Voting Page (with AuthModal)
/results                 Public Results (Realtime)

/admin                   Dashboard
/admin/events            Event Settings ⭐ QUAN TRỌNG
/admin/categories        Categories CRUD
/admin/candidates        Candidates CRUD
/admin/voters            Voters List
/admin/results           Results Analytics
```

### 4.2. Header Navigation

**Public Header**:
```typescript
<header>
  <nav>
    <Link href="/">Home</Link>
    <Link href="/vote">Vote</Link>
    <Link href="/results">Results</Link>
    <Link href="/admin">Admin</Link>
  </nav>
</header>
```

**Admin Header**:
```typescript
<header>
  <nav>
    <Link href="/admin">Dashboard</Link>
    <Link href="/admin/events">Settings</Link>
    <Link href="/admin/categories">Categories</Link>
    <Link href="/admin/candidates">Candidates</Link>
    <Link href="/admin/voters">Voters</Link>
    <Link href="/admin/results">Results</Link>
  </nav>
  <UserMenu />
</header>
```

---

## ✅ CHECKLIST

### Public Pages ✅
- [ ] Landing Page with stats
- [ ] Voting Page with multiple selection
- [ ] Results Page with realtime

### Admin Pages ✅
- [ ] Dashboard with overview
- [ ] Event Settings (auth + voting rules)
- [ ] Categories Management
- [ ] Candidates Management
- [ ] Voters List
- [ ] Results Analytics

### Features ✅
- [ ] AuthModal (modal-based login)
- [ ] Multiple votes per category
- [ ] Edit vote feature (configurable)
- [ ] Realtime results
- [ ] Photo upload
- [ ] Export CSV/Excel

---

**Last updated**: 2025-11-05
**Status**: Complete specification ✅
