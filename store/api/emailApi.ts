import { baseApi, type ApiListResponse } from './baseApi'
import type {
  EmailTemplate,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
  EmailLog,
  EmailFilters,
  SendEmailRequest,
  EmailCampaign,
  SuccessResponse,
} from '@/types/admin'
import qs from 'qs'

export const emailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================
    // Email Templates
    // ============================================

    // Get all templates
    getEmailTemplates: builder.query<ApiListResponse<EmailTemplate>, { eventId: number }>({
      query: ({ eventId }) => `/my-events/${eventId}/email-templates`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'EmailTemplates' as const, id })),
              { type: 'EmailTemplates', id: 'LIST' },
            ]
          : [{ type: 'EmailTemplates', id: 'LIST' }],
    }),

    // Get single template
    getEmailTemplateById: builder.query<
      { data: EmailTemplate },
      { eventId: number; templateId: number }
    >({
      query: ({ eventId, templateId }) =>
        `/my-events/${eventId}/email-templates/${templateId}`,
      providesTags: (result, error, { templateId }) => [
        { type: 'EmailTemplates', id: templateId },
      ],
    }),

    // Create template
    createEmailTemplate: builder.mutation<
      { data: EmailTemplate },
      { eventId: number; data: CreateEmailTemplateRequest }
    >({
      query: ({ eventId, data }) => ({
        url: `/my-events/${eventId}/email-templates`,
        method: 'POST',
        body: { data },
      }),
      invalidatesTags: [{ type: 'EmailTemplates', id: 'LIST' }],
    }),

    // Update template
    updateEmailTemplate: builder.mutation<
      { data: EmailTemplate },
      { eventId: number; templateId: number; data: UpdateEmailTemplateRequest }
    >({
      query: ({ eventId, templateId, data }) => ({
        url: `/my-events/${eventId}/email-templates/${templateId}`,
        method: 'PUT',
        body: { data },
      }),
      invalidatesTags: (result, error, { templateId }) => [
        { type: 'EmailTemplates', id: templateId },
        { type: 'EmailTemplates', id: 'LIST' },
      ],
    }),

    // Delete template
    deleteEmailTemplate: builder.mutation<
      SuccessResponse,
      { eventId: number; templateId: number }
    >({
      query: ({ eventId, templateId }) => ({
        url: `/my-events/${eventId}/email-templates/${templateId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'EmailTemplates', id: 'LIST' }],
    }),

    // Duplicate template
    duplicateEmailTemplate: builder.mutation<
      { data: EmailTemplate },
      { eventId: number; templateId: number }
    >({
      query: ({ eventId, templateId }) => ({
        url: `/my-events/${eventId}/email-templates/${templateId}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'EmailTemplates', id: 'LIST' }],
    }),

    // ============================================
    // Email Sending
    // ============================================

    // Send emails
    sendEmails: builder.mutation<
      {
        data: {
          campaignId: number
          queued: number
          message: string
        }
      },
      { eventId: number; data: SendEmailRequest }
    >({
      query: ({ eventId, data }) => ({
        url: `/my-events/${eventId}/emails/send`,
        method: 'POST',
        body: { data },
      }),
      invalidatesTags: [
        { type: 'EmailLogs', id: 'LIST' },
        { type: 'Guests', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),

    // Preview email with sample data
    previewEmail: builder.mutation<
      { data: { subject: string; bodyHtml: string } },
      { eventId: number; templateId: number; sampleGuestId?: number }
    >({
      query: ({ eventId, templateId, sampleGuestId }) => ({
        url: `/my-events/${eventId}/emails/preview`,
        method: 'POST',
        body: { templateId, sampleGuestId },
      }),
    }),

    // ============================================
    // Email Logs / Tracking
    // ============================================

    // Get email logs
    getEmailLogs: builder.query<
      ApiListResponse<EmailLog>,
      { eventId: number } & EmailFilters
    >({
      query: ({ eventId, ...filters }) => {
        const queryString = qs.stringify({
          page: filters.page || 1,
          pageSize: filters.pageSize || 10,
          status: filters.status,
          templateId: filters.templateId,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          sort: 'createdAt:desc',
        }, { skipNulls: true })

        return `/my-events/${eventId}/emails?${queryString}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'EmailLogs' as const, id })),
              { type: 'EmailLogs', id: 'LIST' },
            ]
          : [{ type: 'EmailLogs', id: 'LIST' }],
    }),

    // Get email campaigns
    getEmailCampaigns: builder.query<
      ApiListResponse<EmailCampaign>,
      { eventId: number; page?: number; pageSize?: number }
    >({
      query: ({ eventId, page = 1, pageSize = 10 }) =>
        `/my-events/${eventId}/emails/campaigns?page=${page}&pageSize=${pageSize}`,
      providesTags: [{ type: 'EmailLogs', id: 'CAMPAIGNS' }],
    }),

    // Get campaign details
    getCampaignDetails: builder.query<
      {
        data: EmailCampaign & {
          logs: EmailLog[]
        }
      },
      { eventId: number; campaignId: number }
    >({
      query: ({ eventId, campaignId }) =>
        `/my-events/${eventId}/emails/campaigns/${campaignId}`,
    }),

    // Retry failed email
    retryEmail: builder.mutation<
      { data: EmailLog },
      { eventId: number; emailId: number }
    >({
      query: ({ eventId, emailId }) => ({
        url: `/my-events/${eventId}/emails/${emailId}/retry`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { emailId }) => [
        { type: 'EmailLogs', id: emailId },
        { type: 'EmailLogs', id: 'LIST' },
      ],
    }),

    // Retry all failed emails in a campaign
    retryCampaignFailed: builder.mutation<
      { data: { retried: number } },
      { eventId: number; campaignId: number }
    >({
      query: ({ eventId, campaignId }) => ({
        url: `/my-events/${eventId}/emails/campaigns/${campaignId}/retry-failed`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'EmailLogs', id: 'LIST' }],
    }),

    // Get email stats
    getEmailStats: builder.query<
      {
        data: {
          totalSent: number
          delivered: number
          failed: number
          pending: number
          successRate: number
        }
      },
      { eventId: number }
    >({
      query: ({ eventId }) => `/my-events/${eventId}/emails/stats`,
      providesTags: [{ type: 'EmailLogs', id: 'STATS' }],
    }),
  }),
})

export const {
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
} = emailApi
