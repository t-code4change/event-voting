"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Loader2, Shield } from "lucide-react"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      toast.error("Vui lòng nhập mật khẩu")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Đăng nhập thất bại")
      }

      toast.success("Đăng nhập thành công!")
      // Note: (authenticated) is a route group, not part of the URL
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Đăng nhập Admin</CardTitle>
          <CardDescription>
            Nhập mật khẩu để truy cập trang quản trị
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Mật khẩu demo: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
