# Supabase Storage Setup Guide

Hướng dẫn cấu hình Supabase Storage để upload avatar cho Profile.

## 📦 Yêu cầu

- Supabase project đã được setup
- Admin access vào Supabase Dashboard

## 🚀 Setup Storage Bucket

### 1. Tạo Storage Bucket

1. Truy cập **Supabase Dashboard** → **Storage**
2. Click **New Bucket**
3. Nhập thông tin:
   - **Name:** `avatars`
   - **Public bucket:** ✅ **Check** (để avatar có thể truy cập công khai)
4. Click **Create Bucket**

### 2. Cấu hình Storage Policies (RLS)

Mặc định bucket `avatars` đã public, nhưng để upload/delete file cần thêm policies.

#### Policy 1: Upload Avatar (Authenticated Users)

1. Vào bucket `avatars` → **Policies** tab
2. Click **New Policy**
3. Chọn **For full customization**
4. Nhập thông tin:

```sql
-- Policy Name: Allow authenticated users to upload avatars
-- Target roles: authenticated

CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'avatars'
);
```

5. Click **Review** → **Save policy**

#### Policy 2: Update/Delete Own Avatar

```sql
-- Policy Name: Allow users to update/delete own avatars
-- Target roles: authenticated

CREATE POLICY "Allow users to update/delete own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  owner = auth.uid()
);
```

#### Policy 3: Public Read Access

```sql
-- Policy Name: Public read access for avatars
-- Target roles: public, authenticated

CREATE POLICY "Public read access for avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### 3. Cấu hình File Size & Type Limits (Optional)

Vào **Storage Settings** và cấu hình:

- **Maximum file size:** 5MB
- **Allowed MIME types:**
  - `image/jpeg`
  - `image/png`
  - `image/gif`
  - `image/webp`

## 📁 Cấu trúc Storage

Sau khi setup, cấu trúc storage sẽ như sau:

```
avatars/
└── avatars/
    ├── {userId}-{timestamp}.jpg
    ├── {userId}-{timestamp}.png
    └── ...
```

**Ví dụ:**
```
avatars/
└── avatars/
    └── a1b2c3d4-1705234567890.jpg
```

## 🔒 Security Notes

1. **Authentication Required:** Chỉ user đã login mới upload được
2. **File Validation:** API validate:
   - File type (image only)
   - File size (max 5MB)
3. **Unique Filename:** Mỗi file có tên unique theo pattern `{userId}-{timestamp}.{ext}`
4. **Public Read:** Avatar có thể xem công khai nhưng chỉ owner mới xóa được

## 🧪 Test Upload

1. Login vào admin panel
2. Vào **Profile** (`/admin/profile`)
3. Click **Chọn ảnh** → chọn 1 ảnh
4. Click **Lưu avatar**
5. Kiểm tra:
   - Avatar hiển thị đúng
   - URL có format: `https://{project}.supabase.co/storage/v1/object/public/avatars/avatars/{filename}`
   - File xuất hiện trong Supabase Storage dashboard

## ❓ Troubleshooting

### Lỗi: "new row violates row-level security policy"

**Nguyên nhân:** Chưa setup policies đúng

**Giải pháp:** Kiểm tra lại policies ở bước 2

### Lỗi: "Bucket not found"

**Nguyên nhân:** Bucket `avatars` chưa được tạo

**Giải pháp:** Tạo bucket theo bước 1

### Avatar không hiển thị

**Nguyên nhân:** Bucket chưa được set public

**Giải pháp:**
1. Vào Storage → bucket `avatars`
2. Settings → **Public bucket** → Enable
3. Save

### Upload bị timeout

**Nguyên nhân:** File quá lớn hoặc network chậm

**Giải pháp:**
1. Resize ảnh trước khi upload (recommended: < 500KB)
2. Kiểm tra network connection

## 📚 API Reference

### Upload Avatar
```typescript
POST /api/admin/upload-avatar
Content-Type: multipart/form-data

FormData:
  avatar: File (image)

Response:
{
  success: true,
  avatarUrl: "https://..."
}
```

### Delete Avatar
```typescript
DELETE /api/admin/upload-avatar

Response:
{
  success: true
}
```

## ✅ Checklist

- [ ] Tạo bucket `avatars`
- [ ] Set bucket public
- [ ] Thêm upload policy
- [ ] Thêm delete policy
- [ ] Thêm read policy
- [ ] Test upload avatar
- [ ] Test delete avatar
- [ ] Verify public URL hoạt động

---

**Last Updated:** 2025-01-15
**Version:** 1.0
