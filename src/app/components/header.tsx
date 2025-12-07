import React from "react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

const Header = () => {
  return (
    <div>
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link href="/login">Нэвтрэх</Link>
            </Button>

            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <LogOut className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
