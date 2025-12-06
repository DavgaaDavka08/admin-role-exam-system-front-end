import { Button } from "@/components/ui/button";


import { ArrowRight, Users, FileText, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Онлайн Шалгалтын <span className="text-secondary">Систем</span>
          </h1>
          <p className="mb-12 text-xl text-muted-foreground">
            Шалгалт үүсгэх, удирдах болон автомат шалгах боломжтой орчин үеийн
            систем
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/login">
                нэвтрэх
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <Link href="/register">
                Бүртгүүлэх
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
