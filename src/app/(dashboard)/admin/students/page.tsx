"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Search, Download, Mail } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminSidebar } from "@/app/components/admin-sidebar";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { api } from "@/lib/axios";
import { verifyRole } from "@/lib/auth/verifyRole";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Attempt {
  _id: string;
  studentId: { _id: string } | string;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  grade: string;
  role: string;
  email?: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const role = verifyRole();
        if (role !== "admin") {
          router.push("/login");
          return;
        }

        const [usersRes, attemptsRes] = await Promise.all([
          api.get("/users"),
          api.get("/attempts"),
        ]);

        if (cancelled) return;
        setUsers(usersRes.data as User[]);
        setAttempts(attemptsRes.data as Attempt[]);
      } catch (err) {
        console.error(err);
        toast.error("Сурагчдын мэдээлэл татахад алдаа гарлаа");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const formattedData = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filteredUsers = users
      .filter((u) => u.role !== "admin")
      .filter((u) => {
        if (!q) return true;
        return (
          u.name?.toLowerCase().includes(q) ||
          u.grade?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
        );
      });

    return filteredUsers.map((user) => {
      const userAttempts = attempts.filter((a) =>
        typeof a.studentId === "string"
          ? a.studentId === user._id
          : a.studentId?._id === user._id
      );

      const examCount = userAttempts.length;
      let avg = 0;
      if (examCount > 0) {
        const totalScore = userAttempts.reduce(
          (sum, a) => sum + (a.score / a.totalQuestions) * 100,
          0
        );
        avg = Math.round(totalScore / examCount);
      }

      const lastAttempt = userAttempts[userAttempts.length - 1];
      const lastActive = lastAttempt
        ? new Date(lastAttempt.createdAt).toLocaleDateString()
        : "—";

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        grade: user.grade,
        exams: examCount,
        avgScore: avg,
        lastActive,
      };
    });
  }, [attempts, query, users]);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold">Сурагчид</h1>
              <p className="text-sm text-muted-foreground">
                Бүх сурагчдын мэдээлэл
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Экспорт
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Сурагч хайх..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">Шүүлтүүр</Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-sm text-muted-foreground">
                    Уншиж байна...
                  </div>
                ) : formattedData.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Сурагч олдсонгүй.
                  </div>
                ) : (
                  formattedData.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {student.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Анги: {student.grade}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.email ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xl font-bold">{student.exams}</div>
                        <p className="text-xs text-muted-foreground">Шалгалт</p>
                      </div>

                      <div className="text-center">
                        <div className="text-xl font-bold text-secondary">
                          {student.avgScore}%
                        </div>
                        <p className="text-xs text-muted-foreground">Дундаж</p>
                      </div>

                      <div className="text-center min-w-24">
                        <p className="text-sm">{student.lastActive}</p>
                        <p className="text-xs text-muted-foreground">Сүүлд</p>
                      </div>

                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
