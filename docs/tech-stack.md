# TECH STACK - GalaVote

> Chi tiết về tất cả công nghệ, thư viện và dịch vụ được sử dụng trong dự án

---

## 📋 MỤC LỤC

1. [Frontend Stack](#1-frontend-stack)
2. [Backend Stack](#2-backend-stack)
3. [Database & Storage](#3-database--storage)
4. [Authentication & Security](#4-authentication--security)
5. [Email Service](#5-email-service)
6. [Deployment & Hosting](#6-deployment--hosting)
7. [Development Tools](#7-development-tools)

---

## 1. FRONTEND STACK

### 1.1. Framework: **Next.js 14+**
```json
"next": "^14.0.0"
```

**Tính năng sử dụng:**
- ✅ **App Router** - File-based routing mới
- ✅ **Server Components** - Render trên server, giảm bundle size
- ✅ **Server Actions** - API endpoints dễ dàng
- ✅ **Image Optimization** - Tự động optimize ảnh
- ✅ **Font Optimization** - Load font nhanh hơn
- ✅ **Metadata API** - SEO-friendly

**Tại sao chọn Next.js?**
- Full-stack framework, không cần setup riêng backend
- Server-side rendering tốt cho SEO
- Built-in routing, API routes
- Vercel deployment cực nhanh
- React Server Components giảm JavaScript bundle

### 1.2. UI Framework: **React 18+**
```json
"react": "^18.2.0",
"react-dom": "^18.2.0"
```

**Tính năng:**
- Concurrent features (useTransition, Suspense)
- Automatic batching
- Server Components support

### 1.3. Language: **TypeScript**
```json
"typescript": "^5.5.3"
```

**Lợi ích:**
- Type safety, catch errors sớm
- Better IntelliSense trong editor
- Tự động generate types từ Supabase
- Maintainability tốt hơn

### 1.4. Styling: **Tailwind CSS**
```json
"tailwindcss": "^3.4.0",
"tailwindcss-animate": "^1.0.7"
```

**Config đặc biệt:**
```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
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
        // ... more colors
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**Tại sao Tailwind?**
- Không cần viết CSS files
- Utility-first, compose dễ dàng
- PurgeCSS tự động, bundle nhỏ
- Responsive modifiers (sm:, md:, lg:)
- Dark mode built-in

### 1.5. UI Component Library: **shadcn/ui**
```bash
npx shadcn-ui@latest init
```

**Components sử dụng:**
- `button` - Buttons với variants
- `card` - Layout cards
- `input` - Form inputs
- `label` - Form labels
- `form` - Form wrapper với react-hook-form
- `select` - Dropdowns
- `dialog` - Modals
- `toast` - Notifications
- `dropdown-menu` - Context menus
- `avatar` - User avatars
- `badge` - Status badges
- `table` - Data tables
- `radio-group` - Radio buttons
- `separator` - Dividers

**Tại sao shadcn/ui?**
- ❌ KHÔNG phải npm package, copy vào project → full control
- ✅ Built trên Radix UI → accessibility tốt
- ✅ Customizable hoàn toàn → không bị lock-in
- ✅ TypeScript first
- ✅ Tailwind CSS → consistent styling
- ✅ Dark mode support
- ✅ Tree-shakeable → chỉ import components cần dùng

**Radix UI primitives:**
```json
"@radix-ui/react-slot": "^1.0.2",
"@radix-ui/react-dialog": "^1.0.5",
"@radix-ui/react-dropdown-menu": "^2.0.6",
"@radix-ui/react-label": "^2.0.2",
"@radix-ui/react-radio-group": "^1.1.3",
"@radix-ui/react-select": "^2.0.0",
"@radix-ui/react-separator": "^1.0.3",
"@radix-ui/react-avatar": "^1.0.4",
"@radix-ui/react-toast": "^1.1.5"
```

### 1.6. Form Handling: **React Hook Form + Zod**
```json
"react-hook-form": "^7.51.0",
"@hookform/resolvers": "^3.3.4",
"zod": "^3.22.4"
```

**Usage example:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
})

const form = useForm({
  resolver: zodResolver(loginSchema),
})
```

**Tại sao?**
- react-hook-form: Performance tốt, ít re-render
- Zod: Runtime validation, type-safe
- Tích hợp tốt với shadcn/ui Form components

### 1.7. Icons: **Lucide React**
```json
"lucide-react": "^0.344.0"
```

**Tính năng:**
- 1000+ icons, consistent design
- Tree-shakeable, chỉ import icons cần dùng
- TypeScript support
- Customizable size, color, stroke-width

**Usage:**
```typescript
import { Mail, Phone, Check, X } from 'lucide-react'

<Mail className="h-4 w-4" />
```

### 1.8. Notifications: **Sonner**
```json
"sonner": "^1.4.0"
```

**Tính năng:**
- Beautiful toast notifications
- Promise support (loading → success/error)
- Rich content support
- Accessible (ARIA)

**Usage:**
```typescript
import { toast } from 'sonner'

toast.success('Vote submitted!')
toast.error('Failed to send OTP')
toast.loading('Submitting...')
```

### 1.9. Date Handling: **date-fns**
```json
"date-fns": "^3.3.1"
```

**Usage:**
```typescript
import { formatDistanceToNow, isBefore } from 'date-fns'
import { vi } from 'date-fns/locale'

formatDistanceToNow(new Date(event.voting_close_time), {
  addSuffix: true,
  locale: vi,
})
// => "còn 2 giờ"
```

### 1.10. QR Code: **qrcode.react**
```json
"qrcode.react": "^3.1.0",
"@types/qrcode.react": "^1.0.5"
```

**Usage:**
```typescript
import { QRCodeSVG } from 'qrcode.react'

<QRCodeSVG
  value="https://voting.example.com"
  size={256}
  level="H"
  includeMargin
/>
```

### 1.11. Utilities
```json
"clsx": "^2.1.0",              // Conditional classNames
"tailwind-merge": "^2.2.1",    // Merge Tailwind classes
"class-variance-authority": "^0.7.0"  // Component variants
```

**cn() utility:**
```typescript
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<div className={cn("base-class", isActive && "active-class")} />
```

---

## 2. BACKEND STACK

### 2.1. API: **Next.js API Routes & Server Actions**

**API Routes** (`app/api/*/route.ts`):
```typescript
// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  // Handle logic
  return NextResponse.json({ success: true })
}
```

**Server Actions** (trong Server Components):
```typescript
'use server'

async function submitVote(formData: FormData) {
  const voterId = formData.get('voterId')
  // Database operations
  revalidatePath('/results')
}
```

**Tại sao?**
- Không cần setup Express/Fastify riêng
- Type-safe với TypeScript
- Tích hợp sẵn với Next.js routing
- Server Actions giảm boilerplate code

### 2.2. Runtime: **Node.js 18+**
- ES Modules support
- Fetch API built-in
- Performance improvements

---

## 3. DATABASE & STORAGE

### 3.1. Database: **Supabase (PostgreSQL)**
```json
"@supabase/supabase-js": "^2.39.0",
"@supabase/ssr": "^0.1.0"
```

**Tính năng sử dụng:**
- ✅ **PostgreSQL 15** - Relational database mạnh mẽ
- ✅ **Row Level Security (RLS)** - Bảo mật cấp row
- ✅ **Realtime** - WebSocket subscriptions
- ✅ **Auto-generated REST API** - Instant CRUD
- ✅ **Auto-generated TypeScript types** - Type safety
- ✅ **Database Functions** - Custom SQL logic
- ✅ **Database Views** - Pre-computed queries
- ✅ **Triggers** - Auto-update timestamps

**Client setup:**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Tại sao Supabase (không phải Firebase)?**
- ✅ PostgreSQL vs Firestore → SQL queries mạnh mẽ hơn
- ✅ Relationships & Joins → dễ model data phức tạp
- ✅ Row Level Security → bảo mật chi tiết hơn
- ✅ Built-in Auth với OTP email → không cần service riêng
- ✅ Realtime subscriptions → giống Firebase
- ✅ Open-source → có thể self-host
- ✅ Free tier hào phóng hơn
- ✅ TypeScript types auto-generated

### 3.2. Storage: **Supabase Storage**

**Tính năng:**
- S3-compatible object storage
- Public/private buckets
- Image transformations
- CDN caching

**Usage:**
```typescript
// Upload candidate photo
const { data, error } = await supabase.storage
  .from('candidate-photos')
  .upload(`public/${fileName}`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('candidate-photos')
  .getPublicUrl(fileName)
```

### 3.3. Realtime: **Supabase Realtime**

**Usage:**
```typescript
const channel = supabase
  .channel('votes-changes')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'votes' },
    (payload) => {
      console.log('New vote!', payload)
      updateResults()
    }
  )
  .subscribe()
```

**Tại sao Supabase Realtime?**
- ✅ Built-in, không cần setup WebSocket riêng
- ✅ Listen to database changes trực tiếp
- ✅ Broadcast & Presence cho multiplayer features
- ✅ Auto-reconnect

---

## 4. AUTHENTICATION & SECURITY

### 4.1. Authentication Strategy

**Email OTP Flow:**
1. User nhập email + phone
2. Backend generate 6-digit OTP
3. Store OTP trong database với expiry (10 mins)
4. Send OTP via email (Supabase Auth Email)
5. User nhập OTP
6. Backend verify OTP
7. Create session (HTTP-only cookie)

**Implementation:**
```typescript
// Using Supabase Auth
await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'http://localhost:3000/auth/verify',
  },
})
```

**Session Management:**
- HTTP-only cookies (không thể access từ JavaScript → XSS-safe)
- Secure flag trong production
- SameSite=Lax
- 24-hour expiry

### 4.2. Security Features

**Row Level Security (RLS):**
```sql
-- Voters can only read their own data
CREATE POLICY "Voters can view own data"
  ON voters
  FOR SELECT
  USING (auth.uid() = id);

-- Anyone can vote during voting period
CREATE POLICY "Allow voting during active period"
  ON votes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE is_active = true
      AND NOW() < voting_close_time
    )
  );

-- Public read access to candidates
CREATE POLICY "Public read candidates"
  ON candidates
  FOR SELECT
  TO public
  USING (true);
```

**Rate Limiting:**
- OTP requests: Max 3/hour per email (implemented in API)
- Vote submissions: Debounce on client, unique constraint on DB

**Input Validation:**
- Zod schemas cho tất cả inputs
- SQL injection prevention (Supabase prepared statements)
- XSS prevention (React escapes by default)

---

## 5. EMAIL SERVICE

### 5.1. Option 1: **Supabase Auth Email** (Recommended)

**Setup:**
- Supabase dashboard → Authentication → Email Templates
- Customize OTP email template
- Configure SMTP (hoặc dùng Supabase default)

**Pros:**
- ✅ Built-in, không cần service riêng
- ✅ Free trong Supabase tier
- ✅ Template customization
- ✅ Rate limiting included

**Cons:**
- ❌ Ít control hơn về delivery
- ❌ Branding giới hạn (Supabase footer)

### 5.2. Option 2: **Resend** (Alternative)
```json
"resend": "^3.2.0"
```

**Setup:**
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'voting@yourdomain.com',
  to: 'user@example.com',
  subject: 'Mã OTP của bạn',
  html: `<p>Mã OTP: <strong>${otp}</strong></p>`,
})
```

**Pros:**
- ✅ React Email templates (JSX)
- ✅ Better deliverability
- ✅ Custom domain
- ✅ Free 3000 emails/month

**Cons:**
- ❌ Thêm 1 dependency
- ❌ Phải setup custom domain

**Recommendation:** Dùng Supabase Auth Email cho MVP, nâng cấp lên Resend nếu cần.

---

## 6. DEPLOYMENT & HOSTING

### 6.1. Hosting: **Vercel** (Recommended)

**Tính năng:**
- ✅ Zero-config Next.js deployment
- ✅ Automatic HTTPS
- ✅ Edge Network (fast globally)
- ✅ Environment variables
- ✅ Preview deployments (cho mỗi PR)
- ✅ Analytics & Web Vitals
- ✅ Free tier: 100GB bandwidth/month

**Deployment:**
```bash
npm i -g vercel
vercel login
vercel deploy --prod
```

**Vercel config:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### 6.2. Alternative: **Netlify**

**Pros:**
- ✅ Tương tự Vercel
- ✅ Form handling built-in

**Cons:**
- ❌ Next.js support không tốt bằng Vercel

### 6.3. Database Hosting: **Supabase Cloud**

**Free tier:**
- 500MB database
- 1GB file storage
- 50,000 monthly active users
- Unlimited API requests (fair use)

**Production tier ($25/month):**
- 8GB database
- 100GB file storage
- Point-in-time recovery
- Daily backups

---

## 7. DEVELOPMENT TOOLS

### 7.1. Package Manager: **npm** hoặc **pnpm**

**Recommendation:** pnpm (nhanh hơn, ít disk space)
```bash
npm i -g pnpm
pnpm install
pnpm dev
```

### 7.2. Code Quality

**ESLint:**
```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

**Prettier:**
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 7.3. Git Hooks: **Husky + lint-staged**
```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
}
```

### 7.4. Environment Variables

**.env.local:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (if using Resend)
RESEND_API_KEY=re_xxx...

# Admin
ADMIN_PASSWORD=your-secure-password
```

**.env.example:** (commit vào git)
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

---

## 📦 FULL PACKAGE.JSON

```json
{
  "name": "event-voting",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.4",
    "zod": "^3.22.4",
    "date-fns": "^3.3.1",
    "lucide-react": "^0.344.0",
    "sonner": "^1.4.0",
    "qrcode.react": "^3.1.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/qrcode.react": "^1.0.5",
    "typescript": "^5.5.3",
    "tailwindcss": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "postcss": "^8",
    "autoprefixer": "^10.4.18",
    "eslint": "^8",
    "eslint-config-next": "^14.2.0"
  }
}
```

---

## 🔄 ALTERNATIVES CONSIDERED

### Frontend Alternatives
| Technology | Chọn | Lý do không chọn |
|------------|------|------------------|
| Remix | ❌ | Next.js ecosystem lớn hơn |
| SvelteKit | ❌ | React ecosystem phổ biến hơn |
| Nuxt.js | ❌ | Dùng Vue, không TypeScript native |

### UI Library Alternatives
| Technology | Chọn | Lý do không chọn |
|------------|------|------------------|
| Material UI | ❌ | Bundle size lớn, khó customize |
| Chakra UI | ❌ | Phải install package, styling overhead |
| Ant Design | ❌ | Quá enterprise, không phù hợp voting UI |
| DaisyUI | ❌ | Ít components advanced (dialog, dropdown) |

### Backend Alternatives
| Technology | Chọn | Lý do không chọn |
|------------|------|------------------|
| Firebase | ❌ | NoSQL, khó query phức tạp, đắt hơn |
| PlanetScale | ❌ | MySQL, không có realtime built-in |
| Prisma + PostgreSQL | ❌ | Phải setup DB riêng, không có realtime |
| MongoDB Atlas | ❌ | NoSQL, không phù hợp relational data |

---

**Last updated**: 2025-11-05
**Status**: Finalized ✅
