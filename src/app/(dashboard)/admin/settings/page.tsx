"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { AdminSidebar } from "@/app/components/admin-sidebar"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { useEffect, useState } from "react"
import { api } from "@/lib/axios"
import { toast } from "sonner"
import { verifyRole } from "@/lib/auth/verifyRole"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    const role = verifyRole()
    if (role !== "admin") router.push("/login")
  }, [router])

  async function handleChangePassword() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Бүх талбарыг бөглөнө үү")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Шинэ нууц үг таарахгүй байна")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Нууц үг хамгийн багадаа 6 тэмдэгт байна")
      return
    }

    try {
      setSavingPassword(true)
      await api.patch("/admin/password", {
        oldPassword,
        newPassword,
        confirmPassword,
      })
      toast.success("Нууц үг амжилттай солигдлоо")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message ?? "Нууц үг солиход алдаа гарлаа")
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold">Тохиргоо</h1>
              <p className="text-sm text-muted-foreground">Системийн тохиргоо удирдах</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Профайл</CardTitle>
              <CardDescription>Админы хувийн мэдээллийг засварлах</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Нэр</Label>
                <Input id="name" defaultValue="Админ Хэрэглэгч" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">И-мэйл</Label>
                <Input id="email" type="email" defaultValue="admin@exampro.mn" />
              </div>
              <Button>Хадгалах</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Нууц үг солих</CardTitle>
              <CardDescription>Админы нууц үгийг шинэчлэх</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Хуучин нууц үг</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Шинэ нууц үг</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Шинэ нууц үг давтах</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button onClick={handleChangePassword} disabled={savingPassword}>
                {savingPassword ? "Хадгалж байна..." : "Нууц үг солих"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Системийн тохиргоо</CardTitle>
              <CardDescription>Ерөнхий тохиргоонууд</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>И-мэйл мэдэгдэл</Label>
                  <p className="text-sm text-muted-foreground">Шинэ шалгалтын мэдэгдэл явуулах</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Автомат шалгалт</Label>
                  <p className="text-sm text-muted-foreground">Хугацаа дууссан шалгалтыг автоматаар шалгах</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Статистик харуулах</Label>
                  <p className="text-sm text-muted-foreground">Сурагчид өөрийн статистик харах</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Аюултай бүс</CardTitle>
              <CardDescription>Бүх өгөгдлийг устгах</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Систем Reset хийх</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
