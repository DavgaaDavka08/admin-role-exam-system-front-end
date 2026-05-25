import { api } from "@/lib/axios";
import type {
  PracticalSubmission,
  PracticalTaskSubmission,
  StoredFile,
  PracticalStatus,
  PracticalTaskReview,
} from "@/lib/types/exam";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

async function uploadDirectToCloudinary(
  file: File,
  kind: "image" | "archive"
): Promise<StoredFile> {
  // raw for archives (zip/rar/7z), image for screenshots/photos
  const resourceType = kind === "archive" ? "raw" : "image";
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${resourceType}/upload`;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_PRESET as string);

  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }
  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    originalName: file.name,
    size: file.size,
    mime: file.type,
  };
}

export async function uploadFile(
  file: File,
  kind: "image" | "archive" = "image"
): Promise<StoredFile> {
  // Prefer direct browser → Cloudinary upload when configured.
  // Falls back to the backend endpoint otherwise.
  if (CLOUDINARY_CLOUD && CLOUDINARY_PRESET) {
    return uploadDirectToCloudinary(file, kind);
  }
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
