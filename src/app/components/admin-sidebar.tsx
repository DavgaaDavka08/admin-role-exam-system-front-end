"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Нүүр", icon: LayoutDashboard },
  { href: "/admin/exams", label: "Шалгалтууд", icon: FileText },
  { href: "/admin/analytics", label: "Статистик", icon: BarChart3 },
  { href: "/admin/students", label: "Сурагчид", icon: Users },
  { href: "/admin/settings", label: "Тохиргоо", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Button variant="ghost" className="w-full justify-start gap-3" asChild>
          <Link href="/admin/login">
            <LogOut className="h-4 w-4" />
            Гарах
          </Link>
        </Button>
      </div>
    </aside>
  );
}
