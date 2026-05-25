"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/app/components/admin-sidebar";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { api } from "@/lib/axios";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { PracticalTaskCard } from "@/components/practical/PracticalTaskCard";
import { FileUploader } from "@/components/practical/FileUploader";
import type { Question, PracticalTask } from "@/lib/types/exam";

function makeBlankQuestion(): Question {
  return {
    id: uuid(),
    question: "",
    type: "single",
    options: [
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" },
    ],
    correctAnswer: "A",
    correctAnswers: ["A"],
  };
}

function makeBlankTask(): PracticalTask {
  return {
    id: uuid(),
    title: "",
    instructions: "",
    exampleImage: "",
    referenceImage: "",
    maxScore: 100,
  };
}

export default function NewExamPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");

  const [hasTheory, setHasTheory] = useState(true);
  const [hasPractical, setHasPractical] = useState(false);

  const [theoryMaxScore, setTheoryMaxScore] = useState("100");
  const [practicalMaxScore, setPracticalMaxScore] = useState("100");

  const [questions, setQuestions] = useState<Question[]>([makeBlankQuestion()]);
  const [practicalTasks, setPracticalTasks] = useState<PracticalTask[]>([]);

  const updateQuestion = (id: string, patch: Partial<Question>) => {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    patch: { text?: string; image?: string }
  ) => {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, ...patch } : o
              ),
            }
          : q
      )
    );
  };

  const toggleCorrect = (q: Question, optId: string) => {
    if (q.type === "single") {
      updateQuestion(q.id, {
        correctAnswer: optId,
        correctAnswers: [optId],
      });
      return;
    }
    const current = new Set(q.correctAnswers || []);
    if (current.has(optId)) current.delete(optId);
    else current.add(optId);
    const arr = Array.from(current);
    updateQuestion(q.id, {
      correctAnswers: arr,
      correctAnswer: arr[0] || "",
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Шалгалтын нэр хоосон байна!");
      return;
    }
    if (!hasTheory && !hasPractical) {
      toast.error("Хамгийн багадаа нэг хэсэг сонгох шаардлагатай (Theory эсвэл Practical)");
      return;
    }
    if (hasTheory && questions.length === 0) {
      toast.error("Theory хэсэгт дор хаяж 1 асуулт нэмнэ үү");
      return;
    }
    if (hasPractical && practicalTasks.length === 0) {
      toast.error("Practical хэсэгт дор хаяж 1 даалгавар нэмнэ үү");
      return;
    }
    if (hasPractical && practicalTasks.some((t) => !t.title.trim())) {
      toast.error("Бүх даалгаврын гарчгийг бөглөнө үү");
      return;
    }

    try {
      await api.post("/exams", {
        title,
        description,
        duration: Number(duration),
        hasTheory,
        hasPractical,
        theoryMaxScore: Number(theoryMaxScore) || 100,
        practicalMaxScore: Number(practicalMaxScore) || 100,
        questions: hasTheory ? questions : [],
        practicalTasks: hasPractical ? practicalTasks : [],
      });
      toast.success("Шалгалт амжилттай хадгалагдлаа");
      router.push("/admin/exams");
    } catch (err) {
      toast.error("Хадгалах явцад алдаа гарлаа");
      console.error(err);
    }
  };

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
                <h1 className="text-2xl font-bold">Шинэ шалгалт үүсгэх</h1>
                <p className="text-sm text-muted-foreground">
                  Theory болон Practical хэсгүүдийг бэлдэх
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin/exams">Цуцлах</Link>
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Хадгалах
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Үндсэн мэдээлэл</CardTitle>
              <CardDescription>Шалгалтын нэр, бүтэц, оноо</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Шалгалтын нэр</Label>
                <Input
                  id="title"
                  placeholder="Жишээ нь: Веб хөгжүүлэлт - семестрийн шалгалт"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Тайлбар</Label>
                <Textarea
                  id="description"
                  placeholder="Энэ шалгалтын тухай товч мэдээлэл"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Хугацаа (минут) — Theory</Label>
                <Input
                  id="duration"
                  placeholder="60"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-32"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base">Part 1 — Theory</Label>
                    <p className="text-sm text-muted-foreground">
                      Сонгох/олон сонголттой асуулт
                    </p>
                  </div>
                  <Switch checked={hasTheory} onCheckedChange={setHasTheory} />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base">Part 2 — Practical</Label>
                    <p className="text-sm text-muted-foreground">
                      Кодын даалгавар + файл хуулах
                    </p>
                  </div>
                  <Switch
                    checked={hasPractical}
                    onCheckedChange={setHasPractical}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {hasTheory && (
                  <div className="space-y-2">
                    <Label>Theory максимум оноо</Label>
                    <Input
                      type="number"
                      min={1}
                      value={theoryMaxScore}
                      onChange={(e) => setTheoryMaxScore(e.target.value)}
                      className="w-32"
                    />
                  </div>
                )}
                {hasPractical && (
                  <div className="space-y-2">
                    <Label>Practical максимум оноо</Label>
                    <Input
                      type="number"
                      min={1}
                      value={practicalMaxScore}
                      onChange={(e) => setPracticalMaxScore(e.target.value)}
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {hasTheory && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Part 1 — Theory ({questions.length})
                </h2>
                <Button
                  onClick={() => setQuestions((qs) => [...qs, makeBlankQuestion()])}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Асуулт нэмэх
                </Button>
              </div>

              {questions.map((question, qIndex) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Асуулт {qIndex + 1}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Label htmlFor={`type-${question.id}`}>
                            Олон зөв хариулттай
                          </Label>
                          <Switch
                            id={`type-${question.id}`}
                            checked={question.type === "multiple"}
                            onCheckedChange={(checked) => {
                              const t = checked ? "multiple" : "single";
                              const correctAnswers =
                                t === "single"
                                  ? [question.correctAnswers?.[0] || "A"]
                                  : question.correctAnswers || [];
                              updateQuestion(question.id, {
                                type: t,
                                correctAnswers,
                                correctAnswer: correctAnswers[0] || "",
                              });
                            }}
                          />
                        </div>

                        {questions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setQuestions((qs) =>
                                qs.filter((q) => q.id !== question.id)
                              )
                            }
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Асуулт</Label>
                      <Textarea
                        placeholder="Асуултаа оруулна уу"
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            question: e.target.value,
                          })
                        }
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Асуултын зураг (заавал биш)</Label>
                      <FileUploader
                        kind="image"
                        value={
                          question.image
                            ? ({ url: question.image, originalName: "image" } as any)
                            : null
                        }
                        onChange={(f) =>
                          updateQuestion(question.id, { image: f?.url || "" })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>
                        Хариултууд —{" "}
                        {question.type === "multiple"
                          ? "Олон зөв хариулт сонгох боломжтой"
                          : "Зөв хариултыг нэгийг сонго"}
                      </Label>
                      {question.options.map((option) => {
                        const isCorrect = (question.correctAnswers || []).includes(
                          option.id
                        );
                        return (
                          <div
                            key={option.id}
                            className="flex items-start gap-3"
                          >
                            <button
                              type="button"
                              onClick={() => toggleCorrect(question, option.id)}
                              className={`mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border font-semibold transition ${
                                isCorrect
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-border bg-background"
                              }`}
                              title="Зөв хариулт болгох"
                            >
                              {option.id}
                            </button>
                            <div className="flex-1 space-y-2">
                              <Input
                                placeholder={`Хариулт ${option.id}`}
                                value={option.text}
                                onChange={(e) =>
                                  updateOption(question.id, option.id, {
                                    text: e.target.value,
                                  })
                                }
                              />
                              <FileUploader
                                kind="image"
                                value={
                                  option.image
                                    ? ({ url: option.image, originalName: "option" } as any)
                                    : null
                                }
                                onChange={(f) =>
                                  updateOption(question.id, option.id, {
                                    image: f?.url || "",
                                  })
                                }
                                label="Хариултын зураг (заавал биш)"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}

          {hasPractical && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Part 2 — Practical ({practicalTasks.length})
                </h2>
                <Button
                  onClick={() =>
                    setPracticalTasks((ts) => [...ts, makeBlankTask()])
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Даалгавар нэмэх
                </Button>
              </div>

              {practicalTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Даалгавар нэмээгүй байна. Дээрх товчийг дарж шинэ даалгавар
                    нэмнэ үү.
                  </CardContent>
                </Card>
              ) : (
                practicalTasks.map((task, idx) => (
                  <PracticalTaskCard
                    key={task.id}
                    task={task}
                    index={idx}
                    onChange={(updated) =>
                      setPracticalTasks((ts) =>
                        ts.map((t) => (t.id === updated.id ? updated : t))
                      )
                    }
                    onRemove={
                      practicalTasks.length > 0
                        ? () =>
                            setPracticalTasks((ts) =>
                              ts.filter((t) => t.id !== task.id)
                            )
                        : undefined
                    }
                  />
                ))
              )}
            </section>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/exams">Цуцлах</Link>
            </Button>
            <Button onClick={handleSave} size="lg">
              <Save className="mr-2 h-4 w-4" />
              Шалгалт хадгалах
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
