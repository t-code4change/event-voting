# Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị Project

Project đã sẵn sàng để deploy với:
- ✅ Next.js 14 (App Router)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Supabase integration
- ✅ Image optimization configured

## Bước 2: Push Code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Tạo repository trên GitHub và push
git remote add origin https://github.com/your-username/event-voting.git
git branch -M main
git push -u origin main
```

## Bước 3: Deploy trên Vercel

### 3.1. Đăng nhập Vercel
1. Truy cập https://vercel.com
2. Đăng nhập bằng tài khoản GitHub

### 3.2. Import Project
1. Click "Add New..." → "Project"
2. Chọn repository GitHub của bạn
3. Click "Import"

### 3.3. Cấu hình Project

**Framework Preset:** Next.js (được tự động phát hiện)

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3.4. Cấu hình Environment Variables

Thêm các biến môi trường sau vào Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-admin-password
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Cách lấy Supabase credentials:**
1. Truy cập https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (giữ bí mật!)

**Đặt ADMIN_PASSWORD:**
- Chọn một mật khẩu mạnh cho admin panel
- VD: `Admin@2025!Strong`

### 3.5. Deploy
1. Click "Deploy"
2. Đợi khoảng 2-3 phút
3. Vercel sẽ tự động build và deploy

## Bước 4: Seed Database

Sau khi deploy thành công, cần seed data vào Supabase:

1. Truy cập Supabase Dashboard
2. Vào SQL Editor
3. Chạy file `scripts/seed-with-real-photos.sql`
4. Verify data đã được tạo thành công

## Bước 5: Kiểm tra Website

1. Truy cập URL Vercel của bạn (VD: https://event-voting.vercel.app)
2. Kiểm tra các trang:
   - ✅ Trang chủ: `/`
   - ✅ Voting: `/vote`
   - ✅ Results: `/results`
   - ✅ Admin Login: `/admin/login`
   - ✅ Admin Dashboard: `/admin/dashboard`

## Bước 6: Custom Domain (Tùy chọn)

Nếu muốn sử dụng domain riêng:

1. Vào Project Settings → Domains
2. Add domain của bạn
3. Cấu hình DNS theo hướng dẫn
4. Đợi DNS propagate (15-30 phút)

## Troubleshooting

### Build Failed
- Kiểm tra `npm run build` chạy thành công locally
- Xem logs chi tiết trong Vercel deployment

### Environment Variables không hoạt động
- Đảm bảo đã add đúng tên biến
- Biến `NEXT_PUBLIC_*` mới accessible trong client
- Sau khi thay đổi env vars, cần redeploy

### Images không load
- Kiểm tra `next.config.js` đã cấu hình đúng domains
- Đảm bảo URLs hợp lệ

### Supabase Connection Failed
- Verify credentials trong Environment Variables
- Kiểm tra Supabase project đang active
- Check RLS policies trong Supabase

## Auto Deployment

Sau khi setup xong, mỗi khi push code lên GitHub:
- Vercel tự động detect changes
- Tự động build và deploy
- Website được update trong vài phút

## Monitoring

Vercel cung cấp:
- Analytics dashboard
- Error tracking
- Performance monitoring
- Logs realtime

Truy cập tại: https://vercel.com/dashboard

## Bảo mật

- ✅ HTTPS tự động
- ✅ Environment variables được mã hóa
- ✅ Service role key không bao giờ expose ra client
- ✅ Admin password được protect

## Support

Nếu gặp vấn đề:
1. Check Vercel logs
2. Check Supabase logs
3. Xem documentation: https://vercel.com/docs
