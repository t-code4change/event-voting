# KE HOACH THUC HIEN - ESTRO CHECK-IN SYSTEM

## 1. TONG QUAN

### 1.1 Muc tieu
- Them tinh nang quan ly danh sach khach moi
- Theo doi trang thai check-in cua khach
- Chi cho phep khach da check-in tham gia quay so trung thuong

### 1.2 Nguyen tac
- **Thay doi toi thieu** - Su dung cau truc hien tai cua Strapi
- **Khong anh huong** - Cac tinh nang khac van hoat dong binh thuong
- **Tuong thich nguoc** - Event cu van hoat dong khong can check-in

---

## 2. PHAN TICH HIEN TRANG

### 2.1 Cac API da co
| API | Mo ta | Trang thai |
|-----|-------|------------|
| `/my-events/:id/participants` | Quan ly danh sach khach | ✅ Co san |
| `/my-events/:id/participants/many` | Import khach hang loat | ✅ Co san |
| `/draw-results` | Quan ly ket qua quay so | ✅ Co san |
| `participant.isWinner` | Trang thai trung thuong | ✅ Co san |

### 2.2 Thieu gi?
| Tinh nang | Trang thai |
|-----------|------------|
| Field `isCheckedIn` trong Participant | ❌ Chua co |
| API check-in khach | ❌ Chua co |
| Validation chi cho check-in quay so | ❌ Chua co |

---

## 3. GIAI PHAP DE XUAT

### 3.1 Phuong an: Mo rong Participant Schema (TOI UU NHAT)

**Ly do chon:**
- Khong can tao content type moi
- Tan dung API participant hien co
- Thay doi code it nhat
- De maintain ve sau

### 3.2 Cac thay doi can thuc hien

#### A. BACKEND (Strapi Server)

**File 1:** `src/api/participant/content-types/participant/schema.json`
```json
// THEM 3 FIELD MOI:
{
  "isCheckedIn": {
    "type": "boolean",
    "default": false
  },
  "checkedInAt": {
    "type": "datetime"
  },
  "checkedInBy": {
    "type": "string"
  }
}
```

**File 2:** `src/api/event/controllers/event.ts`
```typescript
// THEM 3 ENDPOINT MOI:

// 1. Check-in theo participant ID
POST /my-events/:id/participants/:participantId/check-in

// 2. Check-in theo ma nhan vien (code)
POST /my-events/:id/check-in/by-code
Body: { code: "NV001" }

// 3. Lay danh sach da check-in
GET /my-events/:id/participants/checked-in
```

**File 3:** `src/api/event/routes/my-events.ts`
```typescript
// THEM ROUTES CHO CAC ENDPOINT MOI
```

**File 4:** `src/api/draw-result/controllers/draw-result.ts` (hoac event.ts)
```typescript
// CHINH SUA: Them validation truoc khi tao draw result
// Kiem tra participant.isCheckedIn === true
```

**File 5:** `src/api/setting/content-types/setting/schema.json` (TUY CHON)
```json
// THEM 1 FIELD:
{
  "requireCheckedIn": {
    "type": "boolean",
    "default": false
  }
}
```

#### B. FRONTEND (Event-voting)

**File 1:** `app/[locale]/event/estro/check-in-form-with-code/page.tsx`
- Goi API check-in khi khach submit form
- Hien thi ket qua thanh cong/that bai

**File 2:** (Tuy chon) Component hien thi danh sach da check-in
- Dashboard cho ban to chuc xem so luong check-in

#### C. FRONTEND (Landing page - Trang quay so)

**File 1:** Draw logic
- Truoc khi quay: Kiem tra `requireCheckedIn` setting
- Neu bat: Chi lay participant co `isCheckedIn = true`

---

## 4. BANG CONG VIEC CHI TIET

### Phase 1: Backend - Schema & API (Uu tien cao)

| STT | Cong viec | File | Thoi gian |
|-----|-----------|------|-----------|
| 1.1 | Them 3 fields vao Participant schema | `schema.json` | ~ |
| 1.2 | Tao endpoint check-in by ID | `event.ts` | ~ |
| 1.3 | Tao endpoint check-in by code | `event.ts` | ~ |
| 1.4 | Tao endpoint get checked-in list | `event.ts` | ~ |
| 1.5 | Them routes cho cac endpoint | `my-events.ts` | ~ |

### Phase 2: Backend - Draw Validation (Uu tien cao)

| STT | Cong viec | File | Thoi gian |
|-----|-----------|------|-----------|
| 2.1 | Them field `requireCheckedIn` vao Setting | `setting/schema.json` | ~ |
| 2.2 | Sua draw logic de loc participant | `event.ts` hoac `draw-result.ts` | ~ |
| 2.3 | Tra ve loi neu khach chua check-in | Controller | ~ |

### Phase 3: Frontend - Check-in Form (Uu tien cao)

| STT | Cong viec | File | Thoi gian |
|-----|-----------|------|-----------|
| 3.1 | Tao API client goi check-in | `api/` | ~ |
| 3.2 | Sua form de goi API khi submit | `check-in-form-with-code/page.tsx` | ~ |
| 3.3 | Hien thi thong bao thanh cong/that bai | Component | ~ |

### Phase 4: Frontend - Landing Page (Uu tien trung binh)

| STT | Cong viec | File | Thoi gian |
|-----|-----------|------|-----------|
| 4.1 | Them setting `requireCheckedIn` vao UI | Setting component | ~ |
| 4.2 | Loc participant truoc khi quay | Draw logic | ~ |

---

## 5. API SPECIFICATION

### 5.1 Check-in by Employee Code

```
POST /api/my-events/:eventId/check-in/by-code

Headers:
  Authorization: Bearer <token> (neu can)

Body:
{
  "code": "NV001",
  "checkedInBy": "Receptionist A" (optional)
}

Response Success (200):
{
  "success": true,
  "data": {
    "id": 123,
    "code": "NV001",
    "fullName": "Nguyen Van A",
    "isCheckedIn": true,
    "checkedInAt": "2026-01-31T10:30:00Z"
  },
  "message": "Check-in thanh cong"
}

Response Error (404):
{
  "success": false,
  "error": "PARTICIPANT_NOT_FOUND",
  "message": "Khong tim thay ma nhan vien"
}

Response Error (400):
{
  "success": false,
  "error": "ALREADY_CHECKED_IN",
  "message": "Khach da check-in truoc do",
  "data": {
    "checkedInAt": "2026-01-31T09:00:00Z"
  }
}
```

### 5.2 Get Checked-in List

```
GET /api/my-events/:eventId/participants/checked-in

Response (200):
{
  "data": [
    {
      "id": 123,
      "code": "NV001",
      "fullName": "Nguyen Van A",
      "checkedInAt": "2026-01-31T10:30:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "checkedIn": 75,
    "notCheckedIn": 75
  }
}
```

---

## 6. FLOW HOAT DONG

### 6.1 Flow Check-in

```
[Khach] --> [Quet QR] --> [Nhap ma NV] --> [API Check-in]
                                               |
                                               v
                                    [Kiem tra ma ton tai?]
                                         |         |
                                        YES       NO
                                         |         |
                                         v         v
                              [Cap nhat isCheckedIn]  [Tra ve loi]
                                         |
                                         v
                              [Hien thi Success + Confetti]
```

### 6.2 Flow Quay so

```
[Admin click Quay] --> [Kiem tra requireCheckedIn?]
                              |            |
                            TRUE         FALSE
                              |            |
                              v            v
                    [Loc participant    [Lay tat ca
                     isCheckedIn=true]   participant]
                              |            |
                              +-----+------+
                                    |
                                    v
                          [Chay thuat toan random]
                                    |
                                    v
                          [Tao Draw Result]
```

---

## 7. BACKWARD COMPATIBILITY

### 7.1 Event cu (khong dung check-in)
- `requireCheckedIn = false` (mac dinh)
- Quay so van lay tat ca participant nhu cu
- Khong anh huong gi

### 7.2 Event moi (dung check-in)
- Admin bat `requireCheckedIn = true` trong setting
- Import danh sach khach voi `isCheckedIn = false`
- Khach check-in tai su kien
- Chi khach da check-in moi duoc quay

---

## 8. RISK & MITIGATION

| Risk | Muc do | Giai phap |
|------|--------|-----------|
| Participant cu khong co field moi | Thap | Strapi tu them field voi gia tri default |
| API check-in bi goi trung | Thap | Kiem tra va tra ve "ALREADY_CHECKED_IN" |
| Khong co khach check-in khi quay | Trung binh | Hien thong bao "Chua co khach check-in" |
| Network loi khi check-in | Trung binh | Retry logic + thong bao loi ro rang |

---

## 9. TESTING CHECKLIST

- [ ] Import danh sach 100 khach thanh cong
- [ ] Check-in 1 khach theo ma thanh cong
- [ ] Check-in trung lap tra ve loi dung
- [ ] Check-in ma khong ton tai tra ve loi
- [ ] Quay so chi lay khach da check-in
- [ ] Event cu van quay so duoc binh thuong
- [ ] UI hien thi dung trang thai check-in

---

## 10. TOM TAT THAY DOI

### Files can sua (Backend):
1. `participant/content-types/participant/schema.json` - Them 3 fields
2. `setting/content-types/setting/schema.json` - Them 1 field
3. `event/controllers/event.ts` - Them 3 endpoints + sua draw logic
4. `event/routes/my-events.ts` - Them routes

### Files can sua (Frontend - Event-voting):
1. `check-in-form-with-code/page.tsx` - Goi API check-in

### Files can sua (Frontend - Landing page):
1. Setting component - Them toggle requireCheckedIn
2. Draw logic - Loc participant truoc khi quay

### Tong so files: ~6-8 files
### Do anh huong: **THAP** - Chi them field va endpoint moi

---

## 11. APPROVAL

[ ] Duyet ke hoach thuc hien
[ ] Bat dau Phase 1: Backend Schema & API
[ ] Bat dau Phase 2: Backend Draw Validation
[ ] Bat dau Phase 3: Frontend Check-in Form
[ ] Bat dau Phase 4: Frontend Landing Page

---

**Nguoi lap:** Claude AI Assistant
**Ngay:** 28/01/2026
**Version:** 1.0
