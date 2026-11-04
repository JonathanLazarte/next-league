'use client';

import React from 'react';
import Image from 'next/image';
import { SIDEBAR_ITEMS, PATCH_NOTES_ITEM } from '../data';
import { SidebarItem } from '../types';
import {
  TargetIcon,
  FistIcon,
  ChaosIcon,
  CrownIcon,
  MasksIcon,
  TrophyIcon,
  SeasonIcon,
  PatchNotesIcon,
} from './LeagueIcons';
import { RESOURCES_URL } from '@/utils/constants';
import { useSound } from '@/hooks/useSound';

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

  const renderIcon = (item: SidebarItem) => {
    if (item.isSpecialThumbnail) {
      return (
        <div className="league-nav-thumb-wrapper">
          <Image
            src={`${RESOURCES_URL}/tiles/Senna_1.jpg`}
            alt={item.title}
            width={48}
            height={28}
            className="league-nav-thumb-img"
          />
        </div>
      );
    }

    const iconProps = { className: 'league-nav-icon' };

    switch (item.iconType) {
      case 'target':
        return <TargetIcon {...iconProps} />;
      case 'fist':
        return <FistIcon {...iconProps} />;
      case 'chaos':
        return <ChaosIcon {...iconProps} />;
      case 'crown':
        return <CrownIcon {...iconProps} />;
      case 'masks':
        return <MasksIcon {...iconProps} />;
      case 'trophy':
        return <TrophyIcon {...iconProps} />;
      case 'season':
        return <SeasonIcon {...iconProps} />;
      default:
        return <TargetIcon {...iconProps} />;
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
              {renderIcon(item)}
              <span className="league-nav-title">{item.title}</span>
            </div>
          );
        })}
      </nav>

      <div className="league-sidebar-bottom">
        <div
          className="league-patch-notes-item"
          onClick={() => {
            playClick();
            onOpenPatchNotes();
          }}
        >
          {PATCH_NOTES_ITEM.hasNotification && (
            <span className="league-unread-dot" />
          )}
          <PatchNotesIcon className="league-nav-icon" />
          <div className="league-patch-notes-text">
            <span>NOTAS DE LA</span>
            <br />
            <span>VERSIÓN</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
