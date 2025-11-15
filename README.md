# 🗳️ Bright4Event

Hệ thống bình chọn sự kiện hiện đại, minh bạch và dễ sử dụng - được xây dựng với Next.js 14 và Supabase.

![Demo](https://img.shields.io/badge/Status-Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## ✨ Tính năng

### 🎯 Cho Người vote
- ✅ **Modal-based Authentication** - Không cần chuyển trang
- ✅ **Đăng nhập linh hoạt** - Email/Phone/OTP tùy cấu hình
- ✅ **Multiple Selection** - Chọn nhiều ứng viên mỗi danh mục
- ✅ **Realtime Updates** - Xem kết quả trực tiếp
- ✅ **Mobile Responsive** - Hoạt động mượt trên mọi thiết bị

### 👨‍💼 Cho Admin
- ✅ **Dashboard tổng quan** - Thống kê realtime
- ✅ **Quản lý Events** - Tạo và cấu hình sự kiện
- ✅ **Quản lý Categories** - Danh hiệu bình chọn
- ✅ **Quản lý Candidates** - Thêm ứng viên với ảnh
- ✅ **Xem kết quả** - Analytics chi tiết
- ✅ **Password Protection** - Bảo mật admin panel

### 🔐 Bảo mật
- ✅ **Row Level Security (RLS)** - Supabase policies
- ✅ **Session Management** - Secure HTTP-only cookies
- ✅ **Input Validation** - Client & Server side
- ✅ **Environment Variables** - Sensitive data protection

---

## 🚀 Quick Start

### Cài đặt nhanh (5 phút)

```bash
# 1. Clone & Install
git clone <repo-url>
cd event-voting
npm install

# 2. Setup Supabase
# - Mở QUICKSTART.md
# - Follow 5 bước đơn giản

# 3. Start
npm run dev
```

**👉 Đọc chi tiết:** [QUICKSTART.md](./QUICKSTART.md)

---

## 📚 Documentation

| File | Mô tả |
|------|-------|
| [QUICKSTART.md](./QUICKSTART.md) | Hướng dẫn setup 5 phút |
| [SETUP.md](./SETUP.md) | Hướng dẫn chi tiết đầy đủ |
| [docs/database-schema.md](./docs/database-schema.md) | Database structure |
| [docs/pages-specification.md](./docs/pages-specification.md) | Pages specs |
| [docs/authentication-flow.md](./docs/authentication-flow.md) | Auth flow |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Deployment**: Vercel (recommended)

---

## 📂 Project Structure

```
event-voting/
├── app/                                    # Next.js App Router
│   ├── page.tsx                            # Landing page
│   ├── about/page.tsx                      # About page
│   ├── auth/verify/page.tsx                # OTP verification
│   ├── blog/page.tsx                       # Blog listing
│   ├── blog/[slug]/page.tsx                # Blog post detail
│   ├── case-studies/page.tsx               # Case studies
│   ├── contact/page.tsx                    # Contact page
│   ├── dashboard/subscription/page.tsx     # Subscription dashboard
│   ├── faq/page.tsx                        # FAQ page
│   ├── guide/page.tsx                      # Guide page
│   ├── hello/page.tsx                      # Demo page
│   ├── pricing/page.tsx                    # Pricing page
│   │
│   ├── event/[eventId]/                    # Event pages
│   │   ├── page.tsx                        # Event detail
│   │   ├── check-in/page.tsx               # Guest check-in
│   │   ├── check-in-form/page.tsx          # Check-in form
│   │   ├── live/page.tsx                   # Live results
│   │   ├── minigame/page.tsx               # Mini game
│   │   ├── results/page.tsx                # Results view
│   │   ├── vote/page.tsx                   # Voting interface
│   │   ├── waiting/page.tsx                # Waiting screen
│   │   └── welcome/page.tsx                # Welcome screen
│   │
│   ├── admin/(authenticated)/              # Admin panel (protected)
│   │   ├── analytics/page.tsx              # Analytics
│   │   ├── candidates/page.tsx             # Candidates management
│   │   ├── categories/page.tsx             # Categories management
│   │   ├── check-in/page.tsx               # Check-in management
│   │   ├── dashboard/page.tsx              # Dashboard
│   │   ├── events/page.tsx                 # Events management
│   │   ├── guests/page.tsx                 # Guests management
│   │   ├── invoices-list/page.tsx          # Invoices list
│   │   ├── mini-game/page.tsx              # Mini game management
│   │   ├── packages/page.tsx               # Packages management
│   │   ├── result-led/page.tsx             # Result LED display
│   │   ├── results/page.tsx                # Results management
│   │   ├── settings/page.tsx               # Settings
│   │   ├── subscriptions-list/page.tsx     # Subscriptions list
│   │   ├── voting/page.tsx                 # Voting management
│   │   ├── waiting-screen/page.tsx         # Waiting screen management
│   │   └── welcome-led/page.tsx            # Welcome LED display
│   │
│   └── api/                                # API routes
│       ├── auth/                           # Authentication
│       ├── admin/                          # Admin endpoints
│       ├── events/                         # Events management
│       ├── votes/                          # Voting endpoints
│       ├── stats/                          # Statistics
│       ├── packages/                       # Packages endpoints
│       ├── subscriptions/                  # Subscriptions endpoints
│       ├── invoices/                       # Invoices endpoints
│       └── transactions/                   # Transactions endpoints
│
├── components/                             # React components
├── lib/                                    # Utilities
├── types/                                  # TypeScript types
├── docs/                                   # Documentation
├── scripts/                                # Helper scripts
├── supabase-schema.sql                     # Database schema
├── supabase-seed.sql                       # Demo data
└── .env.local                              # Environment vars
```

---

## 🔧 Configuration

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin
ADMIN_PASSWORD=your-secure-password
```

### Event Settings

Configure trong Supabase `events` table:

```typescript
{
  auth_settings: {
    require_email: true,    // Yêu cầu email
    require_phone: false,   // Yêu cầu phone
    require_otp: false      // Yêu cầu OTP
  }
}
```

### Category Settings

Mỗi category có thể cấu hình:
- `max_votes_per_voter`: Số ứng viên tối đa mỗi người có thể chọn
- `display_order`: Thứ tự hiển thị

---

## 📱 Features Demo

### 1. Voting Flow

```
User visits /vote
  ↓
Clicks "Đăng nhập ngay"
  ↓
AuthModal appears
  ↓
Enters email (or email + phone)
  ↓
If OTP required:
  - Receives OTP code
  - Enters 6-digit OTP
  ↓
Categories load with candidates
  ↓
Selects up to N candidates per category
  ↓
Submits votes
  ↓
Success! Can edit before deadline
```

### 2. Admin Flow

```
Admin visits /admin/dashboard
  ↓
Redirected to /admin/login
  ↓
Enters password
  ↓
Access granted
  ↓
Manage events, categories, candidates
  ↓
View realtime results
```

---

## 🎨 Screenshots

### Landing Page
- Hero section với gradient text
- Stats cards với animations
- Features showcase
- CTA buttons

### Voting Page
- Clean card-based layout
- Checkbox selection với max limit
- Progress indicators
- Mobile optimized

### Admin Dashboard
- Stats overview
- Recent activity
- Quick actions
- Sidebar navigation

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub

# 2. Import to Vercel
# vercel.com/import

# 3. Add Environment Variables
# Copy from .env

# 4. Deploy!
```

### Environment Variables for Production
- Update `NEXT_PUBLIC_APP_URL` to production URL
- Use strong `ADMIN_PASSWORD`
- Enable Supabase production mode
- Setup email/SMS services for OTP

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Quick login (email only)
- [ ] OTP login flow
- [ ] Multiple vote selection
- [ ] Vote limit enforcement
- [ ] Vote editing
- [ ] Admin login
- [ ] Admin dashboard access
- [ ] Mobile responsive
- [ ] Database persistence

### Load Testing

```bash
# TODO: Add load testing scripts
```

---

## 🐛 Troubleshooting

### Common Issues

**"Failed to load categories"**
- Kiểm tra database đã chạy seed data chưa
- Verify event `is_active = true`

**"OTP not received"**
- Check server console logs
- OTP logged trong development mode

**Admin redirect loop**
- Clear browser cookies
- Đăng nhập lại

**Database connection error**
- Verify `.env.local` có đầy đủ keys
- Check Supabase project status

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📄 License

MIT License - feel free to use for your events!

---

## 👨‍💻 Development

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Database Migrations

```bash
# Manual via Supabase Dashboard
# Copy SQL from supabase-schema.sql
# Run in SQL Editor
```

---

## 📞 Support

- 📧 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Docs: Read [SETUP.md](./SETUP.md)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

---

## 🎉 Demo

**Live Demo**: Coming soon...

**Test Credentials**:
- Voter Email: `demo@example.com`
- Admin Password: `admin123`

---

## 📈 Roadmap

- [ ] Image upload cho candidates
- [ ] Email notifications
- [ ] SMS OTP integration
- [ ] Export results to PDF/CSV
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced analytics
- [ ] Vote history tracking

---

## ⭐ Star History

If you find this project useful, please give it a star! ⭐

---

**Built with ❤️ using Next.js & Supabase**
