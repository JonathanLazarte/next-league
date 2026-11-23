import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (token: string | null): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) return;
    const next = io(API_URL, { auth: { token } });
    setSocket(next)
    return () => { next.disconnect(); setSocket(null)}
  }, [token]);

  return socket;
};
