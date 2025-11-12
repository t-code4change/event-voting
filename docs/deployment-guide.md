# DEPLOYMENT GUIDE - Bright4Event

> Hướng dẫn chi tiết triển khai production từ A-Z

---

## 📋 MỤC LỤC

1. [Pre-deployment Checklist](#1-pre-deployment-checklist)
2. [Supabase Setup](#2-supabase-setup)
3. [Vercel Deployment](#3-vercel-deployment)
4. [Environment Variables](#4-environment-variables)
5. [Domain & DNS](#5-domain--dns)
6. [Post-deployment Tasks](#6-post-deployment-tasks)
7. [Monitoring & Maintenance](#7-monitoring--maintenance)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. PRE-DEPLOYMENT CHECKLIST

### 1.1. Development Complete
- [ ] All features implemented and tested locally
- [ ] Database schema finalized
- [ ] API endpoints working
- [ ] UI responsive on mobile/tablet/desktop
- [ ] Authentication flow tested
- [ ] Voting flow tested
- [ ] Realtime updates working
- [ ] Admin dashboard functional

### 1.2. Code Quality
- [ ] No console errors in browser
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] ESLint passed (`npm run lint`)
- [ ] Build successful (`npm run build`)
- [ ] All environment variables documented

### 1.3. Security Review
- [ ] Row Level Security (RLS) policies enabled
- [ ] API routes protected
- [ ] Rate limiting implemented
- [ ] Input validation with Zod
- [ ] No sensitive data in client code
- [ ] HTTPOnly cookies for sessions

### 1.4. Performance
- [ ] Images optimized (use Next.js Image)
- [ ] Database indexes created
- [ ] API responses cached where appropriate
- [ ] Bundle size checked (<500KB initial load)

---

## 2. SUPABASE SETUP

### 2.1. Create Production Project

1. **Sign up/Login**: [supabase.com](https://supabase.com)
2. **Create New Project**:
   - Name: `event-voting-prod`
   - Database Password: **Strong password** (save securely!)
   - Region: Choose closest to target users (e.g., Southeast Asia)
   - Pricing Plan: Free tier OK for MVP, Pro for production

3. **Wait for setup**: ~2 minutes for database provisioning

### 2.2. Run Database Migration

**Option 1: SQL Editor** (Recommended)
1. Go to **SQL Editor** in Supabase dashboard
2. Create new query
3. Copy entire content from `docs/database-schema.md` (Section 4.1)
4. Run the script
5. Verify tables created in **Table Editor**

**Option 2: Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

### 2.3. Enable Row Level Security

```sql
-- Run in SQL Editor
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
```

### 2.4. Create RLS Policies

Copy all policies from `docs/database-schema.md` (Section 5) và run trong SQL Editor.

### 2.5. Create Storage Bucket

```sql
-- Create bucket for candidate photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('candidate-photos', 'candidate-photos', true);
```

**Set Storage Policies**:
```sql
-- Public read access
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'candidate-photos');

-- Admin upload only (configure later)
```

### 2.6. Generate TypeScript Types

```bash
npx supabase gen types typescript \
  --project-id "your-project-ref" \
  --schema public \
  > types/database.types.ts
```

### 2.7. Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep secret!)

---

## 3. VERCEL DEPLOYMENT

### 3.1. Prepare Repository

```bash
# Initialize git if not already
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/event-voting.git
git branch -M main
git push -u origin main
```

### 3.2. Connect to Vercel

**Option 1: Vercel Dashboard** (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

**Option 2: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 3.3. Configure Build Settings

In Vercel dashboard → **Project Settings** → **Build & Development Settings**:

```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

**Node.js Version**: 18.x or 20.x

### 3.4. Add Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJxxx...` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJxxx...` (secret!) | Production |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production |

**Important**:
- Variables starting with `NEXT_PUBLIC_` are exposed to browser
- `SUPABASE_SERVICE_ROLE_KEY` should be encrypted (Vercel does this automatically)

### 3.5. Deploy

```bash
# If using CLI
vercel --prod

# Or push to main branch (auto-deploy enabled by default)
git push origin main
```

**Deployment URL**: `https://your-project.vercel.app`

---

## 4. ENVIRONMENT VARIABLES

### 4.1. Local Development (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Resend (if using for emails)
RESEND_API_KEY=re_xxx...

# Admin (simple auth for MVP)
ADMIN_PASSWORD=your-secure-password
```

### 4.2. Production (.env.production - DO NOT COMMIT)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://voting.yourdomain.com
RESEND_API_KEY=re_...
ADMIN_PASSWORD=strong-password-here
```

### 4.3. Environment Variables Reference

| Variable | Required | Public | Description |
|----------|----------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | Public anon key (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | Service role key (SECRET!) |
| `NEXT_PUBLIC_APP_URL` | ✅ | ✅ | Your app URL |
| `RESEND_API_KEY` | ❌ | ❌ | Email service key |
| `ADMIN_PASSWORD` | ✅ | ❌ | Simple admin auth |

---

## 5. DOMAIN & DNS

### 5.1. Add Custom Domain (Optional)

**In Vercel Dashboard**:
1. Go to **Settings** → **Domains**
2. Add your domain: `voting.yourdomain.com`
3. Vercel provides DNS configuration

**DNS Records** (at your domain registrar):
```
Type: CNAME
Name: voting
Value: cname.vercel-dns.com
```

Wait 10-60 minutes for DNS propagation.

### 5.2. SSL Certificate

Vercel automatically provisions SSL certificate (Let's Encrypt).
- ✅ HTTPS enabled by default
- ✅ Auto-renewal

---

## 6. POST-DEPLOYMENT TASKS

### 6.1. Seed Initial Data

**Create first event** (via Supabase SQL Editor):
```sql
INSERT INTO events (
  name,
  description,
  start_time,
  end_time,
  voting_close_time,
  is_active
) VALUES (
  'King & Queen of the Night 2025',
  'Annual gala event celebrating excellence',
  '2025-12-31 18:00:00+07',
  '2025-12-31 23:59:59+07',
  '2025-12-31 22:00:00+07',
  true
) RETURNING id;
```

**Add categories and candidates** using admin dashboard (after building it) or SQL.

### 6.2. Generate QR Code

**Option 1: Using qrcode.react**
```typescript
// app/admin/qr/page.tsx
'use client'

import { QRCodeSVG } from 'qrcode.react'

export default function QRCodePage() {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'https://voting.yourdomain.com'

  return (
    <div className="container py-20 text-center">
      <h1 className="text-3xl font-bold mb-8">QR Code cho sự kiện</h1>
      <div className="flex justify-center">
        <QRCodeSVG
          value={url}
          size={512}
          level="H"
          includeMargin
        />
      </div>
      <p className="mt-4 text-muted-foreground">
        URL: {url}
      </p>
      <button
        onClick={() => {
          const svg = document.querySelector('svg')
          const svgData = new XMLSerializer().serializeToString(svg!)
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new Image()
          img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.download = 'qr-code.png'
            downloadLink.href = pngFile
            downloadLink.click()
          }
          img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
        }}
        className="mt-8 px-6 py-3 bg-primary text-white rounded-lg"
      >
        Tải xuống QR Code
      </button>
    </div>
  )
}
```

**Option 2: Online Generator**
- [qr-code-generator.com](https://www.qr-code-generator.com/)
- Input: `https://voting.yourdomain.com`
- Download high-resolution PNG

**Print QR Code**:
- Size: A4 hoặc lớn hơn cho banner
- Include text: "Quét để bình chọn"

### 6.3. Test Production Environment

**Checklist**:
- [ ] Visit production URL
- [ ] Test authentication flow
  - [ ] Request OTP
  - [ ] Receive email
  - [ ] Verify OTP
  - [ ] Redirect to voting
- [ ] Test voting
  - [ ] Select candidates
  - [ ] Submit votes
  - [ ] See success message
- [ ] Test results page
  - [ ] Realtime updates working
  - [ ] Vote counts accurate
- [ ] Test on mobile devices
- [ ] Test QR code scanning

### 6.4. Configure Email Service

**Option 1: Supabase Auth Email** (Default)
1. Go to **Authentication** → **Email Templates**
2. Customize OTP email template
3. Configure SMTP (optional, or use Supabase default)

**Option 2: Resend**
```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOTPEmail(email: string, otp: string) {
  await resend.emails.send({
    from: 'voting@yourdomain.com',
    to: email,
    subject: 'Mã OTP của bạn',
    html: `
      <h1>Mã OTP của bạn</h1>
      <p>Mã OTP: <strong style="font-size: 24px;">${otp}</strong></p>
      <p>Mã có hiệu lực trong 10 phút.</p>
    `,
  })
}
```

---

## 7. MONITORING & MAINTENANCE

### 7.1. Vercel Analytics

**Enable Analytics**:
1. Vercel Dashboard → **Analytics**
2. Free tier: Basic metrics
3. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance (Web Vitals)

### 7.2. Supabase Monitoring

**Dashboard Metrics**:
- Database size
- API requests
- Active users
- Storage usage

**Alerts**:
- Set up email alerts for quota limits

### 7.3. Error Tracking (Optional)

**Sentry Integration**:
```bash
npm install @sentry/nextjs

npx @sentry/wizard@latest -i nextjs
```

**Configure**:
```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### 7.4. Database Backups

**Supabase Free Tier**: No automatic backups

**Manual Backup**:
```bash
# Using Supabase CLI
supabase db dump -f backup-$(date +%Y%m%d).sql

# Schedule with cron (Linux/Mac)
0 0 * * * cd /path/to/project && supabase db dump -f backup-$(date +\%Y\%m\%d).sql
```

**Supabase Pro**: Daily backups with 7-day retention

### 7.5. Performance Monitoring

**Key Metrics**:
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.8s
- API response time: <500ms

**Tools**:
- Vercel Analytics
- Chrome DevTools (Lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## 8. TROUBLESHOOTING

### 8.1. Build Failures

**Error**: `Type error: Cannot find module`
```bash
# Fix: Install missing dependencies
npm install
npm run build
```

**Error**: `Environment variable not found`
```bash
# Fix: Add to Vercel env vars
# Settings → Environment Variables
```

### 8.2. Database Connection Issues

**Error**: `Failed to connect to Supabase`
```bash
# Check:
# 1. NEXT_PUBLIC_SUPABASE_URL correct?
# 2. NEXT_PUBLIC_SUPABASE_ANON_KEY correct?
# 3. Supabase project running?
```

### 8.3. Authentication Not Working

**Error**: OTP not received
```bash
# Check:
# 1. Email service configured in Supabase?
# 2. SMTP settings correct?
# 3. Check spam folder
# 4. Check Supabase logs: Dashboard → Logs
```

### 8.4. Realtime Not Working

**Error**: Results not updating
```bash
# Check:
# 1. Realtime enabled in Supabase?
# 2. RLS policies allow select on votes table?
# 3. Browser console for WebSocket errors
```

**Enable Realtime**:
1. Supabase Dashboard → **Database** → **Replication**
2. Enable for `votes` table

### 8.5. Performance Issues

**Slow API responses**:
```sql
-- Add indexes
CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at DESC);
```

**Large bundle size**:
```bash
# Analyze bundle
npm run build
# Check .next/server/pages/ sizes

# Fix: Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
})
```

---

## 9. SCALING CONSIDERATIONS

### 9.1. If Event Gets Large Traffic

**Supabase**:
- Upgrade to Pro plan ($25/month)
- Dedicated resources
- Connection pooling
- Point-in-time recovery

**Vercel**:
- Pro plan ($20/month/member)
- Unlimited bandwidth
- Advanced analytics
- Priority support

### 9.2. CDN & Caching

**Vercel Edge Network**:
- Automatically enabled
- Global CDN
- Static assets cached

**API Caching**:
```typescript
// app/api/results/route.ts
export const revalidate = 10 // Cache for 10 seconds

export async function GET() {
  // ...
}
```

### 9.3. Rate Limiting

**Supabase**:
- Built-in rate limiting on API
- Free tier: Fair use policy

**Custom Rate Limiting**:
```typescript
// Use Upstash Redis for production
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})
```

---

## 10. CHECKLIST - DEPLOYMENT COMPLETE

### Pre-deployment ✅
- [ ] Code tested locally
- [ ] Build successful
- [ ] No TypeScript errors
- [ ] Environment variables documented

### Supabase ✅
- [ ] Production project created
- [ ] Database schema deployed
- [ ] RLS policies enabled
- [ ] Storage bucket created
- [ ] API keys saved securely

### Vercel ✅
- [ ] Repository pushed to GitHub
- [ ] Project connected to Vercel
- [ ] Environment variables added
- [ ] Production deployment successful
- [ ] Custom domain configured (optional)

### Post-deployment ✅
- [ ] Initial event seeded
- [ ] QR code generated
- [ ] Email service tested
- [ ] Production environment tested
- [ ] Mobile responsive confirmed

### Monitoring ✅
- [ ] Analytics enabled
- [ ] Error tracking configured (optional)
- [ ] Backup strategy in place

---

## 🚀 GO LIVE!

**Launch Checklist**:
1. ✅ Test everything one last time
2. ✅ Print QR codes
3. ✅ Share URL with organizers
4. ✅ Monitor during event
5. ✅ Celebrate! 🎉

---

**Last updated**: 2025-11-05
**Status**: Ready for production deployment ✅
