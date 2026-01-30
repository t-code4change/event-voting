// ============================================
// Guest Types
// ============================================

export interface Guest {
  id: number
  documentId: string
  name: string
  email: string
  phone?: string
  company?: string
  position?: string
  checkInCode: string
  checkedIn: boolean
  checkedInAt?: string
  emailStatus: EmailStatus
  lastEmailSentAt?: string
  eventId: number
  createdAt: string
  updatedAt: string
}

export type EmailStatus = 'not-sent' | 'pending' | 'sent' | 'failed'

export interface CreateGuestRequest {
  name: string
  email: string
  phone?: string
  company?: string
  position?: string
  eventId: number
}

export interface UpdateGuestRequest {
  name?: string
  email?: string
  phone?: string
  company?: string
  position?: string
}

export interface GuestFilters {
  page?: number
  pageSize?: number
  search?: string
  checkInStatus?: 'all' | 'checked-in' | 'pending'
  emailStatus?: 'all' | EmailStatus
  company?: string
  dateFrom?: string
  dateTo?: string
}

// ============================================
// Participant Types (from Quay Số)
// ============================================

export type ParticipantStatus = 'WON' | 'DECLINED' | 'NONE'

export interface Participant {
  id: number
  documentId: string
  code: string
  fullName: string
  position?: string
  company?: string
  participantStatus: ParticipantStatus
  eventId: number
  createdAt: string
  updatedAt: string
}

export interface CreateParticipantRequest {
  code: string
  fullName: string
  position?: string
  company?: string
}

export interface ParticipantFilters {
  page?: number
  pageSize?: number
  search?: string
  status?: 'all' | ParticipantStatus
}

// ============================================
// Draw Result Types (from Quay Số)
// ============================================

export interface DrawResult {
  id: number
  documentId: string
  code: string
  fullName: string
  position?: string
  company?: string
  prizeIndex: number
  prizeName?: string
  participantId?: number
  isDeleted: boolean
  eventId: number
  createdAt: string
  updatedAt: string
}

export interface DrawResultFilters {
  page?: number
  pageSize?: number
  prizeIndex?: number
  includeDeleted?: boolean
}

// ============================================
// Email Types
// ============================================

export interface EmailTemplate {
  id: number
  documentId: string
  name: string
  subject: string
  bodyHtml: string
  variables: string[]
  eventId: number
  createdAt: string
  updatedAt: string
}

export interface CreateEmailTemplateRequest {
  name: string
  subject: string
  bodyHtml: string
  eventId: number
}

export interface UpdateEmailTemplateRequest {
  name?: string
  subject?: string
  bodyHtml?: string
}

export type EmailLogStatus = 'pending' | 'sending' | 'sent' | 'failed'

export interface EmailLog {
  id: number
  documentId: string
  templateId: number
  templateName?: string
  recipientId: number
  recipientName?: string
  recipientEmail: string
  subject: string
  status: EmailLogStatus
  errorMessage?: string
  sentAt?: string
  eventId: number
  createdAt: string
}

export interface SendEmailRequest {
  templateId: number
  recipientIds: number[] // Guest IDs
  eventId: number
}

export interface EmailCampaign {
  id: number
  templateId: number
  templateName: string
  totalRecipients: number
  sentCount: number
  failedCount: number
  pendingCount: number
  status: 'pending' | 'sending' | 'completed' | 'failed'
  createdAt: string
}

export interface EmailFilters {
  page?: number
  pageSize?: number
  status?: 'all' | EmailLogStatus
  templateId?: number
  dateFrom?: string
  dateTo?: string
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
  totalGuests: number
  checkedInGuests: number
  checkInRate: number
  totalParticipants: number
  totalEmailsSent: number
  emailSuccessRate: number
  totalDrawResults: number
  eventName?: string
  eventStatus?: 'active' | 'inactive'
}

export interface RecentActivity {
  id: number
  type: 'check-in' | 'email-sent' | 'draw-result' | 'guest-added'
  description: string
  user?: string
  timestamp: string
}

// ============================================
// Event Types
// ============================================

export interface Event {
  id: number
  documentId: string
  code: string
  name: string
  displayName?: string
  organizer?: string
  area?: string
  startDate?: string
  eventType?: string
  isActive: boolean
  userId: number
  createdAt: string
  updatedAt: string
}

// ============================================
// API Response Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface SingleResponse<T> {
  data: T
}

export interface SuccessResponse {
  success: boolean
  message?: string
}

export interface ErrorResponse {
  error: string
  message?: string
  statusCode?: number
}

// ============================================
// Variable Helpers for Email Templates
// ============================================

export const EMAIL_TEMPLATE_VARIABLES = [
  { key: 'guestName', label: 'Tên khách', example: 'Nguyễn Văn A' },
  { key: 'guestEmail', label: 'Email khách', example: 'email@example.com' },
  { key: 'guestPhone', label: 'Số điện thoại', example: '0901234567' },
  { key: 'guestCompany', label: 'Công ty', example: 'ABC Corp' },
  { key: 'guestPosition', label: 'Chức vụ', example: 'Manager' },
  { key: 'checkInCode', label: 'Mã check-in', example: 'CHK-123456' },
  { key: 'checkInUrl', label: 'Link check-in', example: 'https://...' },
  { key: 'eventName', label: 'Tên sự kiện', example: 'Year End Party 2025' },
  { key: 'eventDate', label: 'Ngày sự kiện', example: '31/12/2025' },
  { key: 'eventLocation', label: 'Địa điểm', example: 'Grand Ballroom' },
] as const

export type EmailVariableKey = typeof EMAIL_TEMPLATE_VARIABLES[number]['key']
