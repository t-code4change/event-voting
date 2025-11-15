# 📊 Phân tích Admin System - Bright4Event

**Ngày tạo:** 2025-01-14
**Phiên bản:** 1.0
**Trạng thái:** Analysis Complete

---

## 🎯 Tổng quan

Tài liệu này phân tích toàn bộ hệ thống Admin của Bright4Event, bao gồm:
- Tính năng hiện tại
- Database schema
- Các chức năng cần bổ sung
- Plan implementation cho CRUD operations

---

## 📁 I. CẤU TRÚC ADMIN HIỆN TẠI

### 1.1. Admin Pages (17 modules)

| # | Module | Path | Status | Database Table | CRUD API |
|---|--------|------|--------|----------------|----------|
| 1 | **Dashboard** | `/admin/dashboard` | ✅ UI Done | - | ❌ Stats API only |
| 2 | **Events** | `/admin/events` | ✅ UI Done | `events` | ✅ GET only |
| 3 | **Categories** | `/admin/categories` | 🟡 Empty State | `categories` | ❌ Missing |
| 4 | **Candidates** | `/admin/candidates` | ✅ UI Done | `candidates` | ✅ GET only |
| 5 | **Voting** | `/admin/voting` | ✅ UI Done | - | ❌ Settings only |
| 6 | **Results** | `/admin/results` | ✅ UI Done | `votes` | ✅ GET only |
| 7 | **Analytics** | `/admin/analytics` | ✅ UI Done | - | ❌ Mock data |
| 8 | **Waiting Screen** | `/admin/waiting-screen` | ✅ UI Done | - | ❌ Missing table |
| 9 | **Welcome LED** | `/admin/welcome-led` | ✅ UI Done | - | ❌ Missing table |
| 10 | **Result LED** | `/admin/result-led` | ✅ UI Done | - | ❌ Missing table |
| 11 | **Mini Game** | `/admin/mini-game` | ✅ UI Done | - | ❌ Missing table |
| 12 | **Guests** | `/admin/guests` | ✅ UI Done | - | ❌ Missing table |
| 13 | **Check-in** | `/admin/check-in` | ✅ UI Done | - | ❌ Missing table |
| 14 | **Settings** | `/admin/settings` | ✅ UI Done | - | ✅ GET/POST |
| 15 | **Packages** | `/admin/packages` | 🟡 Empty State | `packages` | ❌ Missing |
| 16 | **Subscriptions** | `/admin/subscriptions-list` | 🟡 Empty State | `subscriptions` | ❌ Missing |
| 17 | **Invoices** | `/admin/invoices-list` | 🟡 Empty State | `invoices` | ❌ Missing |

**Tổng kết:**
- ✅ UI hoàn thành: 14/17 modules
- 🟡 Empty state: 3/17 modules
- ❌ Thiếu CRUD API: **13/17 modules**

---

## 🗄️ II. DATABASE SCHEMA HIỆN TẠI

### 2.1. Core Voting Tables (Đã có)

#### `events` ✅
```typescript
{
  id: UUID
  name: TEXT
  description: TEXT | null
  start_time: TIMESTAMP
  end_time: TIMESTAMP
  voting_close_time: TIMESTAMP
  is_active: BOOLEAN
  auth_settings: JSON  // { require_email, require_phone, require_otp }
  max_votes_per_voter: INTEGER
  allow_edit_before_deadline: BOOLEAN
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### `categories` ✅
```typescript
{
  id: UUID
  event_id: UUID -> events(id)
  name: TEXT
  description: TEXT | null
  order: INTEGER
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### `candidates` ✅
```typescript
{
  id: UUID
  category_id: UUID -> categories(id)
  name: TEXT
  photo_url: TEXT | null
  description: TEXT | null
  order: INTEGER
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### `voters` ✅
```typescript
{
  id: UUID
  email: TEXT | null
  phone: TEXT | null
  verified_at: TIMESTAMP | null
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### `votes` ✅
```typescript
{
  id: UUID
  voter_id: UUID -> voters(id)
  event_id: UUID -> events(id)  // Added in migration
  category_id: UUID -> categories(id)
  candidate_id: UUID -> candidates(id)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### `otp_verifications` ✅
```typescript
{
  id: UUID
  email: TEXT
  otp_code: TEXT
  expires_at: TIMESTAMP
  verified: BOOLEAN
  created_at: TIMESTAMP
}
```

---

### 2.2. Subscription/Billing Tables (Đã có)

#### `users` ✅
```typescript
{
  id: UUID -> auth.users(id)
  email: TEXT UNIQUE
  full_name: TEXT
  phone: TEXT
  company_name: TEXT
  role: TEXT  // 'user' | 'admin' | 'super_admin'
  avatar_url: TEXT
  is_active: BOOLEAN
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### `packages` ✅
```typescript
{
  id: UUID
  name: TEXT UNIQUE
  slug: TEXT UNIQUE
  description: TEXT
  price: DECIMAL(12,2)
  currency: TEXT  // Default: 'VND'
  billing_period: TEXT  // 'one_time' | 'monthly' | 'yearly'

  // Limits
  max_events: INTEGER | null  // null = unlimited
  max_participants_per_event: INTEGER
  max_categories_per_event: INTEGER
  max_candidates_per_category: INTEGER

  // Features JSON
  features: JSONB  // { custom_branding, led_display, qr_checkin, ... }

  is_active: BOOLEAN
  is_popular: BOOLEAN
  is_highlighted: BOOLEAN
  display_order: INTEGER
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### `subscriptions` ✅
```typescript
{
  id: UUID
  user_id: UUID -> users(id)
  package_id: UUID -> packages(id)
  status: TEXT  // 'pending' | 'active' | 'expired' | 'cancelled'

  amount_paid: DECIMAL(12,2)
  currency: TEXT

  start_date: TIMESTAMP
  end_date: TIMESTAMP | null

  events_used: INTEGER
  events_limit: INTEGER | null

  requires_invoice: BOOLEAN
  invoice_id: UUID
  notes: TEXT
  metadata: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### `invoices` ✅
```typescript
{
  id: UUID
  subscription_id: UUID -> subscriptions(id)
  user_id: UUID -> users(id)

  invoice_number: TEXT UNIQUE  // Auto-generated
  invoice_date: DATE
  due_date: DATE

  // Company info
  company_name: TEXT
  company_tax_code: TEXT
  company_address: TEXT
  company_email: TEXT
  company_phone: TEXT

  // Billing items JSON
  items: JSONB

  subtotal: DECIMAL(12,2)
  vat_rate: DECIMAL(5,2)  // Default: 10.00
  vat_amount: DECIMAL(12,2)
  total_amount: DECIMAL(12,2)
  currency: TEXT

  payment_status: TEXT  // 'unpaid' | 'paid' | 'overdue' | 'cancelled'
  payment_method: TEXT
  payment_date: TIMESTAMP
  payment_reference: TEXT
  pdf_url: TEXT

  notes: TEXT
  metadata: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### `transactions` ✅
```typescript
{
  id: UUID
  user_id: UUID -> users(id)
  subscription_id: UUID -> subscriptions(id)
  invoice_id: UUID -> invoices(id)

  transaction_type: TEXT  // 'payment' | 'refund' | 'adjustment'
  amount: DECIMAL(12,2)
  currency: TEXT

  payment_method: TEXT
  payment_gateway: TEXT
  payment_gateway_transaction_id: TEXT
  status: TEXT  // 'pending' | 'completed' | 'failed' | 'refunded'

  description: TEXT
  metadata: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### `subscription_history` ✅ (Audit log)
```typescript
{
  id: UUID
  subscription_id: UUID -> subscriptions(id)
  user_id: UUID -> users(id)
  action: TEXT  // 'created' | 'activated' | 'renewed' | 'upgraded' | 'downgraded' | 'cancelled' | 'expired'
  old_package_id: UUID
  new_package_id: UUID
  old_status: TEXT
  new_status: TEXT
  description: TEXT
  metadata: JSONB
  created_at: TIMESTAMP
}
```

---

## ❌ III. TABLES CẦN TẠO MỚI

### 3.1. `waiting_screen_configs`
**Mục đích:** Quản lý slideshow và quotes cho Waiting Screen

```sql
CREATE TABLE waiting_screen_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Slideshow settings
  slides JSONB DEFAULT '[]'::jsonb,
  /* Example:
  [
    {
      "id": "uuid",
      "url": "https://...",
      "type": "image|video",
      "order": 1
    }
  ]
  */

  slide_duration INTEGER DEFAULT 5,  -- seconds per slide
  is_playing BOOLEAN DEFAULT true,

  -- Quote settings
  current_quote TEXT,
  quote_list JSONB DEFAULT '[]'::jsonb,  -- Array of quotes

  -- Display settings
  show_event_logo BOOLEAN DEFAULT true,
  event_logo_url TEXT,
  background_color TEXT DEFAULT '#000000',

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT one_config_per_event UNIQUE(event_id)
);

CREATE INDEX idx_waiting_screen_event_id ON waiting_screen_configs(event_id);
```

---

### 3.2. `welcome_led_configs`
**Mục đích:** Quản lý màn hình LED chào mừng

```sql
CREATE TABLE welcome_led_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Welcome message
  welcome_message TEXT DEFAULT 'Chào mừng đến với sự kiện!',
  sub_message TEXT,

  -- Animation settings
  animation_type TEXT DEFAULT 'fade',  -- 'fade' | 'slide' | 'zoom' | 'confetti'
  animation_speed TEXT DEFAULT 'medium',  -- 'slow' | 'medium' | 'fast'

  -- Color & Theme
  background_type TEXT DEFAULT 'gradient',  -- 'solid' | 'gradient' | 'image'
  background_color TEXT DEFAULT '#0C0F15',
  gradient_colors JSONB DEFAULT '["#0C0F15", "#161A23"]'::jsonb,
  background_image_url TEXT,

  text_color TEXT DEFAULT '#FFD700',
  logo_url TEXT,
  logo_position TEXT DEFAULT 'top',  -- 'top' | 'bottom' | 'left' | 'right' | 'center'

  -- Auto display
  auto_show BOOLEAN DEFAULT true,
  show_duration INTEGER DEFAULT 10,  -- seconds

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT one_config_per_event UNIQUE(event_id)
);

CREATE INDEX idx_welcome_led_event_id ON welcome_led_configs(event_id);
```

---

### 3.3. `result_led_configs`
**Mục đích:** Quản lý màn hình LED hiển thị kết quả

```sql
CREATE TABLE result_led_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Display settings
  display_mode TEXT DEFAULT 'live',  -- 'live' | 'final' | 'top3' | 'all'
  refresh_interval INTEGER DEFAULT 5,  -- seconds for live mode
  show_vote_count BOOLEAN DEFAULT true,
  show_percentage BOOLEAN DEFAULT true,
  show_photos BOOLEAN DEFAULT true,

  -- Visual effects
  enable_confetti BOOLEAN DEFAULT true,
  enable_award_animation BOOLEAN DEFAULT true,
  enable_sound_effects BOOLEAN DEFAULT false,

  -- Theme
  theme TEXT DEFAULT 'gold',  -- 'gold' | 'silver' | 'bronze' | 'rainbow'
  background_image_url TEXT,

  -- Categories to display (null = all)
  selected_categories JSONB,  -- ["cat1_id", "cat2_id"]

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT one_config_per_event UNIQUE(event_id)
);

CREATE INDEX idx_result_led_event_id ON result_led_configs(event_id);
```

---

### 3.4. `mini_games`
**Mục đích:** Quản lý mini games trong event

```sql
CREATE TABLE mini_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  game_type TEXT NOT NULL,  -- 'lucky_wheel' | 'quiz' | 'lucky_number' | 'memory' | 'custom'

  -- Game config JSON
  config JSONB DEFAULT '{}'::jsonb,
  /* Example for lucky_wheel:
  {
    "prizes": [
      { "id": "1", "name": "iPhone 15", "probability": 0.01, "color": "#FFD700" },
      { "id": "2", "name": "AirPods", "probability": 0.05, "color": "#FFC107" }
    ],
    "spin_duration": 5,
    "sound_enabled": true
  }
  */

  -- Winners tracking
  winners JSONB DEFAULT '[]'::jsonb,
  /* Example:
  [
    {
      "guest_id": "uuid",
      "guest_name": "Nguyễn Văn A",
      "prize_id": "1",
      "prize_name": "iPhone 15",
      "won_at": "2025-01-14T10:30:00Z"
    }
  ]
  */

  -- Game status
  is_active BOOLEAN DEFAULT false,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,  -- null = unlimited
  participants_count INTEGER DEFAULT 0,

  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mini_games_event_id ON mini_games(event_id);
CREATE INDEX idx_mini_games_is_active ON mini_games(is_active);
```

---

### 3.5. `guests`
**Mục đích:** Quản lý danh sách khách mời

```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Basic info
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,

  -- Categorization
  guest_type TEXT DEFAULT 'standard',  -- 'vip' | 'speaker' | 'sponsor' | 'staff' | 'standard'
  table_number TEXT,
  seat_number TEXT,

  -- Check-in status
  check_in_status TEXT DEFAULT 'pending',  -- 'pending' | 'checked_in' | 'cancelled' | 'no_show'
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_in_method TEXT,  -- 'qr' | 'manual' | 'self'

  -- Additional data
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,

  -- QR code
  qr_code_data TEXT UNIQUE,  -- Generated UUID for QR

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_guests_qr_code ON guests(qr_code_data);
CREATE INDEX idx_guests_check_in_status ON guests(check_in_status);
```

---

### 3.6. `check_in_configs`
**Mục đích:** Cấu hình form check-in

```sql
CREATE TABLE check_in_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Form fields configuration
  form_fields JSONB DEFAULT '{
    "full_name": { "enabled": true, "required": true, "order": 1 },
    "email": { "enabled": true, "required": false, "order": 2 },
    "phone": { "enabled": true, "required": false, "order": 3 },
    "company": { "enabled": false, "required": false, "order": 4 },
    "job_title": { "enabled": false, "required": false, "order": 5 }
  }'::jsonb,

  -- Check-in method
  enable_qr_check_in BOOLEAN DEFAULT true,
  enable_manual_check_in BOOLEAN DEFAULT true,
  enable_self_check_in BOOLEAN DEFAULT false,

  -- QR settings
  qr_url_template TEXT DEFAULT 'https://bright4event.com/event/{event_id}/check-in/{qr_code}',

  -- Success message
  success_message TEXT DEFAULT 'Check-in thành công! Chúc bạn có trải nghiệm tuyệt vời!',
  success_redirect_url TEXT,

  -- LED display
  show_on_led BOOLEAN DEFAULT true,
  led_display_duration INTEGER DEFAULT 5,  -- seconds

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT one_config_per_event UNIQUE(event_id)
);

CREATE INDEX idx_check_in_configs_event_id ON check_in_configs(event_id);
```

---

### 3.7. `event_settings` (Tổng hợp settings)
**Mục đích:** Lưu trữ settings tổng quát cho event

```sql
CREATE TABLE event_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Voting settings
  voting_settings JSONB DEFAULT '{
    "allow_multiple_votes": false,
    "require_email_verification": true,
    "require_phone_verification": true,
    "show_realtime_results": true,
    "enable_confetti": true,
    "enable_award_mode": false
  }'::jsonb,

  -- Display settings
  display_settings JSONB DEFAULT '{
    "theme": "gold",
    "primary_color": "#FFD700",
    "secondary_color": "#FFC107",
    "background_color": "#0C0F15",
    "custom_logo_url": null,
    "custom_css": null
  }'::jsonb,

  -- Email settings
  email_settings JSONB DEFAULT '{
    "enable_welcome_email": false,
    "enable_vote_confirmation": false,
    "enable_result_notification": false,
    "from_name": "Bright4Event",
    "from_email": "noreply@bright4event.com"
  }'::jsonb,

  -- Analytics settings
  analytics_settings JSONB DEFAULT '{
    "enable_google_analytics": false,
    "enable_facebook_pixel": false,
    "google_analytics_id": null,
    "facebook_pixel_id": null
  }'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT one_settings_per_event UNIQUE(event_id)
);

CREATE INDEX idx_event_settings_event_id ON event_settings(event_id);
```

---

## 🔧 IV. API ENDPOINTS CẦN IMPLEMENT

### 4.1. Events CRUD ✅ (Partial - cần bổ sung)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/events` | Get all events | ✅ Done |
| GET | `/api/admin/events/:id` | Get event by ID | ❌ Missing |
| POST | `/api/admin/events` | Create new event | ❌ Missing |
| PUT | `/api/admin/events/:id` | Update event | ❌ Missing |
| DELETE | `/api/admin/events/:id` | Delete event | ❌ Missing |
| PATCH | `/api/admin/events/:id/toggle` | Toggle active status | ❌ Missing |

---

### 4.2. Categories CRUD ❌ (Hoàn toàn thiếu)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/categories` | Get all categories | ❌ Missing |
| GET | `/api/admin/categories/:id` | Get category by ID | ❌ Missing |
| GET | `/api/admin/events/:eventId/categories` | Get categories by event | ❌ Missing |
| POST | `/api/admin/categories` | Create category | ❌ Missing |
| PUT | `/api/admin/categories/:id` | Update category | ❌ Missing |
| DELETE | `/api/admin/categories/:id` | Delete category | ❌ Missing |
| PATCH | `/api/admin/categories/:id/reorder` | Reorder categories | ❌ Missing |

---

### 4.3. Candidates CRUD ✅ (Partial)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/candidates` | Get all candidates grouped | ✅ Done |
| GET | `/api/admin/candidates/:id` | Get candidate by ID | ❌ Missing |
| GET | `/api/admin/categories/:categoryId/candidates` | Get candidates by category | ❌ Missing |
| POST | `/api/admin/candidates` | Create candidate | ❌ Missing |
| PUT | `/api/admin/candidates/:id` | Update candidate | ❌ Missing |
| DELETE | `/api/admin/candidates/:id` | Delete candidate | ❌ Missing |
| PATCH | `/api/admin/candidates/:id/reorder` | Reorder candidates | ❌ Missing |
| POST | `/api/admin/candidates/upload-photo` | Upload candidate photo | ❌ Missing |

---

### 4.4. Waiting Screen API ❌

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/waiting-screen/:eventId` | Get config | ❌ Missing |
| PUT | `/api/admin/waiting-screen/:eventId` | Update config | ❌ Missing |
| POST | `/api/admin/waiting-screen/upload-slide` | Upload slide image | ❌ Missing |
| DELETE | `/api/admin/waiting-screen/slides/:slideId` | Delete slide | ❌ Missing |

---

### 4.5. Welcome LED API ❌

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/welcome-led/:eventId` | Get config | ❌ Missing |
| PUT | `/api/admin/welcome-led/:eventId` | Update config | ❌ Missing |
| POST | `/api/admin/welcome-led/trigger` | Manually trigger welcome screen | ❌ Missing |

---

### 4.6. Result LED API ❌

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/result-led/:eventId` | Get config | ❌ Missing |
| PUT | `/api/admin/result-led/:eventId` | Update config | ❌ Missing |
| GET | `/api/admin/result-led/:eventId/preview` | Preview results | ❌ Missing |

---

### 4.7. Mini Games API ❌

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/mini-games/:eventId` | Get all games for event | ❌ Missing |
| GET | `/api/admin/mini-games/:id` | Get game by ID | ❌ Missing |
| POST | `/api/admin/mini-games` | Create game | ❌ Missing |
| PUT | `/api/admin/mini-games/:id` | Update game | ❌ Missing |
| DELETE | `/api/admin/mini-games/:id` | Delete game | ❌ Missing |
| POST | `/api/admin/mini-games/:id/spin` | Spin lucky wheel | ❌ Missing |
| GET | `/api/admin/mini-games/:id/winners` | Get winners list | ❌ Missing |

---

### 4.8. Guests API ❌

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/guests/:eventId` | Get all guests | ❌ Missing |
| GET | `/api/admin/guests/:id` | Get guest by ID | ❌ Missing |
| POST | `/api/admin/guests` | Create guest | ❌ Missing |
| PUT | `/api/admin/guests/:id` | Update guest | ❌ Missing |
| DELETE | `/api/admin/guests/:id` | Delete guest | ❌ Missing |
| POST | `/api/admin/guests/import` | Import from Excel | ❌ Missing |
| GET | `/api/admin/guests/:eventId/export` | Export to Excel | ❌ Missing |
| GET | `/api/admin/guests/:eventId/stats` | Get check-in stats | ❌ Missing |

---

### 4.9. Check-in API ❌

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/check-in/:eventId/config` | Get config | ❌ Missing |
| PUT | `/api/admin/check-in/:eventId/config` | Update config | ❌ Missing |
| POST | `/api/admin/check-in/manual` | Manual check-in | ❌ Missing |
| GET | `/api/admin/check-in/:eventId/recent` | Get recent check-ins | ❌ Missing |

---

### 4.10. Packages API ❌

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/packages` | Get all packages | ❌ Missing |
| GET | `/api/admin/packages/:id` | Get package by ID | ❌ Missing |
| POST | `/api/admin/packages` | Create package | ❌ Missing |
| PUT | `/api/admin/packages/:id` | Update package | ❌ Missing |
| DELETE | `/api/admin/packages/:id` | Delete package | ❌ Missing |
| PATCH | `/api/admin/packages/:id/toggle` | Toggle active status | ❌ Missing |

---

### 4.11. Subscriptions API ❌

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/subscriptions` | Get all subscriptions | ❌ Missing |
| GET | `/api/admin/subscriptions/:id` | Get subscription by ID | ❌ Missing |
| POST | `/api/admin/subscriptions` | Create subscription | ❌ Missing |
| PUT | `/api/admin/subscriptions/:id` | Update subscription | ❌ Missing |
| PATCH | `/api/admin/subscriptions/:id/status` | Change status | ❌ Missing |
| GET | `/api/admin/subscriptions/stats` | Get stats | ❌ Missing |

---

### 4.12. Invoices API ❌

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/invoices` | Get all invoices | ❌ Missing |
| GET | `/api/admin/invoices/:id` | Get invoice by ID | ❌ Missing |
| POST | `/api/admin/invoices` | Create invoice | ❌ Missing |
| PUT | `/api/admin/invoices/:id` | Update invoice | ❌ Missing |
| POST | `/api/admin/invoices/:id/generate-pdf` | Generate PDF | ❌ Missing |
| PATCH | `/api/admin/invoices/:id/payment` | Mark as paid | ❌ Missing |

---

## 📊 V. PRIORITY MATRIX

### Phase 1: Core Voting Features (HIGH PRIORITY) 🔴

**Timeline:** Week 1-2

1. **Events CRUD** ⭐⭐⭐⭐⭐
   - POST /api/admin/events
   - PUT /api/admin/events/:id
   - DELETE /api/admin/events/:id
   - GET /api/admin/events/:id

2. **Categories CRUD** ⭐⭐⭐⭐⭐
   - Full CRUD implementation
   - Reorder functionality

3. **Candidates CRUD** ⭐⭐⭐⭐⭐
   - Full CRUD implementation
   - Photo upload
   - Reorder functionality

4. **Guests & Check-in** ⭐⭐⭐⭐
   - Create `guests` table
   - Create `check_in_configs` table
   - Import/Export Excel
   - QR code generation

---

### Phase 2: Display & LED Features (MEDIUM PRIORITY) 🟡

**Timeline:** Week 3-4

5. **Waiting Screen** ⭐⭐⭐
   - Create `waiting_screen_configs` table
   - Upload/manage slides
   - Quotes management

6. **Result LED** ⭐⭐⭐
   - Create `result_led_configs` table
   - Real-time results display
   - Animation settings

7. **Welcome LED** ⭐⭐
   - Create `welcome_led_configs` table
   - Message & animation settings

---

### Phase 3: Mini Games (LOW PRIORITY) 🟢

**Timeline:** Week 5

8. **Mini Games** ⭐⭐
   - Create `mini_games` table
   - Lucky wheel implementation
   - Winners tracking

---

### Phase 4: Subscription & Billing (LOW PRIORITY) 🟢

**Timeline:** Week 6

9. **Packages Management** ⭐⭐
   - Full CRUD for packages

10. **Subscriptions** ⭐⭐
    - Full CRUD for subscriptions
    - Status management

11. **Invoices** ⭐
    - Full CRUD for invoices
    - PDF generation

---

## 🎯 VI. IMPLEMENTATION CHECKLIST

### ✅ Step 1: Database Migrations

```bash
# Create new migration file
supabase migration new admin_feature_tables

# Apply migrations
npm run supabase:migrate
```

**Tables to create:**
- [ ] `waiting_screen_configs`
- [ ] `welcome_led_configs`
- [ ] `result_led_configs`
- [ ] `mini_games`
- [ ] `guests`
- [ ] `check_in_configs`
- [ ] `event_settings`

---

### ✅ Step 2: Type Definitions

Update `types/database.types.ts` with new tables

---

### ✅ Step 3: API Routes Implementation

Create API routes theo thứ tự priority:

**Phase 1 (Week 1-2):**
- [ ] `/api/admin/events` (POST, PUT, DELETE, GET by ID)
- [ ] `/api/admin/categories` (Full CRUD)
- [ ] `/api/admin/candidates` (Full CRUD + upload)
- [ ] `/api/admin/guests` (Full CRUD + import/export)
- [ ] `/api/admin/check-in` (Config + manual check-in)

**Phase 2 (Week 3-4):**
- [ ] `/api/admin/waiting-screen` (Config + upload)
- [ ] `/api/admin/result-led` (Config + preview)
- [ ] `/api/admin/welcome-led` (Config + trigger)

**Phase 3 (Week 5):**
- [ ] `/api/admin/mini-games` (Full CRUD + spin)

**Phase 4 (Week 6):**
- [ ] `/api/admin/packages` (Full CRUD)
- [ ] `/api/admin/subscriptions` (Full CRUD)
- [ ] `/api/admin/invoices` (Full CRUD + PDF)

---

### ✅ Step 4: Frontend Integration

Update admin pages to use real APIs instead of mock data:

- [ ] Events page - use real CRUD
- [ ] Categories page - implement full CRUD
- [ ] Candidates page - implement full CRUD
- [ ] Waiting screen - connect to API
- [ ] Welcome LED - connect to API
- [ ] Result LED - connect to API
- [ ] Mini games - connect to API
- [ ] Guests - connect to API + Excel import/export
- [ ] Check-in - connect to API + QR generation
- [ ] Packages - implement CRUD UI
- [ ] Subscriptions - implement CRUD UI
- [ ] Invoices - implement CRUD UI + PDF viewer

---

## 🔐 VII. SECURITY & PERMISSIONS

### RLS Policies cần thêm:

```sql
-- Guests table
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view guests for their events"
ON guests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN subscriptions s ON s.user_id = auth.uid()
    WHERE e.id = guests.event_id
    AND s.status = 'active'
  )
);

-- Similar policies for all new tables
```

---

## 📈 VIII. ANALYTICS & MONITORING

### Metrics cần track:

1. **Voting Metrics**
   - Total votes per event
   - Votes per category
   - Votes per candidate
   - Peak voting times
   - Device breakdown (mobile vs desktop)

2. **Check-in Metrics**
   - Check-in rate
   - Average check-in time
   - Check-in method breakdown (QR vs manual)

3. **Engagement Metrics**
   - Active events
   - Active users
   - Subscription conversion rate

---

## 🚀 IX. NEXT STEPS

### Immediate Actions:

1. **Create migration file** với tất cả tables mới
2. **Generate types** từ Supabase schema
3. **Implement Phase 1 APIs** (Events, Categories, Candidates, Guests)
4. **Update frontend** để sử dụng real APIs
5. **Testing & QA**

---

## 📝 X. NOTES

- Tất cả tables đều có `created_at` và `updated_at` triggers
- Sử dụng JSONB cho flexible configs
- RLS policies đảm bảo multi-tenancy security
- Consider adding caching layer (Redis) cho real-time features
- PDF generation sẽ dùng library như `@react-pdf/renderer` hoặc `pdfkit`

---

**END OF DOCUMENT**
