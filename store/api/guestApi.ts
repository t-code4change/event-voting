import { baseApi, type ApiListResponse } from './baseApi'
import type {
  Guest,
  CreateGuestRequest,
  UpdateGuestRequest,
  GuestFilters,
  SuccessResponse,
} from '@/types/admin'
import qs from 'qs'

export const guestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get guests with pagination and filters
    getGuests: builder.query<ApiListResponse<Guest>, { eventId: number } & GuestFilters>({
      query: ({ eventId, ...filters }) => {
        const queryString = qs.stringify({
          page: filters.page || 1,
          pageSize: filters.pageSize || 10,
          search: filters.search,
          checkInStatus: filters.checkInStatus,
          emailStatus: filters.emailStatus,
          company: filters.company,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          sort: 'createdAt:desc',
        }, { skipNulls: true })

        return `/my-events/${eventId}/guests?${queryString}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Guests' as const, id })),
              { type: 'Guests', id: 'LIST' },
            ]
          : [{ type: 'Guests', id: 'LIST' }],
    }),

    // Get single guest
    getGuestById: builder.query<{ data: Guest }, { eventId: number; guestId: number }>({
      query: ({ eventId, guestId }) => `/my-events/${eventId}/guests/${guestId}`,
      providesTags: (result, error, { guestId }) => [{ type: 'Guests', id: guestId }],
    }),

    // Create guest
    createGuest: builder.mutation<{ data: Guest }, { eventId: number; data: CreateGuestRequest }>({
      query: ({ eventId, data }) => ({
        url: `/my-events/${eventId}/guests`,
        method: 'POST',
        body: { data },
      }),
      invalidatesTags: [{ type: 'Guests', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // Update guest
    updateGuest: builder.mutation<
      { data: Guest },
      { eventId: number; guestId: number; data: UpdateGuestRequest }
    >({
      query: ({ eventId, guestId, data }) => ({
        url: `/my-events/${eventId}/guests/${guestId}`,
        method: 'PUT',
        body: { data },
      }),
      invalidatesTags: (result, error, { guestId }) => [
        { type: 'Guests', id: guestId },
        { type: 'Guests', id: 'LIST' },
      ],
    }),

    // Delete guest
    deleteGuest: builder.mutation<SuccessResponse, { eventId: number; guestId: number }>({
      query: ({ eventId, guestId }) => ({
        url: `/my-events/${eventId}/guests/${guestId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Guests', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // Bulk delete guests
    deleteGuests: builder.mutation<SuccessResponse, { eventId: number; guestIds: number[] }>({
      query: ({ eventId, guestIds }) => ({
        url: `/my-events/${eventId}/guests/bulk-delete`,
        method: 'POST',
        body: { guestIds },
      }),
      invalidatesTags: [{ type: 'Guests', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // Import guests from Excel
    importGuests: builder.mutation<
      { data: { imported: number; failed: number; errors?: string[] } },
      { eventId: number; file: FormData }
    >({
      query: ({ eventId, file }) => ({
        url: `/my-events/${eventId}/guests/import`,
        method: 'POST',
        body: file,
      }),
      invalidatesTags: [{ type: 'Guests', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // Check-in guest (creates participant)
    checkInGuest: builder.mutation<
      { data: { guest: Guest; participant: { id: number; code: string } } },
      { eventId: number; guestId: number }
    >({
      query: ({ eventId, guestId }) => ({
        url: `/my-events/${eventId}/guests/${guestId}/check-in`,
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'Guests', id: 'LIST' },
        { type: 'Participants', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),

    // Bulk check-in
    checkInGuests: builder.mutation<
      { data: { success: number; failed: number } },
      { eventId: number; guestIds: number[] }
    >({
      query: ({ eventId, guestIds }) => ({
        url: `/my-events/${eventId}/guests/bulk-check-in`,
        method: 'POST',
        body: { guestIds },
      }),
      invalidatesTags: [
        { type: 'Guests', id: 'LIST' },
        { type: 'Participants', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),

    // Get unique companies for filter
    getGuestCompanies: builder.query<{ data: string[] }, { eventId: number }>({
      query: ({ eventId }) => `/my-events/${eventId}/guests/companies`,
    }),

    // Export guests to Excel
    exportGuests: builder.query<Blob, { eventId: number; filters?: GuestFilters }>({
      query: ({ eventId, filters }) => {
        const queryString = filters ? `?${qs.stringify(filters, { skipNulls: true })}` : ''
        return {
          url: `/my-events/${eventId}/guests/export${queryString}`,
          responseHandler: (response) => response.blob(),
        }
      },
    }),
  }),
})

export const {
  useGetGuestsQuery,
  useLazyGetGuestsQuery,
  useGetGuestByIdQuery,
  useCreateGuestMutation,
  useUpdateGuestMutation,
  useDeleteGuestMutation,
  useDeleteGuestsMutation,
  useImportGuestsMutation,
  useCheckInGuestMutation,
  useCheckInGuestsMutation,
  useGetGuestCompaniesQuery,
  useLazyExportGuestsQuery,
} = guestApi
