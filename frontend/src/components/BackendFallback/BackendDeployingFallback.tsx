'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { IoReload } from 'react-icons/io5';
import { useBackendStatus } from '@/hooks/useBackendStatus';
import { useSound } from '@/hooks/useSound';
import { useI18n } from '@/hooks/useI18n';
import './BackendFallback.css';

interface BackendDeployingFallbackProps {
  onContinueAsGuest?: () => void;
  customMessage?: string;
  onOnline?: () => void;
}

export default function BackendDeployingFallback({
  onContinueAsGuest,
  customMessage,
  onOnline,
}: BackendDeployingFallbackProps) {
  const { t } = useI18n();
  const { isOnline, retryCount, checkNow } = useBackendStatus(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const { play: playClick } = useSound('/general/menu-click.mp3');

  React.useEffect(() => {
    if (isOnline && onOnline) {
      onOnline();
    }
  }, [isOnline, onOnline]);

  const handleManualRetry = async () => {
    playClick();
    setIsRetrying(true);
    await checkNow();
    setIsRetrying(false);
  };


  return (
    <div className="backend-fallback-overlay">
      <div className="backend-fallback-container">
        {/* Corner Accents */}
        <span className="backend-fallback-corner tl" />
        <span className="backend-fallback-corner tr" />
        <span className="backend-fallback-corner bl" />
        <span className="backend-fallback-corner br" />

        {/* Hextech Spinner & Emblem */}
        <div className="backend-fallback-logo-wrapper">
          <Image
            src="/LOL_Icon_Rendered.png"
            width={88}
            height={92}
            alt="League of Legends"
            className="backend-fallback-emblem"
          />
        </div>

        {/* Pulsing Status Badge */}
        <div className="backend-fallback-status-badge">
          <span>{isOnline ? 'Servidor Conectado' : 'Despliegue en curso'}</span>
        </div>

        {/* Title */}
        <h1 className="backend-fallback-title">
          {isOnline ? t("backend.restored") : t("backend.starting")}
        </h1>

        {/* Explanation */}
        <p className="backend-fallback-desc">
          {customMessage || (
            <>
              {t("backend.deploying")}
            </>
          )}
        </p>

        {/* Indeterminate Progress Bar */}
        <div className="backend-fallback-progress-line">
          <div className="backend-fallback-progress-indeterminate" />
        </div>

        {/* Meta Stats */}
        {/*<div className="backend-fallback-meta">
          <span>{t("backend.retries")} <strong>{retryCount}</strong></span>
        </div>*/}

        {/* Actions */}
        {/*<div className="backend-fallback-actions">
          <button
            className="general-button"
            onClick={handleManualRetry}
            disabled={isRetrying}
          >
            <IoReload className={isRetrying ? 'animate-spin' : ''} size={18} />
            <span>{isRetrying ? t("backend.checking") : t("backend.retryNow")}</span>
          </button>
        </div>*/}

      </div>
    </div>
  );
}
