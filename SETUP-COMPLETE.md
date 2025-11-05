# Setup Complete - Hướng dẫn sử dụng

## Tổng quan

Code admin đã được refactor hoàn chỉnh để kết nối với Supabase database. Tất cả thông tin kỹ thuật về Supabase đã được lưu trong `docs/supabase.md` và người dùng không cần quan tâm đến chi tiết này.

## Các thay đổi đã thực hiện

### 1. Kết nối Database
- ✅ Sử dụng thông tin Supabase từ `docs/supabase.md`
- ✅ Cấu hình `.env.local` với credentials
- ✅ Setup Supabase client (browser & server)

### 2. API Routes đã tạo
- ✅ `/api/admin/dashboard/stats` - Lấy thống kê tổng quan
- ✅ `/api/admin/events` - Lấy danh sách sự kiện
- ✅ `/api/admin/login` - Đăng nhập admin (đã có sẵn)

### 3. Admin Pages đã cập nhật
- ✅ Dashboard (`/admin/dashboard`) - Hiển thị thống kê thật từ database
- ✅ Events (`/admin/events`) - Hiển thị danh sách sự kiện từ database
- ✅ Login (`/admin/login`) - Fix navigation sau khi login

### 4. Database Schema & Seed Data
- ✅ Schema SQL đã sẵn sàng trong `supabase-schema.sql`
- ✅ Seed data đã sẵn sàng trong `supabase-seed.sql`

## Bước tiếp theo - CẦN LÀM

### Bước 1: Lấy Service Role Key từ Supabase

1. Truy cập: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/settings/api
2. Tìm phần "Project API keys"
3. Copy key **"service_role"** (màu vàng/cam - key bí mật)
4. Mở file `.env.local`
5. Thay đổi dòng:
   ```
   SUPABASE_SERVICE_ROLE_KEY=placeholder-service-key
   ```
   Thành:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI... (key bạn vừa copy)
   ```

### Bước 2: Chạy SQL Scripts trong Supabase

1. Truy cập: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/sql/new

2. **Tạo Schema (tables):**
   - Mở file `supabase-schema.sql`
   - Copy toàn bộ nội dung
   - Paste vào SQL Editor
   - Click "RUN"
   - Chờ cho đến khi thấy "Success!"

3. **Seed Data (dữ liệu demo):**
   - Mở file `supabase-seed.sql`
   - Copy toàn bộ nội dung
   - Paste vào SQL Editor
   - Click "RUN"
   - Chờ cho đến khi thấy "Success!"

### Bước 3: Kiểm tra Database

Chạy script để verify:
```bash
node scripts/setup-database.js
```

Nếu thành công, bạn sẽ thấy:
```
✅ Connection successful!
✅ Active event found: King & Queen of the Night 2025
```

### Bước 4: Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000 (hoặc 3001 nếu 3000 đang dùng)

### Bước 5: Test Admin Panel

1. Truy cập: http://localhost:3000/admin/login
2. Nhập mật khẩu: `admin123`
3. Sau khi đăng nhập, bạn sẽ được chuyển đến `/admin/dashboard`
4. Dashboard sẽ hiển thị:
   - ✅ Số lượng Events
   - ✅ Số lượng Categories
   - ✅ Số lượng Candidates
   - ✅ Số lượng Voters
   - ✅ Tổng số Votes

5. Truy cập `/admin/events` để xem danh sách sự kiện

## Dữ liệu Demo

Sau khi chạy seed data, bạn sẽ có:

- **1 Event:** "King & Queen of the Night 2025"
- **3 Categories:**
  - 🤴 King of the Night (max 3 votes)
  - 👸 Queen of the Night (max 3 votes)
  - 👔 Best Dressed (max 2 votes)
- **16 Candidates:** 5 Kings, 5 Queens, 6 Best Dressed
- **Auth Settings:** Email required, no phone, no OTP

## Cấu trúc Code

```
app/
├── admin/
│   ├── (authenticated)/          # Protected routes
│   │   ├── layout.tsx            # Layout với auth check
│   │   ├── dashboard/page.tsx    # Dashboard với stats
│   │   ├── events/page.tsx       # Quản lý events
│   │   ├── categories/page.tsx   # Quản lý categories
│   │   ├── candidates/page.tsx   # Quản lý candidates
│   │   ├── results/page.tsx      # Kết quả bình chọn
│   │   └── settings/page.tsx     # Cài đặt
│   └── login/page.tsx            # Login page
│
├── api/
│   ├── admin/
│   │   ├── login/route.ts        # Admin login API
│   │   ├── logout/route.ts       # Admin logout API
│   │   ├── dashboard/
│   │   │   └── stats/route.ts    # Dashboard stats
│   │   └── events/route.ts       # Events CRUD
│   └── ...
│
lib/
├── supabase/
│   ├── client.ts                 # Browser client
│   └── server.ts                 # Server client
└── auth.ts                       # Admin session management
```

## Troubleshooting

### Lỗi: "SUPABASE_SERVICE_ROLE_KEY is placeholder"
- Bạn chưa update service role key trong `.env.local`
- Làm theo Bước 1 ở trên

### Lỗi: "Tables not found" hoặc "42P01"
- Database chưa có tables
- Làm theo Bước 2 ở trên để chạy schema SQL

### Lỗi: "No active events found"
- Database chưa có data
- Làm theo Bước 2 ở trên để chạy seed SQL

### Dashboard hiển thị 0 cho tất cả stats
- Kiểm tra console trong browser (F12) để xem có lỗi API không
- Kiểm tra terminal để xem có lỗi server-side không
- Verify rằng seed data đã chạy thành công

## Các tính năng đã hoàn thành

- ✅ Kết nối Supabase database
- ✅ Admin authentication
- ✅ Dashboard với real-time stats
- ✅ Events management (view)
- ✅ Row Level Security (RLS) policies
- ✅ Helper functions trong database

## Các tính năng cần develop tiếp

- ⏳ Categories management (CRUD)
- ⏳ Candidates management (CRUD)
- ⏳ Results page với charts
- ⏳ Settings page
- ⏳ File upload cho candidate photos
- ⏳ Real-time voting updates

## Thông tin Admin

- **URL:** http://localhost:3000/admin/login
- **Password:** `admin123` (có thể thay đổi trong `.env.local`)
- **Session:** 7 days

## Security Notes

- Service Role Key có quyền admin, không được commit vào git
- Admin password được lưu trong `.env.local`
- Cookie session được bảo vệ bằng httpOnly
- RLS policies đã được enable trên tất cả tables

## Liên hệ

Nếu có vấn đề, kiểm tra:
1. File `.env.local` có đúng credentials không
2. Supabase project có active không
3. SQL scripts đã chạy thành công chưa
4. Console logs trong browser và terminal
