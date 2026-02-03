"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionSidebar } from "@/components/session-sidebar";
import { useUserStore } from "@/stores/user-store";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const activeLanguage = useUserStore((s) => s.activeLanguage);

  useEffect(() => {
    if (!activeLanguage) {
      router.push("/");
    }
  }, [activeLanguage, router]);

  if (!activeLanguage) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <SessionSidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
