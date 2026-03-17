"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (inputPassword: string) => void | Promise<void>;
};

export function ConfirmPasswordDialog({
  open,
  title,
  description,
  confirmText = "Үргэлжлүүлэх",
  loading = false,
  onOpenChange,
  onConfirm,
}: Props) {
  const [inputPassword, setInputPassword] = useState("");

  useEffect(() => {
    if (!open) setInputPassword("");
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="adminPassword">Admin нууц үг</Label>
          <Input
            id="adminPassword"
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            placeholder="Нууц үгээ оруулна уу"
            autoFocus
          />
        </div>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Болих
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(inputPassword)}
            disabled={loading || !inputPassword}
          >
            {loading ? "Шалгаж байна..." : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

