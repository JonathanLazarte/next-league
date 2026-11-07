'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { IoReload, IoChevronDown, IoChevronUp, IoWarningOutline } from 'react-icons/io5';
import { useBackendStatus } from '@/hooks/useBackendStatus';
import { useSound } from '@/hooks/useSound';
import './BackendFallback.css';

interface BackendDeployingFallbackProps {
  onContinueAsGuest?: () => void;
  customMessage?: string;
}

export default function BackendDeployingFallback({
  onContinueAsGuest,
  customMessage,
}: BackendDeployingFallbackProps) {
  const { isOnline, retryCount, secondsElapsed, errorDetails, checkNow } = useBackendStatus(true);
  const [showDetails, setShowDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { play: playClick } = useSound('/general/menu-click.mp3');

  const handleManualRetry = async () => {
    playClick();
    setIsRetrying(true);
    await checkNow();
    setIsRetrying(false);
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'No configurada';

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
          <svg className="backend-fallback-hex-ring" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#cdbe91"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              opacity="0.4"
            />
          </svg>
          <svg className="backend-fallback-hex-ring-reverse" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="1"
              strokeDasharray="2 12"
              opacity="0.5"
            />
          </svg>
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
          <span className="backend-pulse-dot" />
          <span>{isOnline ? 'Servidor Conectado' : 'Despliegue en curso'}</span>
        </div>

        {/* Title */}
        <h1 className="backend-fallback-title">
          {isOnline ? 'Servidor Restaurado' : 'Iniciando Servidores'}
        </h1>

        {/* Explanation */}
        <p className="backend-fallback-desc">
          {customMessage || (
            <>
              El backend se está <strong>desplegando</strong> o despertando de inactividad (cold start de Render). Este proceso suele tardar entre <strong>30 y 60 segundos</strong>. La aplicación se conectará automáticamente.
            </>
          )}
        </p>

        {/* Indeterminate Progress Bar */}
        <div className="backend-fallback-progress-line">
          <div className="backend-fallback-progress-indeterminate" />
        </div>

        {/* Meta Stats */}
        <div className="backend-fallback-meta">
          <span>Tiempo en espera: <strong>{secondsElapsed}s</strong></span>
          <span>•</span>
          <span>Reintentos: <strong>{retryCount}</strong></span>
        </div>

        {/* Actions */}
        <div className="backend-fallback-actions">
          <button
            className="backend-retry-btn"
            onClick={handleManualRetry}
            disabled={isRetrying}
          >
            <IoReload className={isRetrying ? 'animate-spin' : ''} size={18} />
            <span>{isRetrying ? 'Comprobando...' : 'Reintentar Ahora'}</span>
          </button>

          {onContinueAsGuest && (
            <button
              className="backend-guest-btn"
              onClick={() => {
                playClick();
                onContinueAsGuest();
              }}
            >
              Modo Invitado (Offline)
            </button>
          )}
        </div>

        {/* Technical Details Accordion */}
        <button
          className="backend-details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <span className="flex items-center gap-1 justify-center">
              Ocultar detalles técnicos <IoChevronUp size={14} />
            </span>
          ) : (
            <span className="flex items-center gap-1 justify-center">
              Ver detalles técnicos <IoChevronDown size={14} />
            </span>
          )}
        </button>

        {showDetails && (
          <div className="backend-details-box">
            <div><strong>Endpoint:</strong> {apiUrl}</div>
            <div><strong>Estado:</strong> {errorDetails || 'Esperando respuesta del servidor...'}</div>
            <div><strong>Estrategia:</strong> Polling automático cada 4s con AbortController</div>
          </div>
        )}
      </div>
    </div>
  );
}
