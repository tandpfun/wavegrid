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
| `@illuminate/simulator` | 7×7 RGB grid simulator web UI with smooth transitions |

## Architecture

The simulator serves a web interface that renders a 7×7 grid of virtual laser cannons. All state transitions use interpolation (low-pass filtering) to ensure smooth, flowing changes — no abrupt jumps.

Future phases will add:
- OSC bridge to BEYOND laser software
- pgpm database modules for show programming and presets
- iPad/mobile-optimized touch controls

## Credits

**🛠 Built by the [Constructive](https://constructive.io) team — creators of modular Postgres tooling for secure, composable backends. If you like our work, contribute on [GitHub](https://github.com/constructive-io).**
