"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-md)] bg-slate-200",
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-slate-200 bg-white p-5",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-[var(--radius-md)]" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-28 h-28 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>

        {/* Level card skeleton */}
        <div className="grid grid-cols-[1fr_auto] gap-4 mb-8">
          <div className="rounded-[var(--radius-lg)] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-[var(--radius-md)]" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-7 w-16 ml-auto" />
                <Skeleton className="h-3 w-12 ml-auto" />
              </div>
            </div>
          </div>
          <Skeleton className="w-[140px] h-[140px] rounded-[var(--radius-lg)]" />
        </div>

        {/* Activity cards skeleton */}
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonProgressRing() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Skeleton className="w-32 h-32 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function SkeletonWordCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-lg)] border border-slate-200 bg-white p-4"
        >
          <Skeleton className="h-5 w-20 mb-2" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-2 w-full mt-3 rounded-full" />
        </div>
      ))}
    </div>
  );
}
