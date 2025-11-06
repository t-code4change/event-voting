import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface CategoryResult {
  id: string
  name: string
  emoji: string
  candidates: CandidateResult[]
}

export interface CandidateResult {
  id: string
  name: string
  photo_url: string
  description: string
  vote_count: number
  rank: number
}

export interface VoteStats {
  totalVotes: number
  totalVoters: number
  totalCategories: number
  totalCandidates: number
}

export function useRealtimeResults(eventId: string | null) {
  const [categories, setCategories] = useState<CategoryResult[]>([])
  const [stats, setStats] = useState<VoteStats>({
    totalVotes: 0,
    totalVoters: 0,
    totalCategories: 0,
    totalCandidates: 0,
  })
  const [loading, setLoading] = useState(true)
  const [onNewVote, setOnNewVote] = useState<(() => void) | null>(null)

  const loadResults = useCallback(async () => {
    if (!eventId) {
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Load categories with candidates and vote counts
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          emoji,
          candidates (
            id,
            name,
            photo_url,
            description
          )
        `)
        .eq('event_id', eventId)
        .order('display_order', { ascending: true })

      if (categoriesError) {
        console.error('Error loading categories:', categoriesError)
        setLoading(false)
        return
      }

      // Load vote counts for each candidate
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('candidate_id')
        .eq('event_id', eventId)

      if (votesError) {
        console.error('Error loading votes:', votesError)
      }

      // Count votes per candidate
      const voteCounts = new Map<string, number>()
      if (votesData) {
        votesData.forEach((vote) => {
          const count = voteCounts.get(vote.candidate_id) || 0
          voteCounts.set(vote.candidate_id, count + 1)
        })
      }

      // Load voter count
      const { data: votersData, error: votersError } = await supabase
        .from('voters')
        .select('id')
        .eq('event_id', eventId)

      const totalVoters = votersData?.length || 0

      // Process categories with vote counts and rankings
      const processedCategories: CategoryResult[] = (categoriesData || []).map((cat) => {
        const candidatesWithVotes = (cat.candidates || []).map((candidate: any) => ({
          ...candidate,
          vote_count: voteCounts.get(candidate.id) || 0,
          rank: 0,
        }))

        // Sort by vote count and assign ranks
        candidatesWithVotes.sort((a, b) => b.vote_count - a.vote_count)
        candidatesWithVotes.forEach((candidate, index) => {
          candidate.rank = index + 1
        })

        return {
          id: cat.id,
          name: cat.name,
          emoji: cat.emoji,
          candidates: candidatesWithVotes,
        }
      })

      setCategories(processedCategories)

      // Calculate stats
      const totalCandidates = processedCategories.reduce(
        (sum, cat) => sum + cat.candidates.length,
        0
      )
      const totalVotes = votesData?.length || 0

      setStats({
        totalVotes,
        totalVoters,
        totalCategories: processedCategories.length,
        totalCandidates,
      })
    } catch (error) {
      console.error('Error loading results:', error)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    loadResults()
  }, [loadResults])

  useEffect(() => {
    if (!eventId) return

    const supabase = createClient()
    let channel: RealtimeChannel

    // Subscribe to votes table changes
    channel = supabase
      .channel('results-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          console.log('New vote received:', payload)

          // Trigger confetti
          if (onNewVote) {
            onNewVote()
          }

          // Reload results
          loadResults()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId, loadResults, onNewVote])

  return {
    categories,
    stats,
    loading,
    refresh: loadResults,
    setOnNewVote,
  }
}
