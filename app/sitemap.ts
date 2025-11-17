import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog-data'
import { caseStudiesDetail } from '@/app/[locale]/case-studies/constants/case-studies-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bright4event.com'
  const locales = ['vi', 'en']
  const defaultLocale = 'vi'

  // Get all blog posts
  const blogPosts = getAllPosts()

  // Generate blog post URLs for all locales
  const blogPostUrls = locales.flatMap((locale) =>
    blogPosts.map((post) => ({
      url: locale === defaultLocale
        ? `${baseUrl}/blog/${post.slug}`
        : `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date.split('/').reverse().join('-')),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          vi: `${baseUrl}/blog/${post.slug}`,
          en: `${baseUrl}/en/blog/${post.slug}`,
        }
      }
    }))
  )

  // Generate case study detail URLs for all locales
  const caseStudyUrls = locales.flatMap((locale) =>
    caseStudiesDetail.map((caseStudy) => ({
      url: locale === defaultLocale
        ? `${baseUrl}/case-studies/${caseStudy.slug}`
        : `${baseUrl}/${locale}/case-studies/${caseStudy.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          vi: `${baseUrl}/case-studies/${caseStudy.slug}`,
          en: `${baseUrl}/en/case-studies/${caseStudy.slug}`,
        }
      }
    }))
  )

  // Helper function to create locale URLs
  const createLocaleUrls = (path: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    return locales.map((locale) => ({
      url: locale === defaultLocale ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          vi: `${baseUrl}${path}`,
          en: `${baseUrl}/en${path}`,
        }
      }
    }))
  }

  return [
    // Home page for both locales
    ...createLocaleUrls('/', 1, 'daily'),

    // Main pages
    ...createLocaleUrls('/about', 0.9, 'monthly'),
    ...createLocaleUrls('/blog', 0.9, 'weekly'),
    ...blogPostUrls,
    ...createLocaleUrls('/case-studies', 0.9, 'weekly'),
    ...caseStudyUrls,
    ...createLocaleUrls('/pricing', 0.9, 'weekly'),
    ...createLocaleUrls('/guide', 0.8, 'monthly'),
    ...createLocaleUrls('/faq', 0.8, 'monthly'),
    ...createLocaleUrls('/contact', 0.8, 'monthly'),

    // Legal pages
    ...createLocaleUrls('/policy', 0.3, 'yearly'),
    ...createLocaleUrls('/terms', 0.3, 'yearly'),

    // Auth pages (no locale prefix as they're shared)
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
  ]
}
