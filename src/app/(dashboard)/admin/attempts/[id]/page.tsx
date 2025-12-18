"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState<any>(null);

  useEffect(() => {
    api.get(`/attempts/single/${id}`).then((res) => setAttempt(res.data));
  }, [id]);

  if (!attempt) return <>Loading...</>;

  const wrongAnswers = Array.isArray(attempt.answers)
    ? attempt.answers.filter((a: any) => a.isCorrect === false)
    : [];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {attempt.studentId?.name} — {attempt.studentId?.grade}-р анги
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-1 text-sm">
          <p>
            Оноо: <b>{attempt.score}</b> / {attempt.totalQuestions}
          </p>
          <p>
            Алдсан асуултын тоо: <b>{wrongAnswers.length}</b>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Алдсан асуултууд</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {wrongAnswers.length > 0 ? (
            wrongAnswers.map((a: any, index: number) => (
              <div key={index} className="rounded-md border p-4 bg-red-50">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">
                    {a.questionIndex
                      ? `${a.questionIndex}-р асуулт`
                      : `Асуулт ID: ${a.questionId}`}
                  </p>
                  <Badge variant="destructive">Буруу</Badge>
                </div>

                <p className="text-sm">
                  Сонгосон хариулт: <b>{a.selectedOption}</b>
                </p>
                <p className="text-sm">
                  Зөв хариулт: <b>{a.correctOption}</b>
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-green-700 font-medium">
              Бүх асуултад зөв хариулсан байна.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
