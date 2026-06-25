'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface CannonColor {
  h: number;
  s: number;
  b: number;
}

export interface Orientation {
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;
  flipV: boolean;
}

export function useSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [grid, setGrid] = useState<CannonColor[]>([]);
  const [orientation, setOrientation] = useState<Orientation>({ rotation: 0, flipH: false, flipV: false });

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      setTimeout(() => {
        if (wsRef.current === ws) {
          wsRef.current = null;
        }
      }, 2000);
    };
    ws.onerror = () => ws.close();
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'state' && Array.isArray(msg.grid)) {
          setGrid(msg.grid);
        } else if (msg.type === 'orientation') {
          setOrientation({ rotation: msg.rotation ?? 0, flipH: !!msg.flipH, flipV: !!msg.flipV });
        }
      } catch {
        // ignore
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [url]);

  const send = useCallback((msg: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  return { connected, grid, orientation, send };
}
