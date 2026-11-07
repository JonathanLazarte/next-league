import { useState, useEffect, useCallback, useRef } from 'react';

export type BackendStatus = 'checking' | 'online' | 'deploying' | 'offline';

export interface BackendStatusState {
  status: BackendStatus;
  isOnline: boolean;
  isDeploying: boolean;
  retryCount: number;
  secondsElapsed: number;
  errorDetails: string | null;
  checkNow: () => Promise<boolean>;
}

export function useBackendStatus(autoCheck = true): BackendStatusState {
  const [status, setStatus] = useState<BackendStatus>('checking');
  const [retryCount, setRetryCount] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingRef = useRef(false);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    if (isCheckingRef.current) return false;
    isCheckingRef.current = true;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setStatus('online');
      isCheckingRef.current = false;
      return true;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      // Intentamos con /api/v1/health o la raíz
      const response = await fetch(`${apiUrl}/api/v1/health`, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      // Si responde 200, está completamente online
      if (response.ok) {
        setStatus('online');
        setErrorDetails(null);
        setSecondsElapsed(0);
        isCheckingRef.current = false;
        return true;
      }

      // Si responde 502, 503, 504 es típicamente un proxy (Render, Cloudflare) durante el despliegue
      if ([502, 503, 504].includes(response.status)) {
        setStatus('deploying');
        setErrorDetails(`El servidor devolvió HTTP ${response.status} (Iniciando / Desplegando en Render)`);
      } else {
        // Otro código (ej: 404 si la ruta no existe pero el server respondió) significa que el backend SÍ está vivo
        setStatus('online');
        setErrorDetails(null);
        isCheckingRef.current = false;
        return true;
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const errorMsg = err instanceof Error ? err.message : String(err);
      
      // TypeError: Failed to fetch o AbortError indican que el backend está caído o iniciando
      setStatus('deploying');
      setErrorDetails(errorMsg.includes('abort') ? 'Tiempo de espera agotado (Servidor iniciando)' : errorMsg);
    }

    setRetryCount((prev) => prev + 1);
    isCheckingRef.current = false;
    return false;
  }, []);

  // Timer para contar segundos mientras esté en estado 'deploying'
  useEffect(() => {
    if (status === 'deploying') {
      elapsedTimerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    }

    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [status]);

  // Chequeo inicial y reintentos periódicos si está desplegando
  useEffect(() => {
    if (!autoCheck) return;

    checkHealth();

    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [autoCheck, checkHealth]);

  // Si está desplegando, reintentar cada 4 segundos
  useEffect(() => {
    if (status === 'deploying') {
      retryTimerRef.current = setTimeout(() => {
        checkHealth();
      }, 4000);
    }

    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [status, retryCount, checkHealth]);

  return {
    status,
    isOnline: status === 'online',
    isDeploying: status === 'deploying',
    retryCount,
    secondsElapsed,
    errorDetails,
    checkNow: checkHealth,
  };
}
