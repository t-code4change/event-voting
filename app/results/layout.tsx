import { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata.results

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
