import { Metadata } from 'next'
import { generateEventMetadata } from '@/lib/metadata'

type Props = {
  params: { eventId: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = params

  // In a real application, you would fetch event data from your database
  // For now, we'll use a placeholder
  // Example: const event = await fetchEventData(eventId)

  return generateEventMetadata(
    eventId,
    'Year End Party 2025', // Replace with actual event name from database
    'Đêm hội tri ân và vinh danh những gương mặt tỏa sáng nhất năm. Tham gia bình chọn và xem kết quả sự kiện.'
  )
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
