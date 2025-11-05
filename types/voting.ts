export interface Candidate {
  id: string
  name: string
  description: string | null
  photo_url: string | null
  display_order: number
}

export interface Category {
  id: string
  name: string
  description: string | null
  emoji: string | null
  max_votes_per_voter: number
  display_order: number
  candidates: Candidate[]
}

export interface VotesByCategory {
  [categoryId: string]: string[] // Array of candidate IDs
}

export interface VoteSubmission {
  category_id: string
  candidate_ids: string[]
}
