'use client';

import React from 'react';
import { IoVolumeMuteOutline, IoVolumeHighOutline, IoEyeOutline } from 'react-icons/io5';
import { useSoundState } from '@/hooks/useSoundState';
import { useSound } from '@/hooks/useSound';
import { useI18n } from '@/hooks/useI18n';

interface TopControlsProps {
  hideUI: boolean;
  onToggleHideUI: () => void;
}

export default function TopControls({
  hideUI,
  onToggleHideUI,
}: TopControlsProps) {
  const { t } = useI18n();
  const { music, setMute } = useSoundState();
  const { play: playClick } = useSound('/general/menu-click.mp3');

  return;

  const toggleSound = () => {
    playClick();
    setMute({ type: 'music', muted: !music.muted });
  };

  const handleToggleHide = () => {
    playClick();
    onToggleHideUI();
  };

  if (hideUI) {
    return (
      <button
        className="league-circle-btn league-show-ui-btn"
        onClick={handleToggleHide}
        title={t("common.showUi")}
      >
        <IoEyeOutline size={18} />
      </button>
    );
  }

  return (
    <div className="league-top-controls">
      <button
        className="league-circle-btn"
        onClick={toggleSound}
        title={music.muted ? 'Activar sonido' : 'Silenciar sonido'}
      >
        {music.muted ? (
          <IoVolumeMuteOutline size={18} />
        ) : (
          <IoVolumeHighOutline size={18} />
        )}
      </button>
      <button
        className="league-circle-btn"
        onClick={handleToggleHide}
        title={t("common.hideUi")}
      >
        <IoEyeOutline size={18} />
      </button>
    </div>
  );
}
