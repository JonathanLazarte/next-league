'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { SkinSet, SkinSlide } from '../../types';
import { RpIcon, TierCrestIcon } from '../LeagueIcons';
import { RESOURCES_URL } from '@/utils/constants';
import { useSound } from '@/hooks/useSound';

interface SkinCarouselSectionProps {
  set: SkinSet;
  onBuySkin: (skin: SkinSlide) => void;
  onSlideChange?: (slide: SkinSlide) => void;
}

export default function SkinCarouselSection({
  set,
  onBuySkin,
  onSlideChange,
}: SkinCarouselSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(set.defaultIndex || 0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { play: playClick } = useSound('/general/menu-click.mp3');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = set.slides;
  const currentSlide = slides[currentIndex] || slides[0];

  // Reset index when skin set changes
  useEffect(() => {
    const nextIdx = set.defaultIndex ?? 0;
    setCurrentIndex(nextIdx);
    setProgress(0);
    if (onSlideChange && slides[nextIdx]) {
      onSlideChange(slides[nextIdx]);
    }
  }, [set.id]);

  // Notify parent of slide change
  useEffect(() => {
    if (onSlideChange && currentSlide) {
      onSlideChange(currentSlide);
    }
  }, [currentIndex, currentSlide, onSlideChange]);

  // Auto-play progress loop (7 seconds duration)
  useEffect(() => {
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);

    if (isPaused || slides.length <= 1) return;

    const intervalMs = 70;
    const step = 100 / (7000 / intervalMs);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, slides.length]);

  const handlePrev = () => {
    playClick();
    const prev = (currentIndex - 1 + slides.length) % slides.length;
    setCurrentIndex(prev);
  };

  const handleNext = () => {
    playClick();
    const next = (currentIndex + 1) % slides.length;
    setCurrentIndex(next);
  };

  const handleSelect = (idx: number) => {
    playClick();
    setCurrentIndex(idx);
  };

  // Get 3 visible thumbnails: [prev, current, next]
  const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
  const nextIdx = (currentIndex + 1) % slides.length;
  const visibleIndices = [prevIdx, currentIndex, nextIdx];

  return (
    <div
      className="league-center-content"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hero Info Center */}
      <div className="league-hero-info">
        <div className="league-tier-crest">
          <TierCrestIcon className="league-crest-svg" />
        </div>

        <h1 className="league-hero-title">{currentSlide.fullTitle}</h1>

        <div className="league-hero-price">
          <RpIcon className="league-rp-icon" />
          <span>{currentSlide.price}</span>
        </div>

        <button
          className="league-buy-button"
          onClick={() => {
            playClick();
            onBuySkin(currentSlide);
          }}
        >
          COMPRAR AHORA
        </button>

        {/* Dots Pagination */}
        <div className="league-dots-container">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`league-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => handleSelect(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Carousel Thumbnails Strip */}
      <div className="league-carousel-wrapper">
        <button
          className="league-carousel-arrow"
          onClick={handlePrev}
          aria-label="Anterior"
        >
          <IoChevronBack />
        </button>

        <div className="league-carousel-thumbnails">
          {visibleIndices.map((slideIdx, position) => {
            const slide = slides[slideIdx];
            const isActive = slideIdx === currentIndex;

            return (
              <div
                key={`${slide.id}-${position}`}
                className={`league-thumb-card ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(slideIdx)}
              >
                <Image
                  src={`${RESOURCES_URL}/centered/${slide.img}`}
                  alt={slide.skinName}
                  width={160}
                  height={90}
                  className="league-thumb-card-img"
                  loading="lazy"
                />

                {isActive && (
                  <div className="league-thumb-progress-container">
                    <div
                      className="league-thumb-progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="league-carousel-arrow"
          onClick={handleNext}
          aria-label="Siguiente"
        >
          <IoChevronForward />
        </button>
      </div>
    </div>
  );
}
