"use client";

import { verifyRole } from "@/lib/auth/verifyRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const role = verifyRole();
    if (role !== "admin") router.push("/login");
  }, []);

  return <h1>Admin Dashboard</h1>;
}
