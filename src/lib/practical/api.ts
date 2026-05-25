import { api } from "@/lib/axios";
import type {
  PracticalSubmission,
  PracticalTaskSubmission,
  StoredFile,
  PracticalStatus,
  PracticalTaskReview,
} from "@/lib/types/exam";

export async function uploadFile(
  file: File,
  kind: "image" | "archive" = "image"
): Promise<StoredFile> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await api.post(`/practical/upload?kind=${kind}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function submitPractical(payload: {
  studentId: string;
  examId: string;
  tasks: PracticalTaskSubmission[];
  finalize?: boolean;
}): Promise<PracticalSubmission> {
  const res = await api.post("/practical/submit", payload);
  return res.data;
}

export async function getMyPracticalSubmission(
  studentId: string,
  examId: string
): Promise<PracticalSubmission | null> {
  const res = await api.get(`/practical/mine/${studentId}/${examId}`);
  return res.data;
}

export async function listPracticalSubmissions(filters?: {
  status?: PracticalStatus;
  examId?: string;
}): Promise<PracticalSubmission[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.examId) params.set("examId", filters.examId);
  const qs = params.toString();
  const res = await api.get(`/practical/submissions${qs ? `?${qs}` : ""}`);
  return res.data;
}

export async function getPracticalSubmission(
  id: string
): Promise<PracticalSubmission> {
  const res = await api.get(`/practical/submissions/${id}`);
  return res.data;
}

export async function reviewPracticalSubmission(
  id: string,
  body: {
    reviews: PracticalTaskReview[];
    status?: PracticalStatus;
    overallFeedback?: string;
  }
): Promise<PracticalSubmission> {
  const res = await api.patch(`/practical/submissions/${id}/review`, body);
  return res.data;
}
