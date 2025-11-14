# Bright4Event Admin Design System
**Based on Waiting Screen UI - ClassName Analysis**

> **Quan trọng:** Dashboard dùng theme riêng (`#0C0F15`, `#161A23`, `#F5C242`, `#F2D276`).
> Design system này áp dụng cho: **Voting, Result LED, Mini Game, Analytics, Welcome LED, Waiting Screen, Settings, Guests, Check-in, Event Settings**.

---

## 📊 ClassName Pattern Analysis

### 🎨 Colors

#### Background Colors
```tsx
// Page background
bg-[#0C0F15]

// Card/Panel backgrounds
bg-gradient-to-br from-white/10 to-white/5  // Glass morphism gradient
bg-white/10                                  // Input, secondary elements
bg-white/5                                   // Hover states, subtle backgrounds
bg-black                                     // Slideshow preview
bg-black/50                                  // Overlay on hover
bg-black/80                                  // Dark overlay (from)
bg-black/40                                  // Medium overlay (via)

// Accent backgrounds
bg-[#FFD700]                                 // Gold primary button
bg-[#FFC107]                                 // Gold hover state
bg-[#FFD700]/10                              // Gold tint (selected state)
bg-red-500                                   // Delete button
bg-red-600                                   // Delete button hover
bg-green-500                                 // Live indicator
```

#### Border Colors
```tsx
border-white/20          // Default border
border-white/10          // Subtle border (not used much)
border-[#FFD700]         // Active/selected state
border-[#FFD700]/50      // Gold hover state
border-2 border-dashed   // Upload button
```

#### Text Colors
```tsx
text-white               // Primary headings
text-white/80            // Secondary text
text-white/60            // Tertiary text (labels, descriptions)
text-white/40            // Quaternary text (placeholders)
text-black               // Text on gold buttons
text-red-500             // Error text (if needed)

// Gradient text
bg-gradient-to-r from-[#FFD700] to-[#FFC107] bg-clip-text text-transparent
```

---

### 📏 Spacing

#### Padding
```tsx
p-2          // Icon buttons (8px)
p-3          // Quote selection buttons (12px)
p-4          // Upload button (16px)
p-6          // Cards/panels (24px)
p-12         // Quote overlay on preview (48px)

px-2 py-1    // Small badges (8px × 4px)
px-3 py-1    // Live indicator (12px × 4px)
px-4 py-2    // Buttons (16px × 8px)
px-4 py-3    // Inputs (16px × 12px)
```

#### Margin
```tsx
mb-2         // Description spacing (8px)
mb-4         // Section header bottom margin (16px)
mb-6         // Preview header bottom (24px)
mt-2         // Description top margin (8px)
mt-6         // Thumbnail section top (24px)
```

#### Gap
```tsx
gap-2        // Small gaps (icon + text) (8px)
gap-3        // Medium gaps (header buttons, thumbnails) (12px)
gap-8        // Large gaps (grid columns) (32px)

space-y-3    // Stack with 12px gap
space-y-4    // Stack with 16px gap
space-y-6    // Stack with 24px gap
space-y-8    // Stack with 32px gap
```

---

### 🔤 Typography

#### Font Sizes
```tsx
text-xs      // 12px - badges, hints
text-sm      // 14px - labels, secondary text
text-base    // 16px - body (not used explicitly, default)
text-lg      // 18px - section headers
text-xl      // 20px - not used in waiting screen
text-2xl     // 24px - event name overlay
text-3xl     // 30px - page title, quote overlay
```

#### Font Weights
```tsx
font-normal    // 400 - not used explicitly
font-medium    // 500 - not used
font-semibold  // 600 - primary buttons
font-bold      // 700 - headers, page title
```

---

### 🔲 Border Radius

```tsx
rounded         // 4px - small badge
rounded-lg      // 8px - thumbnails, buttons, quote selector
rounded-xl      // 12px - inputs, primary buttons, preview container
rounded-2xl     // 16px - cards/panels
rounded-full    // 9999px - live indicator dot
```

---

### 📐 Widths & Heights

#### Widths
```tsx
w-2          // 8px - live dot
w-4          // 16px - icon size
w-5          // 20px - section header icon
w-8          // 32px - page title icon
w-12         // 48px - quote icon
w-24         // 96px - thumbnail width
w-full       // 100%
```

#### Heights
```tsx
h-1          // 4px - progress bar
h-2          // 8px - live dot, range slider track
h-4          // 16px - icon size
h-5          // 20px - section header icon
h-8          // 32px - page title icon
h-12         // 48px - quote icon
h-16         // 64px - thumbnail height
h-20         // 80px - slide image height
h-full       // 100%
```

#### Special Sizes
```tsx
aspect-video     // 16:9 aspect ratio for preview
max-w-4xl        // 896px - quote text container
```

---

### 🎭 Layout & Positioning

```tsx
// Flexbox
flex items-center justify-between  // Header layout
flex items-center gap-3            // Button with icon
flex-shrink-0                      // Thumbnails

// Grid
grid grid-cols-3 gap-8             // Main layout (1/3 settings, 2/3 preview)
col-span-1                         // Settings column
col-span-2                         // Preview column

// Position
relative                           // Parent for absolute children
absolute inset-0                   // Full overlay
absolute top-2 right-2             // Badge position
absolute bottom-0 left-0 right-0   // Quote overlay position
absolute top-8 left-8              // Event logo position
```

---

### 🎬 Transitions & Animations

```tsx
// Transitions
transition-all            // All properties
transition-opacity        // Opacity only

// Hover states
hover:bg-white/20
hover:bg-[#FFC107]
hover:bg-red-600
hover:opacity-100
hover:border-[#FFD700]/50
hover:text-white

// Group hover
group-hover:opacity-100

// Framer Motion (whileHover/whileTap)
whileHover={{ scale: 1.05 }}  // Button hover
whileTap={{ scale: 0.95 }}    // Button click
whileHover={{ scale: 1.02 }}  // Upload button hover (subtle)
whileTap={{ scale: 0.98 }}    // Upload button click

// Scale
scale-110                     // Active thumbnail

// Opacity
opacity-0                     // Hidden
opacity-60                    // Inactive thumbnails

// Animate
animate-pulse                 // Live indicator
```

---

### 🎨 Other Utilities

```tsx
// Overflow
overflow-hidden        // Clip content (thumbnails, preview)
overflow-x-auto        // Horizontal scroll (thumbnails)

// Object fit
object-cover           // Images fill container

// Line clamp
line-clamp-2           // Truncate to 2 lines

// Outline
focus:outline-none     // Remove default outline

// Resize
resize-none            // Disable textarea resize

// Cursor
cursor-pointer         // Clickable elements

// Appearance
appearance-none        // Remove default range slider styling
```

---

## 🧩 Reusable Component Patterns

### 1. AdminCard
**ClassName:**
```tsx
"rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6"
```

### 2. AdminPageHeader
**ClassName:**
```tsx
// Title
"text-3xl font-bold text-white flex items-center gap-3"
// Description
"text-white/60 mt-2"
```

### 3. AdminSectionHeader
**ClassName:**
```tsx
"text-lg font-bold text-white flex items-center gap-2 mb-4"
```

### 4. AdminButton (Primary)
**ClassName:**
```tsx
"flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107]"
```
**Motion:**
```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### 5. AdminButton (Secondary)
**ClassName:**
```tsx
"flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20"
```

### 6. AdminInput
**ClassName:**
```tsx
"w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50"
```

### 7. AdminTextarea
**ClassName (extends AdminInput):**
```tsx
"w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 resize-none"
```

### 8. AdminThumbnail
**ClassName (default):**
```tsx
"flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 border-white/20 opacity-60 hover:opacity-100 transition-all"
```
**ClassName (active):**
```tsx
"flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 border-[#FFD700] scale-110 transition-all"
```

### 9. AdminBadge
**ClassName:**
```tsx
"absolute top-2 right-2 px-2 py-1 bg-[#FFD700] text-black text-xs font-bold rounded"
```

### 10. AdminLiveIndicator
**ClassName:**
```tsx
// Container
"flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10"
// Dot
"w-2 h-2 bg-green-500 rounded-full animate-pulse"
// Text
"text-xs text-white/60"
```

### 11. AdminUploadButton
**ClassName:**
```tsx
"w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-white/20 text-white/60 hover:border-[#FFD700]/50 hover:text-white transition-all"
```
**Motion:**
```tsx
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

### 12. AdminIconButton (Delete)
**ClassName:**
```tsx
"p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
```

### 13. AdminRangeSlider
**ClassName:**
```tsx
"w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFD700]"
```

### 14. AdminQuoteSelector
**ClassName (default):**
```tsx
"w-full text-left p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
```
**ClassName (active):**
```tsx
"w-full text-left p-3 rounded-lg border border-[#FFD700] bg-[#FFD700]/10 transition-all"
```

---

## 📦 Component Library Structure

```
components/admin/
├── AdminCard.tsx
├── AdminPageHeader.tsx
├── AdminSectionHeader.tsx
├── AdminButton.tsx (Primary, Secondary, Icon variants)
├── AdminInput.tsx
├── AdminTextarea.tsx
├── AdminThumbnail.tsx
├── AdminBadge.tsx
├── AdminLiveIndicator.tsx
├── AdminUploadButton.tsx
├── AdminRangeSlider.tsx
├── AdminQuoteSelector.tsx
└── index.ts (barrel export)
```

---

## 🎯 Usage Philosophy

### Nguyên tắc sử dụng:
1. **Copy className trực tiếp** - Không cần token, chỉ copy className từ patterns
2. **Component hóa patterns lặp lại** - Tạo component khi pattern xuất hiện 3+ lần
3. **Props tối giản** - Chỉ props cần thiết (children, onClick, value, onChange)
4. **Extend bằng className prop** - Cho phép override/extend styles
5. **TypeScript strict** - Đảm bảo type safety

### Khi nào tạo component mới:
- ✅ Pattern xuất hiện >= 3 lần
- ✅ Logic phức tạp (state, effects)
- ✅ Cần reuse nhiều pages

### Khi nào dùng className trực tiếp:
- ✅ Pattern chỉ dùng 1-2 lần
- ✅ Layout đặc thù của page
- ✅ Prototype nhanh

---

**Version:** 2.0 (ClassName-based)
**Last Updated:** 2025-01-14
**Based On:** `/app/admin/(authenticated)/waiting-screen/page.tsx`
