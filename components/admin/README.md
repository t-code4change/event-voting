# Admin Component Library

Component library dựa trên **Waiting Screen UI patterns** - dễ dùng, chỉ cần copy className và import component.

## 📦 Installation

```tsx
import {
  AdminCard,
  AdminPageHeader,
  AdminSectionHeader,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminUploadButton,
  AdminLiveIndicator,
  AdminRangeSlider,
} from "@/home/admin"
```

---

## 🧩 Components

### 1. AdminCard

Card container với glass morphism effect.

**Props:**
- `children: ReactNode` - Nội dung card
- `className?: string` - Override/extend styles

**Usage:**
```tsx
<AdminCard>
  <h2>Card Content</h2>
</AdminCard>

// Custom styling
<AdminCard className="h-full">
  <p>Full height card</p>
</AdminCard>
```

**Generated className:**
```
rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6
```

---

### 2. AdminPageHeader

Page header với title, description, icon, và actions.

**Props:**
- `title: string` - Page title
- `description?: string` - Description text (optional)
- `icon?: LucideIcon` - Icon component (optional)
- `actions?: ReactNode` - Action buttons (optional)
- `className?: string` - Override/extend styles

**Usage:**
```tsx
import { Tv } from "lucide-react"

<AdminPageHeader
  title="Waiting Screen"
  description="Màn hình chờ với slideshow và quote"
  icon={Tv}
  actions={
    <>
      <AdminButton variant="secondary">Action 1</AdminButton>
      <AdminButton>Action 2</AdminButton>
    </>
  }
/>
```

---

### 3. AdminSectionHeader

Section header với icon.

**Props:**
- `title: string` - Section title
- `icon?: LucideIcon` - Icon component (optional)
- `className?: string` - Override/extend styles

**Usage:**
```tsx
import { ImageIcon } from "lucide-react"

<AdminSectionHeader title="Slideshow Images" icon={ImageIcon} />

// Remove margin bottom
<AdminSectionHeader title="Preview" icon={Eye} className="mb-0" />
```

**Generated className:**
```
text-lg font-bold text-white flex items-center gap-2 mb-4
```

---

### 4. AdminButton

Button với 3 variants: primary, secondary, icon.

**Props:**
- `children: ReactNode` - Button text
- `onClick?: () => void` - Click handler
- `variant?: "primary" | "secondary" | "icon"` - Button style (default: "primary")
- `icon?: LucideIcon` - Icon component (optional)
- `className?: string` - Override/extend styles
- `disabled?: boolean` - Disabled state (default: false)
- `type?: "button" | "submit" | "reset"` - Button type (default: "button")

**Usage:**
```tsx
import { Plus, Play, X } from "lucide-react"

// Primary button (gold)
<AdminButton icon={Plus} onClick={handleClick}>
  Create New
</AdminButton>

// Secondary button (outline)
<AdminButton variant="secondary" icon={Play}>
  Play
</AdminButton>

// Icon button (small, red for delete)
<AdminButton variant="icon" icon={X} />
```

**Generated classNames:**
- Primary: `flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107]`
- Secondary: `flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20`
- Icon: `p-2 rounded-lg bg-red-500 text-white hover:bg-red-600`

**Motion:**
- Primary/Secondary: `whileHover={{ scale: 1.05 }}` + `whileTap={{ scale: 0.95 }}`
- Icon: No motion (static button)

---

### 5. AdminInput

Text input với focus state.

**Props:**
- Extends all `InputHTMLAttributes<HTMLInputElement>`
- `className?: string` - Override/extend styles

**Usage:**
```tsx
<AdminInput
  type="text"
  placeholder="Enter value..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Generated className:**
```
w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50
```

---

### 6. AdminTextarea

Textarea với focus state (no resize).

**Props:**
- Extends all `TextareaHTMLAttributes<HTMLTextAreaElement>`
- `className?: string` - Override/extend styles

**Usage:**
```tsx
<AdminTextarea
  placeholder="Nhập quote của bạn..."
  rows={4}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Generated className:**
```
w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 resize-none
```

---

### 7. AdminUploadButton

Dashed border button cho upload.

**Props:**
- `children: ReactNode` - Button text
- `onClick?: () => void` - Click handler
- `icon?: LucideIcon` - Icon component (optional)
- `className?: string` - Override/extend styles

**Usage:**
```tsx
import { Plus } from "lucide-react"

<AdminUploadButton icon={Plus} onClick={handleUpload}>
  Upload Image
</AdminUploadButton>
```

**Generated className:**
```
w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-white/20 text-white/60 hover:border-[#FFD700]/50 hover:text-white transition-all
```

**Motion:**
```
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

---

### 8. AdminLiveIndicator

Live indicator với pulse animation.

**Props:**
- `text?: string` - Indicator text (default: "Live")
- `className?: string` - Override/extend styles

**Usage:**
```tsx
<AdminLiveIndicator />

<AdminLiveIndicator text="Playing 1 / 3" />
```

**Generated className:**
```
// Container
flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10
// Dot
w-2 h-2 bg-green-500 rounded-full animate-pulse
// Text
text-xs text-white/60
```

---

### 9. AdminRangeSlider

Range slider với gold thumb.

**Props:**
- Extends all `InputHTMLAttributes<HTMLInputElement>` (except `type`)
- `className?: string` - Override/extend styles

**Usage:**
```tsx
<AdminRangeSlider
  min={3}
  max={15}
  value={speed}
  onChange={(e) => setSpeed(Number(e.target.value))}
/>
```

**Generated className:**
```
w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFD700]
[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FFD700] [&::-moz-range-thumb]:border-0
```

---

## 📖 Complete Example

```tsx
"use client"

import { useState } from "react"
import { Tv, Play, Plus } from "lucide-react"
import {
  AdminCard,
  AdminPageHeader,
  AdminSectionHeader,
  AdminButton,
  AdminTextarea,
  AdminUploadButton,
  AdminLiveIndicator,
  AdminRangeSlider,
} from "@/home/admin"

export default function MyPage() {
  const [speed, setSpeed] = useState(5)
  const [text, setText] = useState("")

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="My Page"
        description="Page description"
        icon={Tv}
        actions={
          <AdminButton icon={Play}>
            Start
          </AdminButton>
        }
      />

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          <AdminCard>
            <AdminSectionHeader title="Settings" icon={Tv} />

            <AdminTextarea
              placeholder="Enter text..."
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <AdminRangeSlider
              min={1}
              max={10}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />

            <AdminUploadButton icon={Plus}>
              Upload File
            </AdminUploadButton>
          </AdminCard>
        </div>

        <div className="col-span-2">
          <AdminCard className="h-full">
            <div className="flex items-center justify-between mb-6">
              <AdminSectionHeader title="Preview" className="mb-0" />
              <AdminLiveIndicator text="1 / 3" />
            </div>

            {/* Preview content */}
          </AdminCard>
        </div>
      </div>
    </div>
  )
}
```

---

## 🎯 Design Principles

1. **Copy className patterns** - Không cần token variables, chỉ copy className
2. **Minimal props** - Chỉ props cần thiết
3. **Extend with className** - Override styles bằng className prop
4. **TypeScript strict** - Type safety đầy đủ
5. **Consistent patterns** - Tất cả components dùng chung className patterns

---

## 🔗 Related Files

- **Design System Doc:** `/app/admin/(authenticated)/THEME_ADMIN.md`
- **Reference Implementation:** `/app/admin/(authenticated)/waiting-screen/page.tsx`

---

**Version:** 1.0
**Last Updated:** 2025-01-14
