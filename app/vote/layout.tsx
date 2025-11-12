import { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata.vote

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
