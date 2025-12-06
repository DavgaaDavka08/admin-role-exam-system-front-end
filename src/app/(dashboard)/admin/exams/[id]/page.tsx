"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import ExamDetailClient from "./ExamDetailClient";
import { verifyRole } from "@/lib/auth/verifyRole";

export default function ExamDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const examId = id as string;

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = verifyRole();
    if (role !== "admin") {
      router.push("/login");
      return;
    }

    if (!examId) return;

    api
      .get(`/exams/${examId}`)
      .then((res) => setExam(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [examId, router]);

  if (loading) return <div className="p-6">Уншиж байна...</div>;
  if (!exam) return <div className="p-6">Шалгалт олдсонгүй.</div>;

  return <ExamDetailClient exam={exam} />;
}
