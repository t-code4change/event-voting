# Hướng Dẫn SEO Cho GalaVote

## Tổng Quan

Dự án đã được cấu hình đầy đủ các yếu tố SEO cần thiết theo chuẩn **Next.js 14 App Router** để tối ưu hóa khả năng hiển thị trên các công cụ tìm kiếm như Google, Bing, và các mạng xã hội.

## Các Tệp Đã Được Cấu Hình

### 1. **robots.txt** (`app/robots.txt`)
- Cho phép bot crawl các trang public
- Chặn bot crawl các trang admin và API
- Chỉ định vị trí sitemap

**Lưu ý:** Sau khi deploy, kiểm tra tại: `https://quaysotrungthuong.vn/robots.txt`

### 2. **Sitemap** (`app/sitemap.ts`)
- Tự động generate sitemap động theo chuẩn Next.js
- Cập nhật lastModified date
- Có priority và changeFrequency cho từng trang

**Kiểm tra:** `https://quaysotrungthuong.vn/sitemap.xml`

### 3. **Root Layout Metadata** (`app/layout.tsx`)
Đã cấu hình đầy đủ:
- Title template và default title
- Meta description chi tiết
- Keywords cho SEO
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Canonical URL
- Dynamic icon generation (via `app/icon.tsx`)
- Dynamic OG image generation (via `app/opengraph-image.tsx`)
- Manifest reference (via `app/manifest.ts`)
- Robots directives
- Verification codes (cần update với Google Search Console)

### 4. **Metadata Helper** (`lib/metadata.ts`)
Tạo helper functions để generate metadata động cho các trang:
- `generateSEO()` - Function chung
- `pageMetadata` - Metadata được định nghĩa sẵn cho các trang
- `generateEventMetadata()` - Generate metadata cho event pages

### 5. **Manifest** (`app/manifest.ts`)
**⚠️ Quan trọng:** Sử dụng `manifest.ts` thay vì `manifest.json` theo chuẩn Next.js 14+
- Cấu hình PWA đầy đủ
- Icons, theme colors và display mode
- Tự động generate tại `/manifest.webmanifest`

### 6. **Dynamic Open Graph Image** (`app/opengraph-image.tsx`)
**⚠️ Quan trọng:** Sử dụng dynamic image generation thay vì static image
- Tự động generate OG image với Next.js ImageResponse
- Size: 1200x630px
- Tự động available tại `/opengraph-image`

### 7. **Dynamic Icon** (`app/icon.tsx`)
- Tự động generate favicon động
- Size: 32x32px
- Tự động available tại `/icon`

### 8. **Metadata cho Client Components**
**⚠️ Quan trọng:** Vì các page.tsx là "use client", cần tạo `layout.tsx` trong mỗi folder:
- `app/pricing/layout.tsx` - Metadata cho pricing page
- `app/results/layout.tsx` - Metadata cho results page
- `app/hello/layout.tsx` - Metadata cho hello page
- `app/vote/layout.tsx` - Metadata cho vote page
- `app/event/[eventId]/layout.tsx` - Dynamic metadata cho event pages

### 9. **Structured Data Components** (`components/StructuredData.tsx`)
Các component JSON-LD Schema.org:
- `OrganizationSchema` - Thông tin tổ chức
- `WebsiteSchema` - Thông tin website
- `EventSchema` - Thông tin sự kiện
- `BreadcrumbSchema` - Breadcrumb navigation
- `ProductSchema` - Thông tin gói dịch vụ
- `FAQSchema` - Câu hỏi thường gặp

## Cách Sử Dụng

### Thêm Metadata Cho Trang Mới

1. **Trang tĩnh với metadata đơn giản:**
```tsx
// app/new-page/metadata.ts
import { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata.yourPage
```

2. **Trang động với metadata tùy chỉnh:**
```tsx
// app/events/[id]/page.tsx
import { Metadata } from 'next'
import { generateSEO } from '@/lib/metadata'

export async function generateMetadata({ params }): Promise<Metadata> {
  const event = await fetchEvent(params.id)

  return generateSEO({
    title: event.name,
    description: event.description,
    path: `/events/${params.id}`,
    image: event.image,
    keywords: ['event', event.name, 'voting']
  })
}
```

### Thêm Structured Data

```tsx
// app/your-page/page.tsx
import { EventSchema, FAQSchema } from '@/components/StructuredData'

export default function YourPage() {
  return (
    <>
      <EventSchema
        name="Year End Party 2025"
        description="Đêm hội tri ân và vinh danh"
        startDate="2025-12-28T19:00:00+07:00"
        location={{
          name: "GEM Center",
          address: "TP.HCM"
        }}
      />

      <FAQSchema items={faqData} />

      {/* Your page content */}
    </>
  )
}
```

## Checklist SEO Cần Làm Sau Deploy

### 1. Google Search Console
- [ ] Đăng ký website tại [Google Search Console](https://search.google.com/search-console)
- [ ] Lấy verification code
- [ ] Update code vào `app/layout.tsx` (dòng 94)
- [ ] Submit sitemap: `https://quaysotrungthuong.vn/sitemap.xml`

### 2. Google Analytics
- [ ] Tạo Google Analytics property
- [ ] Thêm tracking code vào `app/layout.tsx`

### 3. Open Graph Images
- [x] ~~Tạo file `/public/og-image.png`~~ **Không cần** - Đã dùng `app/opengraph-image.tsx` để generate động
- [x] ~~Tạo favicon files~~ **Không cần** - Đã dùng `app/icon.tsx` để generate động
- [ ] **Optional:** Tạo các icon files cho PWA manifest (nếu muốn dùng static thay vì dynamic):
  - `/public/icon-192x192.png`
  - `/public/icon-512x512.png`
  - `/public/apple-touch-icon.png` (180x180px)

### 4. Các Công Cụ SEO Khác
- [ ] Bing Webmaster Tools
- [ ] Yandex Webmaster
- [ ] Facebook Domain Verification
- [ ] Twitter Card Validator

### 5. Performance Optimization
- [ ] Optimize images (WebP format)
- [ ] Enable compression (Gzip/Brotli)
- [ ] Configure CDN
- [ ] Set up caching headers

## Testing SEO

### Tools để test:
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **Google PageSpeed Insights**: https://pagespeed.web.dev/
5. **Google Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly

### Kiểm tra local:
```bash
# Build production
npm run build

# Start production server
npm start

# Test các URLs:
# - http://localhost:3000/robots.txt
# - http://localhost:3000/sitemap.xml
# - http://localhost:3000/manifest.json
# - View page source để kiểm tra meta tags
```

## Best Practices

### 1. Title Tags
- Độ dài: 50-60 ký tự
- Chứa keyword chính
- Mỗi trang có title unique
- Format: `Page Title | GalaVote`

### 2. Meta Descriptions
- Độ dài: 150-160 ký tự
- Mô tả rõ ràng nội dung trang
- Chứa call-to-action
- Unique cho mỗi trang

### 3. URLs
- Clean, readable URLs
- Sử dụng hyphens (-) thay vì underscores (_)
- Lowercase
- Chứa keywords khi có thể

### 4. Images
- Alt text mô tả
- Optimize file size
- Sử dụng WebP format
- Lazy loading
- Responsive images

### 5. Content
- Unique, original content
- Heading hierarchy (H1 → H6)
- Internal linking
- Regular updates
- Mobile-friendly

## Monitoring

### Metrics cần theo dõi:
- Organic traffic
- Keyword rankings
- Click-through rate (CTR)
- Bounce rate
- Page load speed
- Core Web Vitals
- Indexed pages
- Crawl errors

### Tools:
- Google Search Console
- Google Analytics 4
- Google PageSpeed Insights
- Ahrefs / SEMrush (optional)

## Cập Nhật và Bảo Trì

### Hàng tuần:
- Kiểm tra Google Search Console errors
- Monitor traffic và rankings

### Hàng tháng:
- Update sitemap nếu có trang mới
- Review và optimize low-performing pages
- Check broken links
- Update content cũ

### Hàng quý:
- Keyword research mới
- Competitor analysis
- Content audit
- Technical SEO audit

## Liên Hệ và Hỗ Trợ

Nếu cần hỗ trợ thêm về SEO, liên hệ:
- Email: contact@code4change.tech
- Website: https://quaysotrungthuong.vn

---

## Về Next.js 16

Next.js 16 đã được release (October 2025) với nhiều tính năng mới:

### Breaking Changes:
- **Node.js 20.9.0+** required (Node.js 18 không còn được support)
- **middleware.ts → proxy.ts** (cần rename nếu upgrade)
- **Async Dynamic APIs** (params, searchParams cần await)
- **Turbopack** là default bundler
- **"use cache"** directive thay thế implicit caching

### Nên Upgrade Không?
**Khuyến nghị cho dự án này:**

✅ **NÊN upgrade nếu:**
- Muốn performance tốt hơn với Turbopack (10x faster Fast Refresh)
- Cần "use cache" directive cho explicit caching
- Đã test kỹ và có time để migration

❌ **KHÔNG NÊN upgrade ngay nếu:**
- Dự án đang stable và production
- Chưa có thời gian test thoroughly
- Team chưa familiar với Next.js 16 changes
- **Hiện tại dùng Next.js 14.2.15 là đủ tốt cho SEO**

### Migration Steps (nếu muốn upgrade):
```bash
# Upgrade command
npx @next/codemod@canary upgrade latest
npm install next@latest react@latest react-dom@latest

# Update Node.js to 20.9.0+
# Rename middleware.ts → proxy.ts (nếu có)
# Add await cho params và searchParams
# Test thoroughly
```

**Chi tiết:** https://nextjs.org/docs/app/guides/upgrading/version-16

---

**Lưu ý quan trọng:**
- Thay đổi URL base từ `https://quaysotrungthuong.vn` sang domain thực tế của bạn trong các file:
  - `app/layout.tsx`
  - `app/sitemap.ts`
  - `lib/metadata.ts`
  - `components/StructuredData.tsx`
  - `app/manifest.ts`

- Update Google verification code sau khi đăng ký Google Search Console
- **Không cần tạo static image files** - đã dùng dynamic generation với `app/icon.tsx` và `app/opengraph-image.tsx`
