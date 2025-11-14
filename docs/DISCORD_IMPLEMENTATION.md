# Discord Logging Implementation Examples

This document provides ready-to-use implementation examples for integrating Discord logging into your Bright4Event pages.

## Table of Contents
1. [Page View Tracking](#page-view-tracking)
2. [Button Click Tracking](#button-click-tracking)
3. [Form Submission Tracking](#form-submission-tracking)
4. [Event Actions Tracking](#event-actions-tracking)
5. [Admin Actions Tracking](#admin-actions-tracking)
6. [Authentication Tracking](#authentication-tracking)

---

## Page View Tracking

### Home Page (`app/page.tsx`)

```typescript
"use client"

import { useEffect } from "react"
import { useAppSelector } from "@/store/hooks"
import DiscordLogger from "@/lib/discord-logger"

export default function HomePage() {
  const { user } = useAppSelector((state) => state.auth)

  // Track page view on mount
  useEffect(() => {
    DiscordLogger.pageViewHome(user?.email)
  }, [user])

  return (
    <div>
      {/* Your home page content */}
    </div>
  )
}
```

### Pricing Page (`app/pricing/page.tsx`)

```typescript
"use client"

import { useEffect } from "react"
import DiscordLogger from "@/lib/discord-logger"

export default function PricingPage() {
  useEffect(() => {
    // Track pricing page view (usually anonymous)
    DiscordLogger.pageViewPricing()
  }, [])

  return (
    <div>
      {/* Pricing content */}
    </div>
  )
}
```

### Contact Page (`app/contact/page.tsx`)

```typescript
"use client"

import { useEffect } from "react"
import DiscordLogger from "@/lib/discord-logger"

export default function ContactPage() {
  useEffect(() => {
    DiscordLogger.pageViewContact()
  }, [])

  return (
    <div>
      {/* Contact form */}
    </div>
  )
}
```

### Event Voting Page (`app/event/[eventId]/vote/page.tsx`)

```typescript
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import DiscordLogger from "@/lib/discord-logger"

export default function VotingPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [eventName, setEventName] = useState("")
  const [voterId, setVoterId] = useState<string | null>(null)

  // Load event data
  useEffect(() => {
    const loadEvent = async () => {
      const response = await fetch(`/api/events/${eventId}`)
      const data = await response.json()
      setEventName(data.name)
    }

    if (eventId) {
      loadEvent()
    }
  }, [eventId])

  // Track page view when event data is loaded
  useEffect(() => {
    if (eventId && eventName) {
      // Optional: Pass voter email if available
      DiscordLogger.pageViewEventVote(eventId, eventName)
    }
  }, [eventId, eventName])

  return (
    <div>
      {/* Voting interface */}
    </div>
  )
}
```

### Event Results Page (`app/event/[eventId]/results/page.tsx`)

```typescript
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import DiscordLogger from "@/lib/discord-logger"

export default function ResultsPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [eventName, setEventName] = useState("")

  useEffect(() => {
    const loadAndTrack = async () => {
      // Load event details
      const response = await fetch(`/api/events/${eventId}`)
      const data = await response.json()
      setEventName(data.name)

      // Track results page view
      DiscordLogger.pageViewEventResults(eventId, data.name)
    }

    if (eventId) {
      loadAndTrack()
    }
  }, [eventId])

  return (
    <div>
      {/* Results display */}
    </div>
  )
}
```

### Admin Dashboard (`app/admin/(authenticated)/dashboard/page.tsx`)

```typescript
"use client"

import { useEffect } from "react"
import { useAppSelector } from "@/store/hooks"
import DiscordLogger from "@/lib/discord-logger"

export default function AdminDashboard() {
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (user?.email) {
      DiscordLogger.pageViewAdminDashboard(user.email)
    }
  }, [user])

  return (
    <div>
      {/* Dashboard content */}
    </div>
  )
}
```

---

## Button Click Tracking

### Create Event Button (`app/page.tsx`)

```typescript
"use client"

import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"
import DiscordLogger from "@/lib/discord-logger"

export default function HomePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const handleCreateEvent = () => {
    // Track button click
    DiscordLogger.buttonClickCreateEvent(user?.email)

    if (isAuthenticated) {
      router.push('/admin/dashboard')
    } else {
      dispatch(openLoginModal({
        postLoginAction: 'dashboard',
        redirectPath: '/admin/dashboard'
      }))
    }
  }

  return (
    <button onClick={handleCreateEvent}>
      Create Event
    </button>
  )
}
```

### View Demo Button (`app/page.tsx`)

```typescript
"use client"

import Link from "next/link"
import { DEMO_EVENT_ID } from "@/lib/constants"
import DiscordLogger from "@/lib/discord-logger"

export default function HomePage() {
  const handleViewDemo = () => {
    // Track demo button click
    DiscordLogger.buttonClickViewDemo(undefined, DEMO_EVENT_ID)
  }

  return (
    <Link href={`/event/${DEMO_EVENT_ID}`}>
      <button onClick={handleViewDemo}>
        View Demo
      </button>
    </Link>
  )
}
```

### Join Event Button (`app/page.tsx`)

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DiscordLogger from "@/lib/discord-logger"

export default function HomePage() {
  const router = useRouter()
  const [eventCode, setEventCode] = useState("")

  const handleJoinEvent = () => {
    if (!eventCode.trim()) {
      alert("Please enter event code")
      return
    }

    // Track join event action
    DiscordLogger.buttonClickJoinEvent(eventCode)

    // Navigate to event
    router.push(`/event/${eventCode}`)
  }

  return (
    <div>
      <input
        value={eventCode}
        onChange={(e) => setEventCode(e.target.value)}
        placeholder="Enter event code"
      />
      <button onClick={handleJoinEvent}>
        Join Event
      </button>
    </div>
  )
}
```

---

## Form Submission Tracking

### Contact Form (`app/contact/page.tsx`)

```typescript
"use client"

import { useState } from "react"
import DiscordLogger from "@/lib/discord-logger"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestType: 'support',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Log contact form submission to Discord
      await DiscordLogger.contactFormSubmit(
        formData.name,
        formData.email,
        formData.phone,
        formData.requestType,
        formData.message
      )

      // Send to webhook or API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Thank you for contacting us!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          requestType: 'support',
          message: ''
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)

      // Log error to Discord
      await DiscordLogger.error('Contact form submission failed', {
        Email: formData.email,
        Error: error instanceof Error ? error.message : 'Unknown'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
        required
      />
      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        placeholder="Phone"
      />
      <select
        value={formData.requestType}
        onChange={(e) => setFormData(prev => ({ ...prev, requestType: e.target.value }))}
      >
        <option value="support">Technical Support</option>
        <option value="consultation">Service Consultation</option>
        <option value="other">Other</option>
      </select>
      <textarea
        value={formData.message}
        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
        placeholder="Message"
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
```

### Newsletter Subscription

```typescript
"use client"

import { useState } from "react"
import DiscordLogger from "@/lib/discord-logger"

export default function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Log newsletter subscription
      await DiscordLogger.newsletterSubscribe(email, source)

      // Send to newsletter service
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      })

      alert('Successfully subscribed!')
      setEmail('')
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubscribe}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit" disabled={isSubmitting}>
        Subscribe
      </button>
    </form>
  )
}
```

---

## Event Actions Tracking

### Check-in Success (`app/event/[eventId]/check-in-form/page.tsx`)

```typescript
"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import DiscordLogger from "@/lib/discord-logger"

export default function CheckInFormPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckIn = async (data: { type: 'phone' | 'code', value: string }) => {
    setIsLoading(true)

    try {
      // Process check-in
      const response = await fetch('/api/events/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          [data.type]: data.value
        })
      })

      if (!response.ok) {
        throw new Error('Check-in failed')
      }

      const result = await response.json()

      // Log successful check-in to Discord
      await DiscordLogger.eventCheckInSuccess(
        eventId,
        result.eventName || 'Unknown Event',
        data.value,
        data.type
      )

      // Show success animation
      // Then redirect to welcome screen
      setTimeout(() => {
        router.push(`/event/${eventId}/welcome`)
      }, 3000)

    } catch (error) {
      console.error('Check-in error:', error)

      // Log error
      await DiscordLogger.error('Check-in failed', {
        'Event ID': eventId,
        'Identifier': data.value,
        'Type': data.type
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Check-in form */}
    </div>
  )
}
```

### Vote Submission (`app/event/[eventId]/vote/page.tsx`)

```typescript
"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import DiscordLogger from "@/lib/discord-logger"
import { voteSuccessToast } from "@/hooks/use-toast"

export default function VotingPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [eventName, setEventName] = useState("GLOW UP 2025")
  const [voterId, setVoterId] = useState<string | null>(null)
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  const submitVotes = async (voterIdParam: string) => {
    setSubmitting(true)

    try {
      const votes = Object.entries(selectedVotes)
        .filter(([_, candidateIds]) => candidateIds.length > 0)
        .map(([categoryId, candidateIds]) => ({
          category_id: categoryId,
          candidate_ids: candidateIds,
        }))

      // Submit votes to API
      const response = await fetch("/api/votes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voter_id: voterIdParam,
          event_id: eventId,
          votes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit votes")
      }

      // Log vote update to Discord
      await DiscordLogger.voteUpdate(
        eventId,
        eventName,
        voterIdParam,
        votes.length, // Number of categories voted in
        votes.reduce((sum, v) => sum + v.candidate_ids.length, 0) // Total votes
      )

      // Show success toast
      voteSuccessToast({ isUpdate: false })

    } catch (error) {
      console.error("Error submitting votes:", error)

      // Log error to Discord
      await DiscordLogger.error('Vote submission failed', {
        'Event ID': eventId,
        'Voter ID': voterIdParam,
        Error: error instanceof Error ? error.message : 'Unknown'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Voting interface */}
    </div>
  )
}
```

---

## Admin Actions Tracking

### Create Event (`app/admin/(authenticated)/events/page.tsx`)

```typescript
"use client"

import { useState } from "react"
import { useAppSelector } from "@/store/hooks"
import DiscordLogger from "@/lib/discord-logger"

export default function AdminEventsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [isCreating, setIsCreating] = useState(false)

  const createEvent = async (eventData: any) => {
    setIsCreating(true)

    try {
      // Create event via API
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      const newEvent = await response.json()

      // Log event creation to Discord
      await DiscordLogger.adminEventCreate(
        newEvent.id,
        newEvent.name,
        user?.email || 'Unknown Admin',
        eventData.event_date
      )

      alert('Event created successfully!')
      // Reload events list
    } catch (error) {
      console.error('Error creating event:', error)

      await DiscordLogger.error('Event creation failed', {
        'Admin': user?.email || 'Unknown',
        'Event Name': eventData.name,
        Error: error instanceof Error ? error.message : 'Unknown'
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div>
      {/* Event management UI */}
    </div>
  )
}
```

### Update Event

```typescript
const updateEvent = async (eventId: string, eventName: string, updates: any) => {
  try {
    const response = await fetch(`/api/admin/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error('Failed to update event')
    }

    // Create a human-readable changes summary
    const changes = Object.keys(updates).join(', ')

    // Log to Discord
    await DiscordLogger.adminEventUpdate(
      eventId,
      eventName,
      user?.email || 'Unknown Admin',
      changes
    )

    alert('Event updated successfully!')
  } catch (error) {
    console.error('Error updating event:', error)
  }
}
```

### Delete Event

```typescript
const deleteEvent = async (eventId: string, eventName: string) => {
  if (!confirm(`Are you sure you want to delete "${eventName}"?`)) {
    return
  }

  try {
    const response = await fetch(`/api/admin/events/${eventId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete event')
    }

    // Log deletion to Discord
    await DiscordLogger.adminEventDelete(
      eventId,
      eventName,
      user?.email || 'Unknown Admin'
    )

    alert('Event deleted successfully!')
    // Reload events list
  } catch (error) {
    console.error('Error deleting event:', error)
  }
}
```

### Create Category

```typescript
const createCategory = async (categoryData: any) => {
  try {
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    })

    if (!response.ok) {
      throw new Error('Failed to create category')
    }

    const newCategory = await response.json()

    // Log to Discord
    await DiscordLogger.adminCategoryCreate(
      newCategory.id,
      newCategory.name,
      categoryData.event_id,
      user?.email || 'Unknown Admin'
    )

    alert('Category created successfully!')
  } catch (error) {
    console.error('Error creating category:', error)
  }
}
```

### Create Candidate

```typescript
const createCandidate = async (candidateData: any, categoryName: string) => {
  try {
    const response = await fetch('/api/admin/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidateData)
    })

    if (!response.ok) {
      throw new Error('Failed to create candidate')
    }

    const newCandidate = await response.json()

    // Log to Discord
    await DiscordLogger.adminCandidateCreate(
      newCandidate.id,
      newCandidate.name,
      categoryName,
      user?.email || 'Unknown Admin'
    )

    alert('Candidate created successfully!')
  } catch (error) {
    console.error('Error creating candidate:', error)
  }
}
```

### Update Settings

```typescript
const updateSettings = async (settingName: string, newValue: any) => {
  try {
    const response = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [settingName]: newValue })
    })

    if (!response.ok) {
      throw new Error('Failed to update settings')
    }

    // Log to Discord
    await DiscordLogger.adminSettingsUpdate(
      settingName,
      String(newValue),
      user?.email || 'Unknown Admin'
    )

    alert('Settings updated successfully!')
  } catch (error) {
    console.error('Error updating settings:', error)
  }
}
```

---

## Authentication Tracking

### User Login

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DiscordLogger from "@/lib/discord-logger"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      // Log successful login to Discord
      await DiscordLogger.userLogin(email, 'email')

      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Admin Login (API Route)

```typescript
// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import DiscordLogger from '@/lib/discord-logger'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Verify credentials
    const admin = await verifyAdmin(email, password)

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session
    const token = createToken(admin)

    // Log successful admin login
    await DiscordLogger.adminLogin(email)

    return NextResponse.json({
      success: true,
      token,
      user: admin
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Guest Authentication (`components/AuthModal.tsx`)

```typescript
"use client"

import { useState } from "react"
import DiscordLogger from "@/lib/discord-logger"

interface AuthModalProps {
  eventId: string
  eventName: string
  onSuccess: (voterId: string) => void
}

export default function AuthModal({ eventId, eventName, onSuccess }: AuthModalProps) {
  const [loading, setLoading] = useState(false)

  const handleGuestAuth = async (data: { type: 'phone' | 'code', value: string }) => {
    setLoading(true)

    try {
      const response = await fetch("/api/auth/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          phone: data.type === 'phone' ? data.value : undefined,
          email: data.type === 'code' ? `${data.value}@guest.temp` : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Authentication failed")
      }

      const responseData = await response.json()

      // Log successful guest authentication
      await DiscordLogger.guestAuthSuccess(
        eventId,
        eventName,
        data.value,
        data.type
      )

      onSuccess(responseData.voter_id)
    } catch (error) {
      console.error("Auth error:", error)
      alert("Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Auth form UI */}
    </div>
  )
}
```

---

## Quick Reference Checklist

Use this checklist when implementing Discord logging in new pages:

### For Public Pages
- [ ] Import `DiscordLogger` from `@/lib/discord-logger`
- [ ] Add `useEffect` hook for page view tracking
- [ ] Call appropriate `pageView*` method
- [ ] Pass user email if available

### For Event Pages
- [ ] Get `eventId` from route params
- [ ] Fetch `eventName` from API
- [ ] Call `pageViewEvent*` with both eventId and eventName
- [ ] Track all user actions (check-in, votes, etc.)

### For Admin Pages
- [ ] Get user email from Redux state
- [ ] Call `pageViewAdmin*` with user email
- [ ] Track all CRUD operations (create, update, delete)
- [ ] Use appropriate event type (SUCCESS, WARNING, etc.)

### For Forms
- [ ] Track form submission
- [ ] Log errors if submission fails
- [ ] Include relevant form data (not sensitive info)

### For Buttons
- [ ] Track button clicks before navigation
- [ ] Include user email if available
- [ ] Include relevant context (page, action, etc.)

---

## Testing Your Implementation

1. **Set production mode**:
   ```bash
   NODE_ENV=production npm run dev
   ```

2. **Trigger the action** (click button, visit page, etc.)

3. **Check Discord channel** for the notification

4. **Verify fields** are correct and complete

5. **Reset environment** when done testing

---

**Last Updated:** 2025-01-14
**Version:** 1.0
**Maintainer:** Code4Change Team
