"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "compact" | "icon";
  className?: string;
}

/**
 * LinguaAgents logo in 3 variants:
 * - full: Icon + "LinguaAgents" wordmark
 * - compact: Icon + "LA" text
 * - icon: Standalone speech-bubble mark only
 */
export function Logo({ variant = "full", className }: LogoProps) {
  const iconSize = variant === "icon" ? 40 : variant === "compact" ? 32 : 36;

  return (
    <div
      className={cn("flex items-center gap-2.5 select-none", className)}
    >
      {/* Icon mark — speech bubble with language dots */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="LinguaAgents logo"
        role="img"
      >
        <defs>
          <linearGradient id="bubble-grad" x1="4" y1="4" x2="44" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818CF8" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="bubble-shine" x1="12" y1="6" x2="24" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.25" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Speech bubble body */}
        <path
          d="M6 12C6 8.13401 9.13401 5 13 5H35C38.866 5 42 8.13401 42 12V28C42 31.866 38.866 35 35 35H20L12 42V35H13C9.13401 35 6 31.866 6 28V12Z"
          fill="url(#bubble-grad)"
        />

        {/* Shine overlay */}
        <path
          d="M6 12C6 8.13401 9.13401 5 13 5H35C38.866 5 42 8.13401 42 12V28C42 31.866 38.866 35 35 35H20L12 42V35H13C9.13401 35 6 31.866 6 28V12Z"
          fill="url(#bubble-shine)"
        />

        {/* "L" negative space / monogram hint */}
        <path
          d="M16 13H20V26H28V30H16V13Z"
          fill="white"
          opacity="0.9"
        />

        {/* Three language dots */}
        <circle cx="33" cy="14" r="2.5" fill="#3B82F6" /> {/* English — blue */}
        <circle cx="33" cy="21" r="2.5" fill="#F97316" /> {/* Spanish — orange */}
        <circle cx="33" cy="28" r="2.5" fill="#22C55E" /> {/* German — green */}
      </svg>

      {/* Wordmark */}
      {variant === "full" && (
        <span className="text-xl tracking-tight">
          <span className="font-semibold text-slate-800">Lingua</span>
          <span className="font-bold text-indigo-600">Agents</span>
        </span>
      )}

      {variant === "compact" && (
        <span className="text-sm font-bold tracking-tight text-slate-700">
          L<span className="text-indigo-600">A</span>
        </span>
      )}
    </div>
  );
}

/**
 * Animated version of the icon for special moments (landing hero, level-up).
 * Pulses the language dots sequentially.
 */
export function LogoAnimated({ className }: { className?: string }) {
  return (
    <div className={cn("select-none", className)}>
      <svg
        width={64}
        height={64}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="LinguaAgents logo"
        role="img"
      >
        <defs>
          <linearGradient id="bubble-grad-lg" x1="4" y1="4" x2="44" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818CF8" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="bubble-shine-lg" x1="12" y1="6" x2="24" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.25" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Speech bubble */}
        <path
          d="M6 12C6 8.13401 9.13401 5 13 5H35C38.866 5 42 8.13401 42 12V28C42 31.866 38.866 35 35 35H20L12 42V35H13C9.13401 35 6 31.866 6 28V12Z"
          fill="url(#bubble-grad-lg)"
        />
        <path
          d="M6 12C6 8.13401 9.13401 5 13 5H35C38.866 5 42 8.13401 42 12V28C42 31.866 38.866 35 35 35H20L12 42V35H13C9.13401 35 6 31.866 6 28V12Z"
          fill="url(#bubble-shine-lg)"
        />

        {/* L monogram */}
        <path
          d="M16 13H20V26H28V30H16V13Z"
          fill="white"
          opacity="0.9"
        />

        {/* Animated dots */}
        <circle cx="33" cy="14" r="2.5" fill="#3B82F6">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="0s" />
        </circle>
        <circle cx="33" cy="21" r="2.5" fill="#F97316">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="0.4s" />
        </circle>
        <circle cx="33" cy="28" r="2.5" fill="#22C55E">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="0.8s" />
        </circle>
      </svg>
    </div>
  );
}
