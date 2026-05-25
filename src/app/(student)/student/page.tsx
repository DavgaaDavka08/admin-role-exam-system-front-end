"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Code2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { getMyPracticalSubmission } from "@/lib/practical/api";
import { StatusBadge } from "@/components/practical/StatusBadge";
import type { PracticalSubmission } from "@/lib/types/exam";

type ExamRow = {
  _id: string;
  title: string;
  duration: number;
  questions: { id: string }[];
  practicalTasks?: { id: string }[];
  hasTheory?: boolean;
  hasPractical?: boolean;
  hasAttempt: boolean;
};

export default function StudentDashboard() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [practical, setPractical] = useState<
    Record<string, PracticalSubmission | null>
  >({});

  useEffect(() => {
    const n = localStorage.getItem("name");
    const g = localStorage.getItem("grade");
    const id = localStorage.getItem("id");

    if (n) setName(n);
    if (g) setGrade(g);

    if (!id) return;

    api.get(`/exams?studentId=${id}`).then(async (res) => {
      const list: ExamRow[] = res.data;
      setExams(list);

      const map: Record<string, PracticalSubmission | null> = {};
      await Promise.all(
        list
          .filter(
            (e) => e.hasPractical || (e.practicalTasks?.length || 0) > 0
          )
          .map(async (e) => {
            try {
              map[e._id] = await getMyPracticalSubmission(id, e._id);
            } catch {
              map[e._id] = null;
            }
          })
      );
      setPractical(map);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            Сайн уу, {name}! {grade && `(${grade}-р анги)`}
          </h1>
          <p className="text-muted-foreground">Танд оноогдсон шалгалтууд</p>
        </div>

        <div className="grid gap-4">
          {exams.map((exam) => {
            const hasTheory =
              exam.hasTheory ?? (exam.questions?.length || 0) > 0;
            const hasPractical =
              exam.hasPractical ?? (exam.practicalTasks?.length || 0) > 0;
            const ps = practical[exam._id];

            return (
              <Card key={exam._id} className="hover:border-primary transition">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl">{exam.title}</CardTitle>
                      <CardDescription className="mt-2 flex flex-wrap gap-4">
                        {hasTheory && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {exam.duration} мин
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />{" "}
                          {exam.questions?.length || 0} асуулт
                        </span>
                        {hasPractical && (
                          <span className="flex items-center gap-1">
                            <Code2 className="h-4 w-4" />{" "}
                            {exam.practicalTasks?.length || 0} даалгавар
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {hasTheory && (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-semibold">Part 1 — Theory</p>
                        <p className="text-xs text-muted-foreground">
                          {exam.hasAttempt ? "Өгсөн" : "Эхлүүлэхэд бэлэн"}
                        </p>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        disabled={exam.hasAttempt}
                        variant={exam.hasAttempt ? "secondary" : "default"}
                      >
                        <Link
                          href={exam.hasAttempt ? "#" : `/exam/${exam._id}`}
                        >
                          {exam.hasAttempt ? "Өгсөн" : "Эхлүүлэх"}
                        </Link>
                      </Button>
                    </div>
                  )}

                  {hasPractical && (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">
                          Part 2 — Practical
                        </p>
                        {ps ? (
                          <div className="flex items-center gap-2">
                            <StatusBadge status={ps.status} />
                            {ps.isSubmitted && (
                              <Badge variant="outline" className="text-[10px]">
                                {ps.totalScore}/{ps.maxScore}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Хүлээн авч эхлээгүй
                          </p>
                        )}
                        {ps?.overallFeedback && ps.status !== "pending" && (
                          <p className="mt-1 max-w-xs text-xs italic text-muted-foreground">
                            “{ps.overallFeedback}”
                          </p>
                        )}
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant={ps?.isSubmitted ? "secondary" : "default"}
                      >
                        <Link href={`/exam/${exam._id}/practical`}>
                          {ps?.isSubmitted ? "Харах" : "Хийх"}
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {exams.length === 0 && (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Танд оноогдсон шалгалт алга байна.
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
