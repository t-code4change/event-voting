# Hướng Dẫn Các Trang SEO Mới - GalaVote

## ✅ Đã Hoàn Thành

### 1. `/about` - Giới thiệu
- ✅ Layout với SEO metadata
- ✅ Page với full content:
  - Hero banner với Sparkles icon
  - Mission & Vision cards
  - Core Values (4 giá trị)
  - Timeline phát triển
  - Đội ngũ Code4Change (3 teams)
  - CTA section với confetti effect

### 2. `/blog` - Tin tức & Blog
- ✅ Layout với SEO metadata
- ✅ Page với 6 blog posts grid
- ✅ Hover effects: scale-up, shadow gold
- ✅ Newsletter subscription CTA

---

## 📋 Cần Tạo Tiếp (Code Mẫu Bên Dưới)

### 3. `/guide` - Hướng dẫn sử dụng
**Layout.tsx:**
```tsx
import { Metadata } from 'next'
import { generateSEO } from '@/lib/metadata'

export const metadata: Metadata = generateSEO({
  title: 'Hướng Dẫn Sử Dụng - GalaVote',
  description: 'Hướng dẫn chi tiết cách sử dụng GalaVote: Đăng ký, tạo sự kiện, tùy chỉnh giao diện, quản lý và xuất kết quả bình chọn.',
  path: '/guide',
  keywords: ['hướng dẫn galavote', 'cách sử dụng', 'tạo sự kiện', 'bình chọn online'],
})

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

**Page.tsx Structure:**
- Hero: "Hướng Dẫn Sử Dụng GalaVote"
- 4 Steps timeline với icons:
  1. Đăng ký tài khoản (User icon)
  2. Tạo sự kiện (Plus icon)
  3. Tùy chỉnh giao diện (Palette icon)
  4. Quản lý & xuất kết quả (Download icon)
- Video placeholder
- FAQ nhỏ
- CTA: "Bắt đầu ngay"

### 4. `/policy` - Chính sách & Bảo mật
**Page Structure:**
- Điều khoản sử dụng
- Chính sách bảo mật
- Chính sách thanh toán
- Chính sách hoàn tiền
- Card layout, gold dividers
- No animations, clean text-only

### 5. `/contact` - Liên hệ
**Features:**
- Contact form: name, email, phone, message
- Support info box:
  - Hotline: 1900-xxx-xxx
  - Email: code4change.co@gmail.com
  - Địa chỉ: TP.HCM
- Success animation: canvas-confetti
- Google Maps embed (optional)
- Social links

### 6. `/case-studies` - Khách hàng & Case Studies
**Page Structure:**
- Carousel với logos khách hàng
- Case study cards grid:
  - Image
  - Company name
  - Event type
  - Participants count
  - Success metrics
  - Quote from organizer
- CTA: "Tổ chức sự kiện của bạn"

### 7. `/faq` - Câu hỏi thường gặp
**Features:**
- Accordion list (shadcn/ui)
- 10+ FAQs optimized:
  - "GalaVote hoạt động thế nào?"
  - "Có hỗ trợ hiển thị LED không?"
  - "Giá cả như thế nào?"
  - "Có hỗ trợ offline không?"
  - etc.
- Icon rotation on toggle
- Search box (optional)

---

## 🎨 Styling Guidelines (Áp dụng cho tất cả)

### Colors:
```css
background: #0A0A0A
text-primary: #FFFFFF
accent: #FFD700
accent-hover: #FDB931
border: #FFD700/20
border-hover: #FFD700
```

### Animations:
```tsx
// Fade in from bottom
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}

// Hover lift
whileHover={{ y: -10, scale: 1.02 }}

// Gold glow
className="hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]"
```

### Typography:
- Headings: `font-bold text-4xl md:text-6xl`
- Body: `text-gray-300 leading-relaxed`
- Gold text: `text-[#FFD700]`
- Shadow: `style={{ textShadow: '0 0 40px rgba(255,215,0,0.4)' }}`

### Components:
- Card: `bg-[#1a1a1a] border-2 border-[#FFD700]/20 rounded-2xl`
- Button: `bg-gradient-to-r from-[#FFD700] to-[#FDB931]`
- Input: `bg-[#1a1a1a] border-2 border-[#FFD700]/30`

---

## 🔗 Header Navigation Update

**File:** `components/Header.tsx`

Thêm navigation links:
```tsx
const navLinks = [
  { label: "Giới thiệu", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Hướng dẫn", href: "/guide" },
  { label: "Khách hàng", href: "/case-studies" },
  { label: "FAQ", href: "/faq" },
  { label: "Liên hệ", href: "/contact" },
]
```

**Styling:**
```tsx
<Link
  href={link.href}
  className="relative px-4 py-2 text-white font-medium hover:text-[#FFD700] transition-colors group"
>
  {link.label}
  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] group-hover:w-full transition-all duration-300" />
</Link>
```

---

## 📊 SEO Updates Needed

### 1. Update `lib/metadata.ts`
Thêm metadata cho các trang mới:
```tsx
guide: generateSEO({
  title: 'Hướng Dẫn Sử Dụng',
  description: '...',
  path: '/guide',
  keywords: ['hướng dẫn galavote', '...']
}),
policy: generateSEO({ ... }),
contact: generateSEO({ ... }),
caseStudies: generateSEO({ ... }),
faq: generateSEO({ ... }),
```

### 2. Update `app/sitemap.ts`
Thêm URLs:
```tsx
{
  url: `${baseUrl}/about`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.8,
},
{
  url: `${baseUrl}/blog`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.9,
},
// ... thêm các trang khác
```

---

## 🚀 Triển Khai

### Bước 1: Tạo các file layout
```bash
# Tạo layout.tsx cho mỗi trang
app/guide/layout.tsx
app/policy/layout.tsx
app/contact/layout.tsx
app/case-studies/layout.tsx
app/faq/layout.tsx
```

### Bước 2: Tạo page.tsx
Copy structure từ `/about/page.tsx` và `/blog/page.tsx`
Customize content theo từng trang

### Bước 3: Update SEO files
- `lib/metadata.ts` - Thêm pageMetadata
- `app/sitemap.ts` - Thêm URLs
- `SEO_GUIDE.md` - Document các trang mới

### Bước 4: Update Header
- `components/Header.tsx` - Thêm navigation

### Bước 5: Test
```bash
npm run dev
# Kiểm tra:
# - /about
# - /blog
# - /guide
# - /policy
# - /contact
# - /case-studies
# - /faq
```

---

## 💡 Tips & Best Practices

1. **Confetti:** Chỉ dùng ở 2-3 trang quan trọng (about, contact success)
2. **Images:** Sử dụng Unsplash placeholders, sau đó thay bằng ảnh thực
3. **Forms:** Validate input, show loading states
4. **Mobile:** Test responsive trên mobile
5. **Performance:** Lazy load images, optimize animations
6. **SEO:** Unique title/description cho mỗi trang
7. **Accessibility:** Alt text cho images, ARIA labels

---

## 📦 Dependencies Needed

Tất cả đã có sẵn trong `package.json`:
- ✅ `framer-motion` - Animations
- ✅ `canvas-confetti` - Confetti effect
- ✅ `lucide-react` - Icons
- ✅ `next` - Framework
- ✅ `@radix-ui/*` - UI components

---

## 🎯 Kế Hoạch Hoàn Thành

**Ưu tiên cao:**
1. ✅ /about - DONE
2. ✅ /blog - DONE
3. ⏳ /guide - IN PROGRESS
4. ⏳ /faq - IN PROGRESS
5. ⏳ /contact - IN PROGRESS

**Ưu tiên trung bình:**
6. /case-studies
7. /policy

**Có thể làm sau:**
- Blog detail pages `/blog/[slug]`
- Search functionality
- Comments system
- Social share buttons

---

**Tất cả code đã follow đúng dark-gold theme và Next.js 14 App Router standards!**
