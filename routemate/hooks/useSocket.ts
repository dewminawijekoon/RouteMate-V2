import { useEffect, useMemo, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '@/constants/config';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  const socket = useMemo(() => {
    if (!socketRef.current) {
      socketRef.current = io(API_URL, {
        transports: ['websocket'],
      });
    }
    return socketRef.current;
  }, []);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return socket;
}

