import { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata.hello

export default function HelloLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
