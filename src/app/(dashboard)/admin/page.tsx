"use client";

import { verifyRole } from "@/lib/auth/verifyRole";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { FileText, TrendingUp, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { ThemeToggle } from "@/app/components/theme-toggle";
import { AdminSidebar } from "@/app/components/admin-sidebar";
import { api } from "@/lib/axios";

type Exam = {
  _id: string;
  createdAt: string;
};

type Attempt = {
  _id: string;
  examId: { _id: string } | string;
  score: number;
  totalQuestions: number;
  createdAt: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = verifyRole();
    if (role !== "admin") {
      router.push("/login");
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [examsRes, attemptsRes] = await Promise.all([
          api.get("/exams"),
          api.get("/attempts"),
        ]);
        if (cancelled) return;
        setExams(examsRes.data as Exam[]);
        setAttempts(attemptsRes.data as Attempt[]);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const computed = useMemo(() => {
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    const totalExams = exams.length;
    const newExams = exams.filter((e) => {
      const t = new Date(e.createdAt).getTime();
      return Number.isFinite(t) && now - t <= sevenDaysMs;
    }).length;

    const attemptPercents = attempts
      .filter((a) => typeof a.totalQuestions === "number" && a.totalQuestions > 0)
      .map((a) => Math.round((a.score / a.totalQuestions) * 100));

    const avgScore =
      attemptPercents.length === 0
        ? 0
        : Math.round(
            attemptPercents.reduce((sum, v) => sum + v, 0) /
              attemptPercents.length
          );

    const activeExamIds = new Set(
      attempts
        .filter((a) => {
          const t = new Date(a.createdAt).getTime();
          return Number.isFinite(t) && now - t <= sevenDaysMs;
        })
        .map((a) => (typeof a.examId === "string" ? a.examId : a.examId?._id))
        .filter(Boolean) as string[]
    );

    const activeExams = activeExamIds.size;

    return { totalExams, newExams, avgScore, activeExams };
  }, [attempts, exams]);

  const stats = [
    {
      label: "Нийт шалгалт",
      value: computed.totalExams,
      icon: FileText,
      color: "text-blue-600",
      trend: computed.newExams > 0 ? `+${computed.newExams} шинэ` : undefined,
    },
    {
      label: "Дундаж оноо",
      value: `${computed.avgScore}%`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      label: "Идэвхтэй шалгалт",
      value: computed.activeExams,
      icon: Clock,
      color: "text-orange-600",
    },
  ] as const;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold">Нүүр хуудас</h1>
              <p className="text-sm text-muted-foreground">
                Системийн ерөнхий мэдээлэл
              </p>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  Уншиж байна...
                </CardContent>
              </Card>
            ) : (
              stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {stat.trend && (
                        <Badge variant="secondary" className="text-xs">
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
