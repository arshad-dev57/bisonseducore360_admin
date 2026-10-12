"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(admin ? "/dashboard" : "/login");
  }, [admin, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
      Redirecting…
    </div>
  );
}
