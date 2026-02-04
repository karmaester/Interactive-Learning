"use client";

import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-[var(--radius-md)]", className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] transition-all duration-150 cursor-pointer",
            activeTab === tab.id
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-[var(--shadow-sm)]"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
