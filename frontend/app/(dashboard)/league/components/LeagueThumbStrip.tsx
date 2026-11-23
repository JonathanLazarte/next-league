'use client';

import React from 'react';
import Image from 'next/image';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { SkinSlide } from '../types';
import { RESOURCES_URL } from '@/utils/constants';
import { getCircularWindow } from '@/utils/circularWindow';

const LEAGUE_WINDOW = 3;
const PROGRESS_ANIMATION = 'league-thumb-progress';

interface LeagueThumbStripProps {
  slides: SkinSlide[];
  currentIndex: number;
  previousLabel: string;
  nextLabel: string;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onAutoAdvance: () => void;
}

export default function LeagueThumbStrip({
  slides,
  currentIndex,
  previousLabel,
  nextLabel,
  onSelect,
  onPrevious,
  onNext,
  onAutoAdvance,
}: LeagueThumbStripProps) {
  const visibleIndices = getCircularWindow(currentIndex, slides.length, LEAGUE_WINDOW);
  const canRotate = slides.length > 1;
  const advancedFrom = React.useRef<number | null>(null);

  const handleProgressEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.animationName !== PROGRESS_ANIMATION) return;
    const owner = Number(event.currentTarget.dataset.slide);
    if (owner !== currentIndex || advancedFrom.current === currentIndex) return;
    advancedFrom.current = currentIndex;
    onAutoAdvance();
  };

  return (
    <div className="league-carousel-wrapper">
      {canRotate && (
        <button
          type="button"
          className="league-carousel-arrow"
          onClick={onPrevious}
          aria-label={previousLabel}
        >
          <IoChevronBack />
        </button>
      )}

      <div className="league-carousel-thumbnails">
        {visibleIndices.map((slideIdx) => {
          const slide = slides[slideIdx];
          const isActive = slideIdx === currentIndex;

          return (
            <div
              key={slide.id}
              className={`league-thumb-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(slideIdx)}
            >
              <Image
                src={`${RESOURCES_URL}/champion/centered/${slide.img}`}
                alt={slide.skinName}
                width={160}
                height={90}
                className="league-thumb-card-img"
              />

              {isActive && canRotate && (
                <div className="league-thumb-progress-container">
                  <div
                    key={currentIndex}
                    className="league-thumb-progress-bar"
                    data-slide={currentIndex}
                    onAnimationEnd={handleProgressEnd}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {canRotate && (
        <button
          type="button"
          className="league-carousel-arrow"
          onClick={onNext}
          aria-label={nextLabel}
        >
          <IoChevronForward />
        </button>
      )}
    </div>
  );
}
