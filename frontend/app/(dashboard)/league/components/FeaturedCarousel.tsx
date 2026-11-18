'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { SkinSlide } from '../types';
import { RpIcon, TierCrestIcon } from './LeagueIcons';
import { RESOURCES_URL } from '@/utils/constants';
import { useSound } from '@/hooks/useSound';
import { useI18n } from '@/hooks/useI18n';
import { useCarouselAutoplay } from './useCarouselAutoplay';

interface FeaturedCarouselProps {
  slides: SkinSlide[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onBuyCurrent: () => void;
}

export default function FeaturedCarousel({
  slides,
  currentIndex,
  onSelectIndex,
  onBuyCurrent,
}: FeaturedCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const { play: playClick } = useSound('/general/menu-click.mp3');
  const { t } = useI18n();

  const currentSlide = slides[currentIndex] || slides[0];
  const { progress, isAnimating } = useCarouselAutoplay({
    activeIndex: currentIndex,
    slideCount: slides.length,
    isPaused,
    onAdvance: () => onSelectIndex((currentIndex + 1) % slides.length),
  });

  const handlePrev = () => {
    playClick();
    const prev = (currentIndex - 1 + slides.length) % slides.length;
    onSelectIndex(prev);
  };

  const handleNext = () => {
    playClick();
    const next = (currentIndex + 1) % slides.length;
    onSelectIndex(next);
  };

  const handleSelect = (idx: number) => {
    playClick();
    onSelectIndex(idx);
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
            onBuyCurrent();
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
          aria-label={t("common.previous")}
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
                  src={`${RESOURCES_URL}/champion/centered/${slide.img}`}
                  alt={slide.skinName}
                  width={160}
                  height={90}
                  className="league-thumb-card-img"
                  loading="lazy"
                />

                {isActive && (
                  <div className="league-thumb-progress-container">
                    <div
                      className={`league-thumb-progress-bar ${isAnimating ? 'is-animating' : ''}`}
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
          aria-label={t("common.next")}
        >
          <IoChevronForward />
        </button>
      </div>
    </div>
  );
}
