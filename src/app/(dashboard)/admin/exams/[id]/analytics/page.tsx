"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Attempt = {
  _id: string;
  studentId: {
    name: string;
    grade: string;
  };
  score: number;
  totalQuestions: number;
  createdAt: string;
  finishedAt?: string;
};

export default function ExamAnalyticsPage() {
  const { id } = useParams();
  const examId = id as string;

  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    if (!examId) return;

    api.get(`/attempts/exam/${examId}`).then((res) => {
      setAttempts(res.data);
    });
  }, [examId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Шалгалтын анализ</h1>

      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Сурагч</th>
                <th className="py-2 pr-4">Анги</th>
                <th className="py-2 pr-4">Оноо</th>
                <th className="py-2 pr-4">Эхэлсэн</th>
                <th className="py-2 pr-4">Дууссан</th>
              </tr>
            </thead>

            <tbody>
              {attempts.map((a, i) => (
                <tr key={a._id} className="border-b hover:bg-muted/30">
                  <td className="py-2 pr-4">{i + 1}</td>
                  <td className="py-2 pr-4">{a.studentId?.name}</td>
                  <td className="py-2 pr-4">{a.studentId?.grade}-р анги</td>
                  <td className="py-2 pr-4">
                    <Badge variant="secondary">
                      {a.score}/{a.totalQuestions}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4">
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">
                    {a.finishedAt
                      ? new Date(a.finishedAt).toLocaleString()
                      : "Дуусаагүй"}
                  </td>
                  <td className="py-2 pr-4">
                    <Link
                      href={`/admin/attempts/${a._id}`}
                      className="text-blue-500 underline"
                    >
                      Дэлгэрэнгүй
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
