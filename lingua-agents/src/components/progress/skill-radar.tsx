"use client";

import type { SkillScores } from "@/lib/types";

interface SkillRadarProps {
  scores: SkillScores;
  size?: number;
}

const SKILLS: { key: keyof SkillScores; label: string }[] = [
  { key: "grammar", label: "Grammar" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "conversation", label: "Conversation" },
  { key: "reading", label: "Reading" },
  { key: "culture", label: "Culture" },
];

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleDeg: number
) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
  };
}

export function SkillRadar({ scores, size = 220 }: SkillRadarProps) {
  const center = size / 2;
  const maxRadius = size * 0.38;
  const angleStep = 360 / SKILLS.length;
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Build grid lines
  const gridPaths = levels.map((level) => {
    const radius = maxRadius * level;
    const points = SKILLS.map((_, i) => {
      const angle = i * angleStep;
      return polarToCartesian(center, center, radius, angle);
    });
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  });

  // Build data polygon
  const dataPoints = SKILLS.map((skill, i) => {
    const value = (scores[skill.key] || 0) / 100;
    const radius = maxRadius * value;
    const angle = i * angleStep;
    return polarToCartesian(center, center, radius, angle);
  });
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Label positions
  const labelPoints = SKILLS.map((skill, i) => {
    const angle = i * angleStep;
    const pos = polarToCartesian(center, center, maxRadius + 22, angle);
    return { ...pos, label: skill.label, value: scores[skill.key] || 0 };
  });

  // Axis lines
  const axisLines = SKILLS.map((_, i) => {
    const angle = i * angleStep;
    const end = polarToCartesian(center, center, maxRadius, angle);
    return { x1: center, y1: center, x2: end.x, y2: end.y };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid */}
        {gridPaths.map((points, i) => (
          <polygon
            key={`grid-${i}`}
            points={points}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={`axis-${i}`}
            {...line}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Data polygon */}
        <polygon
          points={dataPath}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="#6366f1"
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#6366f1"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Labels */}
        {labelPoints.map((lp, i) => (
          <text
            key={`label-${i}`}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[10px] fill-slate-500 font-medium"
          >
            {lp.label}
          </text>
        ))}
      </svg>

      {/* Score summary */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {SKILLS.map((skill) => (
          <div key={skill.key} className="text-center">
            <div className="text-xs text-slate-400">{skill.label}</div>
            <div className="text-sm font-semibold text-slate-700">
              {scores[skill.key] || 0}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
