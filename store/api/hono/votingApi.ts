import { honoBaseApi } from '../honoBaseApi'

interface RequestOtpRequest {
  phone: string
  name?: string
  slug: string
}

interface RequestOtpResponse {
  ttlSeconds: number
}

interface VerifyOtpRequest {
  phone: string
  code: string
  slug: string
}

interface VerifyOtpResponse {
  voterToken: string
  voter: Record<string, unknown>
}

interface SubmitVoteRequest {
  slug: string
  categoryId: string
  candidateId: string
  voterToken: string
}

export interface ResultCandidate {
  id: string
  name: string
  photoUrl?: string
  bio?: string
  displayOrder: number
  voteCount: number
  rank: number
}

export interface ResultCategory {
  id: string
  name: string
  displayOrder: number
  candidates: ResultCandidate[]
}

export const votingApi = honoBaseApi.injectEndpoints({
  endpoints: (build) => ({
    requestOtp: build.mutation<RequestOtpResponse, RequestOtpRequest>({
      query: ({ slug, ...body }) => ({
        url: `/events/${slug}/voters/request-otp`,
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: build.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: ({ slug, ...body }) => ({
        url: `/events/${slug}/voters/verify-otp`,
        method: 'POST',
        body,
      }),
    }),
    submitVote: build.mutation<Record<string, unknown>, SubmitVoteRequest>({
      query: ({ slug, voterToken, ...body }) => ({
        url: `/events/${slug}/vote`,
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${voterToken}` },
      }),
      invalidatesTags: ['Results'],
    }),
    getResults: build.query<{ success: boolean; data: ResultCategory[] }, string>({
      query: (slug) => `/events/${slug}/results`,
      providesTags: (_r, _e, slug) => [{ type: 'Results', id: slug }],
    }),
  }),
})

export const {
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useSubmitVoteMutation,
  useGetResultsQuery,
} = votingApi
