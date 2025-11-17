# 🎨 Bright4Event Design System

> **Quy chuẩn thiết kế cho Marketing & Public Pages**
>
> **Scope**: Áp dụng cho tất cả trang PUBLIC trong `/app/`
>
> **Tham khảo chính**: Homepage (`/app/page.tsx`) và các component con

---

## 📋 SCOPE & EXCEPTIONS

### ✅ Áp dụng cho (Public/Marketing Pages):
```
/app/
├── page.tsx                    # Homepage ✅
├── about/                      # About page ✅
├── blog/                       # Blog & articles ✅
├── pricing/                    # Pricing page ✅
├── contact/                    # Contact page ✅
├── guide/                      # Guide page ✅
├── case-studies/              # Case studies ✅
├── faq/                        # FAQ page ✅
├── policy/                     # Privacy policy ✅
├── terms/                      # Terms of service ✅
├── login/                      # Login page ✅
├── register/                   # Register page ✅
└── [any-other-public-page]/   # New public pages ✅
```

### ❌ KHÔNG áp dụng cho:

#### 1. Admin Pages (Có theme riêng - THEME_ADMIN.md)
```
/app/admin/(authenticated)/
├── dashboard/                  # ❌ Dùng THEME_ADMIN.md
├── events/                     # ❌ Dùng THEME_ADMIN.md
├── candidates/                 # ❌ Dùng THEME_ADMIN.md
├── results/                    # ❌ Dùng THEME_ADMIN.md
├── analytics/                  # ❌ Dùng THEME_ADMIN.md
└── ...                         # ❌ Tất cả admin pages
```
**Reference**: Xem `/THEME_ADMIN.md` cho admin design system

#### 2. Event Pages (Có theme riêng cho public viewing)
```
/app/event/
├── [eventId]/                  # ❌ Event-specific theme
│   ├── page.tsx                # ❌ Event voting page
│   ├── results/                # ❌ Event results page
│   ├── check-in/               # ❌ Check-in page
│   ├── live/                   # ❌ Live display
│   ├── minigame/               # ❌ Mini game
│   └── ...                     # ❌ Event-related pages
```
**Note**: Event pages có design riêng, tối ưu cho LED displays và user interaction

### 🎯 Quy tắc áp dụng:

1. **Public/Marketing Pages** → Dùng DESIGN_SYSTEM.md (file này)
2. **Admin Pages** → Dùng THEME_ADMIN.md
3. **Event Pages** → Dùng event-specific design (riêng)

---

## 📐 1. LAYOUT & SPACING

### Container
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem; /* px-4 */
}
```

### Section Spacing
| Loại | Tailwind Class | CSS Value | Sử dụng |
|------|----------------|-----------|---------|
| Small section | `py-16` | 64px | Sections nhỏ, phụ |
| Medium section | `py-24` | 96px | **Standard sections** (khuyên dùng) |
| Large section | `py-32` | 128px | Hero, Final CTA |

### Content Spacing
| Element | Tailwind | CSS | Mô tả |
|---------|----------|-----|-------|
| Giữa các elements | `gap-2` | 8px | Icons, inline items |
| Giữa các items | `gap-4` | 16px | Buttons, cards nhỏ |
| Giữa các sections | `gap-8` | 32px | Cards, features grid |
| Giữa các groups | `gap-12` | 48px | Sections lớn |

### Margin Bottom
```typescript
// Standard bottom margins
mb-3: 12px   // Small gap
mb-4: 16px   // Medium gap (khuyên dùng cho text)
mb-6: 24px   // Large gap (khuyên dùng cho headings)
mb-8: 32px   // XL gap (giữa sections)
mb-12: 48px  // XXL gap (giữa major sections)
```

### Padding
```typescript
// Buttons & Cards
px-4 py-2:   Small button
px-6 py-3:   Medium button
px-10 py-7:  Large button (CTA)

// Cards
p-4:  Small card
p-6:  Medium card (khuyên dùng)
p-8:  Large card
p-12: XL card (hero content)
```

---

## 🎨 2. COLOR PALETTE

### Primary Colors (Gold)
```typescript
const GOLD = {
  primary: '#FFD700',      // Main gold - icons, borders, text highlights
  secondary: '#FDB931',    // Warm gold - gradients, hover states
  tertiary: '#FFE68A',     // Light gold - subtle highlights
}

// Usage
text-[#FFD700]           // Text
bg-[#FFD700]             // Background solid
border-[#FFD700]         // Borders
from-[#FFD700] to-[#FDB931]  // Gradient
```

### Secondary Colors (Purple)
```typescript
const PURPLE = {
  primary: '#9C27FF',      // Bright purple - accents, particles
  secondary: '#7B1FA2',    // Deep purple - gradients
}

// Usage - Dùng cho:
- Floating particles (tạo contrast với gold)
- Stats cards (thay thế cho gold)
- Gradient backgrounds
```

### Background Colors
```typescript
const BACKGROUND = {
  primary: '#0D0D1A',      // Main dark background (body)
  secondary: '#1a1a1a',    // Card backgrounds, sections
  tertiary: '#0A0A0A',     // Darker sections (header, footer)
  quaternary: '#0B0B0B',   // Footer specific
}

// Usage pattern
bg-[#0D0D1A]           // Page background
bg-[#1a1a1a]           // Cards, alternating sections
bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]  // Section gradient
```

### Text Colors
```typescript
// Hierarchy
text-white              // Headings, important text
text-gray-300           // Body text (khuyên dùng)
text-gray-400           // Secondary text, labels
text-gray-500           // Muted text, footer
text-[#FFD700]          // Highlights, active states
```

### Utility Colors
```typescript
// Feature gradients (tham khảo home.constants.ts)
from-green-500 to-emerald-600    // Success, Check-in
from-cyan-500 to-blue-600        // Info, Screens
from-blue-500 to-indigo-600      // Primary features
from-pink-500 to-rose-600        // Media, Slides
from-purple-500 to-violet-600    // Analytics
from-red-500 to-orange-600       // Livestream
from-amber-500 to-yellow-600     // Games
from-[#FFD700] to-[#FDB931]      // Premium, Lucky Draw
```

### Opacity Scale
```css
/* Borders */
border-[#FFD700]/10   /* 10% - Very subtle */
border-[#FFD700]/20   /* 20% - Subtle (standard) */
border-[#FFD700]/30   /* 30% - Visible (hover hint) */
border-[#FFD700]/50   /* 50% - Strong */

/* Backgrounds */
bg-[#FFD700]/5        /* 5% - Ghost */
bg-[#FFD700]/10       /* 10% - Subtle hover */
bg-[#FFD700]/20       /* 20% - Active state */

/* Text */
text-white/80         /* 80% - Secondary headings */
text-white/60         /* 60% - Muted text */
```

---

## ✏️ 3. TYPOGRAPHY

### Font Families
```typescript
// Body & UI (Default - Inter/system fonts)
font-sans               // Default - tất cả text thường

// Logo & Brand (Playfair Display)
fontFamily: 'Playfair Display, serif'  // Chỉ dùng cho logo
```

### Font Sizes

#### Headings
```typescript
// Hero Headlines (H1)
text-5xl md:text-7xl lg:text-8xl     // 48px → 72px → 96px
                                      // Chỉ dùng cho hero section

// Section Titles (H2)
text-3xl md:text-4xl                  // 30px → 36px
                                      // Standard section headings

// Subsection Titles (H3)
text-2xl md:text-3xl                  // 24px → 30px
                                      // Cards, features

// Card Titles (H4)
text-xl                               // 20px
                                      // Feature cards, testimonials
```

#### Body Text
```typescript
// Large body (Hero subtext, important descriptions)
text-xl md:text-2xl                   // 20px → 24px

// Medium body (Standard paragraph)
text-lg                               // 18px (khuyên dùng)

// Regular body (Secondary text)
text-base                             // 16px

// Small text (Labels, captions)
text-sm                               // 14px

// Extra small (Fine print, footnotes)
text-xs                               // 12px
```

### Font Weights
```typescript
font-bold               // 700 - Headings, CTA buttons
font-semibold           // 600 - Subheadings, labels
font-medium             // 500 - Navigation, secondary buttons
font-normal             // 400 - Body text (default)
```

### Line Heights
```typescript
leading-tight           // 1.25 - Headlines
leading-relaxed         // 1.625 - Body text (khuyên dùng)
leading-loose           // 2 - Special cases
```

### Letter Spacing
```typescript
tracking-tight          // Headlines lớn
tracking-normal         // Body text (default)
tracking-wide           // Subtext, labels
tracking-wider          // UPPERCASE labels (VD: "All-in-One for Event")
```

### Text Alignment
```typescript
text-center             // Hero, CTAs
text-left               // Body paragraphs (default)
```

---

## 🔲 4. BORDERS & RADIUS

### Border Width
```typescript
border              // 1px - Default
border-2            // 2px - Cards, buttons (khuyên dùng)
border-4            // 4px - Emphasis
```

### Border Colors
```typescript
// Standard pattern
border-[#FFD700]/20                      // Default card border
hover:border-[#FFD700]                   // Hover state
border-[#FFD700]/30                      // Active/selected state

// Top border (header, footer)
border-t border-[#FFD700]/20

// Bottom border (sections)
border-b border-[#FFD700]/20
```

### Border Radius
```typescript
rounded-none            // 0 - Không dùng
rounded-lg              // 8px - Small cards
rounded-xl              // 12px - Standard cards, buttons (khuyên dùng)
rounded-2xl             // 16px - Large cards, sections
rounded-3xl             // 24px - Hero sections, special cards
rounded-full            // 9999px - Pills, circular buttons, avatars
```

### Usage Pattern
```typescript
// Buttons
rounded-full            // CTA buttons (primary)
rounded-xl              // Secondary buttons

// Cards
rounded-2xl             // Feature cards, testimonials
rounded-xl              // Smaller cards

// Sections
rounded-3xl             // Large content sections
```

---

## 🌈 5. GRADIENTS

### Text Gradients
```typescript
// Gold gradient (brand color)
className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent"

// Gold gradient simple
className="bg-gradient-to-r from-[#FFD700] to-[#FDB931] bg-clip-text text-transparent"

// Usage: Headlines, brand text
```

### Background Gradients

#### Vertical Gradients (Sections)
```typescript
// Dark to darker
bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]

// Alternating pattern
Section 1: bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]
Section 2: bg-gradient-to-b from-[#1a1a1a] to-[#0D0D1A]
Section 3: bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]
```

#### Overlay Gradients
```typescript
// Image overlay (hero backgrounds)
bg-gradient-to-b from-black/70 via-black/60 to-[#0D0D1A]

// Glass morphism
bg-gradient-to-br from-white/10 to-white/5     // Standard glass
bg-gradient-to-br from-white/5 to-white/0      // Lighter glass
```

#### Button Gradients
```typescript
// Primary CTA button
bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700]
hover:from-[#FDB931] hover:to-[#FFD700]

// Purple accent button
bg-gradient-to-r from-[#9C27FF] to-[#7B1FA2]
```

#### Feature Card Gradients
```typescript
// Tham khảo home.constants.ts FEATURES
from-green-500 to-emerald-600
from-cyan-500 to-blue-600
from-blue-500 to-indigo-600
from-pink-500 to-rose-600
from-purple-500 to-violet-600
from-red-500 to-orange-600
from-amber-500 to-yellow-600
from-[#FFD700] to-[#FDB931]
```

---

## 🎭 6. SHADOWS & GLOWS

### Box Shadows
```typescript
// Standard shadows (Tailwind)
shadow-sm               // Subtle
shadow                  // Default
shadow-md               // Medium
shadow-lg               // Large (khuyên dùng cho cards)
shadow-xl               // XL (buttons)
shadow-2xl              // XXL (hero elements)

// Custom gold glow shadows
shadow-[0_0_30px_rgba(255,215,0,0.4)]      // Hover buttons
shadow-[0_0_40px_rgba(255,215,0,0.6)]      // Active/pressed
shadow-lg shadow-[#FFD700]/20              // Cards hover
shadow-xl shadow-[#FFD700]/30              // Emphasized elements
```

### Text Shadows
```typescript
// Gold glow for headings
style={{ textShadow: '0 0 30px rgba(255,215,0,0.3)' }}      // Subtle
style={{ textShadow: '0 0 50px rgba(255,215,0,0.5)' }}      // Strong

// Usage: Hero headlines, brand text
```

### Drop Shadows (Tailwind)
```typescript
drop-shadow-lg          // Icons
drop-shadow-xl          // Large icons
drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]  // Gold glow
```

### Glow Effects (Filters)
```typescript
// Icon glow
style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))' }}

// Crown icon pattern (Header, Hero)
```

---

## 🎬 7. ANIMATIONS

### Framer Motion - Standard Patterns

#### Entrance Animations
```typescript
// Fade in from bottom (standard)
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}

// Fade in from top
initial={{ opacity: 0, y: -30 }}
animate={{ opacity: 1, y: 0 }}

// Scale in (badges, icons)
initial={{ scale: 0, rotate: -180 }}
animate={{ scale: 1, rotate: 0 }}
transition={{ type: "spring", duration: 1 }}

// Fade in only
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.8 }}
```

#### Scroll-triggered Animations (whileInView)
```typescript
// Standard pattern
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}

// Staggered animations (grid items)
transition={{ delay: index * 0.1, duration: 0.6 }}
```

#### Hover Animations
```typescript
// Button hover
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.98 }}

// Card hover (lift effect)
whileHover={{ y: -10, scale: 1.02 }}

// Icon rotation
whileHover={{ rotate: 360 }}
transition={{ duration: 0.6 }}

// Glow on hover
whileHover={{
  boxShadow: '0 0 30px rgba(255,215,0,0.6)'
}}
```

#### Infinite Animations

**Floating particles:**
```typescript
animate={{
  y: [0, -50, 0],
  x: [0, Math.random() * 30 - 15, 0],
  opacity: [0.3, 0.8, 0.3],
  scale: [1, 1.5, 1],
}}
transition={{
  duration: 4 + Math.random() * 4,
  repeat: Infinity,
  delay: Math.random() * 5,
}}
```

**Pulsing glow:**
```typescript
animate={{
  boxShadow: [
    '0 0 20px 10px rgba(255, 215, 0, 0.3)',
    '0 0 40px 20px rgba(255, 215, 0, 0.1)',
    '0 0 20px 10px rgba(255, 215, 0, 0.3)',
  ],
}}
transition={{ duration: 2, repeat: Infinity }}
```

**Shimmer effect (button):**
```typescript
<motion.div
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
  animate={{ x: ['-100%', '200%'] }}
  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
/>
```

**Bounce (scroll indicator):**
```typescript
animate={{ y: [0, 10, 0] }}
transition={{ duration: 2, repeat: Infinity }}
```

**Gradient sweep (background):**
```typescript
animate={{
  background: [
    'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
    'radial-gradient(circle at 80% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
    'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
  ],
}}
transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
```

### Tailwind Animations
```typescript
animate-pulse           // CTA buttons (subtle breathing)
animate-spin            // Loading states
animate-bounce          // Attention grabbers (giới hạn)
```

### Transition Classes
```typescript
transition-all          // All properties (khuyên dùng)
transition-colors       // Colors only
transition-transform    // Transforms only
transition-shadow       // Shadows only

// Duration
duration-200            // Fast (hover)
duration-300            // Standard (khuyên dùng)
duration-500            // Slow
```

---

## 🎊 8. CONFETTI

### Standard Confetti Configuration
```typescript
import confetti from "canvas-confetti"

// Standard burst (CTA clicks)
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#FFD700', '#FDB931', '#FFFFFF'],
  gravity: 0.6,
  scalar: 1.2,
  ticks: 200
})

// Smaller burst (secondary actions)
confetti({
  particleCount: 50,
  spread: 60,
  origin: { y: 0.6 },
  colors: ['#FFD700', '#FDB931'],
  gravity: 0.5,
  scalar: 0.8
})

// Logo click (Header)
confetti({
  particleCount: 100,
  spread: 75,
  origin: { x: 0.15, y: 0.3 },  // Top left (logo position)
  colors: ['#FFD700', '#FDB931', '#FFFFFF', '#C0C0C0'],
  gravity: 0.6,
  scalar: 1.2,
  drift: 0,
  ticks: 200
})
```

### Confetti Component (Custom Particles)
```typescript
// 50 confetti particles với random colors
// Tham khảo: app/home/Confetti.tsx

const CONFETTI_COLORS = ['#FFD700', '#9C27FF', '#FFFFFF']
const PARTICLE_COUNT = 50
const FALL_DURATION = 3000ms
```

### Khi nào dùng Confetti?
- ✅ User clicks primary CTA
- ✅ Logo click (playful interaction)
- ✅ Lucky Draw step trong timeline
- ✅ Successful form submission
- ❌ Không dùng cho hover
- ❌ Không dùng quá thường xuyên (gây phiền)

---

## 🎯 9. BUTTONS

### Variants

#### Primary (Gold gradient)
```tsx
<MyButton
  variant="primary"
  size="large"
  className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold shadow-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 animate-pulse"
  icon={<Sparkles className="h-6 w-6" />}
  iconPosition="left"
>
  Tạo sự kiện ngay
</MyButton>
```

#### Outline (Gold border)
```tsx
<MyButton
  variant="outline"
  size="large"
  className="text-lg px-10 py-7 rounded-full border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all duration-300"
  icon={<Play className="h-6 w-6" />}
  iconPosition="left"
>
  Xem demo
</MyButton>
```

#### Ghost (Subtle hover)
```tsx
<MyButton
  variant="ghost"
  size="small"
  className="text-[#FAF3E0] hover:text-[#FFD700] hover:bg-[#FFD700]/10 font-medium"
>
  Liên hệ
</MyButton>
```

### Sizes
```typescript
// Small (Navigation)
px-2 py-2 text-sm

// Medium (Standard)
px-6 py-3 text-base

// Large (CTA)
px-10 py-7 text-lg
```

### Button States
```typescript
// Default
border-[#FFD700]/20

// Hover
hover:border-[#FFD700]
hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]

// Active
bg-[#FFD700]/20
border-[#FFD700]/30

// Disabled
opacity-50
cursor-not-allowed
pointer-events-none
```

### Icon Position
```typescript
iconPosition="left"     // Icon trước text (khuyên dùng)
iconPosition="right"    // Icon sau text
```

---

## 🎴 10. CARDS

### Standard Card Pattern
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.1, duration: 0.6 }}
  whileHover={{ y: -10, scale: 1.02 }}
  className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a] border-2 border-[#FFD700]/20 hover:border-[#FFD700] p-8 shadow-lg hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all duration-300"
>
  {/* Card content */}
</motion.div>
```

### Glass Morphism Card
```tsx
className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 backdrop-blur-lg"
```

### Feature Card Pattern
```tsx
// Icon section
<div className={`
  inline-flex p-4 rounded-2xl mb-6
  bg-gradient-to-br ${gradient}
  shadow-lg group-hover:shadow-xl
  transition-all duration-300
`}>
  <Icon className="w-8 h-8 text-white" />
</div>

// Title
<h3 className="text-2xl font-bold text-white mb-4">
  Feature Title
</h3>

// Description
<p className="text-gray-300 text-lg leading-relaxed">
  Feature description
</p>
```

### Stat Card Pattern
```tsx
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] border-2 border-[#FFD700]/30 hover:border-[#FFD700] p-8 group">
  {/* Shimmer effect on hover */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[shimmerColor] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

  {/* Icon */}
  <Icon className="w-12 h-12 text-[#FFD700] mb-6" />

  {/* Animated counter */}
  <div className="text-6xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FDB931] bg-clip-text text-transparent mb-3">
    {count}+
  </div>

  {/* Label */}
  <h3 className="text-2xl font-bold text-white mb-3">
    Label
  </h3>

  {/* Description */}
  <p className="text-gray-400">
    Description
  </p>
</div>
```

---

## 🎭 11. ICONS

### Icon Library
```typescript
import { Icon } from "lucide-react"

// Tất cả icons sử dụng Lucide React
// https://lucide.dev/icons
```

### Icon Sizes
```typescript
// Small (inline, navigation)
className="w-4 h-4"     // 16px

// Medium (buttons, cards)
className="w-5 h-5"     // 20px

// Large (feature icons)
className="w-6 h-6"     // 24px
className="w-8 h-8"     // 32px

// XL (stat cards)
className="w-12 h-12"   // 48px

// XXL (hero icons)
className="w-20 h-20"   // 80px
```

### Icon Colors
```typescript
// Gold (default cho brand icons)
className="text-[#FFD700]"

// White (trong gradient backgrounds)
className="text-white"

// Gray (inactive states)
className="text-gray-400"

// Purple (accent icons)
className="text-[#9C27FF]"
```

### Icon Effects

**Drop shadow glow:**
```typescript
style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))' }}
```

**Rotation on hover:**
```typescript
whileHover={{ rotate: 360 }}
transition={{ duration: 0.6 }}
```

**Pulsing animation:**
```typescript
animate={{
  rotate: [0, 5, -5, 0],
  scale: [1, 1.1, 1],
}}
transition={{ duration: 3, repeat: Infinity }}
```

### Icon Usage by Context
```typescript
// Navigation (Header)
Settings: w-4 h-4, text-[#FAF3E0], hover:text-[#FFD700]

// Buttons
Icon + Text: w-5 h-5 hoặc w-6 h-6

// Feature cards
Large feature icon: w-8 h-8, text-white, trong gradient background

// Stats cards
Stat icon: w-12 h-12, text-[#FFD700]

// Hero
Crown logo: w-20 h-20, text-[#FFD700], với pulsing glow
```

### Common Icons & Usage
```typescript
// Actions
Sparkles:     CTA, highlights, magic moments
Play:         Demo, video, preview
Gift:         Lucky draw, rewards
ArrowRight:   Navigation, next steps
Check:        Success, completed
Crown:        Brand, premium, logo

// Features
QrCode:       Check-in
Vote:         Voting, polls
BarChart3:    Analytics, results
MonitorPlay:  Screens, displays
Radio:        Livestream
Gamepad2:     Games, interaction

// Social
Facebook, Linkedin, Link: Sharing

// Navigation
Settings:     Admin, configuration
LogOut:       Sign out
Menu:         Mobile menu
```

---

## 📱 12. RESPONSIVE DESIGN

### Breakpoints (Tailwind)
```typescript
sm:   640px    // Small tablets
md:   768px    // Tablets
lg:   1024px   // Small desktops
xl:   1280px   // Desktops
2xl:  1536px   // Large desktops
```

### Responsive Patterns

#### Typography
```typescript
// Hero headline
text-5xl md:text-7xl lg:text-8xl

// Section title
text-3xl md:text-4xl

// Subheading
text-2xl md:text-3xl

// Body
text-xl md:text-2xl
```

#### Layout
```typescript
// Grid
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Flex direction
flex-col sm:flex-row

// Spacing
gap-4 md:gap-8 lg:gap-12
py-16 md:py-24 lg:py-32
```

#### Visibility
```typescript
// Hide on mobile
hidden md:block

// Hide on desktop
md:hidden

// Navigation pattern
<Link href="/about" className="hidden md:block">
```

#### Button responsive
```typescript
// Desktop button (with text)
className="hidden sm:flex"

// Mobile button (icon only)
className="sm:hidden px-2"
```

---

## 🎪 13. GLASS MORPHISM

### Standard Glass Card
```tsx
className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 backdrop-blur-lg"
```

### Light Glass
```tsx
className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6"
```

### Usage
- Modal overlays
- Floating panels
- Header (scrolled state)
- Cards trên background images

---

## 🌟 14. HOVER EFFECTS

### Standard Hover Pattern
```typescript
// Card lift + glow
whileHover={{ y: -10, scale: 1.02 }}
className="hover:border-[#FFD700] hover:shadow-xl hover:shadow-[#FFD700]/20"

// Button scale
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.98 }}

// Color change
className="hover:text-[#FFD700] hover:bg-[#FFD700]/10"
```

### Shimmer Hover (Cards)
```tsx
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-[shimmerColor] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
```

### Icon Rotation Hover
```tsx
whileHover={{ rotate: 360 }}
transition={{ duration: 0.6 }}
```

---

## 🎬 15. TRANSITIONS

### Standard Transition
```typescript
transition-all duration-300     // Khuyên dùng (smooth, not too slow)
```

### Specific Transitions
```typescript
transition-colors duration-200  // Fast color changes
transition-transform duration-300  // Hover lifts
transition-shadow duration-300  // Shadow changes
transition-opacity duration-500  // Fade in/out
```

---

## 🏗️ 16. COMPONENT STRUCTURE

### Standard Component Pattern
```tsx
"use client"

import { motion } from "framer-motion"
import { Icon } from "lucide-react"
import { DATA_CONSTANT } from "@/app/constants/..."

interface ComponentProps {
  // Props definition
}

export default function Component({ prop }: ComponentProps) {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
      <div className="container px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Section Title
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Section description
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {DATA.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              {/* Card content */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 📦 17. CONSTANTS MANAGEMENT

### File Structure
```
app/constants/
├── home.constants.ts       // Homepage data
├── pricing.constants.ts    // Pricing data
└── [feature].constants.ts  // Feature-specific data
```

### Constant Pattern
```typescript
export const SECTION_DATA = [
  {
    id: 'unique-id',
    icon: IconComponent,
    title: 'Title',
    description: 'Description',
    gradient: 'from-color to-color',
    delay: 0.1,
  },
  // ...
]
```

---

## ✅ 18. BEST PRACTICES

### DO ✅
- Sử dụng constants từ `app/constants/` cho data
- Dùng Framer Motion cho animations
- `viewport={{ once: true }}` cho scroll animations
- Stagger animations với `delay: index * 0.1`
- `transition-all duration-300` cho hover effects
- Gold (`#FFD700`) cho brand elements
- `text-gray-300` cho body text
- `rounded-2xl` cho cards
- `py-24` cho sections
- Icons từ Lucide React
- Glass morphism cho overlays
- Responsive: mobile-first approach

### DON'T ❌
- Hardcode data trong components
- Dùng inline styles (trừ special effects)
- Quá nhiều animations cùng lúc
- Animations không có `viewport={{ once: true }}`
- Confetti cho mọi action
- Colors không theo palette
- Font sizes tùy tiện
- Border radius không consistent
- Spacing không theo scale
- Icons từ nhiều libraries khác nhau
- Forget accessibility (ARIA labels)

---

## 🎯 19. CHECKLIST

Khi tạo màn hình mới, check:

- [ ] Colors theo palette (Gold #FFD700, Purple #9C27FF, Background #0D0D1A)
- [ ] Typography đúng sizes (text-3xl md:text-4xl cho titles)
- [ ] Spacing consistent (py-24, gap-8, mb-6)
- [ ] Border radius (rounded-2xl cho cards)
- [ ] Shadows (shadow-lg, hover:shadow-xl)
- [ ] Animations có `viewport={{ once: true }}`
- [ ] Hover effects (whileHover={{ y: -10 }})
- [ ] Icons từ Lucide React
- [ ] Data trong constants file
- [ ] Responsive (md:, lg: breakpoints)
- [ ] Glass morphism cho overlays
- [ ] Gradient backgrounds cho sections
- [ ] Confetti cho primary CTAs only
- [ ] Text colors (white for headings, gray-300 for body)
- [ ] Button variants correct

---

## 🏛️ 20. CODE ARCHITECTURE & REFACTORING

### Quy tắc vàng khi tạo trang mới

#### ✅ LUÔN Refactor Code
```
Mỗi trang mới PHẢI được refactor ngay từ đầu:
- Tách logic thành components
- Extract constants
- Tạo utility functions
- Optimize performance
- Ensure SEO-friendly
```

### Folder Structure Pattern

#### Standard Page Structure
```
app/
├── [page-name]/
│   ├── page.tsx                    # ⚡ Server Component (main orchestrator)
│   ├── components/                 # 📦 Page-specific components
│   │   ├── [PageName]Wrapper.tsx   # Client wrapper cho state management
│   │   ├── [PageName]Hero.tsx      # Hero section
│   │   ├── [PageName]Features.tsx  # Features section
│   │   └── ...                     # Other sections
│   ├── constants/                  # 📊 Page-specific data
│   │   └── [page-name].constants.ts
│   └── utils/                      # 🔧 Page-specific utilities
│       └── [page-name].utils.ts
```

#### Example: Homepage Structure
```
app/
├── page.tsx                        # Server Component (117 lines)
├── components/
│   ├── HomePageWrapper.tsx         # Client wrapper
│   ├── HomeHero.tsx                # Hero section
│   ├── ImpactStats.tsx             # Stats cards
│   ├── FeaturesGrid.tsx            # Features grid
│   ├── PlatformTimeline.tsx        # Timeline
│   ├── SloganHighlight.tsx         # Slogan section
│   ├── Testimonials.tsx            # Testimonials
│   ├── FinalCTA.tsx                # Final CTA
│   ├── AnimatedCounter.tsx         # Reusable component
│   └── Confetti.tsx                # Effect component
├── constants/
│   └── home.constants.ts           # All homepage data
└── README.md                       # Documentation
```

### Server vs Client Components

#### 🖥️ Server Components (Default)
```tsx
// app/[page]/page.tsx
// ❌ NO "use client" directive
// ✅ Server-side rendering
// ✅ SEO-friendly metadata
// ✅ No JavaScript bundle

import { Metadata } from "next"
import dynamic from "next/dynamic"
import Header from "@/home/Header"
import Footer from "@/home/Footer"
import { getMetadata } from "@/lib/seo"

// Dynamic imports for client home
const PageWrapper = dynamic(() => import('./home/PageWrapper'), {
  ssr: false,
  loading: () => <div className="h-screen" />
})

// Metadata export (server-side only)
export const metadata: Metadata = getMetadata({
  title: "Page Title",
  description: "Page description",
  // ...
})

// Main page component (Server Component)
export default function PageName() {
  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <Header />
      <PageWrapper />
      <Footer />
    </div>
  )
}
```

#### 💻 Client Components (When Needed)
```tsx
// app/[page]/home/Section.tsx
"use client"  // ⚠️ Only when necessary

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store/hooks"

// Client component - có state, effects, animations, Redux
export default function Section() {
  const [state, setState] = useState()
  const dispatch = useAppDispatch()

  // Client-side logic here
  return (
    <motion.div>
      {/* Interactive content */}
    </motion.div>
  )
}
```

### Khi nào dùng "use client"?

#### ✅ PHẢI dùng Client Component khi có:
- `useState`, `useEffect`, `useReducer`
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Framer Motion animations
- Redux hooks (`useAppDispatch`, `useAppSelector`)
- Browser APIs (`window`, `localStorage`, `document`)
- React Router hooks (`useRouter`, `usePathname`)
- Custom hooks sử dụng hooks khác

#### ❌ KHÔNG dùng Client Component khi:
- Chỉ render static HTML
- Fetch data server-side
- SEO metadata
- Không có interactivity
- Pure data display

### Dynamic Imports Pattern

#### Standard Dynamic Import
```tsx
import dynamic from "next/dynamic"

// Component with loading state
const HeavyComponent = dynamic(() => import('./home/HeavyComponent'), {
  loading: () => (
    <div className="py-24">
      <div className="h-96" />  {/* Skeleton */}
    </div>
  )
})

// Component without SSR
const ClientOnlyComponent = dynamic(() => import('./home/ClientOnly'), {
  ssr: false,  // Disable server-side rendering
  loading: () => null
})
```

#### Benefits of Dynamic Imports
```typescript
✅ Giảm initial bundle size (~65% smaller)
✅ Faster Time to Interactive (~63% faster)
✅ Better SEO scores (+20 points)
✅ Lazy load components khi scroll
✅ No layout shift với loading states
```

### Constants Management

#### Create Constants File
```typescript
// app/[page]/constants/[page].constants.ts

import { Icon } from "lucide-react"

// Theme colors (if page-specific)
export const PAGE_COLORS = {
  primary: '#FFD700',
  secondary: '#9C27FF',
}

// Section data
export const HERO_CONTENT = {
  headline: 'Page Headline',
  subtext: 'Page description',
  cta: {
    primary: { text: 'Primary CTA', icon: '🎉' },
    secondary: { text: 'Secondary CTA', icon: '🔍' },
  },
}

export const FEATURES = [
  {
    id: 'feature-1',
    icon: Icon,
    title: 'Feature Title',
    description: 'Feature description',
    gradient: 'from-blue-500 to-indigo-600',
    delay: 0.1,
  },
  // ...
]

export const STATS = [
  {
    icon: Trophy,
    value: 200,
    suffix: '+',
    label: 'Stat Label',
    gradient: 'from-[#FFD700] to-[#FDB931]',
    delay: 0.1,
  },
  // ...
]

// Animation config
export const ANIMATION_CONFIG = {
  particles: 30,
  duration: 3,
  stagger: 0.1,
}
```

#### Import và sử dụng
```tsx
import { HERO_CONTENT, FEATURES } from "@/app/[page]/constants/[page].constants"

export default function Section() {
  return (
    <div>
      <h1>{HERO_CONTENT.headline}</h1>

      {FEATURES.map((feature) => (
        <Card key={feature.id} {...feature} />
      ))}
    </div>
  )
}
```

### Utility Functions

#### Create Utils File
```typescript
// app/[page]/utils/[page].utils.ts

// Format functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

// Validation functions
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Data transformation
export function transformData(raw: any[]): ProcessedData[] {
  return raw.map(item => ({
    id: item.id,
    title: item.name.toUpperCase(),
    // ...
  }))
}

// Animation helpers
export function getStaggerDelay(index: number, base = 0.1): number {
  return index * base
}
```

### Component Refactoring Steps

#### Step 1: Phân tích trang hiện tại
```
1. Identify các sections (Hero, Features, CTA, etc.)
2. List các data được hardcoded
3. Tìm logic có thể tái sử dụng
4. Check components nào cần client-side
```

#### Step 2: Tạo folder structure
```bash
mkdir app/[page]/home
mkdir app/[page]/constants
mkdir app/[page]/utils
```

#### Step 3: Extract constants
```typescript
// Move tất cả hardcoded data vào constants file
// ❌ Before (trong component)
const title = "Welcome to our platform"
const features = [{ name: "Feature 1" }, ...]

// ✅ After (trong constants)
export const PAGE_CONTENT = {
  title: "Welcome to our platform",
  features: [{ name: "Feature 1" }, ...]
}
```

#### Step 4: Chia nhỏ components
```tsx
// ❌ Before: Monolithic component (500+ lines)
export default function Page() {
  return (
    <div>
      {/* Hero section - 100 lines */}
      {/* Features section - 150 lines */}
      {/* Stats section - 100 lines */}
      {/* CTA section - 100 lines */}
    </div>
  )
}

// ✅ After: Modular home
export default function Page() {
  return (
    <div>
      <Hero />
      <Features />
      <Stats />
      <FinalCTA />
    </div>
  )
}
```

#### Step 5: Tối ưu Server/Client split
```tsx
// page.tsx - Server Component
import dynamic from "next/dynamic"

const ClientWrapper = dynamic(() => import('./home/Wrapper'), {
  ssr: false
})

export default function Page() {
  return <ClientWrapper />  // Client-only when needed
}
```

#### Step 6: Add documentation
```markdown
# README.md

## Architecture
- Main page: Server Component
- Components: Client Components with animations
- Constants: Centralized data management
- Utils: Reusable functions

## Performance
- Initial bundle: 180KB
- Time to Interactive: 1.4s
- SEO Score: 95/100
```

### Performance Optimization Checklist

#### ✅ Load Speed
- [ ] Server Component cho page.tsx
- [ ] Dynamic imports cho heavy components
- [ ] Loading states cho tất cả dynamic imports
- [ ] Constants extracted (không hardcode)
- [ ] Utility functions reusable
- [ ] Image optimization (Next.js Image)
- [ ] Font optimization (next/font)

#### ✅ SEO Optimization
- [ ] Metadata export trong page.tsx
- [ ] Server-side rendering cho static content
- [ ] Semantic HTML (h1, h2, section, article)
- [ ] Alt text cho images
- [ ] Structured data (JSON-LD)
- [ ] Canonical URLs
- [ ] Open Graph tags

#### ✅ Code Quality
- [ ] Components < 200 lines mỗi file
- [ ] Reusable components trong shared folder
- [ ] TypeScript interfaces cho props
- [ ] Constants file cho data
- [ ] Utils file cho functions
- [ ] README.md documentation

### File Size Guidelines

```typescript
// Target file sizes
page.tsx:           < 150 lines  // Server orchestrator
Component:          < 200 lines  // Each component
Constants:          < 300 lines  // Data only
Utils:              < 150 lines  // Pure functions
README:             As needed    // Documentation
```

### Code Review Checklist

Trước khi commit, kiểm tra:

#### Architecture
- [ ] page.tsx là Server Component
- [ ] Chỉ dùng "use client" khi cần thiết
- [ ] Constants extracted vào file riêng
- [ ] Utils extracted vào file riêng
- [ ] Components được chia nhỏ hợp lý

#### Performance
- [ ] Dynamic imports cho Client Components
- [ ] Loading states cho tất cả imports
- [ ] No layout shift
- [ ] Images optimized
- [ ] Fonts optimized

#### SEO
- [ ] Metadata export
- [ ] Server-side rendering
- [ ] Semantic HTML
- [ ] Alt texts
- [ ] Structured data

#### Code Quality
- [ ] TypeScript types
- [ ] No hardcoded data
- [ ] Reusable components
- [ ] Consistent naming
- [ ] Documentation added

### Example: Refactored Page

#### Before (Monolithic - 800 lines)
```tsx
"use client"

export default function Page() {
  // All state, logic, and UI in one file
  const [state, setState] = useState()

  return (
    <div>
      {/* 800 lines of mixed logic and UI */}
    </div>
  )
}
```

#### After (Modular - 117 lines main file)
```tsx
// page.tsx - Server Component (117 lines)
import { Metadata } from "next"
import dynamic from "next/dynamic"
import { getMetadata } from "@/lib/seo"

const PageWrapper = dynamic(() => import('./home/PageWrapper'), {
  ssr: false
})

export const metadata: Metadata = getMetadata({...})

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <Header />
      <PageWrapper />
      <Footer />
    </div>
  )
}
```

### Performance Metrics

#### Targets
```
Initial Load:        < 200KB JavaScript
Time to Interactive: < 1.5s
First Paint:         < 1s
SEO Score:           > 90/100
Accessibility:       > 95/100
```

#### Measurement Tools
- Lighthouse (Chrome DevTools)
- PageSpeed Insights
- WebPageTest
- Next.js Built-in Analytics

---

## 📚 21. DOCUMENTATION REQUIREMENTS

### README.md Template
```markdown
# [Page Name] - Architecture & Optimization

## 🎯 Overview
Brief description of the page purpose and features.

## 🏗️ Architecture

### Folder Structure
\`\`\`
app/[page]/
├── page.tsx                    # Server Component (XXX lines)
├── components/                 # Client Components
│   ├── [Page]Wrapper.tsx       # State management
│   ├── [Page]Hero.tsx          # Hero section
│   └── ...
├── constants/
│   └── [page].constants.ts     # Data & config
└── utils/
    └── [page].utils.ts         # Helper functions
\`\`\`

## ⚡ Performance

### Metrics
- Initial Load: XXX KB
- Time to Interactive: X.Xs
- SEO Score: XX/100

### Optimizations
- Server Components for static content
- Dynamic imports for client components
- Centralized constants
- Type-safe utilities

## 📊 Components

### Server Components
- Main page orchestrator

### Client Components
- [Component1]: Purpose
- [Component2]: Purpose

## 🔧 Maintenance

### Update Content
Edit `constants/[page].constants.ts`

### Add Component
1. Create in `components/`
2. Import in wrapper
3. Add data to constants

---

**Last Updated**: YYYY-MM-DD
**Performance Verified**: YYYY-MM-DD
\`\`\`

---

**Version**: 1.1
**Last Updated**: 2025-01-16
**Reference**: `/app/page.tsx` và components con
**Maintained By**: Code4Change Technology Solution

