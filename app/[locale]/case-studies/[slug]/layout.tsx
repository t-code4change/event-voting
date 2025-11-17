import type { Metadata } from 'next'
import { getCaseStudyBySlug } from '../constants/case-studies-data'
import { notFound } from 'next/navigation'

type Props = {
  params: { slug: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseStudy = getCaseStudyBySlug(params.slug)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found | Bright4Event',
      description: 'Case study không tồn tại',
    }
  }

  const statsText = Object.values(caseStudy.stats).join(', ')

  return {
    title: `${caseStudy.title} - Case Study ${caseStudy.company} | Bright4Event`,
    description: `${caseStudy.summary} ${statsText}. Khám phá chi tiết giải pháp bình chọn realtime, check-in QR code, lucky draw và quản lý sự kiện chuyên nghiệp từ Bright4Event.`,
    keywords: [
      ...caseStudy.keywords,
      caseStudy.company,
      caseStudy.title,
      'case study chi tiết',
      'giải pháp sự kiện',
    ],
    openGraph: {
      title: `${caseStudy.title} - ${caseStudy.company}`,
      description: `${caseStudy.summary} ${statsText}`,
      type: 'article',
      locale: 'vi_VN',
      images: [
        {
          url: caseStudy.heroImage,
          width: 1600,
          height: 900,
          alt: caseStudy.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${caseStudy.title} - ${caseStudy.company}`,
      description: caseStudy.summary,
      images: [caseStudy.heroImage],
    },
    alternates: {
      canonical: `https://bright4event.com/case-studies/${params.slug}`,
    },
  }
}

export default function CaseStudyDetailLayout({ children }: Props) {
  return <>{children}</>
}
