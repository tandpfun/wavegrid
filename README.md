# Illuminate

<p align="center" width="100%">
  <img height="250" src="https://raw.githubusercontent.com/constructive-io/constructive/refs/heads/main/assets/outline-logo.svg" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/constructive-io/Illuminate/actions/workflows/ci.yml">
    <img height="20" src="https://github.com/constructive-io/Illuminate/actions/workflows/ci.yml/badge.svg" />
  </a>
</p>

## Overview

**Illuminate** is a 7×7 laser grid controller for Civic Center Plaza — 49 Laser Space Cannons on a Global Truss F34 array. This workspace contains the web-based simulation UI and (eventually) the OSC bridge for controlling BEYOND.

## Getting Started

```sh
# Install dependencies
pnpm install

# Run the simulator dev server
pnpm dev

# Run tests
pnpm test

# Build all packages
pnpm build
```

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for future pgpm database modules)
- pgpm (`npm install -g pgpm`) — for future database work

## Packages

| Package | Description |
|---------|-------------|
| `@illuminate/simulator` | 7×7 grid state engine and debug UI — manages the 49-cannon state with smooth interpolation |
| `@illuminate/canvas` | Artist-facing creative canvas — "painting the sky with light" |

## Architecture

```
┌──────────────┐         ┌──────────────┐
│   Canvas     │ ──ws──▶ │  Simulator   │
│  (artist UI) │ ◀──ws── │ (state + LP) │
│  :3001       │         │  :3000       │
└──────────────┘         └──────────────┘
                              │
                         (future)
                              │
                         ┌────▼─────┐
                         │ Receiver │
                         │ (brain)  │
                         └──────────┘
```

- **Simulator** — state engine with exponential low-pass filtering. All transitions are smooth — no abrupt jumps. Runs at 60fps, broadcasts only on change.
- **Canvas** — artist-facing creative instrument. Paint, gradient, brush, energy, motion, symmetry modes. Connects to the simulator via WebSocket. iPad-optimized, no technical language.
- **Receiver** (future) — the "brain" that controls physical hardware. Runs its own low-pass filter so even if a client disconnects mid-transition, there's never a jolt. On signal loss, falls back to ambient 3D sine waves across the grid.

## Running

```sh
# Start both (two terminals)
pnpm dev:sim     # Simulator at :3000
pnpm dev:canvas  # Canvas at :3001

# Or just the canvas (connects to simulator automatically)
pnpm dev:canvas
```

Future phases will add:
- OSC bridge to BEYOND laser software
- pgpm database modules for show programming and presets
- Receiver/brain with autonomous fallback animations

## Credits

**🛠 Built by the [Constructive](https://constructive.io) team — creators of modular Postgres tooling for secure, composable backends. If you like our work, contribute on [GitHub](https://github.com/constructive-io).**
