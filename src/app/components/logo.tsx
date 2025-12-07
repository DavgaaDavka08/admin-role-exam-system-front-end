import { GraduationCap } from "lucide-react";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
        <Image
          src={"/tsonjin.avif"}
          width={1000}
          height={1000}
          alt="Logo"
          className="h-15 w-15 text-primary-foreground"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-none">TsonjinExam</span>
      </div>
    </div>
  );
}
