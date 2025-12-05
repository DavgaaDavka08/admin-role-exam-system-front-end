import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { ArrowLeft, Edit, Trash2, Users, Clock, FileText } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/app/components/admin-sidebar"
import { ThemeToggle } from "@/app/components/theme-toggle"

const examDetails = {
  id: 1,
  title: "Математикийн үндсэн шалгалт",
  description: "Математикийн суурь мэдлэгийг шалгах шалгалт",
  duration: 60,
  questions: 20,
  students: 45,
  avgScore: 82,
  status: "active",
  created: "2025-11-15",
}

const questions = [
  {
    id: 1,
    question: "2 + 2 тэнцүү юу вэ?",
    options: [
      { id: "A", text: "3" },
      { id: "B", text: "4" },
      { id: "C", text: "5" },
      { id: "D", text: "6" },
    ],
    correctAnswer: "B",
  },
  {
    id: 2,
    question: "Өнцгийн байршил нь 90 градус бол ямар өнцөг гэж нэрлэдэг вэ?",
    options: [
      { id: "A", text: "Шулуун өнцөг" },
      { id: "B", text: "Хурц өнцөг" },
      { id: "C", text: "Мохоо өнцөг" },
      { id: "D", text: "Эргэлтийн өнцөг" },
    ],
    correctAnswer: "A",
  },
]

export default function ExamDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/exams">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{examDetails.title}</h1>
                <p className="text-sm text-muted-foreground">Шалгалтын дэлгэрэнгүй</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/exams/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Засах
                </Link>
              </Button>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-6">
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{examDetails.questions}</div>
                  <p className="text-sm text-muted-foreground">Асуулт</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-6">
                <div className="rounded-lg bg-secondary/10 p-3 text-secondary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{examDetails.students}</div>
                  <p className="text-sm text-muted-foreground">Сурагч</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-6">
                <div className="rounded-lg bg-accent/10 p-3 text-accent">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{examDetails.duration}</div>
                  <p className="text-sm text-muted-foreground">Минут</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-6">
                <div className="rounded-lg bg-muted p-3">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{examDetails.avgScore}%</div>
                  <p className="text-sm text-muted-foreground">Дундаж оноо</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Мэдээлэл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Төлөв:</span>
                <Badge variant="default">Идэвхтэй</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Үүсгэсэн огноо:</span>
                <span className="font-medium">{examDetails.created}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Тайлбар:</span>
                <span className="font-medium">{examDetails.description}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Асуултууд ({questions.length})</CardTitle>
              <CardDescription>Шалгалтын бүх асуултууд</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, idx) => (
                <div key={question.id} className="rounded-lg border border-border p-4">
                  <h3 className="mb-3 font-medium">
                    {idx + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center gap-2 rounded-md border p-2 ${
                          option.id === question.correctAnswer ? "border-secondary bg-secondary/10" : "border-border"
                        }`}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-sm font-medium">
                          {option.id}
                        </span>
                        <span className="flex-1">{option.text}</span>
                        {option.id === question.correctAnswer && (
                          <Badge variant="secondary" className="text-xs">
                            Зөв хариулт
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
