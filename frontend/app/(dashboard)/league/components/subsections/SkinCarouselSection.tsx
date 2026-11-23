'use client';

import React, { useEffect, useState } from 'react';
import { SkinSet, SkinSlide } from '../../types';
import { RpIcon, TierCrestIcon } from '../LeagueIcons';
import { RESOURCES_URL } from '@/utils/constants';
import { useSound } from '@/hooks/useSound';
import { useI18n } from '@/hooks/useI18n';
import { stepIndex } from '@/utils/circularWindow';
import LeagueThumbStrip from '../LeagueThumbStrip';

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
  const { play: playClick } = useSound('/general/menu-click.mp3');
  const { t } = useI18n();

  const slides = set.slides;
  const currentSlide = slides[currentIndex] || slides[0];

  // Reset index when skin set changes
  useEffect(() => {
    const nextIdx = set.defaultIndex ?? 0;
    setCurrentIndex(nextIdx);
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

  const showNext = () => {
    setCurrentIndex((index) => stepIndex(index, slides.length, 1));
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const upcoming = slides[stepIndex(currentIndex, slides.length, 1)];
    if (!upcoming) return;
    const splash = new window.Image();
    splash.src = `${RESOURCES_URL}/champion/splash/${upcoming.img}`;
    const thumb = new window.Image();
    thumb.src = `${RESOURCES_URL}/champion/centered/${upcoming.img}`;
  }, [currentIndex, slides]);

  const handlePrev = () => {
    playClick();
    setCurrentIndex((index) => stepIndex(index, slides.length, -1));
  };

  const handleNext = () => {
    playClick();
    showNext();
  };

  const handleSelect = (idx: number) => {
    playClick();
    setCurrentIndex(idx);
  };

  return (
    <div className="league-center-content">
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

      <LeagueThumbStrip
        slides={slides}
        currentIndex={currentIndex}
        previousLabel={t("common.previous")}
        nextLabel={t("common.next")}
        onSelect={handleSelect}
        onPrevious={handlePrev}
        onNext={handleNext}
        onAutoAdvance={showNext}
      />
    </div>
  );
}
