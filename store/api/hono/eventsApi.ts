import { honoBaseApi } from '../honoBaseApi'

interface Event {
  id: string
  slug: string
  name: string
  description?: string
  subtitle?: string
  venue?: string
  dateDisplay?: string
  galleryUrls?: string[]
  schedule?: Array<{ time: string; title: string; description?: string }>
  countdownEndAt?: string
  waitingScreenConfig?: {
    slides?: Array<{ title: string; subtitle?: string; image_url?: string }>
    speed_ms?: number
    show_quotes?: boolean
  }
  welcomeLedConfig?: {
    animation_type?: 'fade' | 'slide' | 'zoom'
    template?: string
    show_counter?: boolean
  }
  resultLedConfig?: {
    layout?: 'chart' | 'list'
    auto_switch?: boolean
    switch_interval_ms?: number
    show_confetti?: boolean
  }
  startAt: string
  endAt: string
  status: string
  brandConfig?: {
    primary_color?: string
    secondary_color?: string
    logo_url?: string
    banner_url?: string
    favicon_url?: string
  }
  features?: {
    voting?: boolean
    checkin?: boolean
    minigame?: boolean
    results?: boolean
    waiting_screen?: boolean
    welcome_led?: boolean
    result_led?: boolean
  }
  ownerId: string
  createdAt: string
  updatedAt: string
}

type PublicEvent = Event

interface PaginatedEvents {
  data: Event[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

interface ListEventsParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
}

interface CreateEventBody {
  name: string
  slug: string
  description?: string
  subtitle?: string
  venue?: string
  dateDisplay?: string
  galleryUrls?: string[]
  schedule?: unknown[]
  countdownEndAt?: string
  waitingScreenConfig?: Record<string, unknown>
  welcomeLedConfig?: Record<string, unknown>
  resultLedConfig?: Record<string, unknown>
  startAt: string
  endAt: string
  brandConfig?: Record<string, unknown>
  features?: Record<string, boolean>
  status?: string
}

export interface VotingConfig {
  id: string
  slug: string
  name: string
  categories: Array<{
    id: string
    name: string
    description?: string
    emoji?: string
    displayOrder: number
    maxVotesPerVoter: number
    votingStartAt?: string
    votingEndAt?: string
    candidates: Array<{
      id: string
      name: string
      photoUrl?: string
      bio?: string
      metadata?: Record<string, unknown>
      displayOrder: number
    }>
  }>
}

export const eventsApi = honoBaseApi.injectEndpoints({
  endpoints: (build) => ({
    listEvents: build.query<PaginatedEvents, ListEventsParams>({
      query: (params) => ({ url: '/admin/events', params }),
      providesTags: ['Event'],
    }),
    getEvent: build.query<Event, string>({
      query: (id) => `/admin/events/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Event', id }],
    }),
    getPublicEvent: build.query<{ success: boolean; data: PublicEvent }, string>({
      query: (slug) => `/events/${slug}`,
      providesTags: (_r, _e, slug) => [{ type: 'Event', id: slug }],
    }),
    createEvent: build.mutation<Event, CreateEventBody>({
      query: (body) => ({ url: '/admin/events', method: 'POST', body }),
      invalidatesTags: ['Event'],
    }),
    updateEvent: build.mutation<Event, { id: string } & Partial<CreateEventBody>>({
      query: ({ id, ...body }) => ({ url: `/admin/events/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Event', id }, 'Event'],
    }),
    deleteEvent: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/events/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Event'],
    }),
    getEventConfig: build.query<{ success: boolean; data: VotingConfig }, string>({
      query: (slug) => `/events/${slug}/voting-config`,
      providesTags: (_r, _e, slug) => [{ type: 'VotingConfig', id: slug }],
    }),
  }),
})

export const {
  useListEventsQuery,
  useGetEventQuery,
  useGetPublicEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventConfigQuery,
} = eventsApi
