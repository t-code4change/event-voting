import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface VoteCounts {
  [candidateId: string]: number
}

export function useRealtimeVotes(eventId: string | null) {
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({})
  const [loading, setLoading] = useState(true)

  const loadVoteCounts = useCallback(async () => {
    if (!eventId) {
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Load all votes for this event
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('candidate_id')
        .eq('event_id', eventId)

      if (votesError) {
        console.error('Error loading votes:', votesError)
        setLoading(false)
        return
      }

      // Count votes per candidate
      const counts: VoteCounts = {}
      if (votesData) {
        votesData.forEach((vote) => {
          counts[vote.candidate_id] = (counts[vote.candidate_id] || 0) + 1
        })
      }

      setVoteCounts(counts)
    } catch (error) {
      console.error('Error loading vote counts:', error)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    loadVoteCounts()
  }, [loadVoteCounts])

  useEffect(() => {
    if (!eventId) return

    const supabase = createClient()
    let channel: RealtimeChannel

    // Subscribe to votes table changes for realtime updates
    channel = supabase
      .channel('vote-counts-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'votes',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          console.log('Vote count changed:', payload)
          // Reload vote counts when any vote changes
          loadVoteCounts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId, loadVoteCounts])

  return {
    voteCounts,
    loading,
    refresh: loadVoteCounts,
  }
}
