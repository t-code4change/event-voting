// Base API
export { baseApi } from './baseApi'
export type { PaginationMeta, ApiResponse, ApiListResponse } from './baseApi'

// Guest API
export {
  guestApi,
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
} from './guestApi'

// Participant API
export {
  participantApi,
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
} from './participantApi'

// Email API
export {
  emailApi,
  // Templates
  useGetEmailTemplatesQuery,
  useLazyGetEmailTemplatesQuery,
  useGetEmailTemplateByIdQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  useDuplicateEmailTemplateMutation,
  // Sending
  useSendEmailsMutation,
  usePreviewEmailMutation,
  // Logs
  useGetEmailLogsQuery,
  useLazyGetEmailLogsQuery,
  useGetEmailCampaignsQuery,
  useGetCampaignDetailsQuery,
  useRetryEmailMutation,
  useRetryCampaignFailedMutation,
  useGetEmailStatsQuery,
} from './emailApi'

// Draw Result API
export {
  drawResultApi,
  useGetDrawResultsQuery,
  useLazyGetDrawResultsQuery,
  useGetDeletedDrawResultsQuery,
  useDeleteDrawResultMutation,
  useRestoreDrawResultMutation,
  useResetDrawResultsMutation,
  useGetDrawResultStatsQuery,
  useGetDrawResultsByCodeQuery,
} from './drawResultApi'

// Dashboard API
export {
  dashboardApi,
  useGetDashboardStatsQuery,
  useLazyGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetActiveEventQuery,
  useGetMyEventsQuery,
  useLazyGetMyEventsQuery,
  useGetEventByIdQuery,
  useSetActiveEventMutation,
} from './dashboardApi'
