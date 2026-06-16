'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { CannonColor } from '@/lib/use-socket';

export type BrightnessMode = 'off' | 'breathe' | 'ripple' | 'wave' | 'fire' | 'shimmer';

interface BrightnessConfig {
  mode: BrightnessMode;
  speed: number;   // 1–10
  intensity: number; // 0–100
}

const MODES: { key: BrightnessMode; label: string; desc: string }[] = [
  { key: 'off', label: 'Off', desc: 'No overlay' },
  { key: 'breathe', label: 'Breathe', desc: 'Gentle pulse' },
  { key: 'ripple', label: 'Ripple', desc: 'Radial wave' },
  { key: 'wave', label: 'Wave', desc: 'Horizontal sweep' },
  { key: 'fire', label: 'Fire', desc: 'Flickering flames' },
  { key: 'shimmer', label: 'Shimmer', desc: 'Random sparkle' }
];

const MODE_GRADIENTS: Record<BrightnessMode, string> = {
  off: 'linear-gradient(135deg, #1a1a25, #0e0e14)',
  breathe: 'linear-gradient(135deg, #1a1a4a, #3a3a8a)',
  ripple: 'linear-gradient(135deg, #0e3060, #1a6090)',
  wave: 'linear-gradient(135deg, #0a4040, #1a8080)',
  fire: 'linear-gradient(135deg, #8a2000, #cc6600, #ffaa00)',
  shimmer: 'linear-gradient(135deg, #3a2a5a, #6a4a9a)'
};

function applyBrightnessOverlay(
  grid: CannonColor[],
  config: BrightnessConfig,
  time: number,
  cols: number,
  noiseRef: Float32Array
): { index: number; h: number; s: number; b: number }[] {
  const rows = Math.ceil(grid.length / cols);
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const spd = config.speed / 5;
  const mix = config.intensity / 100;
  const cells: { index: number; h: number; s: number; b: number }[] = [];

  for (let i = 0; i < grid.length; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    let { h, s, b } = grid[i];
    let bMod = 1;

    switch (config.mode) {
    case 'breathe': {
      // All beams pulse together
      bMod = 0.5 + 0.5 * Math.sin(time * spd * 1.5);
      break;
    }
    case 'ripple': {
      // Radial wave from center
      const dist = Math.sqrt((r - cy) ** 2 + (c - cx) ** 2);
      bMod = 0.5 + 0.5 * Math.sin(dist * 1.2 - time * spd * 2);
      break;
    }
    case 'wave': {
      // Horizontal sweep
      bMod = 0.5 + 0.5 * Math.sin((c / cols) * Math.PI * 2 - time * spd * 1.8);
      break;
    }
    case 'fire': {
      // Flickering flames — shift hue toward warm range + random brightness
      const flicker = noiseRef[i];
      // Warm hue range: 0 (red) to 45 (orange/yellow)
      h = (flicker * 45 + time * spd * 30) % 50;
      s = 90 + flicker * 10;
      // Brightness flickers with time-varying noise
      const t1 = Math.sin(time * spd * 3 + flicker * 20);
      const t2 = Math.sin(time * spd * 5.7 + i * 0.7);
      bMod = 0.4 + 0.3 * t1 + 0.3 * t2;
      break;
    }
    case 'shimmer': {
      // Per-beam random sparkle
      const sparkle = Math.sin(time * spd * 4 + noiseRef[i] * 30);
      bMod = 0.5 + 0.5 * sparkle;
      break;
    }
    default:
      break;
    }

    if (config.mode !== 'off') {
      if (config.mode === 'fire') {
        // Fire replaces colors entirely
        b = Math.max(5, Math.round(b * (1 - mix) + (bMod * 100) * mix));
      } else {
        // Other modes blend brightness only
        const modulated = b * bMod;
        b = Math.max(5, Math.round(b * (1 - mix) + modulated * mix));
      }
    }

    cells.push({ index: i, h: Math.round(h), s: Math.round(s), b });
  }

  return cells;
}

export function useBrightnessAnimation(
  numCannons: number,
  gridColumns: number,
  gridData: CannonColor[],
  send: (msg: Record<string, unknown>) => void
) {
  const [config, setConfig] = useState<BrightnessConfig>({
    mode: 'off',
    speed: 5,
    intensity: 60
  });
  const configRef = useRef(config);
  configRef.current = config;

  const gridRef = useRef(gridData);
  gridRef.current = gridData;

  // Stable noise values per beam (for fire/shimmer)
  const noiseRef = useRef<Float32Array>(new Float32Array(0));
  if (noiseRef.current.length !== numCannons) {
    const arr = new Float32Array(numCannons);
    for (let i = 0; i < numCannons; i++) arr[i] = Math.random();
    noiseRef.current = arr;
  }

  const rafRef = useRef(0);
  const startRef = useRef(0);

  // Re-seed noise periodically for fire/shimmer variation
  const lastSeedRef = useRef(0);

  const setMode = useCallback((mode: BrightnessMode) => {
    setConfig((c) => ({ ...c, mode }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setConfig((c) => ({ ...c, speed }));
  }, []);

  const setIntensity = useCallback((intensity: number) => {
    setConfig((c) => ({ ...c, intensity }));
  }, []);

  useEffect(() => {
    if (config.mode === 'off') return;

    startRef.current = performance.now() / 1000;
    let running = true;

    const tick = () => {
      if (!running) return;
      const t = performance.now() / 1000 - startRef.current;

      // Re-seed noise every ~0.3s for fire variation
      if (configRef.current.mode === 'fire' && t - lastSeedRef.current > 0.3) {
        lastSeedRef.current = t;
        const arr = noiseRef.current;
        for (let i = 0; i < arr.length; i++) {
          arr[i] = arr[i] * 0.7 + Math.random() * 0.3;
        }
      }

      const cells = applyBrightnessOverlay(
        gridRef.current,
        configRef.current,
        t,
        gridColumns,
        noiseRef.current
      );

      for (const c of cells) {
        send({ type: 'cannon', index: c.index, h: c.h, s: c.s, b: c.b });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [config.mode, gridColumns, send]);

  return { config, setMode, setSpeed, setIntensity };
}

export function BrightnessTab({
  config,
  onMode,
  onSpeed,
  onIntensity
}: {
  config: BrightnessConfig;
  onMode: (m: BrightnessMode) => void;
  onSpeed: (v: number) => void;
  onIntensity: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      {/* Mode swatches */}
      <div className="flex gap-2 flex-wrap">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => onMode(m.key)}
            className="relative overflow-hidden transition-transform active:scale-93"
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: MODE_GRADIENTS[m.key],
              border: config.mode === m.key ? '2px solid #fff' : '2px solid transparent'
            }}
          >
            <span
              className="absolute bottom-0.5 left-0 right-0 text-center text-white font-semibold"
              style={{
                fontSize: 8,
                textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                letterSpacing: '0.03em'
              }}
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* Sliders */}
      {config.mode !== 'off' && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span
              className="text-xs"
              style={{ color: '#888898', letterSpacing: '0.05em', minWidth: 52 }}
            >
              SPEED
            </span>
            <input
              type="range"
              className="flex-1"
              min={1}
              max={10}
              value={config.speed}
              onChange={(e) => onSpeed(Number(e.target.value))}
            />
            <span
              className="text-xs font-mono"
              style={{ color: '#e8e8f0', minWidth: 24, textAlign: 'right' }}
            >
              {config.speed}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs"
              style={{ color: '#888898', letterSpacing: '0.05em', minWidth: 52 }}
            >
              MIX
            </span>
            <input
              type="range"
              className="flex-1"
              min={0}
              max={100}
              value={config.intensity}
              onChange={(e) => onIntensity(Number(e.target.value))}
            />
            <span
              className="text-xs font-mono"
              style={{ color: '#e8e8f0', minWidth: 32, textAlign: 'right' }}
            >
              {config.intensity}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
