# ⚡ QUICK START - 5 PHÚT SETUP

## Bước 1: Lấy Service Role Key (1 phút)

1. Mở link này:
   ```
   https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/settings/api
   ```

2. Scroll xuống phần **Project API keys**

3. Copy key **"service_role"** (dòng màu vàng, bắt đầu bằng `eyJhbGc...`)

4. Mở file `.env.local` và thay thế:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (paste key vừa copy)
   ```

5. Save file

---

## Bước 2: Tạo Database Tables (2 phút)

1. Mở link này:
   ```
   https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/sql/new
   ```

2. Copy TOÀN BỘ nội dung file `supabase-schema.sql`

3. Paste vào SQL Editor

4. Click **RUN** (hoặc Ctrl/Cmd + Enter)

5. Đợi ~10 giây, bạn sẽ thấy:
   ```
   Success. No rows returned
   ```

---

## Bước 3: Tạo Demo Data (1 phút)

1. Vẫn trong SQL Editor

2. Click **New query** (góc trên bên trái)

3. Copy TOÀN BỘ nội dung file `supabase-seed.sql`

4. Paste và click **RUN**

5. Bạn sẽ thấy output:
   ```
   ┌─────────────┬───────┐
   │ table_name  │ count │
   ├─────────────┼───────┤
   │ Events:     │   1   │
   │ Categories: │   3   │
   │ Candidates: │  16   │
   └─────────────┴───────┘
   ```

---

## Bước 4: Khởi động App (30 giây)

```bash
npm run dev
```

Truy cập: **http://localhost:3000**

---

## Bước 5: Test Voting (30 giây)

1. Vào trang Vote: http://localhost:3000/vote

2. Click "Đăng nhập ngay"

3. Nhập email: `demo@example.com`

4. Click "Bắt đầu bình chọn"

5. Chọn ứng viên và submit!

---

## 🎯 Demo Accounts

### Voter (Người vote)
- Email: `demo@example.com`
- Không cần password (quick login)

### Admin (Quản trị)
- URL: http://localhost:3000/admin/dashboard
- Password: `admin123`

---

## 📊 Demo Data

### Event
- **Tên**: King & Queen of the Night 2025
- **Trạng thái**: Active
- **Thời gian**: 7 ngày

### Categories
1. 🤴 **King of the Night** - Chọn tối đa 3 ứng viên
   - Nguyễn Văn A
   - Trần Minh B
   - Lê Hoàng C
   - Phạm Đức D
   - Hoàng Tuấn E

2. 👸 **Queen of the Night** - Chọn tối đa 3 ứng viên
   - Nguyễn Thị X
   - Trần Thu Y
   - Lê Hương Z
   - Phạm Mai K
   - Hoàng Linh L

3. 👔 **Best Dressed** - Chọn tối đa 2 ứng viên
   - 6 ứng viên

---

## ✅ Checklist

- [ ] Lấy service_role_key
- [ ] Cập nhật .env.local
- [ ] Chạy supabase-schema.sql
- [ ] Chạy supabase-seed.sql
- [ ] npm run dev
- [ ] Test voting
- [ ] Test admin login

---

## 🐛 Troubleshooting

### "relation events does not exist"
→ Bạn chưa chạy `supabase-schema.sql`

### "No active event found"
→ Bạn chưa chạy `supabase-seed.sql`

### "Failed to connect"
→ Kiểm tra service_role_key trong `.env.local`

### Admin redirect loop
→ Clear cookies và đăng nhập lại

---

## 🚀 Ready!

Sau khi hoàn thành 5 bước trên, bạn có thể:

✅ Vote tại: http://localhost:3000/vote
✅ Xem kết quả: http://localhost:3000/results
✅ Quản trị: http://localhost:3000/admin/dashboard

---

**Thời gian setup tổng: ~5 phút** ⏱️
