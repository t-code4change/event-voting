import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Playfair_Display } from "next/font/google"
import Script from "next/script"
import "../globals.css"
import { Toaster } from "@/components/ui/toaster"
import ReduxProvider from "@/components/ReduxProvider"
import ModalManager from "@/components/modals/ModalManager"
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData"
import type { Metadata } from "next"

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-playfair",
})

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateMetadata({ params: { locale } }: Props): Metadata {
  const isVietnamese = locale === 'vi';

  return {
    metadataBase: new URL('https://bright4event.com'),
    title: {
      default: isVietnamese
        ? "Bright4Event - Nền tảng tổ chức sự kiện thông minh All-in-One"
        : "Bright4Event - All-in-One Smart Event Management Platform",
      template: "%s | Bright4Event"
    },
    description: isVietnamese
      ? "Nền tảng tổ chức sự kiện toàn diện, chuyên nghiệp. Từ Check-in QR, Màn hình chào mừng, Live Voting, Quay số trúng thưởng đến Analytics realtime — tất cả trong một nền tảng duy nhất. Giúp doanh nghiệp tổ chức sự kiện hiện đại, hiệu quả và ấn tượng."
      : "Comprehensive, professional event management platform. From QR Check-in, Welcome Screen, Live Voting, Lucky Draw to real-time Analytics — all in one unified platform. Helping businesses organize modern, efficient and impressive events.",
    keywords: [
      'tổ chức sự kiện',
      'phần mềm sự kiện',
      'event platform',
      'event management',
      'smart event platform',
      'all-in-one event solution',
      'nền tảng sự kiện all-in-one',
      'hệ thống bình chọn',
      'voting system',
      'event voting',
      'gala vote',
      'check-in qr code',
      'qr check-in',
      'welcome screen',
      'màn hình chào mừng',
      'countdown sự kiện',
      'lucky draw',
      'quay số trúng thưởng',
      'event analytics',
      'real-time voting',
      'livestream integration',
      'bright4event',
    ],
    authors: [{ name: 'Bright4Event', url: 'https://bright4event.com' }],
    creator: 'Bright4Event',
    publisher: 'Bright4Event',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? 'en_US' : 'vi_VN',
      url: 'https://bright4event.com',
      siteName: 'Bright4Event',
      title: isVietnamese
        ? 'Bright4Event - Nền tảng tổ chức sự kiện thông minh All-in-One'
        : 'Bright4Event - All-in-One Smart Event Management Platform',
      description: isVietnamese
        ? 'Từ Check-in, Voting đến Quay số trúng thưởng và Analytics. Bright4Event giúp doanh nghiệp tổ chức sự kiện hiện đại, hiệu quả và ấn tượng.'
        : 'From Check-in, Voting to Lucky Draw and Analytics. Bright4Event helps businesses organize modern, efficient and impressive events.',
    },
    twitter: {
      card: 'summary_large_image',
      title: isVietnamese
        ? 'Bright4Event - Nền tảng tổ chức sự kiện thông minh All-in-One'
        : 'Bright4Event - All-in-One Smart Event Management Platform',
      description: isVietnamese
        ? 'Check-in QR, Màn hình chào mừng, Live Voting, Lucky Draw, Livestream & Analytics realtime — tất cả trong một nền tảng.'
        : 'QR Check-in, Welcome Screen, Live Voting, Lucky Draw, Livestream & Real-time Analytics — all in one platform.',
      creator: '@Bright4Event',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
    alternates: {
      canonical: 'https://bright4event.com',
      languages: {
        'vi': 'https://bright4event.com',
        'en': 'https://bright4event.com/en',
      }
    },
    category: 'technology',
  }
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className={`${playfair.variable} font-sans`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2MCXBSRCXY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2MCXBSRCXY');
          `}
        </Script>

        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            {children}
            <ModalManager />
            <Toaster />
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
