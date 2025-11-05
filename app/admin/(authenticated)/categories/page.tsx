"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Plus } from "lucide-react"

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý Danh mục</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các danh hiệu bình chọn
          </p>
        </div>
        <Button className="rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="p-12 text-center space-y-4">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Chưa có danh mục nào
            </h3>
            <p className="text-muted-foreground">
              Vui lòng chọn một sự kiện để quản lý danh mục
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
