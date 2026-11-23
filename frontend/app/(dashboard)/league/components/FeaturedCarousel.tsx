'use client';

import React from 'react';
import { SkinSlide } from '../types';
import { RpIcon, TierCrestIcon } from './LeagueIcons';
import { useSound } from '@/hooks/useSound';
import { useI18n } from '@/hooks/useI18n';
import { stepIndex } from '@/utils/circularWindow';
import LeagueThumbStrip from './LeagueThumbStrip';

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
  const { play: playClick } = useSound('/general/menu-click.mp3');
  const { t } = useI18n();

  const currentSlide = slides[currentIndex] || slides[0];
  const showNext = () => onSelectIndex(stepIndex(currentIndex, slides.length, 1));

  const handlePrev = () => {
    playClick();
    onSelectIndex(stepIndex(currentIndex, slides.length, -1));
  };

  const handleNext = () => {
    playClick();
    showNext();
  };

  const handleSelect = (idx: number) => {
    playClick();
    onSelectIndex(idx);
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
