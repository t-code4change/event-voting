// Application routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  VOTE: '/vote',
  RESULTS: '/results',

  // Auth routes
  LOGIN: '/admin/login',

  // User dashboard routes
  DASHBOARD: '/dashboard',
  USER_SUBSCRIPTION: '/dashboard/subscription',
  USER_SUBSCRIPTION_HISTORY: '/dashboard/subscription-history',
  USER_INVOICES: '/dashboard/invoices',

  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_PACKAGES: '/admin/packages',
  ADMIN_SUBSCRIPTIONS: '/admin/subscriptions-list',
  ADMIN_INVOICES: '/admin/invoices-list',
  ADMIN_TRANSACTIONS: '/admin/transactions',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CANDIDATES: '/admin/candidates',
  ADMIN_RESULTS: '/admin/results',

  // API routes
  API: {
    PACKAGES: '/api/packages',
    SUBSCRIPTIONS: '/api/subscriptions',
    SUBSCRIPTIONS_ACTIVE: '/api/subscriptions/active',
    INVOICES: '/api/invoices',
    TRANSACTIONS: '/api/transactions',
    ADMIN_STATS: '/api/admin/stats',
  },
} as const
