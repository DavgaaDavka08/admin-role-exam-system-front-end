"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ExamClientPage() {
  const params = useParams();
  const examId = params.id as string;

  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [attemptId, setAttemptId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  // LOAD EXAM + START ATTEMPT
  useEffect(() => {
    api.get(`/exams/${examId}`).then((res) => {
      setExam(res.data);
      setTimeLeft(res.data.duration * 60);
    });

    const studentId = localStorage.getItem("id") || "default-student";

    api.post("/attempts/start", { studentId, examId }).then((res) => {
      setAttemptId(res.data._id);
    });
  }, [examId]);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowTimeUpDialog(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!exam) return <div>Loading...</div>;

  const questions = exam.questions;
  const q = questions[currentQuestion];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const saveAnswer = async (questionId: string, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });

    // backend save
    await api.post("/attempts/answer", {
      attemptId,
      questionId,
      selectedOption: optionId,
    });
  };

  const finishExam = async () => {
    await api.post("/attempts/submit", { attemptId });

    // Toast
    toast.success("Шалгалт амжилттай илгээгдлээ!");

    // Student dashboard руу буцах
    router.push("/student");
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <h1 className="text-lg font-bold">{exam.title}</h1>
            <p className="text-xs text-muted-foreground">
              {answeredCount}/{questions.length} асуулт хариулсан
            </p>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-mono text-2xl font-bold",
              timeLeft < 300
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-primary bg-primary/10 text-primary"
            )}
          >
            <Clock className="h-6 w-6" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="container mx-auto flex gap-6 p-4 lg:p-6">
        {/* Sidebar Navigation */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <Card className="sticky top-24">
            <CardContent className="p-4">
              <h3 className="mb-4 font-semibold">Асуултууд</h3>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((item: any, idx: number) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md border-2 text-sm font-medium transition-all hover:scale-105",
                      currentQuestion === idx &&
                        "border-primary bg-primary text-primary-foreground",
                      currentQuestion !== idx &&
                        answers[item.id] &&
                        "border-secondary bg-secondary/20 text-secondary",
                      currentQuestion !== idx &&
                        !answers[item.id] &&
                        "border-border bg-background hover:border-primary/50"
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
                  <Badge variant="outline">
                    {questions.length - answeredCount}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* MAIN QUESTION AREA */}
        <main className="flex-1">
          <Card className="mb-6">
            <CardContent className="p-6 lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <Badge variant="outline" className="text-sm">
                  Асуулт {currentQuestion + 1}/{questions.length}
                </Badge>
              </div>

              <h2 className="mb-8 text-xl font-medium leading-relaxed lg:text-2xl">
                {q.question}
              </h2>

              <div className="space-y-3">
                {q.options.map((opt: any) => (
                  <button
                    key={opt.id}
                    onClick={() => saveAnswer(q.id, opt.id)}
                    className={cn(
                      "w-full rounded-lg border-2 p-4 text-left transition-all hover:border-primary hover:bg-primary/5",
                      answers[q.id] === opt.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-bold",
                          answers[q.id] === opt.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 bg-background text-muted-foreground"
                        )}
                      >
                        {opt.id}
                      </div>

                      <span className="flex-1 pt-1 text-base leading-relaxed">
                        {opt.text}
                      </span>
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
              onClick={() =>
                setCurrentQuestion(Math.max(0, currentQuestion - 1))
              }
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Өмнөх
            </Button>

            {currentQuestion === questions.length - 1 ? (
              <Button
                size="lg"
                onClick={() => setShowSubmitDialog(true)}
                className="w-full sm:w-auto"
              >
                Шалгалт дуусгах
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="w-full sm:w-auto"
              >
                Дараах
              </Button>
            )}
          </div>

          {/* Mobile question navigator */}
          <Card className="mt-6 lg:hidden">
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-semibold">Асуултын дугаарууд</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((item: any, idx: number) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md border-2 text-sm font-medium",
                      currentQuestion === idx &&
                        "border-primary bg-primary text-primary-foreground",
                      currentQuestion !== idx &&
                        answers[item.id] &&
                        "border-secondary bg-secondary/20",
                      currentQuestion !== idx &&
                        !answers[item.id] &&
                        "border-border"
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

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Шалгалтыг дуусгах уу?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <div>
                Та {answeredCount}/{questions.length} асуултад хариулсан байна.
              </div>
              {answeredCount < questions.length && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Хариулаагүй асуултууд автоматаар буруу тооцогдоно.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Үргэлжлүүлэх</AlertDialogCancel>
            <AlertDialogAction onClick={finishExam}>Дуусгах</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Up Dialog */}
      <AlertDialog open={showTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Хугацаа дууслаа!</AlertDialogTitle>
            <AlertDialogDescription>
              Хугацаа дууссан тул шалгалт автоматаар илгээгдлээ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={finishExam}>
              Үр дүн харах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
