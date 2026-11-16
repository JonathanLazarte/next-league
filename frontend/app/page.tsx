'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBackendStatus } from '@/hooks/useBackendStatus';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/hooks';
import { setUser } from '@/redux/slices/userSlice';
import { setGuestAuth } from '@/redux/slices/authSlice';
import BackendDeployingFallback from '@/components/BackendFallback/BackendDeployingFallback';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isOnline } = useBackendStatus(true);
  const { isAuthenticated, token } = useAuth();

  const handleRedirect = useCallback(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (isAuthenticated || token || storedToken) {
      router.replace('/play');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, token, router]);

  useEffect(() => {
    if (isOnline) {
      handleRedirect();
    }
  }, [isOnline, handleRedirect]);

  const handleContinueAsGuest = () => {
    dispatch(setGuestAuth());
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', 'guest-token');
    }
    router.replace('/play');
  };

  return (
    <BackendDeployingFallback
      onContinueAsGuest={handleContinueAsGuest}
      onOnline={handleRedirect}
    />
  );
}
