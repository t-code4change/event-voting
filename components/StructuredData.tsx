import Script from 'next/script'

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  description?: string
}

export function OrganizationSchema({
  name = 'Bright4Event',
  url = 'https://quaysotrungthuong.vn',
  logo = 'https://quaysotrungthuong.vn/logo.png',
  description = 'Nền tảng bình chọn sự kiện hàng đầu Việt Nam',
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'VN',
      addressLocality: 'TP. Hồ Chí Minh',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'code4change.co@gmail.com',
    },
    sameAs: [
      'https://www.facebook.com/quaysotrungthuong.vn',
      'https://www.linkedin.com/company/code4change',
    ],
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  name?: string
  url?: string
  description?: string
}

export function WebsiteSchema({
  name = 'Bright4Event',
  url = 'https://quaysotrungthuong.vn',
  description = 'Hệ thống bình chọn sự kiện chuyên nghiệp',
}: WebsiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/event/{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface EventSchemaProps {
  name: string
  description: string
  startDate: string
  endDate?: string
  location?: {
    name: string
    address: string
  }
  image?: string
  url?: string
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode'
  eventStatus?: 'EventScheduled' | 'EventPostponed' | 'EventCancelled' | 'EventRescheduled'
}

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image = 'https://quaysotrungthuong.vn/og-image.png',
  url,
  eventAttendanceMode = 'OfflineEventAttendanceMode',
  eventStatus = 'EventScheduled',
}: EventSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate: endDate || startDate,
    eventAttendanceMode: `https://schema.org/${eventAttendanceMode}`,
    eventStatus: `https://schema.org/${eventStatus}`,
    image,
    ...(url && { url }),
    ...(location && {
      location: {
        '@type': 'Place',
        name: location.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: location.address,
          addressCountry: 'VN',
        },
      },
    }),
    organizer: {
      '@type': 'Organization',
      name: 'Bright4Event',
      url: 'https://quaysotrungthuong.vn',
    },
  }

  return (
    <Script
      id="event-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: {
    name: string
    url: string
  }[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ProductSchemaProps {
  name: string
  description: string
  price?: string
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  image?: string
  url?: string
}

export function ProductSchema({
  name,
  description,
  price,
  currency = 'VND',
  availability = 'InStock',
  image = 'https://quaysotrungthuong.vn/og-image.png',
  url,
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    ...(url && { url }),
    ...(price && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: currency,
        availability: `https://schema.org/${availability}`,
        url: url || 'https://quaysotrungthuong.vn/pricing',
      },
    }),
    brand: {
      '@type': 'Brand',
      name: 'Bright4Event',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '150',
    },
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQSchemaProps {
  items: {
    question: string
    answer: string
  }[]
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
