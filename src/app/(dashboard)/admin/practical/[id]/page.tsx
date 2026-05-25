"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { verifyRole } from "@/lib/auth/verifyRole";
import {
  getPracticalSubmission,
  reviewPracticalSubmission,
} from "@/lib/practical/api";
import type {
  PracticalScoreBreakdown,
  PracticalStatus,
  PracticalSubmission,
  PracticalTask,
  PracticalTaskReview,
} from "@/lib/types/exam";

import { AdminSidebar } from "@/app/components/admin-sidebar";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { StatusBadge } from "@/components/practical/StatusBadge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  FileArchive,
  ImageIcon,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const CRITERIA: {
  key: keyof PracticalScoreBreakdown;
  label: string;
  description: string;
}[] = [
  {
    key: "uiSimilarity",
    label: "UI ижил төстэй байдал",
    description: "Reference зурагтай харьцуулахад харагдах төрх",
  },
  {
    key: "responsive",
    label: "Responsive дизайн",
    description: "Дэлгэцийн янз бүрийн хэмжээнд ажиллах",
  },
  {
    key: "codeStructure",
    label: "Кодын бүтэц",
    description: "Цэвэр, унших боломжтой, зохион байгуулалттай",
  },
  {
    key: "functionality",
    label: "Функциональ байдал",
    description: "Шаардлагатай функцууд бүрэн ажиллах эсэх",
  },
];

const blankBreakdown: PracticalScoreBreakdown = {
  uiSimilarity: 0,
  responsive: 0,
  codeStructure: 0,
  functionality: 0,
};

export default function AdminPracticalReviewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const submissionId = params.id;

  const [sub, setSub] = useState<PracticalSubmission | null>(null);
  const [tasks, setTasks] = useState<PracticalTask[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Record<string, PracticalTaskReview>>({});
  const [overallFeedback, setOverallFeedback] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (verifyRole() !== "admin") {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getPracticalSubmission(submissionId);
        if (cancelled) return;
        const exam =
          typeof data.examId === "string"
            ? null
            : data.examId;
        const examTasks: PracticalTask[] = exam?.practicalTasks || [];
        setSub(data);
        setTasks(examTasks);
        setActiveTaskId(examTasks[0]?.id || null);
        setOverallFeedback(data.overallFeedback || "");

        const existingReviews: Record<string, PracticalTaskReview> = {};
        examTasks.forEach((t) => {
          const r = data.reviews?.find((x) => x.taskId === t.id);
          existingReviews[t.id] = {
            taskId: t.id,
            scores: r?.scores || { ...blankBreakdown },
            feedback: r?.feedback || "",
            totalScore: r?.totalScore || 0,
          };
        });
        setReviews(existingReviews);
      } catch (e) {
        console.error(e);
        toast.error("Ажил уншиж чадсангүй");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;
  const activeSubmission = sub?.tasks.find((t) => t.taskId === activeTaskId);
  const activeReview = activeTaskId
    ? reviews[activeTaskId]
    : undefined;

  const totals = useMemo(() => {
    let sum = 0;
    let max = 0;
    tasks.forEach((t) => {
      max += t.maxScore || 0;
      const r = reviews[t.id];
      if (r) {
        sum +=
          (r.scores.uiSimilarity || 0) +
          (r.scores.responsive || 0) +
          (r.scores.codeStructure || 0) +
          (r.scores.functionality || 0);
      }
    });
    return { sum, max };
  }, [reviews, tasks]);

  const maxPerCriterion = activeTask
    ? Math.round(((activeTask.maxScore || 100) / 4) * 100) / 100
    : 25;

  const updateScore = (key: keyof PracticalScoreBreakdown, value: number) => {
    if (!activeTaskId) return;
    setReviews((prev) => {
      const r = prev[activeTaskId] || {
        taskId: activeTaskId,
        scores: { ...blankBreakdown },
        totalScore: 0,
      };
      const scores = {
        ...r.scores,
        [key]: Math.max(0, Math.min(maxPerCriterion, Number(value) || 0)),
      };
      const totalScore =
        scores.uiSimilarity +
        scores.responsive +
        scores.codeStructure +
        scores.functionality;
      return { ...prev, [activeTaskId]: { ...r, scores, totalScore } };
    });
  };

  const updateFeedback = (value: string) => {
    if (!activeTaskId) return;
    setReviews((prev) => ({
      ...prev,
      [activeTaskId]: {
        ...(prev[activeTaskId] || {
          taskId: activeTaskId,
          scores: { ...blankBreakdown },
          totalScore: 0,
        }),
        feedback: value,
      },
    }));
  };

  const save = async (status?: PracticalStatus) => {
    if (!sub) return;
    setSaving(true);
    try {
      const updated = await reviewPracticalSubmission(sub._id, {
        reviews: Object.values(reviews),
        status,
        overallFeedback,
      });
      setSub(updated);
      toast.success("Хадгалагдлаа");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !sub) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-6 text-sm text-muted-foreground">
          Уншиж байна...
        </main>
      </div>
    );
  }

  const student = typeof sub.studentId === "string" ? null : sub.studentId;
  const exam = typeof sub.examId === "string" ? null : sub.examId;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/practical">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-bold">
                  {exam?.title || "Шалгалт"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {student?.name} {student?.grade && `· ${student.grade}`}
                </p>
              </div>
              <StatusBadge status={sub.status} className="ml-3" />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                Нийт оноо: {totals.sum}/{totals.max}
              </Badge>
              <Button
                variant="outline"
                onClick={() => save("failed")}
                disabled={saving}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Тэнцээгүй
              </Button>
              <Button onClick={() => save("passed")} disabled={saving}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Тэнцсэн
              </Button>
              <Button
                variant="secondary"
                onClick={() => save()}
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                Хадгалах
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="grid gap-4 p-6 lg:grid-cols-[200px_1fr]">
          {/* Task switcher */}
          <aside className="space-y-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Даалгаврууд
            </p>
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Даалгавар алга байна
              </p>
            ) : (
              tasks.map((t, idx) => {
                const r = reviews[t.id];
                const submitted = sub.tasks?.find(
                  (x) => x.taskId === t.id
                );
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTaskId(t.id)}
                    className={`w-full rounded-lg border p-3 text-left text-sm transition ${
                      activeTaskId === t.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">#{idx + 1}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {r?.totalScore || 0}/{t.maxScore}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {t.title || "—"}
                    </p>
                    <div className="mt-2 flex gap-1">
                      {submitted?.archive ? (
                        <Badge variant="secondary" className="text-[10px]">
                          ZIP
                        </Badge>
                      ) : null}
                      {submitted?.screenshots?.length ? (
                        <Badge variant="secondary" className="text-[10px]">
                          {submitted.screenshots.length} зураг
                        </Badge>
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </aside>

          {/* Review area */}
          <section>
            {activeTask ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {/* LEFT — reference + instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Жишиг материал
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold">
                        {activeTask.title}
                      </p>
                      {activeTask.instructions && (
                        <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                          {activeTask.instructions}
                        </p>
                      )}
                    </div>

                    {activeTask.referenceImage && (
                      <div>
                        <Label className="text-xs uppercase text-muted-foreground">
                          Reference
                        </Label>
                        <div className="mt-1 overflow-hidden rounded-md border">
                          <Image
                            src={activeTask.referenceImage}
                            alt="reference"
                            width={800}
                            height={500}
                            unoptimized
                            className="h-auto w-full"
                          />
                        </div>
                      </div>
                    )}

                    {activeTask.exampleImage && (
                      <div>
                        <Label className="text-xs uppercase text-muted-foreground">
                          Жишээ
                        </Label>
                        <div className="mt-1 overflow-hidden rounded-md border">
                          <Image
                            src={activeTask.exampleImage}
                            alt="example"
                            width={800}
                            height={500}
                            unoptimized
                            className="h-auto w-full"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* RIGHT — student submission + scoring */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Сурагчийн ажил
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeSubmission?.archive ? (
                      <div className="flex items-center justify-between rounded-md border bg-muted/40 p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <FileArchive className="h-4 w-4" />
                          <span className="truncate">
                            {activeSubmission.archive.originalName ||
                              "Архив файл"}
                          </span>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <a
                            href={activeSubmission.archive.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Download className="mr-2 h-3 w-3" />
                            Татах
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Архив файл хуулаагүй байна
                      </p>
                    )}

                    {!!activeSubmission?.screenshots?.length && (
                      <div>
                        <Label className="text-xs uppercase text-muted-foreground">
                          <ImageIcon className="mr-1 inline h-3 w-3" />
                          Сурагчийн screenshot ({activeSubmission.screenshots.length})
                        </Label>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {activeSubmission.screenshots.map((s, i) => (
                            <a
                              key={i}
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              className="overflow-hidden rounded-md border"
                            >
                              <Image
                                src={s.url}
                                alt={`screenshot-${i}`}
                                width={400}
                                height={250}
                                unoptimized
                                className="h-auto w-full"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSubmission?.notes && (
                      <div>
                        <Label className="text-xs uppercase text-muted-foreground">
                          Сурагчийн тэмдэглэл
                        </Label>
                        <p className="mt-1 whitespace-pre-line rounded-md border bg-muted/40 p-2 text-sm">
                          {activeSubmission.notes}
                        </p>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>
                          Оноо (Дээд тал нь {maxPerCriterion} оноо тус бүрт)
                        </Label>
                        <Badge variant="outline">
                          {activeReview?.totalScore || 0}/{activeTask.maxScore}
                        </Badge>
                      </div>

                      <div className="grid gap-3">
                        {CRITERIA.map((c) => (
                          <div key={c.key} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                <p className="font-medium">{c.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {c.description}
                                </p>
                              </div>
                              <Input
                                type="number"
                                min={0}
                                max={maxPerCriterion}
                                step={0.5}
                                value={activeReview?.scores[c.key] ?? 0}
                                onChange={(e) =>
                                  updateScore(c.key, Number(e.target.value))
                                }
                                className="w-24"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Тайлбар (даалгаврын тухай)</Label>
                      <Textarea
                        rows={3}
                        value={activeReview?.feedback || ""}
                        onChange={(e) => updateFeedback(e.target.value)}
                        placeholder="Сурагчид өгөх тайлбар..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  Даалгавар алга байна.
                </CardContent>
              </Card>
            )}

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Ерөнхий сэтгэгдэл</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={3}
                  value={overallFeedback}
                  onChange={(e) => setOverallFeedback(e.target.value)}
                  placeholder="Бүх практик хэсэгт өгөх ерөнхий сэтгэгдэл..."
                />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
