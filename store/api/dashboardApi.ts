import { baseApi } from './baseApi'
import type { DashboardStats, RecentActivity, Event } from '@/types/admin'

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard stats
    getDashboardStats: builder.query<{ data: DashboardStats }, { eventId: number }>({
      query: ({ eventId }) => `/my-events/${eventId}/dashboard/stats`,
      providesTags: [{ type: 'Dashboard', id: 'STATS' }],
    }),

    // Get recent activity
    getRecentActivity: builder.query<
      { data: RecentActivity[] },
      { eventId: number; limit?: number }
    >({
      query: ({ eventId, limit = 10 }) =>
        `/my-events/${eventId}/dashboard/activity?limit=${limit}`,
      providesTags: [{ type: 'Dashboard', id: 'ACTIVITY' }],
    }),

    // Get active event
    getActiveEvent: builder.query<{ data: Event | null }, void>({
      query: () => '/my-events/active',
      providesTags: [{ type: 'Events', id: 'ACTIVE' }],
    }),

    // Get user's events
    getMyEvents: builder.query<
      {
        data: Event[]
        meta: {
          pagination: {
            page: number
            pageSize: number
            pageCount: number
            total: number
          }
        }
      },
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 10 }) =>
        `/my-events?page=${page}&pageSize=${pageSize}&sort=createdAt:desc`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Events' as const, id })),
              { type: 'Events', id: 'LIST' },
            ]
          : [{ type: 'Events', id: 'LIST' }],
    }),

    // Get event by ID
    getEventById: builder.query<{ data: Event }, { eventId: number }>({
      query: ({ eventId }) => `/my-events/${eventId}`,
      providesTags: (result, error, { eventId }) => [{ type: 'Events', id: eventId }],
    }),

    // Set active event
    setActiveEvent: builder.mutation<{ data: Event }, { eventId: number }>({
      query: ({ eventId }) => ({
        url: `/my-events/${eventId}/set-active`,
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'Events', id: 'ACTIVE' },
        { type: 'Events', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useLazyGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetActiveEventQuery,
  useGetMyEventsQuery,
  useLazyGetMyEventsQuery,
  useGetEventByIdQuery,
  useSetActiveEventMutation,
} = dashboardApi
