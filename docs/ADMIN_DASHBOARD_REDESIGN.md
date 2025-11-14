# Admin Dashboard Redesign - Bright4Event
**Event Tech Platform - Premium Control Center**

---

## 🎯 Overview

Hệ thống Admin Dashboard hoàn toàn mới được thiết kế theo tone **Dark + Neon + Gold** với phong cách **Event Tech – Premium – Professional**, tập trung vào trải nghiệm điều khiển sự kiện trực tiếp.

### 🎨 Design Philosophy
- **3 giây** nhìn hiểu toàn bộ trạng thái sự kiện
- **1 click** để mở bất kỳ màn hình LED nào
- **Realtime updates** - số nhảy, highlight khi thay đổi
- **Preview first** - mọi thứ đều preview được trước khi đưa lên sân khấu

---

## 📁 File Structure

```
components/admin/
├── AdminSidebarNew.tsx      ← Sidebar navigation với collapse
├── AdminHeader.tsx           ← Header với event selector & quick actions

app/admin/
├── dashboard-new/
│   └── page.tsx             ← Main dashboard page
├── checkin/
│   └── page.tsx             ← Check-in control
├── welcome-led/
│   └── page.tsx             ← Welcome LED display
├── waiting-screen/
│   └── page.tsx             ← Waiting screen
├── voting/
│   └── page.tsx             ← Voting control
├── result-led/
│   └── page.tsx             ← Result LED live
├── lucky-draw/
│   └── page.tsx             ← Lucky draw
└── mini-game/
    └── page.tsx             ← Mini game
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--gold-primary: #FFD700;      /* Main brand gold */
--gold-light: #FFC107;        /* Light gold accent */
--gold-dark: #B8860B;         /* Dark gold */

/* Neon Colors */
--purple-neon: #A855F7;       /* Purple accent */
--blue-neon: #3B82F6;         /* Blue accent */
--green-neon: #22C55E;        /* Success green */
--red-neon: #EF4444;          /* Error/Alert red */

/* Background */
--bg-primary: #0A0A0A;        /* Main dark BG */
--bg-secondary: #0F0F0F;      /* Secondary BG */
--bg-elevated: #1A1A1A;       /* Cards, elevated surfaces */

/* Borders & Overlays */
--border-subtle: rgba(255, 255, 255, 0.05);
--border-glow: rgba(255, 215, 0, 0.3);
--overlay-glow: rgba(255, 215, 0, 0.1);
```

### Typography

```css
/* Heading */
font-family: 'Montserrat', 'Space Grotesk', sans-serif;
font-weight: 700;

/* Body */
font-family: 'Inter', -apple-system, sans-serif;
font-weight: 400-600;

/* Monospace (numbers) */
font-variant-numeric: tabular-nums;
```

### Shadows & Glows

```css
/* Card Shadow */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

/* Glow Effects */
--glow-gold: 0 0 20px rgba(255, 215, 0, 0.4);
--glow-purple: 0 0 20px rgba(168, 85, 247, 0.4);
--glow-blue: 0 0 20px rgba(59, 130, 246, 0.4);

/* Animated Glow (keyframe) */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
}
```

---

## 🧩 Components

### 1. AdminSidebarNew

**Location:** `components/admin/AdminSidebarNew.tsx`

**Features:**
- ✅ Collapsible sidebar (280px ↔ 80px)
- ✅ 12 navigation items với icons neon glow
- ✅ Active state với gold gradient
- ✅ Hover sweep effect
- ✅ Background particle animation
- ✅ User profile footer

**Navigation Items:**
1. Dashboard (home) - Gold glow
2. Sự kiện
3. Khách mời
4. Check-in - Blue glow
5. Welcome LED - Purple glow
6. Waiting Screen
7. Voting - Gold glow
8. Result LED - Gold glow
9. Lucky Draw - Red glow
10. Mini Game - Purple glow
11. Analytics
12. Settings

**Animations:**
```typescript
// Hover effect
whileHover={{ x: 4 }}

// Active indicator
layoutId="activeIndicator" // Smooth transition between items

// Icon glow pulse
animate={{
  filter: ["drop-shadow(...)", "drop-shadow(...)", ...]
}}
transition={{ duration: 2, repeat: Infinity }}
```

**Toggle Button:**
- Position: Absolute right -3px, top 80px
- Style: Gold circle với Chevron icon
- Smooth width transition 300ms

---

### 2. AdminHeader

**Location:** `components/admin/AdminHeader.tsx`

**Features:**
- ✅ Event selector dropdown
- ✅ Live status badge với pulse animation
- ✅ Quick "Open Event Page" button
- ✅ Search bar
- ✅ Notifications với red dot
- ✅ Theme toggle (Sun/Moon)
- ✅ User profile dropdown

**Event Selector:**
- Shows: Event name, status (LIVE/UPCOMING/ENDED), stats
- Live badge pulse animation
- Dropdown với event list
- "Tạo sự kiện mới" button ở dưới

**Quick Actions:**
```tsx
<motion.a
  href={`/event/${eventId}`}
  target="_blank"
  className="bg-gradient-to-r from-[#FFD700] to-[#FFC107]"
  whileHover={{ scale: 1.02 }}
>
  <ExternalLink /> Open Event Page
</motion.a>
```

---

### 3. Dashboard Page

**Location:** `app/admin/dashboard-new/page.tsx`

#### Layout Structure:

```
┌─────────────────────────────────────────────┐
│  AdminHeader (sticky)                       │
├─────────┬───────────────────────────────────┤
│ Sidebar │  Main Content Area                │
│         │                                    │
│ (Nav)   │  ┌───────────────────────────┐   │
│         │  │ EVENT STATUS BANNER       │   │
│         │  │ - Title + Live Badge      │   │
│         │  │ - Countdown Timer         │   │
│         │  │ - Realtime Stats (4)      │   │
│         │  │ - Quick Action Buttons    │   │
│         │  └───────────────────────────┘   │
│         │                                    │
│         │  ┌───────────────────────────┐   │
│         │  │ QUICK ACTIONS GRID (3x3)  │   │
│         │  │ - Check-in Control        │   │
│         │  │ - Welcome LED             │   │
│         │  │ - Voting, Result, etc.    │   │
│         │  └───────────────────────────┘   │
│         │                                    │
│         │  ┌──────────────┬────────────┐   │
│         │  │ ANALYTICS    │ ACTIVITY   │   │
│         │  │ (6 cards)    │ TIMELINE   │   │
│         │  └──────────────┴────────────┘   │
└─────────┴───────────────────────────────────┘
```

---

## 📊 Dashboard Sections

### 🔶 (1) EVENT STATUS OVERVIEW BANNER

**Design:**
- Full-width gradient card: `purple-900/20 → #FFD700/10 → purple-900/20`
- Animated gradient overlay (10s loop)
- Glow pulse effect (3s loop)
- Border: `border-[#FFD700]/30`

**Content:**

**Left Side:**
```tsx
<Crown icon> GLOW UP 2025
Year End Party - Pacific Wide

[LIVE NOW] badge - Green pulse
```

**Right Side:**
```tsx
Countdown Timer (3 boxes):
┌────┐  ┌────┐  ┌────┐
│ 02 │: │ 34 │: │ 12 │
└────┘  └────┘  └────┘
 GIỜ     PHÚT    GIÂY
```

**Realtime Stats (Grid 4 columns):**
```tsx
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Tổng khách  │ Đã check-in │ Tổng vote   │ Người vote  │
│ 300         │ 234 (78%)   │ 1520        │ 198 (84%)   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Quick Action Buttons:**
```tsx
[Open Welcome LED] [Open Waiting Screen] [Open Voting Page]
[Open Result LED] [Open Lucky Draw] [Open Mini Game]
```

**Animations:**
- Stats cards: Pulse glow khi highlight (gold)
- Countdown: Tabular nums, smooth transition
- Buttons: Hover scale 1.02 + glow mạnh hơn

---

### 🔶 (2) SYSTEM QUICK ACTIONS

**Grid:** 3 columns x 3 rows = 9 cards

**Card Design:**
```tsx
<QuickActionCard>
  <Icon /> 12x12 (lớn, dễ nhìn)
  <Title /> 18px font-semibold
  <Stats /> 14px text-muted
</QuickActionCard>
```

**Colors:**
- Check-in: Blue gradient
- Welcome LED: Purple gradient
- Waiting Screen: Blue gradient
- Voting: Gold gradient ⭐
- Result LED: Gold gradient ⭐
- Lucky Draw: Red gradient
- Mini Game: Purple gradient
- Analytics: Green gradient
- Export Data: Gray gradient

**Animations:**
```typescript
// On hover
hover:scale-[1.02]

// Sweep effect
<motion.div
  initial={{ x: "-100%" }}
  whileHover={{ x: "100%" }}
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5"
/>
```

---

### 🔶 (3) ANALYTICS SNAPSHOT

**Grid:** 3 columns x 2 rows = 6 cards

**Cards:**
1. Tổng khách mời - 300 (Purple icon)
2. Đã check-in - 234, +5 (Blue icon)
3. Tỷ lệ check-in - 78%, +2.3% (Green icon)
4. Tổng vote - 1520, +7 (Gold icon) ⭐
5. Người đã vote - 198, +2 (Green icon)
6. Lượt quay số - 42, +2 (Red icon)

**Design:**
```tsx
<AnalyticsCard>
  <Header>
    <Icon color />
    <Change badge> +X
  </Header>
  <Value> 2XL font-bold
  <Label> XS text-muted
</AnalyticsCard>
```

**Animations:**
- Counter animate on load (số chạy từ 0 → value)
- Glow highlight khi data thay đổi
- Hover lift effect (y: -2)

---

### 🔶 (4) ACTIVITY TIMELINE

**Position:** Right column, scrollable

**Design:**
```tsx
<ActivityItem>
  <IconBox color /> Check-in/Vote/Gift
  <Content>
    <Action> Check-in / Vote / Trúng thưởng
    <User> Nguyễn Văn A
  </Content>
  <Time> 2 phút trước
</ActivityItem>
```

**Color Coding:**
- Check-in: Blue
- Vote: Gold
- Trúng thưởng: Red

**Animations:**
- New item: Slide-down + glow vàng 0.5s
- Auto-scroll to top when new
- Stagger effect (delay: index * 0.1)

---

## 🎬 Animation System

### Background Particles

```typescript
{[...Array(20)].map((_, i) => (
  <motion.div
    className="w-1 h-1 bg-[#FFD700]/20 rounded-full"
    animate={{
      y: [0, -30, 0],
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.5, 1],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 2,
    }}
  />
))}
```

### Glow Pulse (Live Badge, Stats)

```typescript
animate={{
  boxShadow: [
    "0 0 10px rgba(255, 215, 0, 0.3)",
    "0 0 20px rgba(255, 215, 0, 0.6)",
    "0 0 10px rgba(255, 215, 0, 0.3)",
  ],
}}
transition={{ duration: 2, repeat: Infinity }}
```

### Sweep Effect (Hover)

```typescript
<motion.div
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
  initial={{ x: "-100%" }}
  whileHover={{ x: "100%" }}
  transition={{ duration: 0.6 }}
/>
```

### Counter Animation

```typescript
// Use react-countup or custom
<CountUp
  start={0}
  end={value}
  duration={2}
  separator=","
  useEasing={true}
  easingFn={(t) => t * (2 - t)} // easeOutQuad
/>
```

### Stagger Children

```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    />
  ))}
</motion.div>
```

---

## 🎮 Interactive Elements

### Hover States

**Buttons:**
```css
.button-gold {
  transition: all 0.3s;
}
.button-gold:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}
```

**Cards:**
```css
.card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 215, 0, 0.4);
  background: rgba(255, 255, 255, 0.1);
}
```

### Click States

```typescript
whileTap={{ scale: 0.98 }}
```

### Focus States

```css
.input:focus {
  outline: none;
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}
```

---

## 🚀 Realtime Features

### Data Flow

```
Supabase Realtime
    ↓
useRealtimeStats hook
    ↓
State updates (3s interval)
    ↓
UI re-renders with animation
    ↓
Counter số chạy
Glow highlight
Activity log slide-in
```

### Implementation

```typescript
const useRealtimeStats = () => {
  const [stats, setStats] = useState({...})

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        checkedIn: prev.checkedIn + Math.floor(Math.random() * 3),
        totalVotes: prev.totalVotes + Math.floor(Math.random() * 5),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return stats
}
```

### Activity Log

```typescript
const [activities, setActivities] = useState([])

// Supabase subscription
supabase
  .channel('activity-log')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'activities'
  }, (payload) => {
    setActivities(prev => [payload.new, ...prev].slice(0, 10))
  })
  .subscribe()
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  .sidebar { display: none; } /* Hidden on mobile */
  .quick-actions { grid-template-columns: 1fr; }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .quick-actions { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1025px) {
  .quick-actions { grid-template-columns: repeat(3, 1fr); }
}
```

### Mobile Menu

```tsx
// Add hamburger menu for mobile
<button className="md:hidden">
  <Menu className="w-6 h-6" />
</button>

<Sheet>
  <SheetContent side="left">
    {/* Sidebar content */}
  </SheetContent>
</Sheet>
```

---

## 🎯 Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const AnalyticsChart = lazy(() => import('@/components/AnalyticsChart'))

<Suspense fallback={<Skeleton />}>
  <AnalyticsChart />
</Suspense>
```

### Memoization

```typescript
// Expensive calculations
const checkinRate = useMemo(
  () => ((stats.checkedIn / stats.totalGuests) * 100).toFixed(1),
  [stats.checkedIn, stats.totalGuests]
)

// Callbacks
const handleAction = useCallback(() => {
  // ...
}, [dependencies])
```

### Virtual Scrolling

```typescript
// For activity log with 100+ items
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={400}
  itemCount={activities.length}
  itemSize={60}
>
  {({ index, style }) => (
    <ActivityItem style={style} {...activities[index]} />
  )}
</FixedSizeList>
```

---

## 🔒 Security & Permissions

### Role-Based Access

```typescript
const userRole = useRole() // 'admin' | 'organizer' | 'staff'

{userRole === 'admin' && (
  <QuickActionCard title="Settings" ... />
)}
```

### API Protection

```typescript
// Verify admin token
const token = cookies().get('admin_token')
const { data: admin } = await supabase.auth.getUser(token)

if (!admin || !admin.isAdmin) {
  return redirect('/admin/login')
}
```

---

## 🎨 Next Steps

### Modules to Build

1. **Check-in Module** ✓ (Sidebar link created)
   - QR generator
   - Manual check-in
   - Check-in analytics
   - LED screen preview

2. **Welcome LED Module**
   - Template selector
   - Effect chooser (fade/glow/wave/slide)
   - Full-screen preview
   - "Open LED Now" button

3. **Voting Module** (Already exists, needs redesign)
   - Create categories
   - Add candidates
   - Enable/disable voting
   - Preview guest UI

4. **Result LED Module**
   - Display mode (list/chart/leaderboard)
   - Auto-switch toggle
   - Fullscreen button
   - Realtime preview

5. **Lucky Draw Module**
   - Prize setup
   - "Spin Now" button
   - Winner history
   - Jackpot animation

6. **Mini Game Module**
   - Quiz/Reaction/Poll games
   - Question setup
   - Live leaderboard
   - Preview

### Future Enhancements

- [ ] Multi-language support (EN/VI)
- [ ] Dark/Light theme toggle (currently dark only)
- [ ] Export to Excel/PDF with charts
- [ ] Email notifications
- [ ] Mobile app for organizers
- [ ] Voice commands integration
- [ ] AI-powered insights

---

## 📚 Resources

### Dependencies

```json
{
  "framer-motion": "^12.x",
  "lucide-react": "^0.344.x",
  "@radix-ui/react-dropdown-menu": "^2.x",
  "recharts": "^2.x", // For charts
  "react-countup": "^6.x", // For counter animations
  "react-window": "^1.x" // For virtual scrolling
}
```

### Design References

- **Color Inspiration:** Stage lighting, LED displays, Neon signage
- **Layout:** Modern SaaS dashboards (Linear, Vercel, Stripe)
- **Animation:** Apple Motion, Figma Smart Animate

---

**Document Version:** 1.0.0
**Last Updated:** 2025-01-14
**Status:** ✅ Core Dashboard Complete
**Next:** Build module-specific pages
