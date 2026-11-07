'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useBackendStatus } from '@/hooks/useBackendStatus';
import BackendDeployingFallback from '@/components/BackendFallback/BackendDeployingFallback';
import { useAppDispatch } from '@/hooks/hooks';
import { setUser } from '@/redux/slices/userSlice';

interface DashboardLoadingProps {
  customMessage?: string;
}

export default function DashboardLoading({ customMessage }: DashboardLoadingProps) {
  const dispatch = useAppDispatch();
  const { isDeploying } = useBackendStatus(true);
  const [showDeploymentFallback, setShowDeploymentFallback] = useState(false);

  // Si después de 3.5 segundos sigue cargando, o si se detecta que el backend está desplegándose
  useEffect(() => {
    if (isDeploying) {
      setShowDeploymentFallback(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowDeploymentFallback(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [isDeploying]);

  const handleContinueAsGuest = () => {
    dispatch(
      setUser({
        userName: 'Invitado',
        id: 'guest-offline',
        alias: 'Invitado',
        tag: 'LAS',
        title: 'Invocador',
        level: 30,
        EXP: 1200,
        BE: 25000,
        RP: 5000,
        rank: {
          name: 'Gold',
          level: 1,
          points: 75,
        },
        profile_icon: '6668',
        profile_background: 'Shen_49',
        loading: false,
        token: 'guest-token',
      })
    );
  };

  if (showDeploymentFallback) {
    return (
      <BackendDeployingFallback
        customMessage={customMessage}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return (
    <div className="dashboard-loading-screen flex items-center content-center justify-center w-screen min-h-screen">
      <Image
        alt="golden loading background"
        width={1080}
        height={720}
        sizes="fill"
        style={{ width: '100%' }}
        src="/loading-golden.png"
        priority
      />
      <svg
        id="Capa_2"
        className="hextech-loading-svg"
        data-name="Capa 2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 769.62 776.17"
      >
        <g id="Lines">
          <ellipse
            className="cls-1"
            cx="384.81"
            cy="388.09"
            rx="377.81"
            ry="381.09"
          />
        </g>
      </svg>
      <div className="text-center absolute">
        <Image
          className="lol-logo-image"
          src="/LOL_Icon_Rendered.png"
          width={360}
          height={378}
          alt="League of Legends logo"
          priority
        />
        <div className="loading-underlogo"> LOADING </div>
      </div>
    </div>
  );
}
