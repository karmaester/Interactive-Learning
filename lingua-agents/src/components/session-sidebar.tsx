"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, BookOpen, ClipboardCheck, BarChart3, Home, Library, Globe, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import { AvatarWithName } from "@/components/characters/avatar";
import { LevelBadge } from "@/components/progress/level-badge";
import { XPDisplay } from "@/components/progress/xp-display";
import { StreakDisplay } from "@/components/progress/streak-display";

const navItems = [
  { href: "/learn", icon: Home, label: "Dashboard" },
  { href: "/learn/conversation", icon: MessageCircle, label: "Conversation" },
  { href: "/learn/lesson", icon: BookOpen, label: "Lessons" },
  { href: "/learn/exercise", icon: Dumbbell, label: "Exercises" },
  { href: "/learn/vocabulary", icon: Library, label: "Vocabulary" },
  { href: "/learn/culture", icon: Globe, label: "Culture" },
  { href: "/learn/assessment", icon: ClipboardCheck, label: "Assessment" },
  { href: "/progress", icon: BarChart3, label: "Progress" },
];

export function SessionSidebar() {
  const pathname = usePathname();
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const getActiveProfile = useUserStore((s) => s.getActiveProfile);
  const profile = getActiveProfile();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Profile section */}
      <div className="p-6 border-b border-slate-100">
        {activeLanguage && profile && (
          <div className="flex flex-col items-center gap-3">
            <AvatarWithName
              language={activeLanguage}
              expression="neutral"
              size="lg"
            />
            <LevelBadge level={profile.cefrLevel} />
            <div className="flex gap-2">
              <XPDisplay xp={profile.totalXP} />
              <StreakDisplay streak={profile.streak} />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/learn"
                ? pathname === "/learn"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          <span>Change Language</span>
        </Link>
      </div>
    </aside>
  );
}
