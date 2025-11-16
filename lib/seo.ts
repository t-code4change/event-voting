import { Metadata } from "next"

export const siteConfig = {
  name: "Bright4Event",
  description: "Nền tảng tổ chức sự kiện thông minh All-in-One - Check-in, Bình chọn, Quay số, Livestream & Báo cáo realtime",
  url: "https://bright4event.com",
  ogImage: "https://bright4event.com/og-image.png",
  keywords: [
    "quản lý sự kiện",
    "event management",
    "check-in sự kiện",
    "bình chọn realtime",
    "voting realtime",
    "lucky draw",
    "quay số may mắn",
    "livestream sự kiện",
    "Year-end Party",
    "Gala Dinner",
    "Team Building",
    "màn hình LED sự kiện",
    "tổ chức sự kiện chuyên nghiệp",
    "công nghệ sự kiện",
    "QR code check-in",
    "Bright4Event",
    "Code4Change",
  ],
  creator: "Code4Change Technology Solution",
  contact: {
    email: "code4change.co@gmail.com",
    phone: "+84901333434",
  },
}

interface PageSEO {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
}

export function getMetadata({
  title,
  description,
  keywords = [],
  ogImage,
  canonicalUrl,
}: PageSEO): Metadata {
  const pageTitle = title.includes("Bright4Event")
    ? title
    : `${title} | Bright4Event`

  const allKeywords = [...siteConfig.keywords, ...keywords]

  return {
    title: pageTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    alternates: {
      canonical: canonicalUrl || siteConfig.url,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl || siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage || siteConfig.ogImage],
      creator: "@Bright4Event",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code", // Cần cập nhật từ Google Search Console
      // yandex: "your-yandex-verification-code",
      // bing: "your-bing-verification-code",
    },
  }
}

// JSON-LD Structured Data Generators
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: "customer service",
      areaServed: "VN",
      availableLanguage: ["Vietnamese", "English"],
    },
    sameAs: [
      // Add social media links here
      // "https://facebook.com/bright4event",
      // "https://twitter.com/bright4event",
    ],
  }
}

export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "2000000",
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
    description: siteConfig.description,
    operatingSystem: "Web, iOS, Android",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "200",
      bestRating: "5",
      worstRating: "1",
    },
  }
}

export function generateEventSchema(event: {
  name: string
  startDate: string
  endDate?: string
  location: string
  description: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vietnam",
      },
    },
    description: event.description,
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function generateArticleSchema(article: {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
  }
}
