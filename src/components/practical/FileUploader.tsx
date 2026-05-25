"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { uploadFile } from "@/lib/practical/api";
import type { StoredFile } from "@/lib/types/exam";
import { toast } from "sonner";
import Image from "next/image";

type Props = {
  kind: "image" | "archive";
  value?: StoredFile | null;
  onChange: (file: StoredFile | null) => void;
  accept?: string;
  label?: string;
  disabled?: boolean;
};

export function FileUploader({
  kind,
  value,
  onChange,
  accept,
  label,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const defaultAccept =
    kind === "image" ? "image/*" : ".zip,.rar,.7z,application/zip";

  const handlePick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const stored = await uploadFile(file, kind);
      onChange(stored);
      toast.success("Файл амжилттай хуулагдлаа");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Файл хуулахад алдаа гарлаа");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="text-sm font-medium text-foreground">{label}</div>
      )}

      {kind === "image" && value?.url ? (
        <div className="relative w-fit">
          <Image
            src={value.url}
            alt={value.originalName || "uploaded"}
            width={320}
            height={200}
            unoptimized
            className="rounded-md border border-border object-cover"
          />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : value?.url ? (
        <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 p-3 text-sm">
          <a
            href={
              kind === "archive" && value.url.includes("res.cloudinary.com")
                ? value.url.replace("/raw/upload/", "/raw/upload/fl_attachment/")
                : value.url
            }
            download={kind === "archive" ? (value.originalName || "code.zip") : undefined}
            rel="noreferrer"
            className="truncate text-primary underline"
          >
            {value.originalName || value.url}
          </a>
          {!disabled && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(null)}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept || defaultAccept}
        onChange={(e) => handlePick(e.target.files?.[0])}
        disabled={disabled || busy}
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || busy}
      >
        {busy ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {value?.url
          ? "Солих"
          : kind === "image"
          ? "Зураг хуулах"
          : "Файл хуулах"}
      </Button>
    </div>
  );
}
