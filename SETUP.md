# 🚀 HƯỚNG DẪN SETUP - EVENT VOTING SYSTEM

## 📋 Mục lục
1. [Cài đặt Dependencies](#1-cài-đặt-dependencies)
2. [Cấu hình Supabase](#2-cấu-hình-supabase)
3. [Chạy Database Migrations](#3-chạy-database-migrations)
4. [Chạy Seed Data](#4-chạy-seed-data)
5. [Khởi động Application](#5-khởi-động-application)
6. [Test Authentication & Voting](#6-test-authentication--voting)
7. [Truy cập Admin Panel](#7-truy-cập-admin-panel)

---

## 1. Cài đặt Dependencies

```bash
cd event-voting
npm install
```

---

## 2. Cấu hình Supabase

### 2.1. Lấy Service Role Key

1. Truy cập Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/settings/api
   ```

2. Copy **service_role** key (secret key - MÀU VÀNG)

3. Thêm vào `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-key-here
   ```

### 2.2. Kiểm tra .env.local

File `.env.local` hiện tại:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xicdommyxzsschupzvsx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=<CẦN THÊM VÀO>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin
ADMIN_PASSWORD=admin123
```

---

## 3. Chạy Database Migrations

### 3.1. Truy cập SQL Editor

1. Vào Supabase Dashboard
2. Chọn **SQL Editor** (biểu tượng database bên trái)
3. Click **New query**

### 3.2. Chạy Schema Script

1. Copy toàn bộ nội dung file `supabase-schema.sql`
2. Paste vào SQL Editor
3. Click **Run** (hoặc Ctrl/Cmd + Enter)

**Kết quả mong đợi:**
```
✓ Tables created: events, categories, candidates, voters, votes, otp_codes
✓ Indexes created
✓ Triggers created
✓ RLS policies enabled
✓ Functions created
```

### 3.3. Verify Tables

Chạy query sau để verify:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Kết quả phải có:
- ✅ candidates
- ✅ categories
- ✅ events
- ✅ otp_codes
- ✅ voters
- ✅ votes

---

## 4. Chạy Seed Data

### 4.1. Tạo Test Data

1. Vẫn trong SQL Editor
2. Copy toàn bộ nội dung file `supabase-seed.sql`
3. Paste và Run

**Test data được tạo:**
- 1 Event: "King & Queen of the Night 2025"
- 3 Categories:
  - 🤴 King of the Night (max 3 votes)
  - 👸 Queen of the Night (max 3 votes)
  - 👔 Best Dressed (max 2 votes)
- 16 Candidates (5+5+6)

### 4.2. Verify Data

```sql
-- Check event
SELECT name, is_active, voting_start_time, voting_end_time
FROM events;

-- Check categories
SELECT c.name as category, COUNT(ca.id) as candidates_count
FROM categories c
LEFT JOIN candidates ca ON ca.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.display_order;
```

---

## 5. Khởi động Application

```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

---

## 6. Test Authentication & Voting

### 6.1. Truy cập Voting Page

```
http://localhost:3000/vote
```

### 6.2. Test Authentication Flow

1. Click **"Đăng nhập ngay"**
2. Modal hiện ra với form email
3. Nhập email: `test@example.com`
4. Click **"Bắt đầu bình chọn"**
   - ✅ Nếu OTP disabled → Vào ngay trang voting
   - ⏳ Nếu OTP enabled → Nhập mã OTP (kiểm tra console log)

### 6.3. Test Voting

1. Sau khi đăng nhập, chọn ứng viên:
   - King of the Night: Chọn tối đa 3 người
   - Queen of the Night: Chọn tối đa 3 người
   - Best Dressed: Chọn tối đa 2 người

2. Click **"Xác nhận bình chọn"**

3. Thông báo thành công ✅

### 6.4. Kiểm tra Database

```sql
-- Check votes
SELECT
    v.email as voter,
    c.name as category,
    ca.name as candidate
FROM votes vo
JOIN voters v ON v.id = vo.voter_id
JOIN categories c ON c.id = vo.category_id
JOIN candidates ca ON ca.id = vo.candidate_id
ORDER BY v.email, c.display_order;
```

---

## 7. Truy cập Admin Panel

### 7.1. Login Admin

```
http://localhost:3000/admin/dashboard
```

Sẽ redirect đến login page nếu chưa đăng nhập.

### 7.2. Admin Credentials

```
Password: admin123
```

(Có thể thay đổi trong `.env.local`)

### 7.3. Admin Features

Sau khi login, bạn có quyền truy cập:

1. **Dashboard** (`/admin/dashboard`)
   - Tổng quan hệ thống
   - Stats cards
   - Hướng dẫn sử dụng

2. **Sự kiện** (`/admin/events`)
   - Quản lý events
   - Xem thông tin chi tiết
   - Active/Inactive status

3. **Danh mục** (`/admin/categories`)
   - Tạo categories mới
   - Chỉnh sửa max votes
   - Thứ tự hiển thị

4. **Ứng viên** (`/admin/candidates`)
   - Thêm candidates
   - Upload ảnh
   - Quản lý thông tin

5. **Kết quả** (`/admin/results`)
   - Xem kết quả realtime
   - Export data

6. **Cài đặt** (`/admin/settings`)
   - Cấu hình hệ thống
   - Database info

---

## 8. Troubleshooting

### Lỗi: "Failed to load categories"

**Nguyên nhân:** Database chưa có data

**Giải pháp:**
1. Chạy lại `supabase-seed.sql`
2. Verify trong SQL Editor:
   ```sql
   SELECT COUNT(*) FROM events WHERE is_active = true;
   ```

### Lỗi: "OTP sent successfully" nhưng không nhận được OTP

**Nguyên nhân:** Chưa setup email service

**Giải pháp (Development):**
- OTP được log trong server console
- Kiểm tra terminal chạy `npm run dev`
- Tìm dòng: `OTP for test@example.com: 123456`

### Lỗi: "Voter not found"

**Nguyên nhân:** Voter chưa được tạo

**Giải pháp:**
- Đăng nhập lại qua `/vote`
- Kiểm tra voters table:
  ```sql
  SELECT * FROM voters;
  ```

### Lỗi: Admin redirect loop

**Nguyên nhân:** Cookie issue

**Giải pháp:**
1. Clear cookies: DevTools → Application → Cookies
2. Đăng nhập lại

---

## 9. Next Steps

### 9.1. Production Setup

- [ ] Setup email service (SendGrid, Mailgun, etc.)
- [ ] Setup SMS service nếu dùng phone auth
- [ ] Cấu hình domain và HTTPS
- [ ] Update CORS và security headers
- [ ] Enable Supabase RLS strict mode

### 9.2. Feature Enhancements

- [ ] Upload candidate photos qua UI
- [ ] Realtime results với Supabase subscriptions
- [ ] Export results to CSV/PDF
- [ ] Email notifications cho voters
- [ ] Analytics dashboard

### 9.3. Testing

- [ ] Test authentication flow (email, phone, OTP)
- [ ] Test voting với multiple selections
- [ ] Test vote editing trước deadline
- [ ] Test admin permissions
- [ ] Load testing với nhiều voters

---

## 10. API Documentation

### Public APIs

```
GET  /api/events/[eventId]/auth-settings
GET  /api/events/[eventId]/categories
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/quick-login
GET  /api/votes/voter/[voterId]
POST /api/votes/submit
```

### Admin APIs

```
POST /api/admin/login
POST /api/admin/logout
```

---

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console logs (Browser + Server)
2. Verify database schema và data
3. Check environment variables
4. Review RLS policies trong Supabase

---

**🎉 SETUP COMPLETED!**

Ứng dụng của bạn đã sẵn sàng để sử dụng!

**URLs quan trọng:**
- 🏠 Homepage: http://localhost:3000
- 🗳️ Voting: http://localhost:3000/vote
- 📊 Results: http://localhost:3000/results
- 👨‍💼 Admin: http://localhost:3000/admin/dashboard
