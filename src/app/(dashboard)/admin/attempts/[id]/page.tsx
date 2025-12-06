"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState<any>(null);

  useEffect(() => {
    api.get(`/attempts/single/${id}`).then((res) => setAttempt(res.data));
  }, [id]);

  if (!attempt) return <>Loading...</>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {attempt.studentId?.name} — {attempt.studentId?.grade}-р анги
          </CardTitle>
          <p>
            Оноо: {attempt.score} / {attempt.totalQuestions}
          </p>
        </CardHeader>

        <CardContent>
          {Array.isArray(attempt.answers) ? (
            attempt.answers.map((a: any, index: number) => (
              <div key={index} className="border-b pb-4 mb-4">
                <p className="font-semibold">Асуулт ID: {a.questionId}</p>
                <p>Сонгосон: {a.selectedOption}</p>
              </div>
            ))
          ) : (
            <p>Хариултын мэдээлэл алгаа.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
