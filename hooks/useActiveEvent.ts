import { useAppSelector } from '@/store/hooks'
import { selectActiveEvent } from '@/store/slices/adminSettingsSlice'

export function useActiveEvent() {
  return useAppSelector(selectActiveEvent)
}

export function useActiveEventSlug(): string {
  const event = useAppSelector(selectActiveEvent)
  return event?.slug ?? ''
}
