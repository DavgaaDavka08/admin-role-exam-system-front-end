import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Search, Download, Mail } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AdminSidebar } from "@/app/components/admin-sidebar"
import { ThemeToggle } from "@/app/components/theme-toggle"

const students = [
  { id: 1, name: "Бат Болд", email: "bat@email.com", exams: 5, avgScore: 85, lastActive: "2025-12-01" },
  { id: 2, name: "Сарантуяа Дорж", email: "sara@email.com", exams: 4, avgScore: 92, lastActive: "2025-11-30" },
  { id: 3, name: "Ганболд Төмөр", email: "gan@email.com", exams: 6, avgScore: 78, lastActive: "2025-12-01" },
  { id: 4, name: "Оюунаа Цэцэг", email: "oyuna@email.com", exams: 3, avgScore: 88, lastActive: "2025-11-29" },
  { id: 5, name: "Энхбат Мөнх", email: "enkhbat@email.com", exams: 5, avgScore: 72, lastActive: "2025-11-28" },
]

export default function StudentsPage() {

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold">Сурагчид</h1>
              <p className="text-sm text-muted-foreground">Бүх сурагчдын мэдээлэл</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Экспорт
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Сурагч хайх..." className="pl-10" />
                </div>
                <Button variant="outline">Шүүлтүүр</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xl font-bold">{student.exams}</div>
                        <p className="text-xs text-muted-foreground">Шалгалт</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-secondary">{student.avgScore}%</div>
                        <p className="text-xs text-muted-foreground">Дундаж</p>
                      </div>
                      <div className="text-center min-w-24">
                        <p className="text-sm">{student.lastActive}</p>
                        <p className="text-xs text-muted-foreground">Сүүлд</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
