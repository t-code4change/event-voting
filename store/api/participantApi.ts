import { baseApi, type ApiListResponse } from './baseApi'
import type {
  Participant,
  CreateParticipantRequest,
  ParticipantFilters,
  SuccessResponse,
} from '@/types/admin'
import qs from 'qs'

export const participantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get participants with pagination and filters
    getParticipants: builder.query<
      ApiListResponse<Participant>,
      { eventId: number } & ParticipantFilters
    >({
      query: ({ eventId, ...filters }) => {
        const queryString = qs.stringify({
          page: filters.page || 1,
          pageSize: filters.pageSize || 10,
          search: filters.search,
          status: filters.status,
          sort: 'createdAt:desc',
        }, { skipNulls: true })

        return `/my-events/${eventId}/participants?${queryString}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Participants' as const, id })),
              { type: 'Participants', id: 'LIST' },
            ]
          : [{ type: 'Participants', id: 'LIST' }],
    }),

    // Get single participant
    getParticipantById: builder.query<
      { data: Participant },
      { eventId: number; participantId: number }
    >({
      query: ({ eventId, participantId }) =>
        `/my-events/${eventId}/participants/${participantId}`,
      providesTags: (result, error, { participantId }) => [
        { type: 'Participants', id: participantId },
      ],
    }),

    // Create participant manually
    createParticipant: builder.mutation<
      { data: Participant },
      { eventId: number; data: CreateParticipantRequest }
    >({
      query: ({ eventId, data }) => ({
        url: `/my-events/${eventId}/participants`,
        method: 'POST',
        body: { data },
      }),
      invalidatesTags: [{ type: 'Participants', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // Create many participants
    createManyParticipants: builder.mutation<
      { data: { created: number; failed: number } },
      { eventId: number; participants: CreateParticipantRequest[] }
    >({
      query: ({ eventId, participants }) => ({
        url: `/my-events/${eventId}/participants/many`,
        method: 'POST',
        body: { participants },
      }),
      invalidatesTags: [{ type: 'Participants', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // Update participant
    updateParticipant: builder.mutation<
      { data: Participant },
      { eventId: number; participantId: number; data: Partial<CreateParticipantRequest> }
    >({
      query: ({ eventId, participantId, data }) => ({
        url: `/my-events/${eventId}/participants/${participantId}`,
        method: 'PUT',
        body: { data },
      }),
      invalidatesTags: (result, error, { participantId }) => [
        { type: 'Participants', id: participantId },
        { type: 'Participants', id: 'LIST' },
      ],
    }),

    // Delete participant
    deleteParticipant: builder.mutation<
      SuccessResponse,
      { eventId: number; participantId: number }
    >({
      query: ({ eventId, participantId }) => ({
        url: `/my-events/${eventId}/participants/${participantId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Participants', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // Bulk delete participants
    deleteParticipants: builder.mutation<
      SuccessResponse,
      { eventId: number; participantIds: number[] }
    >({
      query: ({ eventId, participantIds }) => ({
        url: `/my-events/${eventId}/participants/delete`,
        method: 'POST',
        body: { data: { participantIds } },
      }),
      invalidatesTags: [{ type: 'Participants', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // Delete all participants
    deleteAllParticipants: builder.mutation<SuccessResponse, { eventId: number }>({
      query: ({ eventId }) => ({
        url: `/my-events/${eventId}/participants/delete-all`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Participants', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // Get participant stats
    getParticipantStats: builder.query<
      {
        data: {
          total: number
          won: number
          declined: number
          available: number
        }
      },
      { eventId: number }
    >({
      query: ({ eventId }) => `/my-events/${eventId}/participants/stats`,
      providesTags: [{ type: 'Participants', id: 'STATS' }],
    }),
  }),
})

export const {
  useGetParticipantsQuery,
  useLazyGetParticipantsQuery,
  useGetParticipantByIdQuery,
  useCreateParticipantMutation,
  useCreateManyParticipantsMutation,
  useUpdateParticipantMutation,
  useDeleteParticipantMutation,
  useDeleteParticipantsMutation,
  useDeleteAllParticipantsMutation,
  useGetParticipantStatsQuery,
} = participantApi
