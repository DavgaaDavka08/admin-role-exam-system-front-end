"use client";

import { verifyRole } from "@/lib/auth/verifyRole";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  FileText,
  Users,
  TrendingUp,
  Clock,
  Plus,
  MoreVertical,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { ThemeToggle } from "@/app/components/theme-toggle";
import { AdminSidebar } from "@/app/components/admin-sidebar";
const stats = [
  {
    label: "Нийт шалгалт",
    value: 12,
    icon: FileText,
    color: "text-blue-600",
    trend: "+3 шинэ",
  },
  {
    label: "Нийт сурагч",
    value: 452,
    icon: Users,
    color: "text-green-600",
    trend: "+18 энэ долоо хоногт",
  },
  {
    label: "Дундаж оноо",
    value: "76%",
    icon: TrendingUp,
    color: "text-purple-600",
  },
  {
    label: "Идэвхтэй шалгалт",
    value: 4,
    icon: Clock,
    color: "text-orange-600",
  },
];

export default function AdminPage() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const role = verifyRole();
    if (role !== "admin") router.push("/login");
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
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
            {stats.map((stat) => {
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
            })}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Сүүлийн шалгалтууд</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/exams">Бүгдийг харах</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary"
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-medium">{stat.label}</h3>
                        <Badge
                          variant={
                            stat.value === 12
                              ? "default"
                              : stat.value === 18
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {stat.value === 12
                            ? "Идэвхтэй"
                            : stat.value === 18
                            ? "Дууссан"
                            : "Ноорог"}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{stat.value} сурагч</span>
                        <span>Дундаж: {stat.value}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/exams/${stat.value}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Button asChild variant="secondary">
          <Link href={`/admin/exams/${id}/analytics`}>Анализ gogo харах</Link>
        </Button>
      </main>
    </div>
  );
}
