"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, BookOpen, BarChart3, Home, Library, Settings, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import { Avatar } from "@/components/characters/avatar";
import { LevelBadge } from "@/components/progress/level-badge";
import { XPDisplay } from "@/components/progress/xp-display";
import { StreakFlame } from "@/components/gamification/streak-flame";
import { Logo } from "@/components/ui/logo";
import { LANGUAGE_CONFIG } from "@/lib/types";

const navItems = [
  { href: "/learn", icon: Home, label: "Home" },
  { href: "/learn/practice", icon: MessageCircle, label: "Practice" },
  { href: "/learn/lesson", icon: BookOpen, label: "Learn" },
  { href: "/learn/vocabulary", icon: Library, label: "Vocabulary" },
  { href: "/progress", icon: BarChart3, label: "Progress" },
];

const utilityItems = [
  { href: "/learn/settings", icon: Settings, label: "Settings" },
];

export function SessionSidebar() {
  const pathname = usePathname();
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const getActiveProfile = useUserStore((s) => s.getActiveProfile);
  const profile = getActiveProfile();
  const config = activeLanguage ? LANGUAGE_CONFIG[activeLanguage] : null;

  return (
    <aside className="w-64 bg-[var(--surface-primary)] border-r border-slate-200 dark:border-slate-700 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-5 pb-3">
        <Logo variant="compact" />
      </div>

      {/* Condensed profile section */}
      {activeLanguage && profile && config && (
        <div className="px-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-slate-50 dark:bg-slate-800 p-3">
            <Avatar
              language={activeLanguage}
              expression="neutral"
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {config.tutorName}
                </span>
                <LevelBadge level={profile.cefrLevel} />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <XPDisplay xp={profile.totalXP} />
                <StreakFlame streak={profile.streak} size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            let isActive = false;
            if (item.href === "/learn") {
              isActive = pathname === "/learn";
            } else if (item.href === "/learn/practice") {
              isActive = pathname === "/learn/practice" ||
                pathname.startsWith("/learn/conversation") ||
                pathname.startsWith("/learn/exercise") ||
                pathname.startsWith("/learn/culture");
            } else if (item.href === "/learn/lesson") {
              isActive = pathname.startsWith("/learn/lesson") ||
                pathname.startsWith("/learn/assessment");
            } else if (item.href === "/progress") {
              isActive = pathname.startsWith("/progress") ||
                pathname.startsWith("/learn/achievements") ||
                pathname.startsWith("/learn/history");
            } else {
              isActive = pathname.startsWith(item.href);
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-l-3 border-indigo-600 shadow-[var(--shadow-sm)]"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Separator + utility items */}
        <div className="border-t border-slate-100 dark:border-slate-700 mt-3 pt-3">
          <ul className="space-y-0.5">
            {utilityItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-l-3 border-indigo-600"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-700">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[var(--radius-sm)] transition-all duration-150"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Change Language</span>
        </Link>
      </div>
    </aside>
  );
}
