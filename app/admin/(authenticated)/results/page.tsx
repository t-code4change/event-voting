"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Trophy, Users, Vote, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Candidate {
  id: string
  name: string
  photo_url: string | null
  description: string | null
  display_order: number
  voteCount: number
}

interface Category {
  id: string
  name: string
  emoji: string | null
  max_votes_per_voter: number
  display_order: number
  candidates: Candidate[]
}

interface Event {
  id: string
  name: string
  is_active: boolean
  voting_start_time: string
  voting_end_time: string
  categories: Category[]
}

export default function AdminResultsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [totalVoters, setTotalVoters] = useState(0)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      const response = await fetch("/api/admin/results")
      if (!response.ok) throw new Error("Failed to fetch results")

      const data = await response.json()
      setEvents(data.events || [])
      setTotalVoters(data.totalVoters || 0)
      setTotalVotes(data.totalVotes || 0)
    } catch (error) {
      console.error("Error loading results:", error)
      toast.error("Không thể tải kết quả bình chọn")
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getMaxVotes = (candidates: Candidate[]) => {
    return Math.max(...candidates.map(c => c.voteCount), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Kết quả Bình chọn</h1>
        <p className="text-muted-foreground">
          Theo dõi kết quả real-time
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số người vote
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVoters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng lượt vote
            </CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVotes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số sự kiện
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto" />
            <p className="text-muted-foreground mt-4">Đang tải kết quả...</p>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Chưa có sự kiện nào
              </h3>
              <p className="text-muted-foreground">
                Tạo sự kiện và danh mục để bắt đầu nhận votes
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Results by Event */
        <div className="space-y-6">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{event.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.categories?.length || 0} danh mục
                    </p>
                  </div>
                  {event.is_active && (
                    <Badge variant="default" className="animate-pulse">
                      Active
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {event.categories?.map((category) => {
                  const maxVotes = getMaxVotes(category.candidates || [])
                  const totalCategoryVotes = (category.candidates || []).reduce(
                    (sum, c) => sum + c.voteCount,
                    0
                  )

                  return (
                    <div key={category.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          {category.emoji} {category.name}
                        </h3>
                        <Badge variant="outline">
                          {totalCategoryVotes} votes
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {category.candidates?.map((candidate, index) => {
                          const percentage =
                            maxVotes > 0 ? (candidate.voteCount / maxVotes) * 100 : 0

                          return (
                            <div key={candidate.id} className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 flex-1">
                                  {index < 3 && (
                                    <div
                                      className={`text-2xl ${
                                        index === 0
                                          ? "text-yellow-500"
                                          : index === 1
                                          ? "text-gray-400"
                                          : "text-amber-700"
                                      }`}
                                    >
                                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                                    </div>
                                  )}
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={candidate.photo_url || undefined} />
                                    <AvatarFallback>
                                      {getInitials(candidate.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {candidate.name}
                                    </p>
                                    {candidate.description && (
                                      <p className="text-xs text-muted-foreground truncate">
                                        {candidate.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">
                                    {candidate.voteCount}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    votes
                                  </p>
                                </div>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
