# Modal Flow Update - Cập nhật Luồng Modal

## Tổng quan

Đã cập nhật hệ thống authentication và modal flow để xử lý các tình huống sau:
1. Xóa trang `/admin/login` - tất cả đăng nhập thông qua modal
2. Xử lý query string `?request=create-event` hoặc `?request=payment`
3. Tự động mở payment modal sau login với thông tin gói đã chọn

## Các thay đổi chính

### 1. Xóa trang `/admin/login`

**Files đã cập nhật:**
- `constants/routes.ts`: Thay đổi `LOGIN: '/admin/login'` → `LOGIN: '/?action=login'`
- `components/AdminSidebar.tsx`: Logout redirect về trang chủ `/`
- `app/admin/(authenticated)/layout.tsx`: Redirect về `/?action=login` thay vì `/admin/login`

### 2. Xử lý Query String

**Component mới:** `components/AutoOpenModal.tsx`
- Tự động mở modal dựa trên URL query parameters
- Hỗ trợ:
  - `?action=login` - Mở login modal
  - `?action=register` - Mở register modal
  - `?request=create-event` - Mở login modal với post-action create-event
  - `?request=payment` - Mở login modal với post-action payment

**Thêm vào:** `app/layout.tsx`
```tsx
<AutoOpenModal />
```

### 3. Login Flow với Request Types

**Files đã cập nhật:**
- `components/modals/LoginModal.tsx`
- `components/modals/RegisterModal.tsx`

**Logic xử lý:**

```typescript
// Lấy request type từ URL query params
const requestType = searchParams.get('request')

// Sau khi login thành công
if (finalRequestType === 'create-event') {
  // Redirect đến admin dashboard
  router.push('/admin/dashboard')
} else if (finalRequestType === 'payment') {
  // Kiểm tra có gói đã lưu không
  const savedPlan = localStorage.getItem('selected_plan')
  if (savedPlan) {
    // Mở payment modal với thông tin gói
    dispatch(openPaymentModal(savedPlan))
  } else {
    // Không có gói, redirect về pricing
    router.push('/pricing')
  }
}
```

### 4. Payment Flow từ Pricing Page

**File:** `app/pricing/page.tsx`

**Logic:**
```typescript
const handlePlanSelect = (plan: PricingPlan) => {
  if (user) {
    // User đã login - mở payment modal ngay
    dispatch(openPaymentModal({
      name: plan.name,
      price: plan.price,
      description: plan.description
    }))
  } else {
    // User chưa login
    // 1. Lưu thông tin gói vào localStorage
    localStorage.setItem('selected_plan', JSON.stringify(plan))

    // 2. Mở login modal với payment intent
    dispatch(openLoginModal({
      postLoginAction: 'payment',
      redirectPath: '/pricing'
    }))
  }
}
```

## Luồng hoạt động

### Luồng 1: User click "Tạo sự kiện" (chưa login)

1. User click button "Tạo sự kiện"
2. Kiểm tra: User chưa login
3. Dispatch `openLoginModal({ postLoginAction: 'create-event', redirectPath: '/admin/dashboard' })`
4. Modal login hiện ra
5. User nhập thông tin và login
6. Sau login thành công → Redirect đến `/admin/dashboard`

### Luồng 2: User chọn gói trên Pricing (chưa login)

1. User ở trang `/pricing`
2. Click "Chọn gói Basic/Pro/Enterprise"
3. Kiểm tra: User chưa login
4. Lưu thông tin gói vào `localStorage.setItem('selected_plan', ...)`
5. Dispatch `openLoginModal({ postLoginAction: 'payment' })`
6. Modal login hiện ra
7. User nhập thông tin và login
8. Sau login thành công:
   - Đọc thông tin gói từ localStorage
   - Dispatch `openPaymentModal(savedPlan)`
   - Payment modal hiện ra với đúng thông tin gói user đã chọn
   - Xóa `localStorage.removeItem('selected_plan')`

### Luồng 3: User chọn gói trên Pricing (đã login)

1. User ở trang `/pricing` (đã login)
2. Click "Chọn gói Basic/Pro/Enterprise"
3. Kiểm tra: User đã login
4. Dispatch `openPaymentModal(plan)` ngay lập tức
5. Payment modal hiện ra với thông tin gói

### Luồng 4: Access admin page khi chưa login

1. User cố truy cập `/admin/dashboard` (chưa login)
2. `app/admin/(authenticated)/layout.tsx` kiểm tra auth
3. Redirect về `/?action=login`
4. `AutoOpenModal` component phát hiện `?action=login`
5. Tự động mở login modal
6. Sau login → Redirect về trang user đang cố truy cập

### Luồng 5: Logout

1. User click logout button ở Header hoặc AdminSidebar
2. Dispatch `logout()` action
3. Redux xóa:
   - User state
   - Token
   - Cookies (admin_token, auth_token)
   - localStorage (auth_redirect)
4. Redirect về trang chủ `/`

## URL Query Parameters

### Supported Parameters

| Parameter | Value | Mô tả |
|-----------|-------|-------|
| `action` | `login` | Mở login modal |
| `action` | `register` | Mở register modal |
| `request` | `create-event` | Login và redirect đến dashboard |
| `request` | `payment` | Login và mở payment modal |

### Ví dụ URLs

```
# Mở login modal
https://yourdomain.com/?action=login

# Mở register modal
https://yourdomain.com/?action=register

# Login để tạo event
https://yourdomain.com/?request=create-event

# Login để thanh toán
https://yourdomain.com/?request=payment

# Login với redirect cụ thể
https://yourdomain.com/?action=login&redirect=/admin/settings
```

## LocalStorage Usage

### `selected_plan`

Lưu thông tin gói khi user chưa login nhưng đã chọn gói:

```json
{
  "name": "Pro",
  "price": "Liên hệ",
  "description": "Phổ biến nhất cho doanh nghiệp"
}
```

**Lifecycle:**
- **Tạo:** Khi user click chọn gói mà chưa login
- **Đọc:** Sau khi login thành công với `postLoginAction: 'payment'`
- **Xóa:** Ngay sau khi đọc và mở payment modal

### `auth_redirect`

Lưu đường dẫn để redirect sau login (legacy, có thể thay bằng Redux):

```
"/admin/dashboard"
```

## Redux State Structure

### Auth Slice
```typescript
{
  user: {
    id: string
    email: string
    name?: string
    phone?: string
  } | null,
  isAuthenticated: boolean,
  loading: boolean,
  token: string | null
}
```

### Modal Slice
```typescript
{
  activeModal: 'login' | 'register' | 'payment' | null,
  postLoginAction: 'create-event' | 'payment' | 'dashboard' | null,
  redirectPath: string | null,
  selectedPlan: {
    name: string
    price: string
    description: string
  } | null
}
```

## Testing Scenarios

### Test 1: Login để tạo event
```bash
# 1. Đảm bảo logged out
# 2. Truy cập: /?request=create-event
# 3. Login modal tự động mở
# 4. Login thành công
# 5. Kiểm tra: Redirect đến /admin/dashboard
```

### Test 2: Chọn gói khi chưa login
```bash
# 1. Đảm bảo logged out
# 2. Truy cập: /pricing
# 3. Click "Chọn gói Pro"
# 4. Login modal tự động mở
# 5. Login thành công
# 6. Kiểm tra: Payment modal mở với thông tin gói Pro
```

### Test 3: Chọn gói khi đã login
```bash
# 1. Đảm bảo logged in
# 2. Truy cập: /pricing
# 3. Click "Chọn gói Pro"
# 4. Kiểm tra: Payment modal mở ngay với thông tin gói Pro
```

### Test 4: Logout
```bash
# 1. Đảm bảo logged in
# 2. Click logout button
# 3. Kiểm tra:
#    - Redux state cleared
#    - Cookies cleared
#    - Redirect về trang chủ
```

## Lưu ý khi Development

1. **LocalStorage Management:**
   - Luôn xóa `selected_plan` sau khi sử dụng
   - Kiểm tra tồn tại trước khi parse JSON

2. **Modal State:**
   - Chỉ mở 1 modal tại 1 thời điểm
   - `AutoOpenModal` kiểm tra `activeModal` trước khi mở

3. **Redirect Logic:**
   - URL query params có ưu tiên cao hơn Redux state
   - Luôn có fallback behavior (default: refresh trang hiện tại)

4. **Error Handling:**
   - Wrap `JSON.parse()` trong try-catch
   - Log errors để debug
   - Có fallback khi parse fails

## Files Changed

### Created:
- `components/AutoOpenModal.tsx`
- `MODAL-FLOW-UPDATE.md`

### Modified:
- `constants/routes.ts`
- `components/AdminSidebar.tsx`
- `app/admin/(authenticated)/layout.tsx`
- `components/modals/LoginModal.tsx`
- `components/modals/RegisterModal.tsx`
- `app/pricing/page.tsx`
- `app/layout.tsx`

## Build Status

✅ Build successful
✅ No TypeScript errors
✅ All components working correctly
