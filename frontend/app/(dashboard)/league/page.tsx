'use client';

import React, { useState, useMemo } from 'react';
import './league.css';
import LeagueSidebar from './components/LeagueSidebar';
import TopControls from './components/TopControls';
import PatchNotesModal from './components/PatchNotesModal';
import SkinCarouselSection from './components/subsections/SkinCarouselSection';
import PatchNotesSection from './components/subsections/PatchNotesSection';
import { SIDEBAR_ITEMS, PATCH_NOTES_ITEM, TRUE_DAMAGE_SET } from './data';
import { SidebarItem, SkinSlide } from './types';
import { RESOURCES_URL } from '@/utils/constants';
import { usePurchase } from '@/hooks/usePurchase';

export default function LeaguePage() {
  const [activeTab, setActiveTab] = useState<string>('true-damage');
  const [currentSlide, setCurrentSlide] = useState<SkinSlide | null>(
    TRUE_DAMAGE_SET.slides[TRUE_DAMAGE_SET.defaultIndex || 0]
  );
  const [hideUI, setHideUI] = useState<boolean>(false);
  const [isPatchNotesModalOpen, setIsPatchNotesModalOpen] = useState<boolean>(false);

  const { openPurchaseModal } = usePurchase();

  // Find active configuration item
  const activeItem: SidebarItem = useMemo(() => {
    if (activeTab === 'patch-notes') return PATCH_NOTES_ITEM;
    return (
      SIDEBAR_ITEMS.find((item) => item.id === activeTab) || SIDEBAR_ITEMS[0] // default true-damage
    );
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleBuySkin = (skin: SkinSlide) => {
    openPurchaseModal({
      id: skin.id,
      type: 'skin',
      name: skin.skinName,
      img: `${RESOURCES_URL}/splash/${skin.img}`,
      subtitle: `¡Desbloquea ${skin.fullTitle} para tu colección!`,
      value: {
        rp: skin.price,
      },
    });
  };

  // Determine current background wallpaper
  const backgroundUrl = useMemo(() => {
    if (activeItem.type === 'carousel') {
      if (currentSlide?.img) {
        return `${RESOURCES_URL}/splash/${currentSlide.img}`;
      }
      return `${RESOURCES_URL}/splash/Senna_1.jpg`;
    }
    return activeItem.bgImage || '/collection_background.webp';
  }, [activeItem, currentSlide]);

  // Dynamic subsection rendering according to selected tab
  const renderSubsection = () => {
    switch (activeItem.type) {
      case 'carousel':
        return (
          <SkinCarouselSection
            key={activeItem.id}
            set={activeItem.skinSet!}
            onBuySkin={handleBuySkin}
            onSlideChange={setCurrentSlide}
          />
        );
      case 'patch-notes':
        return <PatchNotesSection key={activeItem.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="league-container">
      {/* Background Wallpaper with Crossfade */}
      <div className="league-bg-container" style={{ backgroundImage: `url(${backgroundUrl})` }}>
        <div
          key={backgroundUrl}
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
          onOpenPatchNotes={() => setActiveTab('patch-notes')}
        />

        {renderSubsection()}
      </div>

      {/* Optional Patch Notes Modal */}
      <PatchNotesModal
        isOpen={isPatchNotesModalOpen}
        onClose={() => setIsPatchNotesModalOpen(false)}
      />
    </div>
  );
}
