// app/student/page.tsx (жишээ)
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

type Exam = {
  _id: string;
  title: string;
  duration: number;
  questions: { id: string; question: string }[];
  hasAttempt: boolean;
};

export default function StudentDashboard() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const n = localStorage.getItem("name");
    const g = localStorage.getItem("grade");
    const studentId = localStorage.getItem("id");

    if (n) setName(n);
    if (g) setGrade(g);

    api.get(`/exams?studentId=${studentId}`).then((res) => {
      setExams(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            Hi, {name}! {grade && `${grade}-р анги`}
          </h1>
          <p className="text-muted-foreground">Амжилт </p>
        </div>

        <div className="grid gap-4">
          {exams.map((exam) => (
            <Card key={exam._id} className="hover:border-primary transition">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{exam.title}</CardTitle>
                    <CardDescription className="flex gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {exam.duration} мин
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" /> {exam.questions.length}{" "}
                        асуулт
                      </span>
                    </CardDescription>
                  </div>

                  <Button
                    asChild
                    disabled={exam.hasAttempt}
                    variant={exam.hasAttempt ? "secondary" : "default"}
                  >
                    <Link href={exam.hasAttempt ? "#" : `/exam/${exam._id}`}>
                      {exam.hasAttempt ? "Өгсөн" : "Эхлүүлэх"}
                    </Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
