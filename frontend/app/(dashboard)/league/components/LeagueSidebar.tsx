'use client';

import React from 'react';
import { SIDEBAR_ITEMS, PATCH_NOTES_ITEM } from '../data';
import { SidebarItem } from '../types';
import {
  TrueDamageIcon,
  DemaciaIcon,
  MaskIcon,
  TrophyIcon,
  PatchNotesIcon,
  SpiritBlossomIcon,
} from './LeagueIcons';
import { RESOURCES_URL } from '@/utils/constants';
import { useSound } from '@/hooks/useSound';
import { useI18n } from '@/hooks/useI18n';

interface LeagueSidebarProps {
  activeTab: string;
  onSelectTab: (id: string) => void;
  onOpenPatchNotes: () => void;
}

export default function LeagueSidebar({
  activeTab,
  onSelectTab,
  onOpenPatchNotes,
}: LeagueSidebarProps) {
  const { play: playClick } = useSound('/general/menu-click.mp3');
  const { t } = useI18n();

  const renderIcon = (item: SidebarItem) => {
    const iconProps = { className: 'league-nav-icon' };

    switch (item.iconType) {
      case 'true-damage':
        return <DemaciaIcon {...iconProps} />;
      case 'mask':
        return <MaskIcon {...iconProps} />;
      case 'spirit-blossom':
        return <SpiritBlossomIcon {...iconProps} />;
      case 'trophy':
        return <TrophyIcon {...iconProps} />;
      case 'patch-notes':
        return <PatchNotesIcon {...iconProps} />;
      default:
        return <TrueDamageIcon {...iconProps} />;
    }
  };

  const handleItemClick = (id: string) => {
    playClick();
    onSelectTab(id);
  };

  return (
    <aside className="league-sidebar">
      <nav className="league-sidebar-nav">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`league-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <div className='league-nav-item-background' >
                <div
                  className="league-nav-thumb-wrapper"
                  style={{
                    backgroundImage: `url('/league/missions/${item.thumbnailUrl || ''}')`
                  }}
                >
                </div>
              </div>
              <video
                className="navigation-magic-idle"
                src="/league/navigation_magic_idle.webm"
                loop
                autoPlay
              >
              </video>
              <div className="league-nav-title">
                {renderIcon(item)}
                <span >{item.title}</span>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="league-sidebar-bottom">
        <div
          className={`league-nav-item ${activeTab === PATCH_NOTES_ITEM.id ? 'active' : ''}`}
          onClick={() => {
            playClick();
            onOpenPatchNotes();
          }}
        >
          {PATCH_NOTES_ITEM.hasNotification && (
            <span className="league-unread-dot" />
          )}
          <div className="league-nav-item-background">
            <div className="league-nav-thumb-wrapper">
              <PatchNotesIcon className="league-nav-bg-icon" width="25" height="25" />
            </div>
          </div>
          <video
            className="navigation-magic-idle"
            src="/league/navigation_magic_idle.webm"
            loop
            autoPlay
          >
          </video>
          <div className="league-nav-title">
            {renderIcon(PATCH_NOTES_ITEM)}
            <span>{t("patch.notesTitle")}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
