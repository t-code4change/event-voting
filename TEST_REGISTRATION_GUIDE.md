# 🧪 Hướng Dẫn Test Registration

## ✅ Fix Đã Hoàn Thành

Tất cả database triggers và policies đã được fix:
- ✅ RLS policies cho phép trigger insert
- ✅ `handle_new_user_subscription()` - Fixed (removed currency column)
- ✅ `auto_set_user_code()` - Fixed (lowercase column name)
- ✅ Tất cả 3 triggers hoạt động đúng

**Test trong database PASS 100%! ✅**

---

## 🧪 Test Registration Qua Web

### **Cách 1: Test Trực Tiếp Trên Website** (Recommended)

1. Mở trình duyệt (Chrome/Firefox)
2. Mở **Developer Tools** (F12)
3. Vào tab **Console**
4. Vào trang web của bạn
5. Click **"Đăng ký"**
6. Nhập thông tin:
   ```
   Email: test@example.com
   Password: 12341234
   Confirm: 12341234
   ```
7. Click **"Đăng ký"**
8. Xem kết quả trong Console

**Nếu thành công:**
- ✅ Không có lỗi
- ✅ Redirect về `/admin/dashboard`
- ✅ User được tạo trong database

**Nếu có lỗi:**
- ❌ Copy error message trong Console
- ❌ Gửi cho tôi để debug thêm

---

### **Cách 2: Test Bằng Curl** (Cần API Key)

#### **Step 1: Lấy Supabase API Key**

1. Vào Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project: `xicdommyxzsschupzvsx`
3. Vào **Settings** → **API**
4. Copy **anon public** key (starts with `eyJhbGci...`)

#### **Step 2: Update test script**

```bash
# Edit file test-registration-curl.sh
# Line 4: Thay YOUR_ANON_KEY bằng key vừa copy
SUPABASE_ANON_KEY="eyJhbGci..."  # Paste your key here
```

#### **Step 3: Run test**

```bash
chmod +x test-registration-curl.sh
./test-registration-curl.sh
```

---

### **Cách 3: Verify Trong Database**

Sau khi đăng ký trên web, kiểm tra database:

```bash
export PROJECT_REF="xicdommyxzsschupzvsx"
export SUPABASE_DB_PASSWORD="xR1v8HKgUIGDR6ox"
export DB_HOST="db.$PROJECT_REF.supabase.co"

psql "postgresql://postgres:$SUPABASE_DB_PASSWORD@$DB_HOST:5432/postgres?sslmode=require" << 'EOF'
-- Check user vừa đăng ký
SELECT
  u.email,
  u.usercode,
  u.created_at,
  s.status as subscription_status,
  p.name as package_name,
  (SELECT COUNT(*) FROM events WHERE user_id = u.id) as event_count
FROM users u
LEFT JOIN subscriptions s ON s.user_id = u.id
LEFT JOIN packages p ON p.id = s.package_id
WHERE u.email = 'test@example.com';  -- Thay email của bạn
EOF
```

**Expected output:**
```
email              | usercode | subscription_status | package_name | event_count
-------------------+----------+---------------------+--------------+-------------
test@example.com   | ABC123   | active              | Basic        | 1
```

---

## 🔍 Debug Nếu Vẫn Lỗi

### **Check 1: Xem Error Message Chính Xác**

Khi đăng ký trên web, mở **Browser Console** (F12) và xem error:

```javascript
// Example error:
{
  "code": "unexpected_failure",
  "message": "Database error saving new user"
}
```

**Gửi cho tôi:**
- Full error message
- Timestamp khi error xảy ra
- Email bạn đã dùng để đăng ký

### **Check 2: Xem Postgres Logs**

1. Vào Supabase Dashboard
2. **Logs** → **Postgres Logs**
3. Filter: `level = WARNING` hoặc `level = ERROR`
4. Tìm log gần thời điểm bạn đăng ký
5. Copy log và gửi cho tôi

### **Check 3: Verify Triggers Still Enabled**

```bash
export PROJECT_REF="xicdommyxzsschupzvsx"
export SUPABASE_DB_PASSWORD="xR1v8HKgUIGDR6ox"
export DB_HOST="db.$PROJECT_REF.supabase.co"

psql "postgresql://postgres:$SUPABASE_DB_PASSWORD@$DB_HOST:5432/postgres?sslmode=require" -c "
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgname LIKE '%auth_user%'
ORDER BY tgname;
"
```

**Expected:**
```
tgname                            | tgenabled
----------------------------------+-----------
on_auth_user_created              | O
on_auth_user_created_first_event  | O
on_auth_user_created_subscription | O
```

All should be `O` (Enabled).

---

## 📊 Final Verification Status

```
╔═══════════════════════════════════════════════════╗
║              ✅ DATABASE FIXES COMPLETE           ║
╚═══════════════════════════════════════════════════╝

✅ Triggers: 3/3 installed and working
✅ RLS Policies: All updated
✅ Functions: All fixed
✅ Database Test: PASSED

Next: Test registration on website
```

---

## 🚀 Recommended Testing Flow

1. **Test on website** (easiest)
   - Open browser
   - Go to your app
   - Try registering

2. **If error occurs:**
   - Copy error from Console
   - Check Postgres logs in Supabase
   - Send me the error details

3. **Verify in database:**
   - Check if user was created
   - Check if subscription exists
   - Check if event was created

---

## 📞 Need Help?

Nếu vẫn gặp lỗi:

1. **Thử đăng ký trên web** với email test
2. **Copy error message** từ Console
3. **Copy Postgres logs** từ Supabase Dashboard
4. **Gửi cho tôi:**
   - Error message
   - Postgres logs
   - Email bạn dùng để test
   - Thời gian test (để tìm log)

---

**Last Updated:** 2025-01-15
**Database Status:** ✅ READY
**Next Step:** Test trên website và gửi kết quả
