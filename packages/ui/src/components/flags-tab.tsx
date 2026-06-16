'use client';

const ROWS = 7;
const COLS = 7;

type HSB = [number, number, number];

interface FlagDef {
  name: string;
  emoji: string;
  gradient: string;
  pattern: (row: number, col: number) => HSB;
}

// Common flag colors in HSB [hue, saturation, brightness]
const RED: HSB = [0, 100, 80];
const WHITE: HSB = [0, 0, 100];
const BLUE: HSB = [220, 100, 70];
const BLACK: HSB = [0, 0, 5];
const GREEN: HSB = [140, 100, 40];
const YELLOW: HSB = [50, 100, 100];
const GOLD: HSB = [45, 100, 80];
const SKY_BLUE: HSB = [200, 55, 85];
const DARK_GREEN: HSB = [150, 100, 30];
const NAVY: HSB = [230, 80, 35];
const DARK_RED: HSB = [350, 90, 55];
const BRIGHT_GREEN: HSB = [120, 100, 50];

function hStripes(bands: [HSB, number][]): (row: number, col: number) => HSB {
  const map: HSB[] = [];
  for (const [color, count] of bands) {
    for (let i = 0; i < count; i++) map.push(color);
  }
  return (row) => map[Math.min(row, map.length - 1)];
}

function vStripes(bands: [HSB, number][]): (row: number, col: number) => HSB {
  const map: HSB[] = [];
  for (const [color, count] of bands) {
    for (let i = 0; i < count; i++) map.push(color);
  }
  return (_, col) => map[Math.min(col, map.length - 1)];
}

const FLAGS: FlagDef[] = [
  {
    name: 'Argentina',
    emoji: '🇦🇷',
    gradient: 'linear-gradient(180deg, #74ACDF 0%, #74ACDF 33%, #fff 33%, #fff 66%, #74ACDF 66%)',
    pattern: hStripes([[SKY_BLUE, 2], [WHITE, 3], [SKY_BLUE, 2]])
  },
  {
    name: 'Austria',
    emoji: '🇦🇹',
    gradient: 'linear-gradient(180deg, #ED2939 0%, #ED2939 33%, #fff 33%, #fff 66%, #ED2939 66%)',
    pattern: hStripes([[RED, 2], [WHITE, 3], [RED, 2]])
  },
  {
    name: 'Brazil',
    emoji: '🇧🇷',
    gradient: 'linear-gradient(135deg, #009739, #FEDD00, #009739)',
    pattern: (row, col) => {
      // Green background with yellow diamond
      const cr = 3, cc = 3;
      const dist = Math.abs(row - cr) / 3 + Math.abs(col - cc) / 3;
      if (dist <= 0.85) {
        // Blue circle inside diamond
        const circDist = Math.sqrt((row - cr) ** 2 + (col - cc) ** 2);
        if (circDist <= 1.2) return [220, 90, 50];
        return YELLOW;
      }
      return GREEN;
    }
  },
  {
    name: 'Egypt',
    emoji: '🇪🇬',
    gradient: 'linear-gradient(180deg, #CE1126 0%, #CE1126 33%, #fff 33%, #fff 66%, #000 66%)',
    pattern: hStripes([[RED, 2], [WHITE, 3], [BLACK, 2]])
  },
  {
    name: 'England',
    emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    gradient: 'linear-gradient(180deg, #fff 42%, #CE1124 42%, #CE1124 58%, #fff 58%)',
    pattern: (row, col) => {
      // White background with red cross
      if (row === 3 || col === 3) return RED;
      return WHITE;
    }
  },
  {
    name: 'France',
    emoji: '🇫🇷',
    gradient: 'linear-gradient(90deg, #002395 0%, #002395 33%, #fff 33%, #fff 66%, #ED2939 66%)',
    pattern: vStripes([[BLUE, 2], [WHITE, 3], [RED, 2]])
  },
  {
    name: 'Germany',
    emoji: '🇩🇪',
    gradient: 'linear-gradient(180deg, #000 0%, #000 33%, #DD0000 33%, #DD0000 66%, #FFCC00 66%)',
    pattern: hStripes([[BLACK, 2], [RED, 3], [GOLD, 2]])
  },
  {
    name: 'Italy',
    emoji: '🇮🇹',
    gradient: 'linear-gradient(90deg, #008C45 0%, #008C45 33%, #fff 33%, #fff 66%, #CD212A 66%)',
    pattern: vStripes([[GREEN, 2], [WHITE, 3], [RED, 2]])
  },
  {
    name: 'Japan',
    emoji: '🇯🇵',
    gradient: 'radial-gradient(circle, #BC002D 30%, #fff 30%)',
    pattern: (row, col) => {
      // White background with red circle
      const dist = Math.sqrt((row - 3) ** 2 + (col - 3) ** 2);
      return dist <= 1.8 ? [0, 100, 70] : WHITE;
    }
  },
  {
    name: 'Mexico',
    emoji: '🇲🇽',
    gradient: 'linear-gradient(90deg, #006847 0%, #006847 33%, #fff 33%, #fff 66%, #CE1126 66%)',
    pattern: vStripes([[DARK_GREEN, 2], [WHITE, 3], [RED, 2]])
  },
  {
    name: 'Morocco',
    emoji: '🇲🇦',
    gradient: 'linear-gradient(135deg, #C1272D, #006233, #C1272D)',
    pattern: (row, col) => {
      // Red background with green star (simplified as green center cross)
      const cr = 3, cc = 3;
      const dist = Math.sqrt((row - cr) ** 2 + (col - cc) ** 2);
      if (dist <= 1.6) return BRIGHT_GREEN;
      return DARK_RED;
    }
  },
  {
    name: 'New Zealand',
    emoji: '🇳🇿',
    gradient: 'linear-gradient(135deg, #00247D, #CC142B, #00247D)',
    pattern: (row, col) => {
      // Blue background with Union Jack hint (top-left) and red stars (right)
      if (row <= 2 && col <= 2) {
        if (row === 1 || col === 1) return RED;
        return NAVY;
      }
      // 4 red stars on right side
      if ((row === 1 && col === 5) || (row === 2 && col === 6) ||
          (row === 4 && col === 5) || (row === 5 && col === 6)) return RED;
      return NAVY;
    }
  },
  {
    name: 'Portugal',
    emoji: '🇵🇹',
    gradient: 'linear-gradient(90deg, #006600 0%, #006600 40%, #FF0000 40%)',
    pattern: vStripes([[GREEN, 3], [RED, 4]])
  },
  {
    name: 'Saudi Arabia',
    emoji: '🇸🇦',
    gradient: 'linear-gradient(180deg, #006C35, #006C35)',
    pattern: (row, col) => {
      // Green background with white center band (simplified shahada + sword)
      if (row >= 2 && row <= 4 && col >= 1 && col <= 5) return WHITE;
      return [140, 100, 35];
    }
  },
  {
    name: 'South Africa',
    emoji: '🇿🇦',
    gradient: 'linear-gradient(180deg, #E03C31 0%, #E03C31 17%, #fff 17%, #fff 22%, #007749 22%, #007749 50%, #FFB81C 50%, #FFB81C 55%, #001489 55%, #001489 78%, #fff 78%, #fff 83%, #E03C31 83%)',
    pattern: (row, col) => {
      // Simplified: Y-shape with 6 colors
      // Green Y-shape, red top, blue bottom, white/gold borders
      if (col <= 1) {
        if (row === 3) return BRIGHT_GREEN;
        if (row === 2 || row === 4) return YELLOW;
        return row < 3 ? RED : BLUE;
      }
      if (row <= 1) return RED;
      if (row === 2) return WHITE;
      if (row === 3) return BRIGHT_GREEN;
      if (row === 4) return YELLOW;
      if (row >= 5) return BLUE;
      return WHITE;
    }
  },
  {
    name: 'South Korea',
    emoji: '🇰🇷',
    gradient: 'radial-gradient(circle, #CD2E3A 25%, #0047A0 25% 50%, #fff 50%)',
    pattern: (row, col) => {
      // White background with red/blue taegeuk center, black trigram corners
      const dist = Math.sqrt((row - 3) ** 2 + (col - 3) ** 2);
      if (dist <= 1.5) {
        return row <= 3 ? [0, 90, 75] : [215, 100, 55];
      }
      // Trigram bars at corners
      if ((row <= 1 && col <= 1) || (row <= 1 && col >= 5) ||
          (row >= 5 && col <= 1) || (row >= 5 && col >= 5)) return BLACK;
      return WHITE;
    }
  },
  {
    name: 'Spain',
    emoji: '🇪🇸',
    gradient: 'linear-gradient(180deg, #AA151B 0%, #AA151B 25%, #F1BF00 25%, #F1BF00 75%, #AA151B 75%)',
    pattern: hStripes([[RED, 2], [YELLOW, 3], [RED, 2]])
  },
  {
    name: 'Tunisia',
    emoji: '🇹🇳',
    gradient: 'radial-gradient(circle, #fff 25%, #E70013 25%)',
    pattern: (row, col) => {
      // Red background with white circle and red crescent/star center
      const dist = Math.sqrt((row - 3) ** 2 + (col - 3) ** 2);
      if (dist <= 1.8) return WHITE;
      return RED;
    }
  },
  {
    name: 'UAE',
    emoji: '🇦🇪',
    gradient: 'linear-gradient(180deg, #00732F 0%, #00732F 25%, #fff 25%, #fff 50%, #000 50%, #000 75%, #FF0000 75%)',
    pattern: (row, col) => {
      // Red vertical bar on left + green/white/black horizontal stripes
      if (col <= 1) return RED;
      if (row <= 1) return GREEN;
      if (row <= 3) return WHITE;
      if (row <= 4) return BLACK;
      return [0, 0, 5];
    }
  },
  {
    name: 'United States',
    emoji: '🇺🇸',
    gradient: 'linear-gradient(180deg, #B22234 0%, #B22234 15%, #fff 15%, #fff 23%, #B22234 23%, #B22234 38%, #fff 38%, #fff 46%, #B22234 46%, #B22234 62%, #fff 62%, #fff 69%, #B22234 69%)',
    pattern: (row, col) => {
      // Blue canton top-left, red/white stripes
      if (row <= 2 && col <= 2) return [220, 90, 50];
      return row % 2 === 0 ? [0, 95, 65] : WHITE;
    }
  }
];

function generateGrid(flag: FlagDef): { index: number; h: number; s: number; b: number }[] {
  const cells: { index: number; h: number; s: number; b: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const [h, s, b] = flag.pattern(r, c);
      cells.push({ index: r * COLS + c, h, s, b });
    }
  }
  return cells;
}

export function FlagsTab({
  active,
  onSelect
}: {
  active: string | null;
  onSelect: (name: string, cells: { index: number; h: number; s: number; b: number }[]) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FLAGS.map((flag) => (
        <button
          key={flag.name}
          onClick={() => onSelect(flag.name, generateGrid(flag))}
          className="relative overflow-hidden transition-transform active:scale-93"
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: flag.gradient,
            border: active === flag.name ? '2px solid #fff' : '2px solid transparent'
          }}
        >
          <span
            className="absolute bottom-0.5 left-0 right-0 text-center text-white font-semibold"
            style={{
              fontSize: 7,
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              letterSpacing: '0.02em'
            }}
          >
            {flag.name}
          </span>
        </button>
      ))}
    </div>
  );
}
