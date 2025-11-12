# API SPECIFICATION - Bright4Event

> Chi tiết về tất cả API endpoints, request/response formats, và business logic

---

## 📋 MỤC LỤC

1. [Overview](#1-overview)
2. [Authentication Endpoints](#2-authentication-endpoints)
3. [Voting Endpoints](#3-voting-endpoints)
4. [Public Data Endpoints](#4-public-data-endpoints)
5. [Admin Endpoints](#5-admin-endpoints)
6. [Error Handling](#6-error-handling)
7. [Rate Limiting](#7-rate-limiting)

---

## 1. OVERVIEW

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.vercel.app/api`

### API Style
- **Type**: REST API
- **Framework**: Next.js API Routes (App Router)
- **Location**: `app/api/*/route.ts`
- **Authentication**: Cookie-based sessions

### Response Format
```typescript
// Success response
{
  "success": true,
  "data": { ... }
}

// Error response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE" // optional
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 2. AUTHENTICATION ENDPOINTS

### 2.1. Send OTP

**Endpoint**: `POST /api/auth/send-otp`

**Description**: Gửi OTP code qua email để xác thực người dùng

**Request Body**:
```typescript
{
  email: string      // Valid email format
  phone: string      // 10-11 digits
}
```

**Validation Schema** (Zod):
```typescript
const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10).max(11).regex(/^\d+$/, 'Số điện thoại chỉ chứa số')
})
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "OTP đã được gửi đến email của bạn",
  "expiresIn": 600
}
```

**Error Responses**:
```json
// 400 - Validation Error
{
  "success": false,
  "error": "Email không hợp lệ"
}

// 429 - Rate Limit
{
  "success": false,
  "error": "Bạn đã yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau 1 giờ",
  "code": "RATE_LIMIT_EXCEEDED"
}

// 500 - Server Error
{
  "success": false,
  "error": "Không thể gửi OTP. Vui lòng thử lại"
}
```

**Implementation**:
```typescript
// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(11),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone } = schema.parse(body)

    const supabase = createClient()

    // Rate limiting: Check recent OTP requests
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const { data: recentOTPs } = await supabase
      .from('otp_verifications')
      .select('id')
      .eq('email', email)
      .gte('created_at', oneHourAgo.toISOString())

    if (recentOTPs && recentOTPs.length >= 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bạn đã yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau 1 giờ',
          code: 'RATE_LIMIT_EXCEEDED',
        },
        { status: 429 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database
    const { error: insertError } = await supabase
      .from('otp_verifications')
      .insert({
        email,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
      })

    if (insertError) throw insertError

    // Send OTP via email (Supabase Auth or Resend)
    // TODO: Implement email sending
    // await sendOTPEmail(email, otp)

    return NextResponse.json({
      success: true,
      message: 'OTP đã được gửi đến email của bạn',
      expiresIn: 600,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Không thể gửi OTP. Vui lòng thử lại' },
      { status: 500 }
    )
  }
}
```

**Rate Limiting**:
- Max 3 OTP requests per email per hour
- Implemented at application level (check database)

---

### 2.2. Verify OTP

**Endpoint**: `POST /api/auth/verify-otp`

**Description**: Xác thực OTP code và tạo session cho voter

**Request Body**:
```typescript
{
  email: string
  otp: string        // 6-digit code
  phone?: string     // Optional, from previous step
}
```

**Validation Schema**:
```typescript
const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP phải có 6 chữ số'),
  phone: z.string().optional(),
})
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "voter": {
      "id": "uuid",
      "email": "user@example.com",
      "verified_at": "2025-11-05T10:00:00Z"
    }
  }
}
```

**Error Responses**:
```json
// 400 - Invalid OTP
{
  "success": false,
  "error": "OTP không hợp lệ hoặc đã hết hạn",
  "code": "INVALID_OTP"
}

// 400 - Already verified
{
  "success": false,
  "error": "OTP đã được sử dụng",
  "code": "OTP_ALREADY_USED"
}
```

**Implementation**:
```typescript
// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp, phone } = schema.parse(body)

    const supabase = createClient()

    // Find valid OTP
    const { data: otpRecord, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !otpRecord) {
      return NextResponse.json(
        {
          success: false,
          error: 'OTP không hợp lệ hoặc đã hết hạn',
          code: 'INVALID_OTP',
        },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id)

    // Create or update voter record
    const { data: voter, error: voterError } = await supabase
      .from('voters')
      .upsert(
        {
          email,
          phone: phone || null,
          verified_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select()
      .single()

    if (voterError) throw voterError

    // Set session cookie
    cookies().set('voter_id', voter.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return NextResponse.json({
      success: true,
      data: { voter },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Xác thực thất bại' },
      { status: 500 }
    )
  }
}
```

**Session Management**:
- Cookie name: `voter_id`
- HTTPOnly: `true` (cannot access via JavaScript)
- Secure: `true` in production
- SameSite: `lax`
- Max age: 24 hours

---

### 2.3. Logout

**Endpoint**: `POST /api/auth/logout`

**Description**: Xóa session của voter

**Request**: None (uses cookie)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

**Implementation**:
```typescript
// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  cookies().delete('voter_id')

  return NextResponse.json({
    success: true,
    message: 'Đăng xuất thành công',
  })
}
```

---

## 3. VOTING ENDPOINTS

### 3.1. Submit/Update Votes

**Endpoint**: `POST /api/votes`

**Description**: Submit hoặc update phiếu bầu cho các danh hiệu

**Authentication**: Required (cookie: `voter_id`)

**Request Body**:
```typescript
{
  votes: Array<{
    category_id: string
    candidate_id: string
  }>
}
```

**Validation**:
- Voter must be authenticated
- Voting must be open (before `voting_close_time`)
- Candidate must belong to category
- Max 1 vote per category per voter (upsert logic)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Phiếu bầu đã được ghi nhận",
  "data": {
    "votes_count": 3
  }
}
```

**Error Responses**:
```json
// 401 - Not authenticated
{
  "success": false,
  "error": "Vui lòng đăng nhập để bình chọn",
  "code": "UNAUTHORIZED"
}

// 403 - Voting closed
{
  "success": false,
  "error": "Thời gian bình chọn đã kết thúc",
  "code": "VOTING_CLOSED"
}

// 400 - Invalid candidate for category
{
  "success": false,
  "error": "Ứng viên không thuộc danh hiệu này",
  "code": "INVALID_CANDIDATE"
}
```

**Implementation**:
```typescript
// app/api/votes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

const schema = z.object({
  votes: z.array(
    z.object({
      category_id: z.string().uuid(),
      candidate_id: z.string().uuid(),
    })
  ),
})

export async function POST(request: NextRequest) {
  try {
    const voterId = cookies().get('voter_id')?.value

    if (!voterId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vui lòng đăng nhập để bình chọn',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { votes } = schema.parse(body)

    const supabase = createClient()

    // Check if voting is open
    const { data: activeEvent } = await supabase
      .from('events')
      .select('id, voting_close_time')
      .eq('is_active', true)
      .single()

    if (!activeEvent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không có sự kiện nào đang diễn ra',
          code: 'NO_ACTIVE_EVENT',
        },
        { status: 400 }
      )
    }

    const now = new Date()
    const closeTime = new Date(activeEvent.voting_close_time)

    if (now >= closeTime) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thời gian bình chọn đã kết thúc',
          code: 'VOTING_CLOSED',
        },
        { status: 403 }
      )
    }

    // Prepare vote records
    const voteRecords = votes.map((vote) => ({
      voter_id: voterId,
      category_id: vote.category_id,
      candidate_id: vote.candidate_id,
    }))

    // Upsert votes (insert or update on conflict)
    const { error: voteError } = await supabase
      .from('votes')
      .upsert(voteRecords, {
        onConflict: 'voter_id,category_id',
      })

    if (voteError) throw voteError

    return NextResponse.json({
      success: true,
      message: 'Phiếu bầu đã được ghi nhận',
      data: {
        votes_count: votes.length,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Không thể ghi nhận phiếu bầu' },
      { status: 500 }
    )
  }
}
```

---

### 3.2. Get My Votes

**Endpoint**: `GET /api/votes/my-votes`

**Description**: Lấy danh sách phiếu bầu của voter hiện tại

**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "votes": [
      {
        "id": "uuid",
        "category_id": "uuid",
        "candidate_id": "uuid",
        "created_at": "2025-11-05T10:00:00Z",
        "updated_at": "2025-11-05T10:00:00Z"
      }
    ]
  }
}
```

**Implementation**:
```typescript
// app/api/votes/my-votes/route.ts
export async function GET(request: NextRequest) {
  const voterId = cookies().get('voter_id')?.value

  if (!voterId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  const supabase = createClient()

  const { data: votes, error } = await supabase
    .from('votes')
    .select('*')
    .eq('voter_id', voterId)

  if (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    data: { votes },
  })
}
```

---

## 4. PUBLIC DATA ENDPOINTS

### 4.1. Get Active Event

**Endpoint**: `GET /api/events/active`

**Description**: Lấy thông tin sự kiện đang active với categories và candidates

**Authentication**: Not required

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "uuid",
      "name": "King & Queen of the Night 2025",
      "description": "...",
      "start_time": "2025-12-31T18:00:00Z",
      "end_time": "2025-12-31T23:59:59Z",
      "voting_close_time": "2025-12-31T22:00:00Z",
      "is_voting_open": true,
      "categories": [
        {
          "id": "uuid",
          "name": "King of the Night",
          "description": "...",
          "order": 1,
          "candidates": [
            {
              "id": "uuid",
              "name": "John Doe",
              "photo_url": "https://...",
              "description": "...",
              "order": 1
            }
          ]
        }
      ]
    }
  }
}
```

**Error Response**:
```json
// 404 - No active event
{
  "success": false,
  "error": "Không có sự kiện nào đang diễn ra",
  "code": "NO_ACTIVE_EVENT"
}
```

**Implementation**:
```typescript
// app/api/events/active/route.ts
export async function GET() {
  const supabase = createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      categories (
        *,
        candidates (*)
      )
    `)
    .eq('is_active', true)
    .single()

  if (error || !event) {
    return NextResponse.json(
      {
        success: false,
        error: 'Không có sự kiện nào đang diễn ra',
        code: 'NO_ACTIVE_EVENT',
      },
      { status: 404 }
    )
  }

  // Sort categories and candidates by order
  event.categories = event.categories
    .sort((a, b) => a.order - b.order)
    .map((cat) => ({
      ...cat,
      candidates: cat.candidates.sort((a, b) => a.order - b.order),
    }))

  // Check if voting is open
  const isVotingOpen = new Date() < new Date(event.voting_close_time)

  return NextResponse.json({
    success: true,
    data: {
      event: {
        ...event,
        is_voting_open: isVotingOpen,
      },
    },
  })
}
```

---

### 4.2. Get Results (Realtime)

**Endpoint**: `GET /api/results`

**Description**: Lấy kết quả bình chọn realtime

**Query Parameters**:
- `event_id` (optional): UUID of event (defaults to active event)

**Authentication**: Not required (public results)

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "event_id": "uuid",
    "event_name": "King & Queen of the Night 2025",
    "categories": [
      {
        "id": "uuid",
        "name": "King of the Night",
        "order": 1,
        "results": [
          {
            "candidate_id": "uuid",
            "candidate_name": "John Doe",
            "photo_url": "https://...",
            "vote_count": 150,
            "rank": 1
          },
          {
            "candidate_id": "uuid",
            "candidate_name": "Michael Smith",
            "photo_url": "https://...",
            "vote_count": 120,
            "rank": 2
          }
        ]
      }
    ],
    "total_votes": 500,
    "last_updated": "2025-11-05T10:30:00Z"
  }
}
```

**Implementation**:
```typescript
// app/api/results/route.ts
export async function GET(request: NextRequest) {
  const supabase = createClient()

  const { data: results, error } = await supabase
    .from('vote_results') // View created in database
    .select('*')

  if (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    )
  }

  // Group by category
  const categoriesMap = new Map()

  results.forEach((row) => {
    if (!categoriesMap.has(row.category_id)) {
      categoriesMap.set(row.category_id, {
        id: row.category_id,
        name: row.category_name,
        order: row.category_order,
        results: [],
      })
    }

    categoriesMap.get(row.category_id).results.push({
      candidate_id: row.candidate_id,
      candidate_name: row.candidate_name,
      photo_url: row.photo_url,
      vote_count: row.vote_count,
      rank: row.rank,
    })
  })

  const categories = Array.from(categoriesMap.values()).sort(
    (a, b) => a.order - b.order
  )

  const totalVotes = results.reduce((sum, row) => sum + row.vote_count, 0)

  return NextResponse.json({
    success: true,
    data: {
      event_id: results[0]?.event_id,
      event_name: results[0]?.event_name,
      categories,
      total_votes: totalVotes,
      last_updated: new Date().toISOString(),
    },
  })
}
```

---

## 5. ADMIN ENDPOINTS

### 5.1. Admin Authentication

**Middleware**: Check admin cookie/token

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value

    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'ADMIN_ONLY' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/admin/:path*',
}
```

### 5.2. Create Event

**Endpoint**: `POST /api/admin/events`

**Request Body**:
```typescript
{
  name: string
  description?: string
  start_time: string       // ISO 8601
  end_time: string
  voting_close_time: string
  is_active: boolean
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "event": { /* created event */ }
  }
}
```

### 5.3. Create Category

**Endpoint**: `POST /api/admin/categories`

**Request Body**:
```typescript
{
  event_id: string
  name: string
  description?: string
  order: number
}
```

### 5.4. Create Candidate

**Endpoint**: `POST /api/admin/candidates`

**Request Body**:
```typescript
{
  category_id: string
  name: string
  photo_url?: string
  description?: string
  order: number
}
```

### 5.5. Upload Candidate Photo

**Endpoint**: `POST /api/admin/upload-photo`

**Content-Type**: `multipart/form-data`

**Request Body**:
```typescript
{
  file: File    // Image file (JPEG, PNG, WebP)
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "url": "https://xxx.supabase.co/storage/v1/object/public/candidate-photos/123.jpg"
  }
}
```

**Implementation**:
```typescript
// app/api/admin/upload-photo/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    const fileName = `${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from('candidate-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from('candidate-photos').getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      data: { url: publicUrl },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}
```

---

## 6. ERROR HANDLING

### Error Codes
```typescript
enum ErrorCode {
  // Auth
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_OTP = 'INVALID_OTP',
  OTP_ALREADY_USED = 'OTP_ALREADY_USED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Voting
  VOTING_CLOSED = 'VOTING_CLOSED',
  NO_ACTIVE_EVENT = 'NO_ACTIVE_EVENT',
  INVALID_CANDIDATE = 'INVALID_CANDIDATE',

  // Admin
  ADMIN_ONLY = 'ADMIN_ONLY',

  // General
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}
```

### Global Error Handler
```typescript
// lib/api-error-handler.ts
export function handleAPIError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: error.errors[0].message,
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    )
  }

  console.error('API Error:', error)

  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    },
    { status: 500 }
  )
}
```

---

## 7. RATE LIMITING

### Implementation Strategy
```typescript
// lib/rate-limiter.ts
import { createClient } from '@/lib/supabase/server'

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMinutes: number
): Promise<boolean> {
  const supabase = createClient()

  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

  const { data, error } = await supabase
    .from('rate_limits') // Create this table
    .select('count')
    .eq('identifier', identifier)
    .gte('created_at', windowStart.toISOString())

  if (error) return true // Allow on error

  return (data?.length || 0) < limit
}

export async function incrementRateLimit(identifier: string) {
  const supabase = createClient()

  await supabase.from('rate_limits').insert({
    identifier,
    created_at: new Date().toISOString(),
  })
}
```

### Rate Limits
| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/auth/send-otp` | 3 requests | 1 hour |
| `POST /api/auth/verify-otp` | 5 attempts | 10 minutes |
| `POST /api/votes` | 10 requests | 1 minute |

---

## 📚 SUMMARY

### Endpoints Overview
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/send-otp` | POST | ❌ | Gửi OTP |
| `/api/auth/verify-otp` | POST | ❌ | Xác thực OTP |
| `/api/auth/logout` | POST | ✅ | Đăng xuất |
| `/api/votes` | POST | ✅ | Submit votes |
| `/api/votes/my-votes` | GET | ✅ | Get my votes |
| `/api/events/active` | GET | ❌ | Get active event |
| `/api/results` | GET | ❌ | Get results |
| `/api/admin/*` | ALL | ✅ | Admin operations |

---

**Last updated**: 2025-11-05
**Status**: Ready for implementation ✅
