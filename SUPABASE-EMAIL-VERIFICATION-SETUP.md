# 📧 Supabase Email Verification Setup Guide

Hướng dẫn cấu hình email verification cho Supabase Auth trong dự án Bright4Event.

---

## 🎯 Tổng quan

Khi user đăng ký tài khoản mới:
1. User nhập email & password → Gọi `signUpWithEmail()`
2. Supabase gửi email xác thực với magic link
3. User click vào link trong email
4. Browser redirect về `/auth/verify` với `#access_token=...`
5. App xác thực token và hiển thị kết quả
6. Nếu thành công → auto redirect đến `/admin/dashboard`

---

## ⚙️ Cấu hình Supabase Dashboard

### 1. Bật Email Confirmations

Đi đến **Supabase Dashboard** → **Authentication** → **Settings** → **Email**

Đảm bảo các cài đặt sau:

```
✅ Enable email confirmations: ON
✅ Confirm email: ON
✅ Secure email change: ON
```

### 2. Cấu hình Redirect URLs

Đi đến **Authentication** → **URL Configuration**

Thêm các URL sau vào **Redirect URLs**:

```
http://localhost:3000/auth/verify
https://star-vote.code4change.dev/auth/verify
https://yourdomain.com/auth/verify
```

⚠️ **Quan trọng**: Phải thêm chính xác URL của production domain.

### 3. Cấu hình Email Templates

Đi đến **Authentication** → **Email Templates** → **Confirm signup**

Email template mặc định của Supabase:

```html
<h2>Xác nhận email của bạn</h2>
<p>Nhấn vào link bên dưới để xác thực tài khoản:</p>
<p><a href="{{ .ConfirmationURL }}">Xác thực tài khoản</a></p>
```

**Tùy chỉnh (Optional)**:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #FFD700;">🎉 Chào mừng đến với Bright4Event!</h2>
  <p>Cảm ơn bạn đã đăng ký. Vui lòng xác thực email để hoàn tất đăng ký.</p>
  <a href="{{ .ConfirmationURL }}"
     style="display: inline-block; background: #FFD700; color: #000;
            padding: 12px 24px; text-decoration: none; border-radius: 8px;
            font-weight: bold; margin: 20px 0;">
    Xác thực tài khoản
  </a>
  <p style="color: #666; font-size: 12px;">
    Link này sẽ hết hạn sau 24 giờ.
  </p>
</div>
```

### 4. Cấu hình Site URL

Đi đến **Authentication** → **URL Configuration**

```
Site URL: https://star-vote.code4change.dev
```

---

## 🛠️ Code Implementation

### File đã tạo

#### 1. `/app/auth/verify/page.tsx`

Trang xử lý email verification với 3 trạng thái:

- **Loading**: Đang xác thực
- **Success**: Xác thực thành công → redirect to `/admin/dashboard`
- **Error**: Xác thực thất bại → cho phép gửi lại email hoặc đăng nhập lại

#### 2. `/lib/supabase.ts` (Updated)

Thêm `emailRedirectTo` vào hàm `signUpWithEmail()`:

```ts
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/verify`,
    },
  })
  return { data, error }
}
```

---

## 🧪 Testing Flow

### 1. Local Development

```bash
npm run dev
```

1. Mở `http://localhost:3000/pricing`
2. Chọn một gói và click "Đăng ký"
3. Nhập email và password
4. Click "Đăng ký" → Email sẽ được gửi
5. Check email inbox (hoặc spam folder)
6. Click vào link trong email
7. Browser sẽ redirect về `http://localhost:3000/auth/verify#access_token=...`
8. Kiểm tra xem có hiển thị "Xác thực thành công!" không

### 2. Production Testing

Sau khi deploy lên Vercel/Production:

1. Đảm bảo đã thêm production URL vào Supabase Redirect URLs
2. Test lại flow từ đầu trên production domain

---

## 🔧 Troubleshooting

### Lỗi: "Email link is invalid or has expired"

**Nguyên nhân**:
- Link đã hết hạn (thường 24h)
- Link đã được sử dụng rồi
- Redirect URL không khớp với cấu hình Supabase

**Giải pháp**:
1. Kiểm tra lại **Redirect URLs** trong Supabase Dashboard
2. Bấm nút "Gửi lại email xác thực" trên trang `/auth/verify`
3. Hoặc đăng ký lại với email mới

---

### Lỗi: "Invalid redirect URL"

**Nguyên nhân**:
- URL trong `emailRedirectTo` không nằm trong whitelist của Supabase

**Giải pháp**:
1. Đi đến Supabase Dashboard → Authentication → URL Configuration
2. Thêm chính xác URL vào **Redirect URLs**
3. Ví dụ: `http://localhost:3000/auth/verify`

---

### Email không được gửi

**Nguyên nhân**:
- Email bị chặn bởi spam filter
- Supabase email quota hết (free tier: 3 emails/hour)
- Email confirmations chưa được bật

**Giải pháp**:
1. Kiểm tra spam folder
2. Đợi 1 giờ rồi thử lại (nếu hết quota)
3. Bật **Enable email confirmations** trong Supabase Dashboard
4. Upgrade lên Supabase Pro nếu cần quota cao hơn

---

### Lỗi: "User already registered"

**Nguyên nhân**:
- Email đã được đăng ký trước đó nhưng chưa verify

**Giải pháp**:
1. Đi đến trang `/admin/login`
2. Đăng nhập bằng email đã đăng ký
3. Hoặc reset password qua "Quên mật khẩu"

---

## 📊 States & UI

### Loading State
```
🔄 Spinner quay
   "Đang xác thực email của bạn..."
```

### Success State
```
✅ Checkmark xanh lá
   "Xác thực thành công!"
   Email: user@example.com
   [Đi đến trang Quản trị] → /admin/dashboard
   Auto redirect sau 3s
```

### Error State
```
❌ Cross đỏ
   "Xác thực không thành công"
   Lỗi: Liên kết xác thực đã hết hạn
   Email: user@example.com
   [Gửi lại email xác thực] (nếu có email)
   [Quay lại trang đăng nhập]
```

---

## 🎨 Animations

- **Loading**: Spinner quay 360° liên tục
- **Success**: Checkmark bounce-in + auto redirect
- **Error**: Cross shake + fade-in error message
- **Resend success**: Green toast slide-in from top

---

## 📝 Next Steps

1. **Tùy chỉnh email template** với branding của Bright4Event
2. **Thêm analytics** để track conversion rate
3. **Implement password reset flow** tương tự
4. **Add notification** khi resend email thành công
5. **Setup custom SMTP** cho production (SendGrid, AWS SES, etc.)

---

## 🔗 Related Files

- `/app/auth/verify/page.tsx` - Email verification page
- `/lib/supabase.ts` - Supabase client & auth helpers
- `/components/PaymentFlow.tsx` - Registration flow
- `/.env.local` - Supabase credentials

---

## 📚 References

- [Supabase Email Verification Docs](https://supabase.com/docs/guides/auth/auth-email)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Next.js App Router Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

**🎉 Email verification flow hoàn tất!**

User có thể:
- ✅ Đăng ký tài khoản
- ✅ Nhận email xác thực
- ✅ Xác thực email qua link
- ✅ Gửi lại email nếu hết hạn
- ✅ Auto redirect đến admin dashboard
