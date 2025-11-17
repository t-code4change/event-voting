import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Supported locales
  locales: ['vi', 'en'],

  // Default locale
  defaultLocale: 'vi',

  // Locale detection from browser
  localeDetection: true,

  // Locale prefix strategy: 'as-needed' means default locale won't have prefix
  localePrefix: 'as-needed'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
