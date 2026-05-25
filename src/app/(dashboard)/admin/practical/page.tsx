"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { verifyRole } from "@/lib/auth/verifyRole";
import {
  listPracticalSubmissions,
} from "@/lib/practical/api";
import type { PracticalStatus, PracticalSubmission } from "@/lib/types/exam";

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
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  Eye,
  GraduationCap,
  Calendar,
} from "lucide-react";

const STATUSES: { value: PracticalStatus | "all"; label: string }[] = [
  { value: "all", label: "Бүгд" },
  { value: "pending", label: "Хүлээгдэж буй" },
  { value: "reviewed", label: "Шалгасан" },
  { value: "passed", label: "Тэнцсэн" },
  { value: "failed", label: "Тэнцээгүй" },
];

export default function AdminPracticalPage() {
  const router = useRouter();
  const [subs, setSubs] = useState<PracticalSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PracticalStatus | "all">("all");

  useEffect(() => {
    const role = verifyRole();
    if (role !== "admin") {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await listPracticalSubmissions(
          filter === "all" ? undefined : { status: filter }
        );
        if (!cancelled) setSubs(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const counts = useMemo(() => {
    const c: Record<PracticalStatus, number> = {
      pending: 0,
      reviewed: 0,
      passed: 0,
      failed: 0,
    };
    subs.forEach((s) => {
      c[s.status] = (c[s.status] || 0) + 1;
    });
    return c;
  }, [subs]);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold">Практик шалгалт</h1>
              <p className="text-sm text-muted-foreground">
                Сурагчдын илгээсэн ажлуудыг шалгаж оноо өгөх
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(["pending", "reviewed", "passed", "failed"] as PracticalStatus[]).map(
              (s) => (
                <Card key={s}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {STATUSES.find((x) => x.value === s)?.label}
                      </p>
                      <p className="text-2xl font-bold">{counts[s] || 0}</p>
                    </div>
                    <StatusBadge status={s} />
                  </CardContent>
                </Card>
              )
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Button
                key={s.value}
                variant={filter === s.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(s.value)}
              >
                {s.label}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">
              Уншиж байна...
            </div>
          ) : subs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Илгээсэн ажил алга байна.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {subs.map((sub) => {
                const student =
                  typeof sub.studentId === "string" ? null : sub.studentId;
                const exam =
                  typeof sub.examId === "string" ? null : sub.examId;
                return (
                  <Card key={sub._id} className="transition hover:border-primary/60">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <ClipboardList className="h-4 w-4" />
                          {exam?.title || "Шалгалт"}
                        </CardTitle>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {student?.name} {student?.grade && `(${student.grade})`}
                          </span>
                          {sub.submittedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(sub.submittedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={sub.status} />
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline">
                          Оноо: {sub.totalScore}/{sub.maxScore}
                        </Badge>
                        <Badge variant="outline">
                          {sub.tasks?.length || 0} даалгавар
                        </Badge>
                      </div>
                      <Button asChild>
                        <Link href={`/admin/practical/${sub._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Нээж шалгах
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
