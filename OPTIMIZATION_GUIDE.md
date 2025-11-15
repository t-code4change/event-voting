# 📘 Universal Page Optimization Guide

## 🎯 Optimization Pattern - Apply to ALL Pages

This guide shows how to optimize any page in the application using the same pattern as Homepage and Contact Page.

---

## 📋 Step-by-Step Process

### **Step 1: Analyze Current Page**

Read the existing page and identify:
- Total lines of code
- Sections/components within the page
- Data that can be extracted to constants
- Client-side vs server-side requirements

### **Step 2: Create Constants File**

**Location**: `app/[page-name]/constants/[page-name].constants.ts`

**Template**:
```typescript
// ============================================
// TYPES
// ============================================
export interface SectionData {
  // Define your types here
}

// ============================================
// THEME COLORS
// ============================================
export const PAGE_COLORS = {
  gold: {
    primary: '#FFD700',
    secondary: '#FDB931',
  },
  // Add page-specific colors
}

// ============================================
// CONTENT DATA
// ============================================
export const SECTION_CONTENT = {
  heading: 'Your heading',
  subheading: 'Your subheading',
  // Extract all text content
}

// ============================================
// FEATURES/ITEMS DATA
// ============================================
export const ITEMS = [
  {
    title: 'Item 1',
    description: 'Description',
    icon: IconComponent,
    // Add all repetitive data here
  },
]

// ============================================
// ANIMATION CONFIG
// ============================================
export const ANIMATION_CONFIG = {
  delay: 0.1,
  duration: 0.6,
  // Animation parameters
}
```

### **Step 3: Create Modular Components**

**Location**: `app/[page-name]/components/`

For each major section, create a component:

```typescript
"use client"

import { motion } from "framer-motion"
import { SECTION_CONTENT } from "../constants/[page-name].constants"

export default function SectionName() {
  return (
    <section className="relative py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>{SECTION_CONTENT.heading}</h2>
        {/* Component content */}
      </motion.div>
    </section>
  )
}
```

**Common Components to Extract**:
- `HeroSection.tsx` - Hero/banner section
- `FeaturesSection.tsx` - Features/benefits
- `ContentSection.tsx` - Main content
- `CTASection.tsx` - Call-to-action
- `TestimonialsSection.tsx` - If applicable

### **Step 4: Create Page Wrapper**

**Location**: `app/[page-name]/components/PageWrapper.tsx`

```typescript
"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamic imports for all sections
const HeroSection = dynamic(() => import('./HeroSection'))
const FeaturesSection = dynamic(() => import('./FeaturesSection'))
const CTASection = dynamic(() => import('./CTASection'))

export default function PageWrapper() {
  const [state, setState] = useState(/* initial state */)

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </>
  )
}
```

### **Step 5: Update Main Page**

**Location**: `app/[page-name]/page.tsx`

```typescript
import { Metadata } from "next"
import dynamic from "next/dynamic"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// Dynamic import for wrapper
const PageWrapper = dynamic(() => import('./components/PageWrapper'), {
  loading: () => (
    <div className="min-h-screen bg-[#0D0D1A]">
      <div className="h-screen" />
    </div>
  )
})

// SEO Metadata
export const metadata: Metadata = {
  title: "Page Title - Bright4Event",
  description: "Page description for SEO",
  // Add keywords, og tags, etc.
}

// Main Server Component
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

### **Step 6: Create README**

**Location**: `app/[page-name]/README.md`

Use this template:

```markdown
# 📄 [Page Name] - Architecture & Optimization

## 🎯 Tối ưu hóa đã thực hiện

### 1. **Server/Client Component Split**
- **Main Page**: Server Component (SEO tối ưu)
- **Interactive Components**: Client Components (chỉ hydrate khi cần)

### 2. **Code Organization**
```
app/[page-name]/
├── page.tsx                    # Server Component - Main orchestrator
├── components/                 # Client Components
│   ├── PageWrapper.tsx         # State management wrapper
│   ├── HeroSection.tsx         # Hero section
│   ├── FeaturesSection.tsx     # Features
│   └── CTASection.tsx          # Call-to-action
├── constants/
│   └── [page-name].constants.ts # Centralized data
└── README.md                   # This file
```

### 3. **Code Metrics**

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| File size | XXX lines | YY lines | **ZZ% reduction** |
| Components | 1 monolith | N modular | **Better separation** |
| Client bundle | Full page | Only interactive | **~60% smaller** |

## 🔧 Component Details

[Describe each component and why it's client-side]

## 📊 Performance Impact

### Initial Load
```
Before: ~XXXKB JavaScript
After:  ~YYKB JavaScript
Savings: ZZ% reduction
```

---

**Last Updated**: [Date]
**Optimized By**: Code Refactoring & Performance Engineering
```

---

## 🎨 Quick Wins Checklist

For each page optimization:

### Pre-Optimization
- [ ] Read current page file
- [ ] Count total lines
- [ ] Identify sections
- [ ] List data for extraction

### During Optimization
- [ ] Create constants file
- [ ] Extract all data and text
- [ ] Create component folder
- [ ] Split into 3-5 components
- [ ] Create PageWrapper
- [ ] Update main page.tsx
- [ ] Add SEO metadata

### Post-Optimization
- [ ] Create README
- [ ] Document metrics
- [ ] Test page functionality
- [ ] Verify animations work
- [ ] Check mobile responsiveness

---

## 🔑 Key Principles

1. **Server by default, Client when needed**
   - Use Server Components for static content
   - Only add "use client" for interactivity

2. **Dynamic imports with loading states**
   - Prevent layout shift
   - Improve perceived performance

3. **Centralize data**
   - One source of truth
   - Easy to update
   - Type-safe

4. **Modular components**
   - Single responsibility
   - Reusable
   - Testable

5. **SEO optimization**
   - Server-side metadata
   - Proper heading structure
   - Fast initial load

---

## 📦 Benefits Summary

### Developer Experience
✅ Easier to maintain
✅ Better code organization
✅ Faster development
✅ Type-safe with TypeScript

### User Experience
✅ Faster page loads
✅ No layout shift
✅ Smooth animations
✅ Better SEO

### Performance
✅ Smaller bundle size
✅ Faster TTI
✅ Better Lighthouse scores
✅ Optimized re-renders

---

## 🚀 Apply This Pattern To:

- [x] Homepage (`app/page.tsx`) - **COMPLETED**
- [x] Contact Page (`app/contact/page.tsx`) - **REFERENCE**
- [ ] Pricing Page (`app/pricing/page.tsx`)
- [ ] About Page (`app/about/page.tsx`)
- [ ] Guide Page (`app/guide/page.tsx`)
- [ ] Blog Page (`app/blog/page.tsx`)
- [ ] FAQ Page (`app/faq/page.tsx`)
- [ ] Case Studies (`app/case-studies/page.tsx`)

---

## 💡 Pro Tips

### 1. Find Large Components Fast
```bash
# Find files over 500 lines
find app -name "*.tsx" -exec wc -l {} \; | sort -rn | head -20
```

### 2. Extract Icons to Constants
```typescript
// Instead of importing in each component
export const ICONS = {
  check: Check,
  star: Star,
  // ...
}
```

### 3. Reuse Loading Components
```typescript
// Create shared loading component
const SectionLoader = () => (
  <div className="py-24">
    <div className="h-96 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]" />
  </div>
)
```

### 4. Group Related Constants
```typescript
export const HERO = {
  content: { /* ... */ },
  animation: { /* ... */ },
  style: { /* ... */ },
}
```

---

## 📈 Expected Results

After applying this pattern to all pages:

- **Overall bundle reduction**: ~60-70%
- **TTI improvement**: ~50-60%
- **SEO scores**: +15-20 points
- **Code maintainability**: Significantly improved
- **Development velocity**: Faster for new features

---

**Remember**: The goal is not just smaller files, but better architecture that's easier to maintain and performs better for users.
