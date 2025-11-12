# 404 Page - Trang Không Tìm Thấy

## 🎨 Design Overview

Trang 404 của Bright4Event được thiết kế với phong cách sang trọng, sự kiện cao cấp với các hiệu ứng animation mượt mà.

### Màu sắc chính:
- **Background**: Gradient từ `#0A0A0A` đến `#1A1A1A` (đen sâu)
- **Accent**: Gold `#FFD700` và `#FDB931`
- **Text**: White `#FFFFFF` và Gray `#BDBDBD`

### Typography:
- Số 404: 8xl-9xl, bold, gradient gold
- Headline: 3xl-4xl, bold, white with shadow
- Subtext: lg-xl, light gray

---

## ✨ Animation Features

### 1. **Floating Confetti**
- 20 particles vàng rơi từ trên xuống
- Random position, delay, và duration
- Opacity fade in/out
- Rotate 360° khi rơi

### 2. **Pulsing Icon (Sparkles)**
- Icon Sparkles trong vòng tròn gradient gold
- Pulse effect (scale 1 → 1.05 → 1)
- Glow effect với blur và opacity
- Rotate animation nhẹ (-10° → 10°)
- 6 sparkles nhỏ bay xung quanh

### 3. **Moving Spotlight**
- Background spotlight di chuyển chậm
- Kích thước 600x600px với blur 100px
- Loop vô hạn theo hình chéo
- Duration: 20 seconds

### 4. **Rotating Watermark**
- Crown icon lớn ở background
- Opacity 5% (rất nhạt)
- Rotate 360° trong 60 giây
- Không cản trở tương tác (pointer-events-none)

### 5. **Gradient Text Animation**
- Số 404 có gradient di chuyển
- Background size 200% auto
- Animation 3 giây, loop vô hạn

### 6. **Staggered Entry Animation**
- Icon: fade + scale (0.5s)
- 404 Number: fade + move up (0.6s, delay 0.2s)
- Headline: fade + move up (0.6s, delay 0.4s)
- Subtext: fade + move up (0.6s, delay 0.6s)
- Buttons: fade + move up (0.6s, delay 0.8s)
- Help text: fade (0.6s, delay 1s)

### 7. **Button Hover Effects**
- Scale: 1.05 on hover
- Glow effect with pulsing shadow
- Background overlay với opacity
- Smooth transition 0.3s

---

## 🧩 Component Structure

```
<NotFound>
  ├── Animated Background Gradient
  ├── Spotlight Effect (moving blur)
  ├── Floating Confetti (20 particles)
  ├── Rotating Watermark (Crown)
  └── Main Content
      ├── Icon (Sparkles with pulse + floating particles)
      ├── 404 Number (gradient text)
      ├── Headline ("Không tìm thấy trang")
      ├── Subtext ("Có vẻ như bạn đã lạc vào...")
      ├── Action Buttons
      │   ├── Primary: "Về trang chủ" → /
      │   └── Secondary: "Tạo sự kiện mới" → /?request=create-event
      └── Help Text
```

---

## 🔗 Navigation Links

### Primary Button: "Về trang chủ"
- **Route**: `/`
- **Style**: Gold gradient background
- **Icon**: Home
- **Purpose**: Đưa user về trang chủ

### Secondary Button: "Tạo sự kiện mới"
- **Route**: `/?request=create-event`
- **Style**: White/10 backdrop with gold border
- **Icon**: Plus
- **Purpose**: Mở login modal với intent tạo event

---

## 📱 Responsive Design

### Desktop (md breakpoint and above):
- Icon: 20x20 (80px)
- 404 Number: text-9xl
- Headline: text-4xl
- Subtext: text-xl
- Buttons: Side by side (flex-row)
- Spotlight: Full effect

### Mobile (below md):
- Icon: 16x16 (64px)
- 404 Number: text-8xl
- Headline: text-3xl
- Subtext: text-lg
- Buttons: Stacked (flex-col), full width
- Reduced glow intensity

---

## 🎭 Text Content

### Vietnamese:
- **Headline**: "Không tìm thấy trang"
- **Subtext**: "Có vẻ như bạn đã lạc vào một sự kiện chưa được tổ chức 🎭"
- **Primary CTA**: "Về trang chủ"
- **Secondary CTA**: "Tạo sự kiện mới"
- **Help Text**: "Hoặc quay lại trang trước đó"

### Tone:
- Friendly và playful
- Event-themed (sự kiện, gala)
- Professional nhưng không quá formal

---

## 🚀 Usage

### Tự động hiển thị:
Next.js tự động sử dụng `app/not-found.tsx` khi:
- URL không tồn tại
- File route không được tìm thấy
- Component gọi `notFound()` function

### Manual trigger:
```typescript
import { notFound } from 'next/navigation'

// Trong component
if (!data) {
  notFound() // Sẽ render not-found.tsx
}
```

---

## 🛠️ Customization

### Thay đổi màu sắc:
```typescript
// Background gradient
from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A]

// Gold accent
from-[#FFD700] to-[#FDB931]

// Text colors
text-white, text-[#BDBDBD], text-[#888]
```

### Thay đổi animation timing:
```typescript
// Confetti speed
duration: item.duration, // 3-5 seconds

// Spotlight movement
duration: 20, // seconds

// Button hover
transition={{ duration: 0.3 }}
```

### Thay đổi icon:
```typescript
// Hiện tại: Sparkles
<Sparkles className="w-20 h-20 text-black" />

// Có thể thay bằng:
// - Trophy (🏆)
// - Crown (👑)
// - Ticket (🎟️)
// - Star (⭐)
```

---

## 🎬 Animation Libraries

### Framer Motion:
- `motion.div` - Animated containers
- `animate` - Animation properties
- `transition` - Timing & easing
- `initial` - Starting state
- `whileHover` / `whileTap` - Interactive states

### Lucide React:
- `Crown` - Watermark icon
- `Home` - Primary button icon
- `Plus` - Secondary button icon
- `Sparkles` - Main center icon

---

## 🐛 Troubleshooting

### Issue: Animation không chạy
**Fix**: Đảm bảo component có `"use client"` directive

### Issue: Confetti không hiện
**Fix**: Kiểm tra `overflow-hidden` trên parent container

### Issue: Buttons không hoạt động
**Fix**: Đảm bảo Link component được import đúng từ `next/link`

### Issue: Gradient không smooth
**Fix**: Thêm `background-size: 200%` và animation keyframes

---

## 📊 Performance

### Optimization:
- ✅ Client-side rendering với `"use client"`
- ✅ CSS animations (không dùng JS cho smooth transitions)
- ✅ Framer Motion với hardware acceleration
- ✅ Lazy-loaded confetti generation
- ✅ Reduced motion support (có thể thêm)

### Bundle size:
- Framer Motion: ~40KB gzipped
- Lucide Icons: ~2KB per icon
- Total: ~45-50KB additional

---

## 🎨 Design Credits

- **Inspiration**: Premium event platforms, award show websites
- **Color palette**: Bright4Event brand colors
- **Animation style**: Modern, smooth, luxurious
- **UX**: Clear CTAs, friendly error messaging

---

## 📝 Future Enhancements

Có thể thêm:
1. **Sound effects** - Subtle whoosh/ding khi load
2. **Particle trails** - Theo con trỏ chuột
3. **Easter egg** - Hidden interactive element
4. **Search box** - "Tìm kiếm trang..."
5. **Recent pages** - Danh sách trang gần đây
6. **Dark/Light mode** - Toggle theme
7. **Reduced motion** - Respect prefers-reduced-motion

---

## ✅ Testing Checklist

- [ ] Visit `/non-existent-page` → Hiện trang 404
- [ ] Click "Về trang chủ" → Redirect về `/`
- [ ] Click "Tạo sự kiện mới" → Mở login modal
- [ ] Check responsive trên mobile
- [ ] Verify animations chạy mượt
- [ ] Test hover effects trên buttons
- [ ] Check accessibility (keyboard navigation)
- [ ] Verify text readable trên tất cả backgrounds

---

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)
- ⚠️ IE11 (không hỗ trợ - animations fallback)

---

## 📖 Related Documentation

- [Next.js Not Found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
