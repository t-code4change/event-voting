// =============================================
// SUBSCRIPTION & BILLING TYPES
// Generated from Supabase schema
// =============================================

export type UserRole = 'user' | 'admin' | 'super_admin'

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  company_name?: string
  role: UserRole
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type BillingPeriod = 'one_time' | 'monthly' | 'yearly'

export interface PackageFeatures {
  custom_branding: boolean
  led_display: boolean
  qr_checkin: boolean
  advanced_analytics: boolean
  priority_support: boolean
  api_access?: boolean
  white_label?: boolean
  sso?: boolean
  dedicated_manager?: boolean
  custom_development?: boolean
}

export interface Package {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  currency: string
  billing_period: BillingPeriod
  max_events?: number | null  // null = unlimited
  max_participants_per_event?: number | null
  max_categories_per_event?: number | null
  max_candidates_per_category?: number | null
  features: PackageFeatures
  is_active: boolean
  is_popular: boolean
  is_highlighted: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'cancelled'

export interface Subscription {
  id: string
  user_id: string
  package_id: string
  status: SubscriptionStatus
  amount_paid: number
  currency: string
  start_date: string
  end_date?: string | null
  events_used: number
  events_limit?: number | null
  requires_invoice: boolean
  invoice_id?: string | null
  notes?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string

  // Relations
  package?: Package
  user?: User
  invoice?: Invoice
}

export type PaymentStatus = 'unpaid' | 'paid' | 'overdue' | 'cancelled'

export interface InvoiceItem {
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface Invoice {
  id: string
  subscription_id: string
  user_id: string
  invoice_number: string
  invoice_date: string
  due_date?: string

  // Company info
  company_name: string
  company_tax_code: string
  company_address: string
  company_email?: string
  company_phone?: string

  // Items & amounts
  items: InvoiceItem[]
  subtotal: number
  vat_rate: number
  vat_amount: number
  total_amount: number
  currency: string

  // Payment
  payment_status: PaymentStatus
  payment_method?: string
  payment_date?: string
  payment_reference?: string

  pdf_url?: string
  notes?: string
  metadata: Record<string, any>

  created_at: string
  updated_at: string

  // Relations
  subscription?: Subscription
  user?: User
}

export type TransactionType = 'payment' | 'refund' | 'adjustment'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Transaction {
  id: string
  user_id: string
  subscription_id?: string | null
  invoice_id?: string | null
  transaction_type: TransactionType
  amount: number
  currency: string
  payment_method?: string
  payment_gateway?: string
  payment_gateway_transaction_id?: string
  status: TransactionStatus
  description?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string

  // Relations
  user?: User
  subscription?: Subscription
  invoice?: Invoice
}

export type SubscriptionAction =
  | 'created'
  | 'activated'
  | 'renewed'
  | 'upgraded'
  | 'downgraded'
  | 'cancelled'
  | 'expired'

export interface SubscriptionHistory {
  id: string
  subscription_id: string
  user_id: string
  action: SubscriptionAction
  old_package_id?: string | null
  new_package_id?: string | null
  old_status?: string
  new_status?: string
  description?: string
  metadata: Record<string, any>
  created_at: string

  // Relations
  subscription?: Subscription
  user?: User
  old_package?: Package
  new_package?: Package
}

// =============================================
// API Request/Response Types
// =============================================

export interface CreateSubscriptionRequest {
  package_id: string
  requires_invoice: boolean
  invoice_details?: {
    company_name: string
    company_tax_code: string
    company_address: string
    company_email?: string
    company_phone?: string
  }
}

export interface CreateSubscriptionResponse {
  subscription: Subscription
  invoice?: Invoice
  payment_url?: string  // For payment gateway redirect
}

export interface UpdatePackageRequest {
  name?: string
  description?: string
  price?: number
  features?: Partial<PackageFeatures>
  is_active?: boolean
  is_popular?: boolean
  display_order?: number
}

export interface SubscriptionStatsResponse {
  total_revenue: number
  active_subscriptions: number
  total_users: number
  revenue_by_package: Record<string, number>
  subscriptions_by_status: Record<SubscriptionStatus, number>
  recent_subscriptions: number
  expiring_soon: any[]
  unpaid_invoices: number
}

export interface UserSubscriptionInfo {
  has_active_subscription: boolean
  current_subscription?: Subscription
  can_create_event: boolean
  events_remaining?: number
  subscription_expires_at?: string
}

// =============================================
// Form Types
// =============================================

export interface InvoiceFormData {
  company_name: string
  company_tax_code: string
  company_address: string
  company_email?: string
  company_phone?: string
}

export interface SubscriptionFormData {
  package_id: string
  requires_invoice: boolean
  invoice_details?: InvoiceFormData
}

export interface PaymentFormData {
  payment_method: 'bank_transfer' | 'credit_card' | 'vnpay' | 'momo' | 'other'
  payment_reference?: string
  notes?: string
}
