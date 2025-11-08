# 📦 Subscription & Billing System Documentation

## 🎯 Overview

Hệ thống quản lý gói dịch vụ (subscription), thanh toán và xuất hóa đơn VAT cho GalaVote.

---

## 📊 Database Schema

### **Core Tables**

#### **1. users** - Quản lý người dùng
```sql
- id: UUID (FK to auth.users)
- email: TEXT (unique)
- full_name: TEXT
- role: 'user' | 'admin' | 'super_admin'
- company_name: TEXT
- phone: TEXT
- is_active: BOOLEAN
```

**Roles:**
- `user`: Người dùng thường, chỉ quản lý subscription của mình
- `admin`: Admin, quản lý packages, xem all subscriptions/invoices
- `super_admin`: Full access, quản lý users, system settings

---

#### **2. packages** - Các gói dịch vụ
```sql
- id: UUID
- name: TEXT (Basic, Pro, Enterprise)
- slug: TEXT (unique)
- price: DECIMAL
- billing_period: 'one_time' | 'monthly' | 'yearly'
- max_events: INTEGER (NULL = unlimited)
- max_participants_per_event: INTEGER
- features: JSONB
- is_active: BOOLEAN
- is_popular: BOOLEAN (show "Popular" badge)
- is_highlighted: BOOLEAN (highlight in pricing page)
```

**Features JSON Structure:**
```json
{
  "custom_branding": true,
  "led_display": true,
  "qr_checkin": true,
  "advanced_analytics": true,
  "priority_support": true,
  "api_access": false,
  "white_label": false,
  "sso": false,
  "dedicated_manager": false
}
```

---

#### **3. subscriptions** - Subscription của user
```sql
- id: UUID
- user_id: UUID (FK to users)
- package_id: UUID (FK to packages)
- status: 'pending' | 'active' | 'expired' | 'cancelled'
- amount_paid: DECIMAL
- start_date: TIMESTAMP
- end_date: TIMESTAMP (NULL = lifetime)
- events_used: INTEGER
- events_limit: INTEGER (copied from package)
- requires_invoice: BOOLEAN
- invoice_id: UUID
```

**Status Flow:**
```
pending → active → expired
         ↓
      cancelled
```

---

#### **4. invoices** - Hóa đơn VAT
```sql
- id: UUID
- subscription_id: UUID
- user_id: UUID
- invoice_number: TEXT (auto: INV-2025-0001)
- invoice_date: DATE
- company_name: TEXT
- company_tax_code: TEXT (Mã số thuế)
- company_address: TEXT
- items: JSONB (line items)
- subtotal: DECIMAL
- vat_rate: DECIMAL (10%)
- vat_amount: DECIMAL
- total_amount: DECIMAL
- payment_status: 'unpaid' | 'paid' | 'overdue'
- pdf_url: TEXT
```

**Items JSON Structure:**
```json
[
  {
    "description": "Gói Pro - 1 sự kiện",
    "quantity": 1,
    "unit_price": 5000000,
    "total": 5000000
  }
]
```

---

#### **5. transactions** - Lịch sử giao dịch
```sql
- id: UUID
- user_id: UUID
- subscription_id: UUID
- transaction_type: 'payment' | 'refund'
- amount: DECIMAL
- payment_method: TEXT
- payment_gateway: TEXT (vnpay, momo, etc.)
- status: 'pending' | 'completed' | 'failed'
```

---

#### **6. subscription_history** - Audit log
```sql
- id: UUID
- subscription_id: UUID
- action: 'created' | 'activated' | 'upgraded' | 'cancelled'
- old_package_id: UUID
- new_package_id: UUID
- description: TEXT
```

---

## 🔐 Row Level Security (RLS)

### **Users**
- ✅ Users can view/edit own profile
- ✅ Admins can view all users

### **Packages**
- ✅ Public can view active packages
- ✅ Admins can CRUD packages

### **Subscriptions**
- ✅ Users can view own subscriptions
- ✅ Users can create subscriptions
- ✅ Admins can view/manage all subscriptions

### **Invoices**
- ✅ Users can view own invoices
- ✅ Admins can view/manage all invoices

---

## 🛠️ Helper Functions

### **1. `generate_invoice_number()`**
Auto-generate invoice number: `INV-2025-0001`

```sql
SELECT generate_invoice_number();
-- Returns: 'INV-2025-0001'
```

### **2. `can_user_create_event(user_uuid)`**
Check if user can create event based on subscription limits

```sql
SELECT can_user_create_event('user-uuid-here');
-- Returns: true/false
```

### **3. `get_active_subscription(user_uuid)`**
Get user's current active subscription

```sql
SELECT * FROM get_active_subscription('user-uuid-here');
```

### **4. `expire_subscriptions()`**
Mark expired subscriptions (run daily via cron)

```sql
SELECT expire_subscriptions();
-- Returns: number of expired subscriptions
```

---

## 🚀 User Flow

### **Flow 1: Mua gói (Không cần hóa đơn)**
```
1. User chọn gói → Click "Chọn gói Pro"
2. Popup hiển thị: "Bạn có cần hóa đơn VAT?"
3. User chọn: "Không"
4. System tạo subscription (status: pending)
5. Redirect to payment gateway
6. Payment success → Update subscription (status: active)
7. User nhận email xác nhận
```

### **Flow 2: Mua gói (Có hóa đơn)**
```
1. User chọn gói → Click "Chọn gói Pro"
2. Popup hiển thị: "Bạn có cần hóa đơn VAT?"
3. User chọn: "Có" → Hiển thị form:
   - Tên công ty
   - Mã số thuế
   - Địa chỉ
   - Email (optional)
   - Số điện thoại (optional)
4. Submit form → Tạo subscription + invoice
5. Payment → Update invoice (payment_status: paid)
6. System generate PDF invoice
7. User download invoice từ dashboard
```

---

## 📱 Admin Features

### **1. Package Management** (`/admin/packages`)
```
Features:
- ✅ View all packages
- ✅ Create new package
- ✅ Edit package (name, price, features, limits)
- ✅ Activate/deactivate package
- ✅ Set popular/highlighted badges
- ✅ Reorder packages
```

### **2. Subscription Management** (`/admin/subscriptions`)
```
Features:
- ✅ View all subscriptions (filter by status)
- ✅ Search by user email/name
- ✅ View subscription details
- ✅ Manually activate/cancel subscription
- ✅ Extend subscription end date
- ✅ View subscription history
- ✅ Export to Excel
```

### **3. Invoice Management** (`/admin/invoices`)
```
Features:
- ✅ View all invoices
- ✅ Search by invoice number/company
- ✅ Filter by payment status
- ✅ Mark as paid/unpaid
- ✅ Regenerate invoice PDF
- ✅ Send invoice via email
- ✅ Export invoice list
```

### **4. Transaction History** (`/admin/transactions`)
```
Features:
- ✅ View all transactions
- ✅ Filter by status/payment method
- ✅ Search by transaction ID
- ✅ View transaction details
- ✅ Manual refund
- ✅ Export to Excel
```

### **5. Analytics Dashboard** (`/admin/analytics`)
```
Metrics:
- 📊 Total revenue (by package, by month)
- 📈 Active subscriptions count
- 👥 Total users count
- 💰 Revenue chart (line graph)
- 📦 Subscriptions by package (pie chart)
- 🔔 Expiring subscriptions alert
```

---

## 👤 User Features

### **1. My Subscription** (`/dashboard/subscription`)
```
Display:
- Current package name
- Status badge (Active/Expired)
- Start date, end date
- Events used / Events limit
- Features list
- Price paid
- Renewal date (if recurring)

Actions:
- Upgrade package
- Renew subscription
- Cancel subscription
- Download invoice (if exists)
```

### **2. Subscription History** (`/dashboard/subscription-history`)
```
Display:
- Table of all past subscriptions
- Columns: Date, Package, Amount, Status, Invoice
- Timeline view of upgrades/downgrades
```

### **3. Invoices** (`/dashboard/invoices`)
```
Display:
- List of all invoices
- Columns: Invoice #, Date, Amount, Status
- Download PDF button
- Payment proof upload
```

---

## 🔧 API Endpoints

### **Packages**
```
GET    /api/packages           - Get all active packages
GET    /api/packages/:id       - Get package details
POST   /api/packages           - Create package (admin)
PUT    /api/packages/:id       - Update package (admin)
DELETE /api/packages/:id       - Delete package (admin)
```

### **Subscriptions**
```
GET    /api/subscriptions                    - Get user's subscriptions
POST   /api/subscriptions                    - Create subscription
GET    /api/subscriptions/:id                - Get subscription details
PUT    /api/subscriptions/:id/cancel         - Cancel subscription
GET    /api/subscriptions/active             - Get active subscription
POST   /api/subscriptions/:id/renew          - Renew subscription
GET    /api/admin/subscriptions              - Get all subscriptions (admin)
PUT    /api/admin/subscriptions/:id/status   - Update status (admin)
```

### **Invoices**
```
GET    /api/invoices                  - Get user's invoices
GET    /api/invoices/:id              - Get invoice details
GET    /api/invoices/:id/pdf          - Download PDF
POST   /api/invoices/:id/send-email   - Send invoice via email
GET    /api/admin/invoices            - Get all invoices (admin)
PUT    /api/admin/invoices/:id/status - Update payment status (admin)
```

### **Transactions**
```
GET    /api/transactions              - Get user's transactions
GET    /api/admin/transactions        - Get all transactions (admin)
```

---

## 💳 Payment Gateway Integration

### **Supported Gateways:**
1. **VNPay** - Vietnamese cards
2. **Momo** - E-wallet
3. **Bank Transfer** - Manual transfer
4. **Credit Card** - International cards (Stripe)

### **Payment Flow:**
```
1. Create subscription → Get payment URL
2. Redirect user to payment gateway
3. Gateway callback → Verify signature
4. Update subscription status
5. Create transaction record
6. Send confirmation email
```

---

## 📧 Email Notifications

### **User Emails:**
- ✅ Subscription created (payment instructions)
- ✅ Payment received
- ✅ Invoice generated (with PDF attachment)
- ✅ Subscription expiring (7 days before)
- ✅ Subscription expired
- ✅ Subscription cancelled

### **Admin Emails:**
- ✅ New subscription created
- ✅ Payment received
- ✅ Subscription expired (daily digest)

---

## 🎨 UI Components Needed

### **1. Pricing Page** (Đã có - cần update)
- ✅ Package cards with features
- ✅ Popular badge
- ➕ "Chọn gói" button → Open payment flow

### **2. Payment Flow Modal**
```jsx
<PaymentFlow
  selectedPlan={plan}
  onClose={() => setSelectedPlan(null)}
/>

Steps:
1. Confirm package
2. Invoice form (if needed)
3. Payment method selection
4. Payment instructions / Gateway redirect
```

### **3. Subscription Dashboard Card**
```jsx
<SubscriptionCard
  subscription={activeSubscription}
  onUpgrade={() => {}}
  onRenew={() => {}}
  onCancel={() => {}}
/>
```

### **4. Invoice Table**
```jsx
<InvoiceTable
  invoices={userInvoices}
  onDownload={(id) => {}}
  onSendEmail={(id) => {}}
/>
```

### **5. Admin Package Manager**
```jsx
<PackageManager
  packages={allPackages}
  onCreate={() => {}}
  onEdit={(pkg) => {}}
  onDelete={(id) => {}}
/>
```

---

## 🔒 Security Considerations

1. **RLS Enabled**: All tables have row-level security
2. **Admin Checks**: Middleware verifies admin role
3. **Payment Verification**: Verify gateway signatures
4. **Invoice Access**: Users can only see their own invoices
5. **Audit Logging**: All subscription changes logged
6. **Rate Limiting**: Prevent payment spam
7. **HTTPS Only**: All payment endpoints must use HTTPS

---

## 📈 Performance Optimization

1. **Indexes**: Added on all foreign keys and query columns
2. **Caching**: Cache active packages in Redis
3. **Pagination**: All list endpoints support pagination
4. **Lazy Loading**: Load invoice PDFs on demand
5. **Database Views**: Create views for common queries

---

## 🧪 Testing Checklist

### **User Flow:**
- [ ] User can view pricing page
- [ ] User can select package
- [ ] User can purchase without invoice
- [ ] User can purchase with invoice
- [ ] User receives confirmation email
- [ ] User can view active subscription
- [ ] User can download invoice
- [ ] User can upgrade package
- [ ] User can cancel subscription

### **Admin Flow:**
- [ ] Admin can create package
- [ ] Admin can edit package
- [ ] Admin can view all subscriptions
- [ ] Admin can manually activate subscription
- [ ] Admin can generate invoice
- [ ] Admin can view revenue stats
- [ ] Admin can export data

---

## 🚀 Deployment Steps

1. **Run Migration:**
   ```bash
   psql -U postgres -d event_voting < supabase-subscription-schema.sql
   ```

2. **Verify Tables:**
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

3. **Test RLS:**
   ```sql
   SET ROLE authenticated;
   SELECT * FROM subscriptions;  -- Should only return user's data
   ```

4. **Seed Data:**
   - Create sample packages
   - Create admin user
   - Test subscription flow

5. **Setup Cron Jobs:**
   ```sql
   -- Run daily at midnight
   SELECT cron.schedule('expire-subscriptions', '0 0 * * *', 'SELECT expire_subscriptions();');
   ```

---

## 📚 Next Steps

1. ✅ Database schema created
2. ✅ TypeScript types generated
3. ⏳ Create API endpoints
4. ⏳ Build payment flow UI
5. ⏳ Integrate payment gateway
6. ⏳ Create admin pages
7. ⏳ Generate invoice PDFs
8. ⏳ Setup email notifications
9. ⏳ Add analytics dashboard
10. ⏳ Write tests

---

## 💡 Business Rules

1. **One Active Subscription**: User can only have 1 active subscription at a time
2. **Event Limits**: System blocks event creation if limit reached
3. **Invoice Required**: Enterprise customers must provide tax info
4. **Refund Policy**: 7 days money-back guarantee
5. **Proration**: Upgrades prorated based on remaining days
6. **Grace Period**: 3 days after expiration before blocking access

---

## 🐛 Known Issues / TODO

- [ ] Add proration logic for upgrades
- [ ] Implement automatic renewal
- [ ] Add payment retry mechanism
- [ ] Create invoice PDF templates
- [ ] Add subscription pause feature
- [ ] Implement coupon/discount codes
- [ ] Add usage-based billing option
- [ ] Create white-label settings

---

## 📞 Support

For questions or issues, contact:
- **Email**: contact@code4change.tech
- **Docs**: https://docs.eventvoting.vn
- **Status**: https://status.eventvoting.vn
