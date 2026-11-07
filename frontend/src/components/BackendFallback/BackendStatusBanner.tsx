'use client';

import React from 'react';
import { IoWarningOutline, IoReload } from 'react-icons/io5';
import { useBackendStatus } from '@/hooks/useBackendStatus';
import { useSound } from '@/hooks/useSound';
import './BackendFallback.css';

interface BackendStatusBannerProps {
  onRetry?: () => void;
  className?: string;
}

export default function BackendStatusBanner({
  onRetry,
  className = '',
}: BackendStatusBannerProps) {
  const { isDeploying, secondsElapsed, checkNow } = useBackendStatus(true);
  const { play: playClick } = useSound('/general/menu-click.mp3');

  if (!isDeploying) return null;

  const handleRetry = async () => {
    playClick();
    await checkNow();
    if (onRetry) onRetry();
  };

  return (
    <div className={`backend-status-banner ${className}`}>
      <div className="backend-status-banner-content">
        <IoWarningOutline className="backend-status-banner-icon" />
        <div className="backend-status-banner-text">
          <span className="backend-status-banner-title">
            Servidor en proceso de despliegue / inicio ({secondsElapsed}s)
          </span>
          <span className="backend-status-banner-sub">
            El backend en Render está despertando del modo reposo. La conexión se reanudará automáticamente.
          </span>
        </div>
      </div>
      <button
        type="button"
        className="backend-status-banner-btn flex items-center gap-1"
        onClick={handleRetry}
      >
        <IoReload size={14} /> Reintentar
      </button>
    </div>
  );
}
