'use client';

import { useUserInterface } from "@/hooks/useUserInterface";

export default function PlayBackground() {
  const { queue } = useUserInterface();
  const isInQueue = queue !== null;

  return (
    <div className={`play-background-layers ${isInQueue ? "in-room" : ""}`}>
      <div className="bg-layer bg-lobby" />
      <div className="bg-layer bg-room" />
    </div>
  );
}
