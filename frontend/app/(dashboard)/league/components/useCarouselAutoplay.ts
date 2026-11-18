'use client';

import { useEffect, useRef, useState } from 'react';

interface UseCarouselAutoplayOptions {
  activeIndex: number;
  slideCount: number;
  isPaused: boolean;
  onAdvance: () => void;
  duration?: number;
}

export function useCarouselAutoplay({
  activeIndex,
  slideCount,
  isPaused,
  onAdvance,
  duration = 7000,
}: UseCarouselAutoplayOptions) {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const advanceRef = useRef(onAdvance);

  useEffect(() => {
    advanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    setIsAnimating(false);
    setProgress(0);

    if (isPaused || slideCount <= 1) return;

    const frameId = requestAnimationFrame(() => {
      setIsAnimating(true);
      setProgress(100);
    });
    const timeoutId = window.setTimeout(() => {
      advanceRef.current();
    }, duration);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex, duration, isPaused, slideCount]);

  return { progress, isAnimating };
}
