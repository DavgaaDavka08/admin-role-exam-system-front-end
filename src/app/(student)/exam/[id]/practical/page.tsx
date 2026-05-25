"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

function toDownloadUrl(url: string): string {
  if (!url) return url;
  if (url.includes("res.cloudinary.com") && url.includes("/raw/upload/")) {
    return url.replace("/raw/upload/", "/raw/upload/fl_attachment/");
  }
  return url;
}
import Image from "next/image";

import { api } from "@/lib/axios";
import {
  getMyPracticalSubmission,
  submitPractical,
  uploadFile,
} from "@/lib/practical/api";
import type {
  Exam,
  PracticalSubmission,
  PracticalTaskSubmission,
  StoredFile,
} from "@/lib/types/exam";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/practical/FileUploader";
import { StatusBadge } from "@/components/practical/StatusBadge";
import { ArrowLeft, Plus, Send, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function StudentPracticalPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const examId = params.id;

  const [exam, setExam] = useState<Exam | null>(null);
  const [studentId, setStudentId] = useState<string>("");
  const [submission, setSubmission] = useState<PracticalSubmission | null>(null);
  const [tasksState, setTasksState] = useState<
    Record<string, PracticalTaskSubmission>
  >({});

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (!id) {
      router.push("/login");
      return;
    }
    setStudentId(id);
  }, [router]);

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const examRes = await api.get<Exam>(`/exams/${examId}`);
        if (cancelled) return;
        setExam(examRes.data);

        const mine = await getMyPracticalSubmission(studentId, examId);
        if (cancelled) return;
        setSubmission(mine);

        const initial: Record<string, PracticalTaskSubmission> = {};
        (examRes.data.practicalTasks || []).forEach((t) => {
          const existing = mine?.tasks?.find((x) => x.taskId === t.id);
          initial[t.id] = existing || { taskId: t.id, screenshots: [] };
        });
        setTasksState(initial);
      } catch (e) {
        console.error(e);
        toast.error("Шалгалт ачааллахад алдаа гарлаа");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [studentId, examId]);

  const readOnly = !!submission?.isSubmitted;

  const setTask = (
    taskId: string,
    patch: Partial<PracticalTaskSubmission>
  ) => {
    setTasksState((prev) => ({
      ...prev,
      [taskId]: { ...(prev[taskId] || { taskId }), ...patch },
    }));
  };

  const addScreenshot = async (taskId: string, file: File) => {
    setBusy(true);
    try {
      const stored = await uploadFile(file, "image");
      const current = tasksState[taskId]?.screenshots || [];
      setTask(taskId, { screenshots: [...current, stored] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Зураг хуулахад алдаа гарлаа");
    } finally {
      setBusy(false);
    }
  };

  const removeScreenshot = (taskId: string, idx: number) => {
    const current = tasksState[taskId]?.screenshots || [];
    setTask(taskId, {
      screenshots: current.filter((_, i) => i !== idx),
    });
  };

  const handleSave = async (finalize = false) => {
    if (!studentId) return;
    if (finalize) {
      const missing = (exam?.practicalTasks || []).find(
        (t) => !tasksState[t.id]?.archive && !tasksState[t.id]?.screenshots?.length
      );
      if (missing) {
        toast.error(
          `"${missing.title}" даалгаварт файл эсвэл зураг хуулна уу`
        );
        return;
      }
      if (!confirm("Илгээсний дараа өөрчилж болохгүй. Илгээх үү?")) return;
    }

    setBusy(true);
    try {
      const result = await submitPractical({
        studentId,
        examId,
        tasks: Object.values(tasksState),
        finalize,
      });
      setSubmission(result);
      toast.success(finalize ? "Амжилттай илгээгдлээ" : "Хадгалагдлаа");
      if (finalize) router.push("/student");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setBusy(false);
    }
  };

  const tasks = exam?.practicalTasks || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 text-sm text-muted-foreground">
        Уншиж байна...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-background p-6">Шалгалт олдсонгүй</div>
    );
  }

  if (!exam.hasPractical || tasks.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        Энэ шалгалтад практик хэсэг алга байна.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/student">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">{exam.title} — Part 2</h1>
              <p className="text-xs text-muted-foreground">
                Практик даалгавар. Файл болон screenshot хуулна уу.
              </p>
            </div>
            {submission && <StatusBadge status={submission.status} />}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={busy || readOnly}
            >
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Түр хадгалах
            </Button>
            <Button onClick={() => handleSave(true)} disabled={busy || readOnly}>
              <Send className="mr-2 h-4 w-4" />
              Илгээх
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-6 px-4 py-6">
        {readOnly && (
          <Card>
            <CardContent className="flex items-center justify-between p-4 text-sm">
              <span>
                Та аль хэдийн илгээсэн. Үр дүн нь шалгагдаад гарах болно.
              </span>
              {submission && (
                <Badge variant="outline">
                  {submission.totalScore}/{submission.maxScore}
                </Badge>
              )}
            </CardContent>
          </Card>
        )}

        {tasks.map((task, idx) => {
          const state = tasksState[task.id] || { taskId: task.id, screenshots: [] };
          return (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Даалгавар {idx + 1}: {task.title}
                    </CardTitle>
                    {task.instructions && (
                      <CardDescription className="mt-1 whitespace-pre-line">
                        {task.instructions}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="outline">Дээд оноо: {task.maxScore}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(task.referenceImage || task.exampleImage) && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {task.referenceImage && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Reference
                        </Label>
                        <Image
                          src={task.referenceImage}
                          alt="reference"
                          width={600}
                          height={400}
                          unoptimized
                          className="mt-1 h-auto w-full rounded-md border"
                        />
                      </div>
                    )}
                    {task.exampleImage && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Жишээ
                        </Label>
                        <Image
                          src={task.exampleImage}
                          alt="example"
                          width={600}
                          height={400}
                          unoptimized
                          className="mt-1 h-auto w-full rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Кодын архив (ZIP)</Label>
                    <FileUploader
                      kind="archive"
                      value={state.archive || null}
                      onChange={(f) => setTask(task.id, { archive: f || undefined })}
                      disabled={readOnly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Screenshot нэмэх</Label>
                    <FileUploader
                      kind="image"
                      value={null}
                      onChange={(f) => {
                        if (!f) return;
                        const current = state.screenshots || [];
                        setTask(task.id, { screenshots: [...current, f] });
                      }}
                      disabled={readOnly}
                    />
                  </div>
                </div>

                {!!state.screenshots?.length && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Хуулсан зургууд ({state.screenshots.length})
                    </Label>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {state.screenshots.map((s, i) => (
                        <div key={i} className="relative overflow-hidden rounded-md border">
                          <Image
                            src={s.url}
                            alt={`screenshot-${i}`}
                            width={300}
                            height={200}
                            unoptimized
                            className="h-32 w-full object-cover"
                          />
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() => removeScreenshot(task.id, i)}
                              className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white shadow"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Тэмдэглэл (заавал биш)</Label>
                  <Textarea
                    rows={2}
                    value={state.notes || ""}
                    onChange={(e) => setTask(task.id, { notes: e.target.value })}
                    disabled={readOnly}
                    placeholder="Жишээ нь: ашигласан tool, тулгарсан асуудал..."
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}

        {!readOnly && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleSave(false)} disabled={busy}>
              Түр хадгалах
            </Button>
            <Button onClick={() => handleSave(true)} disabled={busy}>
              <Send className="mr-2 h-4 w-4" />
              Эцэслэж илгээх
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
