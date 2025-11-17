# UI COMPONENTS SPECIFICATION - Bright4Event

> Chi tiết về tất cả components, pages và UI/UX flows

---

## 📋 MỤC LỤC

1. [Design System](#1-design-system)
2. [Page Components](#2-page-components)
3. [Feature Components](#3-feature-components)
4. [Shared Components](#4-shared-components)
5. [Layout Components](#5-layout-components)
6. [shadcn/ui Components](#6-shadcnui-components)

---

## 1. DESIGN SYSTEM

### 1.1. Color Palette (Tailwind Config)

```typescript
// tailwind.config.ts
colors: {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  popover: {
    DEFAULT: "hsl(var(--popover))",
    foreground: "hsl(var(--popover-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
}
```

### 1.2. Typography

```css
/* globals.css */
h1 {
  @apply text-4xl font-bold tracking-tight lg:text-5xl;
}

h2 {
  @apply text-3xl font-semibold tracking-tight;
}

h3 {
  @apply text-2xl font-semibold tracking-tight;
}

p {
  @apply leading-7;
}

.muted {
  @apply text-sm text-muted-foreground;
}
```

### 1.3. Spacing & Breakpoints

```typescript
// Consistent spacing
const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  '2xl': '4rem',  // 64px
}

// Breakpoints (Tailwind defaults)
sm: '640px'
md: '768px'
lg: '1024px'
xl: '1280px'
2xl: '1536px'
```

---

## 2. PAGE COMPONENTS

### 2.1. Landing Page

**File**: `app/page.tsx`

**Purpose**: First page người dùng thấy sau khi quét QR

**Layout**:
```
┌─────────────────────────────────┐
│          Header/Logo            │
├─────────────────────────────────┤
│                                 │
│   [Hero Section]                │
│   Event Name & Description      │
│                                 │
│   [CTA Button]                  │
│   "Bắt đầu bình chọn"          │
│                                 │
│   [Info Cards]                  │
│   - Thời gian còn lại           │
│   - Số người đã vote            │
│   - Số danh hiệu                │
│                                 │
└─────────────────────────────────┘
```

**Components Used**:
- `Button` (shadcn)
- `Card` (shadcn)
- Custom: `EventCountdown`, `VoteStats`

**Code Structure**:
```typescript
// app/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/home/ui/button'
import { Card } from '@/home/ui/card'
import EventCountdown from '@/home/EventCountdown'
import Link from 'next/link'

export default async function LandingPage() {
  const supabase = createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .single()

  if (!event) {
    return <div>Không có sự kiện nào đang diễn ra</div>
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="mb-4">{event.name}</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {event.description}
        </p>
        <Button asChild size="lg">
          <Link href="/auth">Bắt đầu bình chọn</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="p-6 text-center">
          <EventCountdown deadline={event.voting_close_time} />
        </Card>
        {/* More cards... */}
      </div>
    </div>
  )
}
```

---

### 2.2. AuthModal Component (Modal-based Login)

**File**: `components/auth/AuthModal.tsx`

**Purpose**: Modal để authentication linh hoạt theo event settings (không redirect sang page mới)

**Key Features**:
- Dynamic form dựa trên `auth_settings` từ event
- 3 states: Input → OTP (optional) → Success
- Modal không redirect, voting tiếp tục trên cùng page
- Responsive và accessible

**States**:
```typescript
type AuthModalState = 'input' | 'otp' | 'loading' | 'success'
```

**Full Implementation**: Xem file `docs/authentication-flow.md` section 5.1

**Usage Example**:
```typescript
// In voting page
<AuthModal
  isOpen={isAuthModalOpen}
  onClose={() => setIsAuthModalOpen(false)}
  authSettings={event.auth_settings}
  onSuccess={() => {
    setIsAuthenticated(true)
    // Reload voting interface
  }}
/>
```

---

### 2.3. OTP Input Component (Optional - if OTP enabled)

**File**: `components/auth/OTPInput.tsx`

**Layout**:
```
┌─────────────────────────────────┐
│                                 │
│   "Nhập mã OTP"                │
│   "Đã gửi đến: email@..."      │
│                                 │
│   ┌───┬───┬───┬───┬───┬───┐   │
│   │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │   │
│   └───┴───┴───┴───┴───┴───┘   │
│                                 │
│   [Verify Button]               │
│                                 │
│   "Gửi lại OTP" (60s cooldown) │
│                                 │
└─────────────────────────────────┘
```

**Component**:
```typescript
// home/auth/OTPInput.tsx
'use client'

import { useState, useRef } from 'react'
import { Input } from '@/home/ui/input'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return

    const newValue = value.split('')
    newValue[index] = digit
    onChange(newValue.join('').slice(0, length))

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length)
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData)
      inputRefs.current[pastedData.length - 1]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            'w-12 h-14 text-center text-2xl font-semibold',
            'focus:ring-2 focus:ring-primary'
          )}
        />
      ))}
    </div>
  )
}
```

---

### 2.4. Voting Page

**File**: `app/(voting)/vote/page.tsx`

**Layout**:
```
┌─────────────────────────────────┐
│ [Header]                        │
│ Event Name | Time Left          │
├─────────────────────────────────┤
│                                 │
│ Category 1: King of the Night   │
│ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │  📷 │ │  📷 │ │  📷 │        │
│ │ [○] │ │ [●] │ │ [○] │        │
│ │Name │ │Name │ │Name │        │
│ └─────┘ └─────┘ └─────┘        │
│                                 │
│ Category 2: Queen of the Night  │
│ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │  📷 │ │  📷 │ │  📷 │        │
│ │ [○] │ │ [○] │ │ [●] │        │
│ │Name │ │Name │ │Name │        │
│ └─────┘ └─────┘ └─────┘        │
│                                 │
│     [Xác nhận bình chọn]        │
│                                 │
└─────────────────────────────────┘
```

**Components**:

#### CategoryCard Component
```typescript
// home/voting/CategoryCard.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/home/ui/card'
import { RadioGroup, RadioGroupItem } from '@/home/ui/radio-group'
import { Label } from '@/home/ui/label'
import CandidateCard from './CandidateCard'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    description: string
    candidates: any[]
  }
  selectedCandidate?: string
  onSelect: (candidateId: string) => void
}

export default function CategoryCard({
  category,
  selectedCandidate,
  onSelect,
}: CategoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        {category.description && (
          <CardDescription>{category.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedCandidate} onValueChange={onSelect}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category.candidates.map((candidate) => (
              <div key={candidate.id} className="relative">
                <RadioGroupItem
                  value={candidate.id}
                  id={candidate.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={candidate.id}
                  className="cursor-pointer block"
                >
                  <CandidateCard
                    candidate={candidate}
                    isSelected={selectedCandidate === candidate.id}
                  />
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
```

#### CandidateCard Component
```typescript
// home/voting/CandidateCard.tsx
import { Card, CardContent } from '@/home/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/home/ui/avatar'
import { Badge } from '@/home/ui/badge'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CandidateCardProps {
  candidate: {
    id: string
    name: string
    photo_url?: string
    description?: string
  }
  isSelected: boolean
}

export default function CandidateCard({
  candidate,
  isSelected,
}: CandidateCardProps) {
  return (
    <Card
      className={cn(
        'transition-all hover:shadow-lg',
        isSelected && 'ring-2 ring-primary shadow-xl'
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={candidate.photo_url} alt={candidate.name} />
              <AvatarFallback>
                {candidate.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isSelected && (
              <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg">{candidate.name}</h3>
            {candidate.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {candidate.description}
              </p>
            )}
          </div>

          {isSelected && (
            <Badge variant="default" className="mt-2">
              Đã chọn
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### 2.5. Results Page (Realtime)

**File**: `app/results/page.tsx`

**Layout**:
```
┌─────────────────────────────────┐
│ [Header] Kết quả bình chọn      │
│ 🔴 Live - Cập nhật realtime     │
├─────────────────────────────────┤
│                                 │
│ King of the Night               │
│ ┌──────────────────────────┐   │
│ │ 🥇 #1 John Doe   150 votes│   │
│ │ ████████████████░░  75%   │   │
│ └──────────────────────────┘   │
│ ┌──────────────────────────┐   │
│ │ 🥈 #2 Michael    120 votes│   │
│ │ ████████████░░░░  60%    │   │
│ └──────────────────────────┘   │
│                                 │
│ Queen of the Night              │
│ ...                             │
│                                 │
└─────────────────────────────────┘
```

**Component**:
```typescript
// app/results/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/home/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/home/ui/avatar'
import { Badge } from '@/home/ui/badge'
import { Progress } from '@/home/ui/progress'

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([])
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
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Kết quả bình chọn</h1>
        {isLive && (
          <Badge variant="destructive" className="animate-pulse">
            🔴 Live Update
          </Badge>
        )}
      </div>

      <div className="space-y-12">
        {results.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.results.map((result: any, index: number) => {
                const maxVotes = category.results[0]?.vote_count || 1
                const percentage = (result.vote_count / maxVotes) * 100

                return (
                  <div
                    key={result.candidate_id}
                    className="flex items-center gap-4 p-4 rounded-lg border"
                  >
                    <div className="text-2xl font-bold w-8">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
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
```

---

## 3. FEATURE COMPONENTS

### 3.1. EventCountdown

```typescript
// home/EventCountdown.tsx
'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Clock } from 'lucide-react'

interface EventCountdownProps {
  deadline: string
}

export default function EventCountdown({ deadline }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const distance = formatDistanceToNow(new Date(deadline), {
        addSuffix: true,
        locale: vi,
      })
      setTimeLeft(distance)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  return (
    <div className="flex items-center justify-center gap-2">
      <Clock className="w-5 h-5" />
      <div>
        <p className="text-sm text-muted-foreground">Thời gian còn lại</p>
        <p className="text-lg font-semibold">{timeLeft}</p>
      </div>
    </div>
  )
}
```

---

## 4. SHARED COMPONENTS

### 4.1. LoadingSpinner

```typescript
// home/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({
  size = 'md',
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <Loader2
      className={cn('animate-spin', sizeClasses[size], className)}
    />
  )
}
```

### 4.2. EmptyState

```typescript
// home/EmptyState.tsx
import { FileQuestion } from 'lucide-react'
import { Button } from '@/home/ui/button'

interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
```

---

## 5. LAYOUT COMPONENTS

### 5.1. Main Layout

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
```

### 5.2. Header Component

```typescript
// home/Header.tsx
import Link from 'next/link'
import { Button } from '@/home/ui/button'
import { LogOut } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Bright4Event
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/results">
            <Button variant="ghost">Kết quả</Button>
          </Link>
          <Button variant="ghost" size="icon">
            <LogOut className="w-4 h-4" />
          </Button>
        </nav>
      </div>
    </header>
  )
}
```

---

## 6. SHADCN/UI COMPONENTS

### Installation Commands

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add table
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add progress
```

### Component List

| Component | Usage | Location |
|-----------|-------|----------|
| Button | CTAs, actions | All pages |
| Card | Containers | Voting, Results |
| Input | Form inputs | Auth pages |
| Label | Form labels | Auth pages |
| Form | Form wrapper | Auth pages |
| RadioGroup | Candidate selection | Voting page |
| Avatar | User/Candidate photos | Voting, Results |
| Badge | Status indicators | Results |
| Progress | Vote percentage | Results |
| Dialog | Modals | Admin |
| Toast | Notifications | All pages |
| Table | Data display | Admin |

---

## 📚 COMPONENT CHECKLIST

### Pages ✅
- [ ] Landing Page (`app/page.tsx`)
- [ ] Login Page (`app/(auth)/auth/page.tsx`)
- [ ] OTP Verify Page (`app/(auth)/auth/verify/page.tsx`)
- [ ] Voting Page (`app/(voting)/vote/page.tsx`)
- [ ] Success Page (`app/(voting)/vote/success/page.tsx`)
- [ ] Results Page (`app/results/page.tsx`)

### Feature Components ✅
- [ ] CategoryCard (`components/voting/CategoryCard.tsx`)
- [ ] CandidateCard (`components/voting/CandidateCard.tsx`)
- [ ] OTPInput (`components/auth/OTPInput.tsx`)
- [ ] EventCountdown (`components/EventCountdown.tsx`)
- [ ] ResultsChart (`components/results/ResultsChart.tsx`)

### Shared Components ✅
- [ ] Header (`components/Header.tsx`)
- [ ] LoadingSpinner (`components/LoadingSpinner.tsx`)
- [ ] EmptyState (`components/EmptyState.tsx`)

### shadcn/ui Components ✅
- [ ] All required components installed
- [ ] Theme configured in `globals.css`
- [ ] Tailwind config updated

---

**Last updated**: 2025-11-05
**Status**: Ready for implementation ✅
