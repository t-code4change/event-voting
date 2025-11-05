"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Candidate {
  id: string
  name: string
  photo_url: string | null
  description: string | null
  display_order: number
  created_at: string
}

interface CategoryGroup {
  categoryId: string
  categoryName: string
  eventName: string
  isActive: boolean
  candidates: Candidate[]
}

export default function AdminCandidatesPage() {
  const [categories, setCategories] = useState<CategoryGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    try {
      const response = await fetch("/api/admin/candidates")
      if (!response.ok) throw new Error("Failed to fetch candidates")

      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error loading candidates:", error)
      toast.error("Không thể tải danh sách ứng viên")
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý Ứng viên</h1>
          <p className="text-muted-foreground">
            Danh sách tất cả ứng viên theo danh mục
          </p>
        </div>
        <Button className="rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          Thêm ứng viên
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto" />
            <p className="text-muted-foreground mt-4">Đang tải...</p>
          </CardContent>
        </Card>
      ) : categories.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <Users className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Chưa có ứng viên nào
              </h3>
              <p className="text-muted-foreground">
                Hãy tạo event và danh mục trước, sau đó thêm ứng viên
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Categories with Candidates */
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category.categoryId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{category.categoryName}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-muted-foreground">
                        Event: {category.eventName}
                      </p>
                      {category.isActive && (
                        <Badge variant="default" className="animate-pulse">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {category.candidates.length} ứng viên
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.candidates.map((candidate) => (
                    <Card key={candidate.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={candidate.photo_url || undefined} />
                            <AvatarFallback>
                              {getInitials(candidate.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">
                              {candidate.name}
                            </h4>
                            {candidate.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {candidate.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                #{candidate.display_order}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
