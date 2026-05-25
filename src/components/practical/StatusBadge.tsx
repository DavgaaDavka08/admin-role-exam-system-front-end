import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PracticalStatus } from "@/lib/types/exam";

const LABEL: Record<PracticalStatus, string> = {
  pending: "Хүлээгдэж буй",
  reviewed: "Шалгасан",
  passed: "Тэнцсэн",
  failed: "Тэнцээгүй",
};

const STYLE: Record<PracticalStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  reviewed:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  passed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  failed: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
};

export function StatusBadge({
  status,
  className,
}: {
  status: PracticalStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent", STYLE[status], className)}
    >
      {LABEL[status]}
    </Badge>
  );
}
