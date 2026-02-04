"use client";

import { CelebrationOverlay } from "./celebration-overlay";
import { LevelUpCeremony } from "./level-up";

export function GamificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CelebrationOverlay />
      <LevelUpCeremony />
    </>
  );
}
