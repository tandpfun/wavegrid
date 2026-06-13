# @illuminate/simulator

7×7 RGB grid simulator for the Illuminate project. Renders 49 virtual laser cannons with smooth interpolated transitions (low-pass filtered) — no abrupt color or brightness changes.

## Usage

```sh
# Start the dev server
pnpm dev

# Run tests
pnpm test

# Build
pnpm build
```

## Architecture

- **`grid.ts`** — Core state engine with exponential interpolation (lerp). Each tick smoothly converges current values toward targets.
- **`scenes.ts`** — Predefined color/brightness patterns (civic blue, pride, gold, sunset, etc.)
- **`server.ts`** — HTTP + WebSocket server. Ticks at 60fps, broadcasts only when state changes.
- **`ui.ts`** — Embedded HTML/CSS/JS client with touch-friendly grid controls.

## Smooth Transitions

All state changes go through a low-pass filter. When you change a scene or adjust a slider, the grid **flows** to the new state over ~1.5 seconds rather than jumping instantly. This ensures the physical laser array will never produce jarring transitions.
