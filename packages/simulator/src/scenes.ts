import { CannonTarget, NUM_CANNONS, setCannonTarget } from './grid';

export interface SceneColor {
  h: number;
  s: number;
  b: number;
}

export type SceneGenerator = (index: number, total: number) => SceneColor;

export const scenes: Record<string, SceneGenerator> = {
  civic: () => ({ h: 220, s: 90, b: 80 }),

  pride: (i, total) => ({ h: Math.round((i / total) * 360), s: 90, b: 80 }),

  gold: () => ({ h: 45, s: 95, b: 80 }),

  white: () => ({ h: 0, s: 0, b: 80 }),

  solstice: (i) => {
    const row = Math.floor(i / 7);
    const col = i % 7;
    return { h: 40 + row * 5 + col * 4, s: 85, b: 80 };
  },

  ocean: (i) => {
    const row = Math.floor(i / 7);
    const col = i % 7;
    return { h: 180 + row * 8 + col * 3, s: 75, b: 70 };
  },

  sunset: (i) => {
    const row = Math.floor(i / 7);
    return { h: 10 + row * 5, s: 90, b: 85 - row * 5 };
  },

  off: () => ({ h: 0, s: 0, b: 0 })
};

export function applyScene(grid: CannonTarget[], sceneName: string) {
  const generator = scenes[sceneName];
  if (!generator) return;
  for (let i = 0; i < NUM_CANNONS; i++) {
    const { h, s, b } = generator(i, NUM_CANNONS);
    setCannonTarget(grid, i, h, s, b);
  }
}
