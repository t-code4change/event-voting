# Guest Management API Specification

Tài liệu này mô tả các API endpoints cho module quản lý khách mời trong hệ thống Bright4Event.

## Base URL
```
/api/admin/events/:eventId/guests
```

## Authentication
Tất cả các endpoints yêu cầu authentication token hợp lệ trong header.

---

## 1. Get Guests List

Lấy danh sách khách mời của sự kiện với phân trang và bộ lọc.

### Endpoint
```
GET /api/admin/events/:eventId/guests
```

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | Số lượng khách mời trên mỗi trang (default: 50) |
| offset | number | No | Vị trí bắt đầu (default: 0) |
| search | string | No | Tìm kiếm theo tên, email, phone |
| checkInStatus | string | No | Filter: `all`, `checked-in`, `pending` |
| company | string | No | Filter theo công ty |
| emailStatus | string | No | Filter: `all`, `not-sent`, `sending`, `sent`, `failed` |
| dateFrom | string | No | Filter từ ngày (ISO 8601) |
| dateTo | string | No | Filter đến ngày (ISO 8601) |

### Response
```json
{
  "guests": [
    {
      "id": "uuid",
      "name": "Nguyễn Văn A",
      "email": "a@example.com",
      "phone": "0901234567",
      "company": "Pacific Wide",
      "notes": "VIP guest",
      "status": "checked-in",
      "emailStatus": "sent",
      "checkedIn": true,
      "checkedInAt": "2025-01-14T10:30:00Z",
      "createdAt": "2025-01-10T08:00:00Z",
      "updatedAt": "2025-01-14T10:30:00Z"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

---

## 2. Add Guest

Thêm khách mời mới vào sự kiện.

### Endpoint
```
POST /api/admin/events/:eventId/guests
```

### Request Body
```json
{
  "name": "Nguyễn Văn A",
  "email": "a@example.com",
  "phone": "0901234567",
  "company": "Pacific Wide",
  "notes": "VIP guest",
  "sendInviteEmail": true
}
```

### Validation Rules
- `name`: Required, min 2 characters
- `email` OR `phone`: At least one required
- `email`: Valid email format
- `phone`: 10-11 digits
- Check guest limit before adding

### Response
```json
{
  "success": true,
  "guest": {
    "id": "uuid",
    "name": "Nguyễn Văn A",
    "email": "a@example.com",
    "phone": "0901234567",
    "company": "Pacific Wide",
    "notes": "VIP guest",
    "status": "pending",
    "emailStatus": "sent",
    "createdAt": "2025-01-14T10:00:00Z"
  },
  "emailSent": true
}
```

### Error Responses
```json
// 400 - Validation Error
{
  "error": "Tên là bắt buộc"
}

// 400 - Limit Exceeded
{
  "error": "Đã đạt giới hạn 200 khách mời"
}

// 409 - Duplicate
{
  "error": "Email/Phone đã tồn tại"
}
```

---

## 3. Update Guest

Cập nhật thông tin khách mời.

### Endpoint
```
PUT /api/admin/events/:eventId/guests/:guestId
```

### Request Body
```json
{
  "name": "Nguyễn Văn A",
  "email": "a@example.com",
  "phone": "0901234567",
  "company": "Pacific Wide",
  "notes": "VIP guest - Updated"
}
```

### Response
```json
{
  "success": true,
  "guest": {
    "id": "uuid",
    "name": "Nguyễn Văn A",
    "email": "a@example.com",
    "phone": "0901234567",
    "company": "Pacific Wide",
    "notes": "VIP guest - Updated",
    "updatedAt": "2025-01-14T11:00:00Z"
  }
}
```

---

## 4. Delete Guest

Xóa khách mời khỏi sự kiện.

### Endpoint
```
DELETE /api/admin/events/:eventId/guests/:guestId
```

### Response
```json
{
  "success": true,
  "message": "Đã xóa khách mời thành công"
}
```

### Notes
- Nếu khách đã check-in, cần warning trước khi xóa
- Xóa cascade các dữ liệu liên quan (votes, check-in records)

---

## 5. Import Guests from Excel

Import danh sách khách mời từ file Excel/CSV.

### Endpoint - Validate
```
POST /api/admin/events/:eventId/guests/import/validate
```

### Request
```
Content-Type: multipart/form-data

file: [Excel/CSV file]
validateOnly: true
```

### Response
```json
{
  "total": 100,
  "valid": 95,
  "duplicates": 3,
  "invalid": 2,
  "errors": [
    {
      "row": 5,
      "field": "email",
      "message": "Email không hợp lệ"
    }
  ]
}
```

### Endpoint - Import
```
POST /api/admin/events/:eventId/guests/import
```

### Request
```
Content-Type: multipart/form-data

file: [Excel/CSV file]
updateDuplicates: false
```

### Response
```json
{
  "successCount": 95,
  "errorCount": 2,
  "skipped": 3,
  "logFile": "https://storage.example.com/import-errors-123.csv"
}
```

### Excel Format
Required columns:
- `name` (Tên) - Required
- `email` (Email) - Optional but required if phone is empty
- `phone` (Điện thoại) - Optional but required if email is empty
- `company` (Công ty) - Optional
- `notes` (Ghi chú) - Optional

---

## 6. Export Guests

Export danh sách khách mời ra Excel/CSV/PDF.

### Endpoint
```
GET /api/admin/events/:eventId/guests/export
```

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| format | string | Yes | `xlsx`, `csv`, `pdf` |
| scope | string | Yes | `all`, `filtered` |
| filter | string | No | JSON string of filter object (if scope=filtered) |

### Response
Binary file download with appropriate headers:
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="guests-export-1234567890.xlsx"
```

---

## 7. Send Email Invite (Single)

Gửi email mời cho một khách.

### Endpoint
```
POST /api/admin/events/:eventId/guests/:guestId/send-invite
```

### Response
```json
{
  "success": true,
  "message": "Email đã được gửi thành công",
  "sentAt": "2025-01-14T10:00:00Z"
}
```

### Updates Guest Record
- Set `emailStatus` to `sending` → `sent` or `failed`
- Record `lastEmailSentAt` timestamp

---

## 8. Send Email Invite (Batch)

Gửi email mời cho nhiều khách cùng lúc.

### Endpoint
```
POST /api/admin/events/:eventId/guests/send-invite-batch
```

### Request Body
```json
{
  "guestIds": ["uuid1", "uuid2", "uuid3"]
}
```

### Response
```json
{
  "success": true,
  "sent": 28,
  "failed": 2,
  "errors": [
    {
      "guestId": "uuid4",
      "email": "invalid@",
      "error": "Invalid email address"
    }
  ]
}
```

---

## 9. Get Email Template

Lấy template email hiện tại của sự kiện.

### Endpoint
```
GET /api/admin/events/:eventId/email-template
```

### Response
```json
{
  "subject": "Thư mời tham dự {{event_name}}",
  "body": "Kính gửi {{guest_name}},\n\nChúng tôi trân trọng kính mời..."
}
```

---

## 10. Update Email Template

Cập nhật template email cho sự kiện.

### Endpoint
```
PUT /api/admin/events/:eventId/email-template
```

### Request Body
```json
{
  "subject": "Thư mời tham dự {{event_name}}",
  "body": "Kính gửi {{guest_name}},\n\n..."
}
```

### Response
```json
{
  "success": true,
  "template": {
    "subject": "Thư mời tham dự {{event_name}}",
    "body": "Kính gửi {{guest_name}},\n\n...",
    "updatedAt": "2025-01-14T10:00:00Z"
  }
}
```

### Available Variables
- `{{guest_name}}` - Tên khách mời
- `{{event_name}}` - Tên sự kiện
- `{{event_date}}` - Ngày sự kiện
- `{{event_time}}` - Giờ sự kiện
- `{{event_location}}` - Địa điểm sự kiện
- `{{qr_link}}` - Link QR code
- `{{checkin_link}}` - Link check-in

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validation failed |
| 401 | Unauthorized - Missing or invalid auth token |
| 403 | Forbidden - No permission to access this event |
| 404 | Not Found - Event or guest not found |
| 409 | Conflict - Duplicate email/phone |
| 413 | Payload Too Large - File size exceeds limit |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

- Import: 5 requests per minute
- Email sending (single): 30 requests per minute
- Email sending (batch): 10 requests per minute
- Other endpoints: 100 requests per minute

---

## Database Schema

### guests table
```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  notes TEXT,

  -- Check-in tracking
  check_in_status VARCHAR(20) DEFAULT 'pending',
  checked_in_at TIMESTAMP,
  check_in_method VARCHAR(50),

  -- Email tracking
  email_status VARCHAR(20) DEFAULT 'not-sent',
  last_email_sent_at TIMESTAMP,
  email_open_count INTEGER DEFAULT 0,

  -- QR code
  qr_code_data VARCHAR(500),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT email_or_phone_required CHECK (
    email IS NOT NULL OR phone IS NOT NULL
  ),
  CONSTRAINT unique_email_per_event UNIQUE (event_id, email),
  CONSTRAINT unique_phone_per_event UNIQUE (event_id, phone)
);

CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_guests_check_in_status ON guests(check_in_status);
CREATE INDEX idx_guests_email_status ON guests(email_status);
```

### email_templates table
```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_template_per_event UNIQUE (event_id)
);
```

### email_logs table
```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  email_to VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP
);

CREATE INDEX idx_email_logs_guest_id ON email_logs(guest_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
```

---

## Implementation Notes

1. **Import Processing**:
   - Process file in chunks of 100 rows
   - Use background job for large imports (>500 rows)
   - Generate error log file for failed rows
   - Send notification email when import completes

2. **Email Sending**:
   - Use queue system for batch emails
   - Implement retry logic (max 3 attempts)
   - Track open/click rates via tracking pixels
   - Respect unsubscribe preferences

3. **Performance**:
   - Cache email templates in Redis
   - Use database indexes for filtering
   - Implement pagination for large guest lists
   - Optimize Excel export with streaming

4. **Security**:
   - Validate all file uploads (type, size, content)
   - Sanitize email templates to prevent XSS
   - Rate limit email sending to prevent abuse
   - Log all guest modifications for audit trail
