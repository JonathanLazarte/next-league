'use client';

import React from 'react';
import { IoVolumeMuteOutline, IoVolumeHighOutline, IoEyeOutline } from 'react-icons/io5';
import { useSoundState } from '@/hooks/useSoundState';
import { useSound } from '@/hooks/useSound';

interface TopControlsProps {
  hideUI: boolean;
  onToggleHideUI: () => void;
}

export default function TopControls({
  hideUI,
  onToggleHideUI,
}: TopControlsProps) {
  const { music, setMute } = useSoundState();
  const { play: playClick } = useSound('/general/menu-click.mp3');

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
        title="Mostrar interfaz"
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
        title="Ocultar interfaz"
      >
        <IoEyeOutline size={18} />
      </button>
    </div>
  );
}
