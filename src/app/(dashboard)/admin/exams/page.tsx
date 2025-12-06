"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyRole } from "@/lib/auth/verifyRole";
import { api } from "@/lib/axios";

import { AdminSidebar } from "@/app/components/admin-sidebar";
import { ThemeToggle } from "@/app/components/theme-toggle";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  Users,
  BarChart2,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";

type Exam = {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  questions: { id: string }[];
  createdAt: string;
};

export default function AdminExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = verifyRole();
    if (role !== "admin") {
      router.push("/login");
      return;
    }

    api
      .get("/exams")
      .then((res) => setExams(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ шалгалтыг устгах уу?")) return;
    try {
      await api.delete(`/exams/${id}`);
      setExams((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      console.error("Failed to delete exam", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold">Шалгалтууд</h1>
              <p className="text-sm text-muted-foreground">
                Бүх шалгалтын жагсаалт
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

        <div className="p-6 space-y-4">
          {loading ? (
            <div>Уншиж байна...</div>
          ) : exams.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                Одоогоор шалгалт алга байна. Шинэ шалгалт үүсгэнэ үү.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {exams.map((exam) => (
                <Card
                  key={exam._id}
                  className="transition hover:border-primary/60"
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {exam.title}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {exam.description}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {new Date(exam.createdAt).toLocaleString()}
                    </Badge>
                  </CardHeader>

                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {exam.duration} мин
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> Асуулт:{" "}
                        {exam.questions?.length ?? 0}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/exams/${exam._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/exams/${exam._id}/analytics`}>
                          <BarChart2 className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(exam._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
