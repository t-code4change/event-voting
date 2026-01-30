import { baseApi, type ApiListResponse } from './baseApi'
import type { DrawResult, DrawResultFilters, SuccessResponse } from '@/types/admin'
import qs from 'qs'

export const drawResultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get draw results
    getDrawResults: builder.query<
      ApiListResponse<DrawResult>,
      { eventId: number } & DrawResultFilters
    >({
      query: ({ eventId, ...filters }) => {
        const queryString = qs.stringify({
          page: filters.page || 1,
          pageSize: filters.pageSize || 10,
          prizeIndex: filters.prizeIndex,
          sort: 'createdAt:desc',
        }, { skipNulls: true })

        return `/my-events/${eventId}/draw-result?${queryString}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'DrawResults' as const, id })),
              { type: 'DrawResults', id: 'LIST' },
            ]
          : [{ type: 'DrawResults', id: 'LIST' }],
    }),

    // Get deleted draw results
    getDeletedDrawResults: builder.query<
      { data: DrawResult[] },
      { eventId: number }
    >({
      query: ({ eventId }) => `/my-events/${eventId}/draw-result/deleted`,
      providesTags: [{ type: 'DrawResults', id: 'DELETED' }],
    }),

    // Delete draw result (soft delete)
    deleteDrawResult: builder.mutation<
      SuccessResponse,
      { eventId: number; resultCode: string }
    >({
      query: ({ eventId, resultCode }) => ({
        url: `/my-events/${eventId}/draw-result/${resultCode}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'DrawResults', id: 'LIST' },
        { type: 'DrawResults', id: 'DELETED' },
        { type: 'Participants', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),

    // Restore deleted draw result
    restoreDrawResult: builder.mutation<
      { data: DrawResult },
      { eventId: number; resultCode: string }
    >({
      query: ({ eventId, resultCode }) => ({
        url: `/my-events/${eventId}/draw-result/${resultCode}/restore`,
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'DrawResults', id: 'LIST' },
        { type: 'DrawResults', id: 'DELETED' },
        { type: 'Participants', id: 'LIST' },
      ],
    }),

    // Reset all draw results
    resetDrawResults: builder.mutation<SuccessResponse, { eventId: number }>({
      query: ({ eventId }) => ({
        url: `/my-events/${eventId}/draw-result/reset`,
        method: 'PUT',
      }),
      invalidatesTags: [
        { type: 'DrawResults', id: 'LIST' },
        { type: 'DrawResults', id: 'DELETED' },
        { type: 'Participants', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),

    // Get draw result stats
    getDrawResultStats: builder.query<
      {
        data: {
          total: number
          byPrize: Array<{
            prizeIndex: number
            prizeName: string
            count: number
            target: number
          }>
        }
      },
      { eventId: number }
    >({
      query: ({ eventId }) => `/my-events/${eventId}/draw-result/stats`,
      providesTags: [{ type: 'DrawResults', id: 'STATS' }],
    }),

    // Get draw results by event code (public)
    getDrawResultsByCode: builder.query<
      {
        data: DrawResult[]
        meta: {
          total: number
          isOwner: boolean
          eventId?: number
        }
      },
      { code: string }
    >({
      query: ({ code }) => `/events/${code}/draw-results`,
    }),
  }),
})

export const {
  useGetDrawResultsQuery,
  useLazyGetDrawResultsQuery,
  useGetDeletedDrawResultsQuery,
  useDeleteDrawResultMutation,
  useRestoreDrawResultMutation,
  useResetDrawResultsMutation,
  useGetDrawResultStatsQuery,
  useGetDrawResultsByCodeQuery,
} = drawResultApi
