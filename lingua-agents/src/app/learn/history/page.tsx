"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle, BookOpen, ClipboardCheck, Library, Globe, Dumbbell,
  Clock, ChevronDown, ChevronUp, Search,
} from "lucide-react";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SessionType } from "@/lib/types";

const SESSION_ICONS: Record<SessionType, typeof MessageCircle> = {
  conversation: MessageCircle,
  lesson: BookOpen,
  assessment: ClipboardCheck,
  vocabulary: Library,
  culture: Globe,
  exercise: Dumbbell,
};

const SESSION_LABELS: Record<SessionType, string> = {
  conversation: "Conversation",
  lesson: "Lesson",
  assessment: "Assessment",
  vocabulary: "Vocabulary",
  culture: "Culture",
  exercise: "Exercise",
};

const SESSION_COLORS: Record<SessionType, string> = {
  conversation: "text-blue-600 bg-blue-50",
  lesson: "text-emerald-600 bg-emerald-50",
  assessment: "text-purple-600 bg-purple-50",
  vocabulary: "text-teal-600 bg-teal-50",
  culture: "text-rose-600 bg-rose-50",
  exercise: "text-orange-600 bg-orange-50",
};

function formatDate(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const sessions = useChatStore((s) => s.sessions);
  const setActiveSession = useChatStore((s) => s.setActiveSession);
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<SessionType | "all">("all");
  const [search, setSearch] = useState("");

  const sortedSessions = useMemo(() => {
    return Object.values(sessions)
      .filter((s) => s.messages.length > 0)
      .filter((s) => filter === "all" || s.type === filter)
      .filter((s) => {
        if (!search) return true;
        const lowerSearch = search.toLowerCase();
        return s.messages.some((m) =>
          m.content.toLowerCase().includes(lowerSearch)
        );
      })
      .sort((a, b) => b.startedAt - a.startedAt);
  }, [sessions, filter, search]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, typeof sortedSessions> = {};
    for (const session of sortedSessions) {
      const key = formatDate(session.startedAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(session);
    }
    return groups;
  }, [sortedSessions]);

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-bold text-slate-900">
              Session History
            </h1>
          </div>
          <p className="text-slate-500 mb-6">
            {sortedSessions.length} sessions total
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-3"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Type filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
                filter === "all"
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              )}
            >
              All
            </button>
            {(Object.keys(SESSION_LABELS) as SessionType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
                  filter === type
                    ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                )}
              >
                {SESSION_LABELS[type]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sessions grouped by date */}
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p>No sessions yet. Start a conversation to see your history here.</p>
          </div>
        )}

        {Object.entries(grouped).map(([dateLabel, dateSessions], groupIdx) => (
          <motion.div
            key={dateLabel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + groupIdx * 0.05 }}
            className="mb-6"
          >
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {dateLabel}
            </h2>
            <div className="space-y-2">
              {dateSessions.map((session) => {
                const Icon = SESSION_ICONS[session.type] || MessageCircle;
                const color = SESSION_COLORS[session.type] || SESSION_COLORS.conversation;
                const isExpanded = expandedId === session.id;
                const userMsgCount = session.messages.filter(
                  (m) => m.role === "user"
                ).length;
                const firstUserMsg = session.messages.find(
                  (m) => m.role === "user"
                );

                return (
                  <Card key={session.id} className="overflow-hidden">
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : session.id)
                      }
                      className="w-full text-left cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-700">
                                {SESSION_LABELS[session.type]}
                              </span>
                              {session.topic && (
                                <span className="text-xs text-slate-400">
                                  &middot; {session.topic}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate">
                              {firstUserMsg
                                ? firstUserMsg.content.slice(0, 60)
                                : "No messages"}
                              {(firstUserMsg?.content.length ?? 0) > 60
                                ? "..."
                                : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-slate-400">
                              {userMsgCount} msgs &middot;{" "}
                              {formatTime(session.startedAt)}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </button>

                    {/* Expanded view */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50 max-h-64 overflow-y-auto">
                        {session.messages.slice(0, 20).map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "text-xs py-1.5",
                              msg.role === "user"
                                ? "text-indigo-700"
                                : msg.role === "system"
                                ? "text-slate-400 italic"
                                : "text-slate-600"
                            )}
                          >
                            <span className="font-medium">
                              {msg.role === "user"
                                ? "You"
                                : msg.role === "system"
                                ? "System"
                                : "Tutor"}
                              :
                            </span>{" "}
                            {msg.content.slice(0, 200)}
                            {msg.content.length > 200 ? "..." : ""}
                          </div>
                        ))}
                        {session.messages.length > 20 && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            + {session.messages.length - 20} more messages
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
