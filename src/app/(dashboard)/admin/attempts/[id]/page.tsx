"use client";

import { verifyRole } from "@/lib/auth/verifyRole";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type AttemptAnswerResult = {
  questionId?: string;
  questionIndex?: number;
  selectedOption?: string | number;
  correctOption?: string | number;
  isCorrect?: boolean;
};

type AttemptResponse = {
  studentId?: { name?: string; grade?: string };
  answers?: AttemptAnswerResult[];
  total?: number;
  totalQuestions?: number;
  score?: number;
  correctCount?: number;
  wrongCount?: number;
  percentage?: number;
};

export default function AttemptDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [attempt, setAttempt] = useState<AttemptResponse | null>(null);

  useEffect(() => {
    const role = verifyRole();
    if (role !== "admin") {
      router.push("/login");
      return;
    }

    api
      .get(`/attempts/single/${id}`)
      .then((res) => setAttempt(res.data as AttemptResponse));
  }, [id, router]);

  if (!attempt) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Уншиж байна...</div>
    );
  }

  const answers: AttemptAnswerResult[] = Array.isArray(attempt.answers)
    ? attempt.answers
    : [];
  const total =
    typeof attempt.total === "number"
      ? attempt.total
      : typeof attempt.totalQuestions === "number"
        ? attempt.totalQuestions
        : answers.length;

  const correctFromAnswers = answers.filter((a) => a?.isCorrect === true).length;
  const wrongFromAnswers = answers.filter((a) => a?.isCorrect === false).length;

  const correctCount =
    typeof attempt.correctCount === "number"
      ? attempt.correctCount
      : correctFromAnswers > 0
        ? correctFromAnswers
        : typeof attempt.score === "number"
          ? attempt.score
          : 0;

  const wrongCount =
    typeof attempt.wrongCount === "number"
      ? attempt.wrongCount
      : wrongFromAnswers > 0
        ? wrongFromAnswers
        : Math.max(0, total - correctCount);

  const score = correctCount;
  const percentage =
    typeof attempt.percentage === "number"
      ? attempt.percentage
      : total === 0
        ? 0
        : Math.round((correctCount / total) * 100);

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
            Оноо: <b>{score}</b> / {total}
          </p>
          <p>
            ✅ Зөв хариулсан: <b>{correctCount}</b>
          </p>
          <p>
            ❌ Алдсан: <b>{wrongCount}</b>
          </p>
          <p>
            📊 Нийт: <b>{total}</b>
          </p>
          <p>
            📈 Хувь: <b>{percentage}%</b>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Асуултуудын хариу</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {answers.length > 0 ? (
            answers.map((a: AttemptAnswerResult, index: number) => {
              const isCorrect = a?.isCorrect === true;
              const isWrong = a?.isCorrect === false;

              const badgeVariant = isCorrect
                ? "secondary"
                : isWrong
                  ? "destructive"
                  : "outline";

              const containerClass = isCorrect
                ? "rounded-md border p-4 bg-green-50"
                : isWrong
                  ? "rounded-md border p-4 bg-red-50"
                  : "rounded-md border p-4 bg-muted/30";

              return (
                <div key={index} className={containerClass}>
                  <div className="flex justify-between items-center mb-2 gap-3">
                    <p className="font-semibold">
                      {a.questionIndex
                        ? `${a.questionIndex}-р асуулт`
                        : `Асуулт ID: ${a.questionId}`}
                    </p>
                    <Badge variant={badgeVariant}>
                      {isCorrect ? "Зөв" : isWrong ? "Буруу" : "Хариулаагүй"}
                    </Badge>
                  </div>

                  <p className="text-sm">
                    Сонгосон хариулт:{" "}
                    <b>{a.selectedOption ?? "—"}</b>
                  </p>
                  <p className="text-sm">
                    Зөв хариулт: <b>{a.correctOption ?? "—"}</b>
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              Хариултын мэдээлэл олдсонгүй.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
