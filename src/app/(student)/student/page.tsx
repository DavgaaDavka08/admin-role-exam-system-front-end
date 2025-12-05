"use client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Clock, FileText, Trophy, TrendingUp, LogOut, User } from "lucide-react"
import Link from "next/link"

import { useEffect, useState } from "react"


const exams = [
  {
    id: 1,
    title: "Математикийн үндсэн шалгалт",
    duration: 60,
    questions: 20,
    status: "available",
    deadline: "2025-12-10",
  },
  {
    id: 2,
    title: "Англи хэлний шалгалт - Intermediate",
    duration: 45,
    questions: 30,
    status: "available",
    deadline: "2025-12-15",
  },
  {
    id: 3,
    title: "Физикийн дунд шалгалт",
    duration: 90,
    questions: 25,
    status: "completed",
    score: 85,
    completedDate: "2025-11-28",
  },
]



export default function StudentDashboard() {
    const [name, setName] = useState("");

    useEffect(() => {
      const n = localStorage.getItem("name");
      if (n) setName(n);
    }, []);
  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
         <h1 className="mb-2 text-3xl font-bold">Сайн уу, {name}!</h1>
      <p className="text-muted-foreground">
        Таны өнөөдрийн шалгалт болон үр дүнг харах боломжтой
      </p>
        </div>


        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Шалгалтууд</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Бүгд
              </Button>
              <Button variant="outline" size="sm">
                Хүлээгдэж буй
              </Button>
              <Button variant="outline" size="sm">
                Дууссан
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {exams.map((exam) => (
              <Card key={exam.id} className="transition-all hover:border-primary">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <CardTitle className="text-xl">{exam.title}</CardTitle>
                        {exam.status === "available" ? (
                          <Badge variant="default">Боломжтой</Badge>
                        ) : (
                          <Badge variant="secondary">Дууссан</Badge>
                        )}
                      </div>
                      <CardDescription className="flex flex-wrap gap-4 text-base">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {exam.duration} минут
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {exam.questions} асуулт
                        </span>
                      </CardDescription>
                    </div>

                    {exam.status === "available" ? (
                      <Button asChild>
                        <Link href={`/exam/${exam.id}`}>Эхлүүлэх</Link>
                      </Button>
                    ) : (
                      <Button variant="outline" asChild>
                        <Link href={`/student/result/${exam.id}`}>Үр дүн харах</Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
