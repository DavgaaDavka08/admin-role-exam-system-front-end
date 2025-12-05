"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const mockQuestions = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  question: `Асуулт ${i + 1}: ${i % 2 === 0 ? "Дараах аль нь зөв вэ? Энэ асуулт нь математикийн суурь мэдлэгийг шалгах зорилготой бөгөөд та анхааралтай уншиж хариулна уу." : "JavaScript дээр function declaration болон function expression-ий ялгаа юу вэ?"}`,
  options: [
    { id: "A", text: "Хариулт A: Энэ нь эхний сонголт юм" },
    { id: "B", text: "Хариулт B: Энэ нь хоёрдахь сонголт" },
    { id: "C", text: "Хариулт C: Энэ нь гуравдахь сонголт" },
    { id: "D", text: "Хариулт D: Энэ нь дөрөвдөхь сонголт" },
  ],
}))

export default function ExamPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowTimeUpDialog(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (questionId: number, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId })
  }

  const handleSubmit = () => {
    router.push(`/student/result/${params.id}`)
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / mockQuestions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Timer */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <h1 className="text-lg font-bold">Математикийн үндсэн шалгалт</h1>
            <p className="text-xs text-muted-foreground">
              {answeredCount}/{mockQuestions.length} асуулт хариулсан
            </p>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-mono text-2xl font-bold",
              timeLeft < 300
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-primary bg-primary/10 text-primary",
            )}
          >
            <Clock className="h-6 w-6" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <div className="container mx-auto flex gap-6 p-4 lg:p-6">
        {/* Question Navigation Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <Card className="sticky top-24">
            <CardContent className="p-4">
              <h3 className="mb-4 font-semibold">Асуултууд</h3>
              <div className="grid grid-cols-5 gap-2">
                {mockQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md border-2 text-sm font-medium transition-all hover:scale-105",
                      currentQuestion === idx && "border-primary bg-primary text-primary-foreground",
                      currentQuestion !== idx && answers[q.id] && "border-secondary bg-secondary/20 text-secondary",
                      currentQuestion !== idx &&
                        !answers[q.id] &&
                        "border-border bg-background hover:border-primary/50",
                    )}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Хариулсан:</span>
                  <Badge variant="secondary">{answeredCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Үлдсэн:</span>
                  <Badge variant="outline">{mockQuestions.length - answeredCount}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Question Area */}
        <main className="flex-1">
          <Card className="mb-6">
            <CardContent className="p-6 lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <Badge variant="outline" className="text-sm">
                  Асуулт {currentQuestion + 1}/{mockQuestions.length}
                </Badge>
                <div className="flex gap-2 lg:hidden">
                  <Badge variant="secondary">{answeredCount} хариулсан</Badge>
                </div>
              </div>

              <h2 className="mb-8 text-xl font-medium leading-relaxed lg:text-2xl">
                {mockQuestions[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {mockQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(mockQuestions[currentQuestion].id, option.id)}
                    className={cn(
                      "w-full rounded-lg border-2 p-4 text-left transition-all hover:border-primary hover:bg-primary/5",
                      answers[mockQuestions[currentQuestion].id] === option.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-bold",
                          answers[mockQuestions[currentQuestion].id] === option.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 bg-background text-muted-foreground",
                        )}
                      >
                        {option.id}
                      </div>
                      <span className="flex-1 pt-1 text-base leading-relaxed">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Өмнөх
            </Button>

            {currentQuestion === mockQuestions.length - 1 ? (
              <Button size="lg" onClick={() => setShowSubmitDialog(true)} className="w-full sm:w-auto">
                Шалгалт дуусгах
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setCurrentQuestion(Math.min(mockQuestions.length - 1, currentQuestion + 1))}
                className="w-full sm:w-auto"
              >
                Дараах
              </Button>
            )}
          </div>

          {/* Mobile Question Grid */}
          <Card className="mt-6 lg:hidden">
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-semibold">Асуултын дугаарууд</h3>
              <div className="grid grid-cols-5 gap-2">
                {mockQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md border-2 text-sm font-medium",
                      currentQuestion === idx && "border-primary bg-primary text-primary-foreground",
                      currentQuestion !== idx && answers[q.id] && "border-secondary bg-secondary/20",
                      currentQuestion !== idx && !answers[q.id] && "border-border",
                    )}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Шалгалт дуусгах уу?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Та {answeredCount}/{mockQuestions.length} асуултад хариулсан байна.
              </p>
              {answeredCount < mockQuestions.length && (
                <p className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Хариулаагүй асуултууд автоматаар буруу гэж тооцогдоно.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Үргэлжлүүлэх</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Дуусгах</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Up Dialog */}
      <AlertDialog open={showTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Хугацаа дууссан!</AlertDialogTitle>
            <AlertDialogDescription>Шалгалтын хугацаа дууссан тул автоматаар илгээгдлээ.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmit}>Үр дүн харах</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
