import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Search, Plus, Edit, Trash2, Copy, MoreVertical } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminSidebar } from "@/app/components/admin-sidebar"
import { ThemeToggle } from "@/app/components/theme-toggle"

const exams = [
  {
    id: 1,
    title: "Математикийн шалгалт",
    questions: 20,
    duration: 60,
    students: 45,
    status: "active",
    created: "2025-11-15",
  },
  {
    id: 2,
    title: "Англи хэлний шалгалт",
    questions: 30,
    duration: 45,
    students: 38,
    status: "active",
    created: "2025-11-20",
  },
  {
    id: 3,
    title: "Физикийн шалгалт",
    questions: 25,
    duration: 90,
    students: 52,
    status: "completed",
    created: "2025-11-10",
  },
  {
    id: 4,
    title: "Программчлалын шалгалт",
    questions: 15,
    duration: 120,
    students: 28,
    status: "draft",
    created: "2025-11-28",
  },
  {
    id: 5,
    title: "Хими шалгалт",
    questions: 22,
    duration: 75,
    students: 41,
    status: "completed",
    created: "2025-11-05",
  },
]

export default function ExamsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold">Шалгалтууд</h1>
              <p className="text-sm text-muted-foreground">Бүх шалгалтуудыг удирдах</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/admin/exams/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Шинэ шалгалт
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Шалгалт хайх..." className="pl-10" />
                </div>
                <Button variant="outline">Шүүлтүүр</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-medium">{exam.title}</h3>
                        <Badge
                          variant={
                            exam.status === "active" ? "default" : exam.status === "completed" ? "secondary" : "outline"
                          }
                        >
                          {exam.status === "active" ? "Идэвхтэй" : exam.status === "completed" ? "Дууссан" : "Ноорог"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>{exam.questions} асуулт</span>
                        <span>{exam.duration} минут</span>
                        <span>{exam.students} сурагч</span>
                        <span>Үүсгэсэн: {exam.created}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/exams/${exam.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Засах
                        </Link>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Хуулах
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Устгах
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
