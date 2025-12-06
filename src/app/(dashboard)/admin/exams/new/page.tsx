"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AdminSidebar } from "@/app/components/admin-sidebar";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { api } from "@/lib/axios";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";

type Question = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
};

export default function NewExamPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "",
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" },
      ],
      correctAnswer: "A",
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: uuid(),
        question: "",
        options: [
          { id: "A", text: "" },
          { id: "B", text: "" },
          { id: "C", text: "" },
          { id: "D", text: "" },
        ],
        correctAnswer: "A",
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: string, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, text } : opt
              ),
            }
          : q
      )
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Шалгалтын нэр хоосон байна!");
      return;
    }

    if (questions.length === 0) {
      toast.error("Дор хаяж 1 асуулт нэмэх шаардлагатай!");
      return;
    }

    try {
      await api.post("/exams", {
        title,
        description,
        duration: Number(duration),
        questions,
      });
      toast.success("Шалгалт амжилттай хадгалагдлаа");
      router.push("/admin/exams");
    } catch (err) {
      toast.error("Хадгалах явцад алдаа гарлаа");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/exams">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Шинэ шалгалт үүсгэх</h1>
                <p className="text-sm text-muted-foreground">
                  Асуулт нэмж шалгалт бэлдэх
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin/exams">Цуцлах</Link>
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Хадгалах
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Үндсэн мэдээлэл</CardTitle>
              <CardDescription>Шалгалтын нэр, хугацаа гэх мэт</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Шалгалтын нэр</Label>
                <Input
                  id="title"
                  placeholder="Математикийн шалгалт"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Тайлбар</Label>
                <Textarea
                  id="description"
                  placeholder="Энэ шалгалтын тухай товч мэдээлэл"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Хугацаа (минут)</Label>
                <Input
                  id="duration"
                  placeholder="60"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)} 
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Асуултууд ({questions.length})
            </h2>
            <Button onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Асуулт нэмэх
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Асуулт {qIndex + 1}</CardTitle>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(question.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
             
                <div className="space-y-2">
                  <Label>Асуулт</Label>
                  <Textarea
                    placeholder="Асуултаа оруулна уу"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(question.id, "question", e.target.value)
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Хариултууд</Label>

                  <RadioGroup
                    value={question.correctAnswer}
                    onValueChange={(value) =>
                      updateQuestion(question.id, "correctAnswer", value)
                    }
                  >
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center gap-3">
              
                        <RadioGroupItem
                          value={option.id}
                          id={`answer-${question.id}-${option.id}`}
                        />
                        <Label
                          htmlFor={`answer-${question.id}-${option.id}`}
                          className="sr-only"
                        >
                          Зөв хариулт {option.id}
                        </Label>

                    
                        <div className="flex flex-1 items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted font-medium">
                            {option.id}
                          </span>

                          <Input
                            placeholder={`Хариулт ${option.id}`}
                            value={option.text}
                            onChange={(e) =>
                              updateOption(
                                question.id,
                                option.id,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  <p className="text-xs text-muted-foreground">
                    Зөв хариултыг сонгоно уу
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/exams">Цуцлах</Link>
            </Button>
            <Button onClick={handleSave} size="lg">
              <Save className="mr-2 h-4 w-4" />
              Шалгалт хадгалах
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
