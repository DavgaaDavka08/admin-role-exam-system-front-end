"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  FileText,
  ListChecks,
  BarChart2,
} from "lucide-react";

export default function ExamDetailClient({ exam }: { exam: any }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/exams">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Буцах
          </Link>
        </Button>

        <Button asChild variant="outline">
          <Link href={`/admin/exams/${exam._id}/analytics`}>
            <BarChart2 className="h-4 w-4 mr-2" />
            Анализ харах
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {exam.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {exam.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Хугацаа: <Badge>{exam.duration} мин</Badge>
            </span>

            <span className="flex items-center gap-1">
              <ListChecks className="h-4 w-4" />
              Асуултын тоо:{" "}
              <Badge variant="outline">{exam.questions?.length ?? 0}</Badge>
            </span>

            <span className="flex items-center gap-1">
              Үүссэн:{" "}
              <Badge variant="outline">
                {new Date(exam.createdAt).toLocaleString()}
              </Badge>
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-base">Асуултууд</h3>
            <div className="space-y-3">
              {exam.questions?.map((q: any, idx: number) => (
                <div
                  key={q.id}
                  className="rounded-lg border border-border p-3 text-sm"
                >
                  <div className="font-medium mb-2">
                    {idx + 1}. {q.question}
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {q.options?.map((opt: any) => (
                      <li
                        key={opt.id}
                        className="flex items-center justify-between rounded-md border px-2 py-1 text-xs"
                      >
                        <span>
                          <span className="font-semibold mr-1">{opt.id}.</span>
                          {opt.text}
                        </span>
                        {q.correctAnswer === opt.id && (
                          <Badge variant="secondary">Зөв хариулт</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
