# Toast System Migration Guide
## Từ Sonner sang Custom Toast UI

---

## 📊 Phân Tích Hệ Thống Toast Hiện Tại

### Hệ Thống Toast Đang Dùng

Hiện tại ứng dụng đang sử dụng **2 hệ thống toast song song**:

#### 1. **Sonner** (thư viện bên ngoài)
```typescript
import { toast } from "sonner"

// Sử dụng
toast.success("Thành công!")
toast.error("Lỗi!")
toast.info("Thông tin")
toast.warning("Cảnh báo")
```

**Vị trí sử dụng:**
- ✅ `app/event/[eventId]/vote/page.tsx` - 7 chỗ
- ✅ `app/event/[eventId]/results/page.tsx` - 1 chỗ
- ✅ `app/admin/*/page.tsx` - 8 chỗ
- ✅ `components/AuthModal.tsx` - 2 chỗ
- ✅ `components/AdminSidebar.tsx` - chưa kiểm tra

**Đặc điểm:**
- ❌ UI mặc định của thư viện (không theo brand)
- ❌ Không có confetti effect
- ❌ Không có animation custom
- ✅ Dễ sử dụng

#### 2. **Custom Toast** (tự xây dựng)
```typescript
import { useToast, voteSuccessToast } from "@/hooks/use-toast"

// Sử dụng
const { toast } = useToast()
toast({
  variant: "success",
  title: "Vote thành công! ✨",
  description: "Cảm ơn bạn đã tham gia bình chọn",
  meta: {
    triggerConfetti: true
  }
})

// Hoặc helper function
voteSuccessToast({ isUpdate: false })
```

**Components:**
- `hooks/use-toast.ts` - Logic & state management
- `components/ui/toast.tsx` - UI components (Radix UI)
- `components/ui/toaster.tsx` - Wrapper với confetti effect

**Đặc điểm:**
- ✅ UI custom theo brand GLOW UP 2025
- ✅ Confetti effect tự động với success toast
- ✅ Animation neon flicker & glow
- ✅ CheckCircle icon với animation
- ✅ Helper function `voteSuccessToast()` để control confetti
- ❌ Phức tạp hơn để setup

---

## 🎯 Mục Tiêu Migration

**Thay thế tất cả `toast` từ Sonner bằng Custom Toast để:**

1. ✅ **UI nhất quán** - Tất cả toast đều theo design system GLOW UP 2025
2. ✅ **Confetti effect** - Tự động trigger confetti khi cần
3. ✅ **Better UX** - Animation mượt mà, professional
4. ✅ **Maintainability** - Chỉ maintain 1 toast system
5. ✅ **Customization** - Dễ thêm variants mới (warning, info, etc.)

---

## 📖 Chi Tiết Custom Toast System

### 1. Architecture

```
┌─────────────────────┐
│  useToast() Hook    │  ← State management (reducer pattern)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Toast Components   │  ← UI từ Radix UI + Custom styling
│  (toast.tsx)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Toaster Wrapper    │  ← Render toasts + confetti trigger
│  (toaster.tsx)      │
└─────────────────────┘
```

### 2. Hook API - `useToast()`

**File:** `hooks/use-toast.ts`

```typescript
// Import
import { useToast, toast, voteSuccessToast } from "@/hooks/use-toast"

// Trong component
const { toast, dismiss, toasts } = useToast()

// Basic usage
toast({
  variant: "success" | "destructive" | "default",
  title: "Tiêu đề",
  description: "Mô tả",
  duration: 3000, // milliseconds
})

// Meta data để control confetti
toast({
  variant: "success",
  title: "Vote thành công! ✨",
  meta: {
    triggerConfetti: true,  // Bật confetti
    isVoteUpdate: false,     // Không phải update
  }
})

// Helper function cho vote success
voteSuccessToast({ isUpdate: false }) // Có confetti
voteSuccessToast({ isUpdate: true })  // Không có confetti
```

**State Management:**
```typescript
// Limit: chỉ hiện 1 toast tại 1 thời điểm
const TOAST_LIMIT = 1

// Auto dismiss sau 1,000,000ms (~ 16 phút)
const TOAST_REMOVE_DELAY = 1000000

// Hoặc custom duration khi gọi toast()
```

### 3. UI Components - `components/ui/toast.tsx`

**Variants:**

#### Success Toast (vote, confetti)
```typescript
toast({
  variant: "success",
  title: "Vote thành công! ✨",
  description: "Cảm ơn bạn đã tham gia bình chọn",
  meta: { triggerConfetti: true }
})
```

**Styling:**
- Border: `border-[#FFD369]` (neon gold)
- Background: Gradient `linear-gradient(135deg, #0A0A0A, #1B1B1B, #FFD36920)`
- Text: `#FFF7D1` (cream white)
- Shadow: `0 0 12px #FFD36980, 0 0 24px #FFD36940`
- Animation: `animate-neon-flicker` (250ms)

#### Destructive Toast (error)
```typescript
toast({
  variant: "destructive",
  title: "Lỗi!",
  description: "Có lỗi xảy ra",
})
```

**Styling:**
- Border: `border-destructive`
- Background: `bg-destructive`
- Text: `text-destructive-foreground`

#### Default Toast (info)
```typescript
toast({
  variant: "default",
  title: "Thông báo",
  description: "Thông tin",
})
```

### 4. Toaster Component - `components/ui/toaster.tsx`

**Confetti Logic:**
```typescript
useEffect(() => {
  toasts.forEach((toast) => {
    if (toast.variant === "success" && toast.meta?.triggerConfetti) {
      // Premium GLOW UP 2025 confetti - 4 bursts trong 1.2s

      // Burst 1: Center, tight spread (40°)
      fire(0.3, { spread: 40, startVelocity: 50 })

      // Burst 2: Wider (70°), 100ms delay
      setTimeout(() => fire(0.25, { spread: 70, startVelocity: 45 }), 100)

      // Burst 3: Widest (100°), 250ms delay
      setTimeout(() => fire(0.25, { spread: 100, decay: 0.92 }), 250)

      // Burst 4: Sparse gold shimmer (120°), 450ms delay
      setTimeout(() => fire(0.2, {
        spread: 120,
        colors: ['#FFD369', '#FFF7D1'] // Only gold
      }), 450)
    }
  })
}, [toasts])
```

**Animation:**
```tsx
<AnimatePresence mode="popLayout">
  {toasts.map(({ id, title, description, variant }) => (
    <Toast key={id} variant={variant}>
      {variant === "success" && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <CheckCircle2 className="h-6 w-6 text-[#FFD369]" />
        </motion.div>
      )}

      <div>
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
      </div>

      <ToastClose />
    </Toast>
  ))}
</AnimatePresence>
```

---

## 🔄 Migration Steps

### Step 1: Chuẩn Bị

**1. Kiểm tra `app/layout.tsx` đã có `<Toaster />` chưa:**

```tsx
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster /> {/* ✅ Phải có dòng này */}
      </body>
    </html>
  )
}
```

**2. Xóa Sonner Toaster (nếu có):**

```tsx
// ❌ Xóa dòng này nếu có
import { Toaster } from "sonner"
<Toaster position="top-center" richColors />
```

### Step 2: Migration Pattern

#### Pattern 1: Error Toast (đơn giản nhất)

**Trước (Sonner):**
```typescript
import { toast } from "sonner"

toast.error("Không thể tải dữ liệu sự kiện")
```

**Sau (Custom Toast):**
```typescript
import { toast } from "@/hooks/use-toast"

toast({
  variant: "destructive",
  title: "Lỗi",
  description: "Không thể tải dữ liệu sự kiện",
})
```

#### Pattern 2: Success Toast (không có confetti)

**Trước:**
```typescript
toast.success("Cập nhật cài đặt thành công!")
```

**Sau:**
```typescript
toast({
  variant: "success",
  title: "Thành công",
  description: "Cập nhật cài đặt thành công!",
  // Không set meta.triggerConfetti => không có confetti
})
```

#### Pattern 3: Vote Success Toast (có confetti)

**Trước:**
```typescript
toast.success('Vote mới vừa được ghi nhận!', {
  duration: 3000,
})
```

**Sau (Option 1 - Helper function):**
```typescript
import { voteSuccessToast } from "@/hooks/use-toast"

voteSuccessToast({ isUpdate: false }) // Có confetti
```

**Sau (Option 2 - Manual):**
```typescript
toast({
  variant: "success",
  title: "Vote mới vừa được ghi nhận! ✨",
  description: "Cảm ơn bạn đã tham gia bình chọn",
  duration: 3000,
  meta: {
    triggerConfetti: true,
    isVoteUpdate: false,
  }
})
```

#### Pattern 4: Auth Success (có confetti riêng)

**Trước:**
```typescript
// AuthModal.tsx
toast.success("Xác thực thành công!")
// + custom confetti code
```

**Sau:**
```typescript
// Giữ nguyên custom confetti ở AuthModal
// Vì nó có animation riêng (continuous 2s)
// Nhưng thay toast.success thành:

toast({
  variant: "success",
  title: "Xác thực thành công!",
  description: "Đang chuyển hướng...",
  // Không trigger confetti của toast vì đã có riêng
})
```

### Step 3: Update từng File

#### File 1: `app/event/[eventId]/vote/page.tsx`

**Thay đổi import:**
```typescript
// ❌ Xóa
import { toast } from "sonner"

// ✅ Thêm
import { toast } from "@/hooks/use-toast"

// ✅ Đã có sẵn
import { useToast, voteSuccessToast } from "@/hooks/use-toast"
```

**Thay đổi 7 chỗ:**

```typescript
// Line 285
toast.error("Không thể tải dữ liệu sự kiện")
// ↓
toast({
  variant: "destructive",
  title: "Lỗi",
  description: "Không thể tải dữ liệu sự kiện",
})

// Line 316
toast.error("Thời gian bình chọn đã kết thúc")
// ↓
toast({
  variant: "destructive",
  title: "Đã kết thúc",
  description: "Thời gian bình chọn đã kết thúc",
})

// Line 340
toast.error("Thời gian bình chọn đã kết thúc")
// ↓ (giống trên)

// Line 349
toast.error("Vui lòng chọn ít nhất một ứng viên")
// ↓
toast({
  variant: "destructive",
  title: "Chưa chọn ứng viên",
  description: "Vui lòng chọn ít nhất một ứng viên",
})

// Line 390 - ĐÃ ĐÚNG (dùng voteSuccessToast)
voteSuccessToast({ isUpdate })
// ✅ Giữ nguyên

// Line 396
toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
// ↓
toast({
  variant: "destructive",
  title: "Lỗi",
  description: error instanceof Error ? error.message : "Có lỗi xảy ra",
})

// Line 486
toast.error("Thời gian bình chọn đã kết thúc!")
// ↓
toast({
  variant: "destructive",
  title: "Hết giờ",
  description: "Thời gian bình chọn đã kết thúc!",
})
```

#### File 2: `app/event/[eventId]/results/page.tsx`

**Thay đổi import:**
```typescript
// ❌ Xóa
import { toast } from "sonner"

// ✅ Thêm
import { toast } from "@/hooks/use-toast"
```

**Thay đổi 1 chỗ:**
```typescript
// Line 45
toast.success('Vote mới vừa được ghi nhận!', {
  duration: 3000,
})
// ↓
toast({
  variant: "success",
  title: "Vote mới! ✨",
  description: "Vote mới vừa được ghi nhận!",
  duration: 3000,
  meta: {
    triggerConfetti: true, // Có confetti vì đây là vote mới
  }
})
```

#### File 3: `components/AuthModal.tsx`

**Thay đổi import:**
```typescript
// ❌ Xóa
import { toast } from "sonner"

// ✅ Thêm
import { toast } from "@/hooks/use-toast"
```

**Thay đổi 2 chỗ:**
```typescript
// Line 70
toast.success("Xác thực thành công!")
// ↓
toast({
  variant: "success",
  title: "Xác thực thành công!",
  description: "Đang chuyển hướng...",
  // Không trigger confetti vì đã có custom confetti riêng (line 44-68)
})

// Line 80
toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
// ↓
toast({
  variant: "destructive",
  title: "Lỗi xác thực",
  description: error instanceof Error ? error.message : "Có lỗi xảy ra",
})
```

#### File 4-8: Admin Pages

**Pattern giống nhau cho tất cả:**

```typescript
// Import
import { toast } from "@/hooks/use-toast"

// Error
toast.error("Message")
// ↓
toast({
  variant: "destructive",
  title: "Lỗi",
  description: "Message",
})

// Success
toast.success("Message")
// ↓
toast({
  variant: "success",
  title: "Thành công",
  description: "Message",
})
```

**Files cần update:**
- `app/admin/(authenticated)/dashboard/page.tsx` - 1 error
- `app/admin/(authenticated)/events/page.tsx` - 1 error
- `app/admin/(authenticated)/candidates/page.tsx` - 1 error
- `app/admin/(authenticated)/results/page.tsx` - 1 error
- `app/admin/(authenticated)/settings/page.tsx` - 5 (3 error, 1 success, 1 validation)

### Step 4: Thêm Variants Mới (Optional)

Nếu muốn thêm variants `info` và `warning`:

**1. Update `components/ui/toast.tsx`:**

```typescript
const toastVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
        success: "...",
        // ✅ Thêm mới
        warning: "border-[#F59E0B] bg-[#F59E0B]/10 text-[#FDB931]",
        info: "border-[#3B82F6] bg-[#3B82F6]/10 text-[#60A5FA]",
      },
    },
  }
)
```

**2. Update TypeScript types:**

```typescript
// hooks/use-toast.ts
type ToastProps = {
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  // ...
}
```

**3. Sử dụng:**

```typescript
// Warning
toast({
  variant: "warning",
  title: "Cảnh báo",
  description: "Thời gian còn lại không nhiều",
})

// Info
toast({
  variant: "info",
  title: "Thông tin",
  description: "Kết quả sẽ được công bố lúc 21:00",
})
```

---

## ✅ Testing Checklist

Sau khi migration, test các scenarios sau:

### Vote Page (`/event/[eventId]`)
- [ ] Vote thành công lần đầu → Toast success + confetti
- [ ] Vote thành công lần 2 (update) → Toast success, KHÔNG có confetti
- [ ] Vote khi hết giờ → Toast error
- [ ] Vote không chọn ai → Toast error
- [ ] Load page lỗi → Toast error

### Results Page (`/event/[eventId]/results`)
- [ ] Realtime vote mới → Toast success + confetti
- [ ] Toast chỉ hiện 1 lúc (TOAST_LIMIT = 1)

### Auth Modal
- [ ] Login thành công → Toast success (giữ confetti riêng)
- [ ] Login lỗi → Toast error

### Admin Pages
- [ ] Load lỗi → Toast error
- [ ] Save thành công → Toast success
- [ ] Validation lỗi → Toast error

### General
- [ ] Toast tự động dismiss sau duration
- [ ] Toast có thể close bằng button X
- [ ] Animation mượt (neon flicker, slide in/out)
- [ ] Confetti chỉ trigger khi `meta.triggerConfetti = true`
- [ ] Reduced motion: confetti ít hơn

---

## 🐛 Troubleshooting

### Issue 1: Toast không hiện

**Nguyên nhân:** Chưa có `<Toaster />` trong layout

**Giải pháp:**
```tsx
// app/layout.tsx
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster /> {/* ← Phải có */}
      </body>
    </html>
  )
}
```

### Issue 2: Confetti không chạy

**Nguyên nhân:** Quên set `meta.triggerConfetti`

**Giải pháp:**
```typescript
toast({
  variant: "success",
  title: "Success",
  meta: {
    triggerConfetti: true, // ← Phải có
  }
})
```

### Issue 3: TypeScript error

**Nguyên nhân:** Import sai

**Giải pháp:**
```typescript
// ❌ Sai
import { toast } from "sonner"

// ✅ Đúng
import { toast } from "@/hooks/use-toast"
```

### Issue 4: Toast bị duplicate

**Nguyên nhân:** Gọi toast 2 lần

**Giải pháp:** Check logic, đảm bảo chỉ gọi 1 lần
```typescript
// ❌ Sai
toast({ ... })
toast({ ... }) // Duplicate

// ✅ Đúng
toast({ ... })
```

### Issue 5: Confetti quá nhiều/ít

**Giải pháp:** Điều chỉnh config trong `toaster.tsx`:

```typescript
// Line 25-35 trong toaster.tsx
const count = 80 // ← Tăng/giảm số particle

// Hoặc điều chỉnh từng burst
fire(0.3, { ... }) // 30% of 80 = 24 particles
fire(0.25, { ... }) // 25% of 80 = 20 particles
```

---

## 📊 Summary

### Trước Migration
- ❌ 2 toast systems (Sonner + Custom)
- ❌ UI không nhất quán
- ❌ Confetti không control được

### Sau Migration
- ✅ 1 toast system (Custom only)
- ✅ UI nhất quán theo GLOW UP 2025 brand
- ✅ Confetti control chính xác (vote mới có, update không)
- ✅ Helper function `voteSuccessToast()` dễ dùng
- ✅ Animation professional

### Files Cần Update

**Total: 9 files**

| File | Số chỗ cần đổi | Priority |
|------|----------------|----------|
| `app/event/[eventId]/vote/page.tsx` | 6 | 🔥 High |
| `app/event/[eventId]/results/page.tsx` | 1 | 🔥 High |
| `components/AuthModal.tsx` | 2 | 🔥 High |
| `app/admin/dashboard/page.tsx` | 1 | Medium |
| `app/admin/events/page.tsx` | 1 | Medium |
| `app/admin/candidates/page.tsx` | 1 | Medium |
| `app/admin/results/page.tsx` | 1 | Medium |
| `app/admin/settings/page.tsx` | 5 | Medium |
| `components/AdminSidebar.tsx` | ? | Low |

### Estimated Time
- Migration: 30-45 phút
- Testing: 15-20 phút
- **Total: ~1 giờ**

---

## 🚀 Next Steps

1. ✅ Đọc tài liệu này
2. ⬜ Update `app/event/[eventId]/vote/page.tsx` (highest priority)
3. ⬜ Update `app/event/[eventId]/results/page.tsx`
4. ⬜ Update `components/AuthModal.tsx`
5. ⬜ Update các admin pages
6. ⬜ Test toàn bộ
7. ⬜ Remove Sonner khỏi `package.json`:
   ```bash
   npm uninstall sonner
   ```

---

**Document Version:** 1.0.0
**Created:** 2025-01-14
**Author:** BRIGHT4EVENT Engineering Team
