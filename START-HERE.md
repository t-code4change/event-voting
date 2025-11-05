# 🚀 START HERE - Event Voting System

**Chào mừng! Đây là điểm bắt đầu cho dự án Event Voting System.**

---

## ⚡ Quick Setup (5 phút)

### Bước 1: Kiểm tra Dependencies

```bash
npm install
```

### Bước 2: Chạy Database Check

```bash
node scripts/setup-db-auto.js
```

Script sẽ kiểm tra và hướng dẫn bạn setup database.

### Bước 3: Follow Hướng Dẫn

Script sẽ:
- ✅ Check Supabase connection
- ✅ Detect nếu thiếu Service Role Key
- ✅ Check tables đã tạo chưa
- ✅ Check data đã seed chưa
- ✅ Hướng dẫn từng bước cụ thể

---

## 📁 Important Files

### 1. **START HERE** (File này)
Đọc đầu tiên để biết bắt đầu từ đâu

### 2. **QUICKSTART.md** ⭐⭐⭐
Hướng dẫn setup 5 phút - CHI TIẾT NHẤT

### 3. **README.md**
Tổng quan project, features, tech stack

### 4. **SETUP.md**
Hướng dẫn đầy đủ cho production

---

## 🔑 Cần Service Role Key?

### Lấy ở đâu?
1. Truy cập: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/settings/api
2. Scroll xuống "Project API keys"
3. Copy **"service_role"** key (màu vàng)
4. Paste vào `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

---

## 📊 Database Setup

### Option 1: Automated Check (Recommended)
```bash
node scripts/setup-db-auto.js
```
Script sẽ check và hướng dẫn bạn.

### Option 2: Manual
1. Mở Supabase SQL Editor
2. Run `supabase-schema.sql`
3. Run `supabase-seed.sql`

Chi tiết: Xem **QUICKSTART.md**

---

## 🎯 Flow Setup

```
1. npm install
   ↓
2. node scripts/setup-db-auto.js
   ↓
3. Follow hướng dẫn từ script
   ↓
4. npm run dev
   ↓
5. Test voting! 🎉
```

---

## 🎨 Features Demo

### Confetti Effects
- ✅ Đăng nhập thành công → Confetti 🎊
- ✅ Vote thành công → Confetti 🎊
- ✅ Beautiful animations

### Voting
- ✅ Multiple selection (up to N per category)
- ✅ Real-time validation
- ✅ Edit votes before deadline

### Admin
- ✅ Password protected
- ✅ Full management panel
- ✅ 6 admin pages

---

## 📝 Next Steps

### After Database Setup

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Voting**
   - URL: http://localhost:3000/vote
   - Email: `demo@example.com`

3. **Test Admin**
   - URL: http://localhost:3000/admin/dashboard
   - Password: `admin123`

---

## 📚 Documentation Structure

```
├── START-HERE.md          ← YOU ARE HERE
├── QUICKSTART.md          ← Setup 5 phút (CHI TIẾT)
├── README.md              ← Tổng quan project
├── SETUP.md               ← Hướng dẫn đầy đủ
└── docs/
    ├── database-schema.md
    ├── pages-specification.md
    └── authentication-flow.md
```

---

## 🐛 Gặp Lỗi?

### "Service Role Key is placeholder"
→ Lấy key từ Supabase Dashboard (link ở trên)

### "Tables not found"
→ Run `supabase-schema.sql` trong SQL Editor

### "No active events"
→ Run `supabase-seed.sql` trong SQL Editor

### Database không connect
→ Check `.env.local` có đầy đủ keys

---

## 🎉 Quick Test

Sau khi setup xong:

```bash
# 1. Start
npm run dev

# 2. Open browser
http://localhost:3000

# 3. Test vote
http://localhost:3000/vote

# 4. Test admin
http://localhost:3000/admin/dashboard
Password: admin123
```

---

## 💡 Tips

- Đọc **QUICKSTART.md** để hiểu rõ từng bước
- Chạy `node scripts/setup-db-auto.js` để check status
- Check console logs nếu có lỗi
- Service Role Key là bắt buộc

---

## 📞 Need Help?

1. Check **QUICKSTART.md** - Hướng dẫn chi tiết nhất
2. Check **SETUP.md** - Troubleshooting guide
3. Run `node scripts/setup-db-auto.js` - Diagnostic tool

---

## ✨ What You'll Get

После setup, bạn sẽ có:

✅ **1 Active Event**: King & Queen of the Night 2025
✅ **3 Categories**: King, Queen, Best Dressed
✅ **16 Candidates**: Đầy đủ demo data
✅ **Admin Panel**: Full management
✅ **Confetti Effects**: On success actions
✅ **Mobile Responsive**: Works on all devices

---

**Ready? 👉 Mở file `QUICKSTART.md` để bắt đầu!**

Or run:
```bash
node scripts/setup-db-auto.js
```

🚀 Have fun building your voting system!
