# 🗺️ Navigation Guide - GalaVote Platform

## Quick Start

### 🏠 Homepage (App Portal) - `/`
**What you'll see:**
- Welcome screen with GalaVote logo
- 3 main action cards:
  - 🎟️ **Tham gia sự kiện** (Join Event)
  - 🔐 **Đăng nhập** (Login)
  - 📊 **Xem kết quả** (View Results)

**What you can do:**
1. **Join an event** → Click "Tham gia sự kiện" → Enter event code → Start voting
2. **Login as organizer** → Click "Đăng nhập" → Go to admin dashboard
3. **View results** → Click "Xem kết quả" → See live voting results
4. **Learn more** → Click "Tìm hiểu thêm về GalaVote" → Go to marketing page

---

### 👋 Marketing Page - `/hello`
**What you'll see:**
- Full feature showcase
- Theme templates
- Customer testimonials
- Pricing information

**Sections (scroll to explore):**
1. Hero - Main value proposition
2. Statistics - 200+ events, 150K+ votes
3. Features - QR check-in, voting, lucky draw, analytics
4. Theme Showcase - 4 beautiful templates
5. Use Cases - Corporate, schools, agencies
6. Testimonials - Real customer stories
7. Final CTA - Book demo, contact

**CTAs on this page:**
- "Xem Demo Ngay" → Go to demo event
- "Xem Bảng Giá" → Go to pricing page
- "Đặt lịch Demo" → Go to pricing/contact
- "Liên hệ Tư vấn" → Contact form

---

## 🎯 User Journeys

### Journey 1: Event Attendee
```
Start at: /
↓
Click: "Tham gia sự kiện"
↓
Enter: Event code (e.g., "d112584a-4c6e-47fa-a4da-df1e3488d374")
↓
Arrive at: /event/[eventId]/vote
↓
Vote & participate!
```

### Journey 2: Event Organizer
```
Start at: /
↓
Click: "Đăng nhập"
↓
Arrive at: /admin/login
↓
Login with credentials
↓
Manage events at: /admin/dashboard
```

### Journey 3: Curious Visitor
```
Start at: /
↓
Click: "Tìm hiểu thêm về GalaVote"
↓
Arrive at: /hello
↓
Explore features
↓
Click: "Xem Demo Ngay"
↓
Try demo event
```

### Journey 4: Results Viewer
```
Start at: /
↓
Click: "Xem kết quả"
↓
Arrive at: /results
↓
View live voting results
```

---

## 📱 Mobile Navigation

### On Mobile Devices:
- All cards stack vertically
- Buttons become full-width
- Features are scrollable
- Header remains sticky
- Touch-friendly buttons (min 44px height)

### Gestures:
- **Swipe** - Scroll through sections
- **Tap** - Activate buttons and cards
- **Pinch** - Zoom on images (theme previews)

---

## 🎨 Visual Indicators

### Colors Mean:
- **Blue gradient** → Primary actions (Join Event)
- **Purple gradient** → Admin functions (Login)
- **Pink gradient** → Results viewing
- **Green icons** → Check-in features
- **Gold accent** → Premium/Lucky Draw features

### Animations Guide:
- **Fade up** → Section entering view
- **Scale on hover** → Interactive element
- **Glow effect** → Primary CTA
- **Slide in** → Card entrance
- **Pulse** → Active/loading state

---

## 🔗 All Pages

### Public Pages:
- `/` - App Portal (main entry)
- `/hello` - Marketing Landing Page
- `/results` - Public Results View
- `/vote` - Legacy voting page
- `/pricing` - Pricing information

### Event Pages:
- `/event/[eventId]/vote` - GalaVote page
- `/event/[eventId]/results` - Event results page

### Admin Pages:
- `/admin/login` - Admin login
- `/admin/dashboard` - Main dashboard
- `/admin/events` - Event management
- `/admin/candidates` - Candidate management
- `/admin/categories` - Category management
- `/admin/results` - Results management
- `/admin/settings` - System settings

---

## 💡 Pro Tips

### For Event Attendees:
1. Bookmark your event URL after joining
2. You can return to vote anytime during event period
3. Check results in real-time
4. Share event code with friends

### For Event Organizers:
1. Start at `/` → Login → Dashboard
2. Create event → Get event code
3. Share code with attendees
4. Monitor results live
5. Export data after event

### For First-Time Visitors:
1. Start at `/` to understand options
2. Visit `/hello` to learn about features
3. Try demo event to experience platform
4. Contact for custom events

---

## 🎯 Quick Actions

### I want to...

**Join an event**
→ Go to `/` → Click "Tham gia sự kiện" → Enter code

**Create an event**
→ Go to `/` → Click "Đăng nhập" → Dashboard → Create Event

**See results**
→ Go to `/` → Click "Xem kết quả"

**Learn about features**
→ Go to `/hello` or click "Tìm hiểu thêm" on `/`

**Try a demo**
→ Go to `/hello` → Click "Xem Demo Ngay"

**Contact sales**
→ Go to `/hello` → Scroll to bottom → Click "Liên hệ Tư vấn"

---

## 🔄 Navigation Flow Chart

```
┌─────────────────────────────────────────┐
│           Homepage (/)                  │
│      [App Portal Entry Point]           │
└─────────┬───────────────────────────────┘
          │
    ┌─────┼─────┬────────────────┐
    │     │     │                │
    ▼     ▼     ▼                ▼
┌───────┐ │  ┌──────┐      ┌──────────┐
│Join   │ │  │View  │      │Learn     │
│Event  │ │  │Results│     │More      │
└───┬───┘ │  └──┬───┘      └────┬─────┘
    │     │     │               │
    │  ┌──▼─────▼──┐            │
    │  │  Admin     │            │
    │  │  Login     │            ▼
    │  └──┬─────────┘      ┌──────────┐
    │     │                │Marketing │
    │     ▼                │Page      │
    │  ┌──────────┐        │(/hello)  │
    │  │Dashboard │        └──────────┘
    │  └──────────┘
    │
    ▼
┌──────────────┐
│ GalaVote │
│    Page      │
└──────────────┘
```

---

## 🎨 Design System Quick Reference

### Spacing:
- Small gap: 4px
- Medium gap: 8px
- Large gap: 16px
- Section padding: 80px (desktop), 40px (mobile)

### Border Radius:
- Small: 8px
- Medium: 12px
- Large: 16px
- Extra large: 24px
- Full: 9999px (pills)

### Shadows:
- Card: Light subtle shadow
- Card hover: Deeper shadow
- Button: Blue/purple glow
- Modal: Strong shadow

### Typography:
- Heading 1: 48-72px
- Heading 2: 36-48px
- Heading 3: 24-30px
- Body large: 18-20px
- Body: 16px
- Small: 14px

---

**Happy Navigating! 🚀**

For support: contact@code4change.tech
Website: quaysotrungthuong.vn
