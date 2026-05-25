export type QuestionOption = {
  id: string;
  text: string;
  image?: string;
};

export type Question = {
  id: string;
  question: string;
  image?: string;
  type: "single" | "multiple";
  options: QuestionOption[];
  correctAnswer?: string;
  correctAnswers?: string[];
};

export type PracticalTask = {
  id: string;
  title: string;
  instructions?: string;
  exampleImage?: string;
  referenceImage?: string;
  maxScore: number;
};

export type Exam = {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  hasTheory?: boolean;
  hasPractical?: boolean;
  theoryMaxScore?: number;
  practicalMaxScore?: number;
  questions: Question[];
  practicalTasks?: PracticalTask[];
  createdAt: string;
  hasAttempt?: boolean;
};

export type StoredFile = {
  url: string;
  publicId?: string;
  originalName: string;
  size: number;
  mime: string;
};

export type PracticalScoreBreakdown = {
  uiSimilarity: number;
  responsive: number;
  codeStructure: number;
  functionality: number;
};

export type PracticalTaskSubmission = {
  taskId: string;
  archive?: StoredFile;
  screenshots?: StoredFile[];
  notes?: string;
};

export type PracticalTaskReview = {
  taskId: string;
  scores: PracticalScoreBreakdown;
  feedback?: string;
  totalScore: number;
};

export type PracticalStatus = "pending" | "reviewed" | "passed" | "failed";

export type PracticalSubmission = {
  _id: string;
  studentId: { _id: string; name: string; grade: string; barcode?: string } | string;
  examId: { _id: string; title: string; practicalTasks?: PracticalTask[] } | string;
  tasks: PracticalTaskSubmission[];
  isSubmitted: boolean;
  submittedAt?: string;
  status: PracticalStatus;
  reviews: PracticalTaskReview[];
  totalScore: number;
  maxScore: number;
  overallFeedback?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
};
