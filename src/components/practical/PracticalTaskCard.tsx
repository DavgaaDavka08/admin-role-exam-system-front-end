"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { FileUploader } from "./FileUploader";
import type { PracticalTask } from "@/lib/types/exam";

type Props = {
  task: PracticalTask;
  index: number;
  onChange: (updated: PracticalTask) => void;
  onRemove?: () => void;
};

export function PracticalTaskCard({ task, index, onChange, onRemove }: Props) {
  const update = <K extends keyof PracticalTask>(
    key: K,
    value: PracticalTask[K]
  ) => onChange({ ...task, [key]: value });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Даалгавар {index + 1}</CardTitle>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive hover:bg-destructive/10"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Гарчиг</Label>
            <Input
              value={task.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Жишээ нь: Login дизайн хийх"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Зааварчилгаа</Label>
            <Textarea
              rows={4}
              value={task.instructions || ""}
              onChange={(e) => update("instructions", e.target.value)}
              placeholder="Сурагч юу хийх ёстойг нарийвчилж бичнэ"
            />
          </div>

          <div className="space-y-2">
            <Label>Жишээ зураг</Label>
            <FileUploader
              kind="image"
              value={task.exampleImage ? ({ url: task.exampleImage, originalName: "example" } as any) : null}
              onChange={(f) => update("exampleImage", f?.url || "")}
            />
          </div>

          <div className="space-y-2">
            <Label>Жишиг (reference) зураг</Label>
            <FileUploader
              kind="image"
              value={task.referenceImage ? ({ url: task.referenceImage, originalName: "reference" } as any) : null}
              onChange={(f) => update("referenceImage", f?.url || "")}
            />
          </div>

          <div className="space-y-2">
            <Label>Максимум оноо</Label>
            <Input
              type="number"
              min={1}
              value={task.maxScore}
              onChange={(e) =>
                update("maxScore", Math.max(1, Number(e.target.value || 0)))
              }
              className="w-32"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
