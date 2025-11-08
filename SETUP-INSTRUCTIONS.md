# 🚀 Database Setup - Auto User Registration

## Cách Sử Dụng

### Bước 1: Chạy Setup Script

1. Mở **Supabase SQL Editor**:
   ```
   https://app.supabase.com/project/xicdommyxzsschupzvsx/sql/new
   ```

2. Copy toàn bộ file **`COMPLETE-SETUP.sql`**

3. Paste vào SQL Editor và click **RUN**

4. Đợi ~10-15 giây để script chạy xong

### Bước 2: Verify Setup

Bạn sẽ thấy output như này:

```
✅ Cleaned up all old objects
✅ Created all tables
✅ Inserted packages: Basic, Pro, Enterprise
✅ Created generate_event_code()
✅ Created handle_new_user()
✅ Created handle_new_user_subscription()
✅ Created handle_new_user_first_event()
✅ Created 3 triggers
✅ Set up RLS policies
✅ Created results view

Tables created: 8 / 8
Functions created: 4 / 4
Triggers created: 3 / 3
Basic package: ✅
Event code test: ✅ (sample: ER123456)

✅ ✅ ✅  SETUP COMPLETE!  ✅ ✅ ✅
```

### Bước 3: Test Registration

```bash
npx tsx test-register-frontend.ts
```

Kết quả mong đợi:

```
✅ ✅ ✅  ALL TESTS PASSED!  ✅ ✅ ✅

User registration is working correctly:
  ✅ Auth user created
  ✅ User profile created in public.users
  ✅ Basic subscription created (30 days trial)
  ✅ First event created with auto-generated code
```

---

## Cách Hoạt Động

Khi user register từ frontend:

```typescript
await supabase.auth.signUp({
  email: "user@example.com",
  password: "password123",
  options: {
    data: { full_name: "John Doe" }
  }
});
```

### Tự động tạo:

1. **User Profile** → `public.users` table
   - Email, full_name, role = 'user'

2. **Basic Subscription** → `public.subscriptions` table
   - 30 ngày trial
   - Giới hạn 1 event
   - Miễn phí (amount_paid = 0)

3. **First Event** → `public.events` table
   - Name: "My First Event"
   - Code: ER123456 (random)
   - Settings mặc định (theme, colors, features)
   - Thời gian: Bắt đầu sau 1 ngày, kết thúc sau 8 ngày

User sẵn sàng sử dụng ngay! 🎉

---

## Database Structure

### Tables Created:
- `users` - User profiles
- `packages` - Subscription plans (Basic, Pro, Enterprise)
- `subscriptions` - User subscriptions
- `events` - Voting events
- `categories` - Award categories
- `candidates` - Candidates in each category
- `voters` - Registered voters
- `votes` - Individual votes

### Functions Created:
- `generate_event_code()` - Generate unique event code
- `handle_new_user()` - Create user profile
- `handle_new_user_subscription()` - Create subscription
- `handle_new_user_first_event()` - Create first event

### Triggers:
- `on_auth_user_created` - Fires after INSERT on auth.users
- `on_auth_user_created_subscription` - Fires after INSERT on auth.users
- `on_auth_user_created_first_event` - Fires after INSERT on auth.users

---

## Troubleshooting

### Nếu test registration fail:

1. **Check Postgres Logs**:
   ```
   https://app.supabase.com/project/xicdommyxzsschupzvsx/logs/postgres-logs
   ```

2. **Chạy lại setup script** (COMPLETE-SETUP.sql)
   - Script sẽ tự động xóa hết và tạo lại từ đầu

3. **Kiểm tra Basic package có tồn tại**:
   ```sql
   SELECT * FROM packages WHERE slug = 'basic';
   ```

---

## Files

- **COMPLETE-SETUP.sql** - Script chính, chạy file này để setup toàn bộ
- **test-register-frontend.ts** - Test script (giống frontend)
- **quick-check-db.ts** - Check database status
- **SETUP-INSTRUCTIONS.md** - File này (hướng dẫn)

---

## Next Steps

Sau khi setup thành công:

1. ✅ Test registration từ frontend
2. ✅ User có thể login
3. ✅ User thấy event đầu tiên trong dashboard
4. ✅ User có thể edit event, add categories, candidates
5. ✅ Bắt đầu xây dựng voting flow

---

**Thời gian setup:** ~2 phút

**Tất cả trong 1 file duy nhất!** ✨
