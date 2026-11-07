'use client';

import { useUserInterface } from "@/hooks/useUserInterface";
import useLoadingDelay from "@/hooks/useLoadingDelay";
import { BACKGROUND_URLS } from "@/utils/constants";
import { useMemo } from 'react';

export default function BackgroundEngine() {
  const { actualSection, isNavigating } = useUserInterface();
  const showLoading = useLoadingDelay(isNavigating);

  const backgroundImage: string = useMemo(() => {
    const bgUrl = BACKGROUND_URLS[actualSection as keyof typeof BACKGROUND_URLS];
    if (!bgUrl) return 'none';
    return `url(${bgUrl})`;
  }, [actualSection]);

  return (
    <div
      className="background-engine"
      style={{
        backgroundImage: showLoading
          ? "var(--blue-five)"
          : backgroundImage,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    />
  );
}
