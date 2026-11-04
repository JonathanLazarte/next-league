'use client';

import React, { useState } from 'react';
import './league.css';
import LeagueSidebar from './components/LeagueSidebar';
import TopControls from './components/TopControls';
import FeaturedCarousel from './components/FeaturedCarousel';
import PatchNotesModal from './components/PatchNotesModal';
import { TRUE_DAMAGE_SLIDES, HEARTSTEEL_SLIDES } from './data';
import { RESOURCES_URL } from '@/utils/constants';
import { usePurchase } from '@/hooks/usePurchase';

export default function LeaguePage() {
  const [activeTab, setActiveTab] = useState('true-damage');
  // Default to index 1 (Senna True Damage Know My Name) to match reference screenshot
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [hideUI, setHideUI] = useState(false);
  const [isPatchNotesOpen, setIsPatchNotesOpen] = useState(false);

  const { openPurchaseModal } = usePurchase();

  // Pick slides according to active tab
  const getSlides = () => {
    switch (activeTab) {
      case 'heartsteel':
        return HEARTSTEEL_SLIDES;
      case 'true-damage':
      default:
        return TRUE_DAMAGE_SLIDES;
    }
  };

  const slides = getSlides();
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentSlideIndex(0);
  };

  const handleBuyCurrent = () => {
    if (!currentSlide) return;
    openPurchaseModal({
      id: currentSlide.id,
      type: 'skin',
      name: currentSlide.skinName,
      img: `${RESOURCES_URL}/splash/${currentSlide.img}`,
      subtitle: `¡Desbloquea ${currentSlide.fullTitle} para tu colección!`,
      value: {
        rp: currentSlide.price,
      },
    });
  };

  return (
    <div className="league-container">
      {/* Background Wallpaper with Crossfade */}
      <div className="league-bg-container">
        <div
          key={currentSlide.img}
          className="league-bg-image"
          style={{
            backgroundImage: `url(${RESOURCES_URL}/splash/${currentSlide.img})`,
          }}
        />
        <div className="league-bg-overlay-left" />
        <div className="league-bg-overlay-bottom" />
        <div className="league-bg-vignette" />
      </div>

      {/* Floating Top-Right Controls */}
      <TopControls
        hideUI={hideUI}
        onToggleHideUI={() => setHideUI(!hideUI)}
      />

      {/* Main UI Overlay (fades out in cinematic mode) */}
      <div className={`league-ui-layer ${hideUI ? 'league-ui-hidden' : ''}`}>
        <LeagueSidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          onOpenPatchNotes={() => setIsPatchNotesOpen(true)}
        />

        <FeaturedCarousel
          slides={slides}
          currentIndex={currentSlideIndex}
          onSelectIndex={setCurrentSlideIndex}
          onBuyCurrent={handleBuyCurrent}
        />
      </div>

      {/* Patch Notes Modal */}
      <PatchNotesModal
        isOpen={isPatchNotesOpen}
        onClose={() => setIsPatchNotesOpen(false)}
      />
    </div>
  );
}
