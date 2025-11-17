/**
 * Route Constants
 * Central place for all route paths in the application
 * Use these constants instead of hardcoded strings for type safety and easier refactoring
 */

// ============================================
// PUBLIC ROUTES (with locale prefix)
// ============================================
export const ROUTES = {
  // Main pages
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  CASE_STUDIES: '/case-studies',
  CONTACT: '/contact',
  FAQ: '/faq',
  GUIDE: '/guide',
  PRICING: '/pricing',

  // Legal
  POLICY: '/policy',
  TERMS: '/terms',

  // Auth (kept outside locale for now as they're shared)
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH_VERIFY: '/auth/verify',

  // Admin (kept outside locale as they're admin-only)
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ANALYTICS: '/admin/analytics',
    CANDIDATES: '/admin/candidates',
    CATEGORIES: '/admin/categories',
    CHECK_IN: '/admin/check-in',
    GUESTS: '/admin/guests',
    MINI_GAME: '/admin/mini-game',
    SETTINGS: '/admin/settings',
  },

  // Event pages (kept outside locale as they're dynamic)
  EVENT: {
    DETAIL: (eventId: string) => `/event/${eventId}`,
    VOTE: (eventId: string) => `/event/${eventId}`,
    RESULTS: (eventId: string) => `/event/${eventId}/results`,
    SCREEN: (eventId: string) => `/event/${eventId}/screen`,
  },

  // Dashboard (kept outside locale)
  DASHBOARD: '/dashboard',
} as const;

// ============================================
// API ROUTES
// ============================================
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify',
  },
  ADMIN: {
    CHANGE_PASSWORD: '/api/admin/change-password',
    DASHBOARD_STATS: '/api/admin/dashboard/stats',
    EVENTS: '/api/admin/events',
    CANDIDATES: '/api/admin/candidates',
    CATEGORIES: '/api/admin/categories',
    GUESTS: '/api/admin/guests',
    RESULTS: '/api/admin/results',
    SETTINGS: '/api/admin/settings',
  },
  EVENT: {
    DETAIL: (eventId: string) => `/api/events/${eventId}`,
    VOTE: '/api/vote',
    RESULTS: (eventId: string) => `/api/events/${eventId}/results`,
    CHECK_IN: '/api/check-in',
  },
  INVOICES: '/api/invoices',
  CONTACT: '/api/contact',
} as const;

// ============================================
// EXTERNAL ROUTES
// ============================================
export const EXTERNAL_ROUTES = {
  LUCKY_DRAW: 'https://quaysotrungthuong.vn/app',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the current pathname without locale prefix
 * Example: /en/about -> /about
 */
export function getPathnameWithoutLocale(pathname: string): string {
  // Remove leading slash
  const parts = pathname.substring(1).split('/');

  // Check if first part is a locale
  if (parts[0] === 'vi' || parts[0] === 'en') {
    parts.shift(); // Remove locale
  }

  return '/' + parts.join('/');
}

/**
 * Check if a route is active based on pathname
 */
export function isRouteActive(currentPath: string, routePath: string): boolean {
  if (routePath === '/') {
    return currentPath === '/' || currentPath === '/vi' || currentPath === '/en';
  }

  const cleanCurrentPath = getPathnameWithoutLocale(currentPath);
  return cleanCurrentPath.startsWith(routePath);
}
