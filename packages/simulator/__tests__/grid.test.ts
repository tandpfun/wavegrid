import { createGrid, tickGrid, setCannonTarget, setAllTargets, NUM_CANNONS } from '../src/grid';

describe('grid', () => {
  it('should create a grid of 49 cannons', () => {
    const grid = createGrid();
    expect(grid).toHaveLength(NUM_CANNONS);
    expect(grid[0].h).toBe(220);
    expect(grid[0].s).toBe(90);
    expect(grid[0].b).toBe(80);
  });

  it('should interpolate toward target on tick', () => {
    const grid = createGrid();
    setCannonTarget(grid, 0, 0, 0, 0);

    // After one tick, should move toward target but not reach it
    tickGrid(grid, 0.1);
    expect(grid[0].b).toBeLessThan(80);
    expect(grid[0].b).toBeGreaterThan(0);
  });

  it('should converge to target after many ticks', () => {
    const grid = createGrid();
    setCannonTarget(grid, 0, 0, 50, 50);

    for (let i = 0; i < 200; i++) {
      tickGrid(grid, 0.1);
    }

    expect(grid[0].s).toBeCloseTo(50, 0);
    expect(grid[0].b).toBeCloseTo(50, 0);
  });

  it('should handle hue wrap-around (shortest path)', () => {
    const grid = createGrid();
    // Start at hue 350, target hue 10 — should go 350→0→10 (not 350→180→10)
    grid[0].h = 350;
    grid[0].targetH = 350;
    setCannonTarget(grid, 0, 10);

    tickGrid(grid, 0.5);
    // angleDelta(350, 10) = +20, so new hue = (350 + 10) % 360 = 0
    // This means it moved forward through 360 (the short path), not backward
    const h = grid[0].h;
    // The hue should be between 350 and 10 on the short arc (i.e., >= 350 or <= 10)
    expect(h >= 350 || h <= 10).toBe(true);
  });

  it('should set all targets at once', () => {
    const grid = createGrid();
    setAllTargets(grid, 100, 50, 30);

    for (const c of grid) {
      expect(c.targetH).toBe(100);
      expect(c.targetS).toBe(50);
      expect(c.targetB).toBe(30);
    }
  });

  it('should report no change when grid is at target', () => {
    const grid = createGrid();
    // Grid starts at target, so tick should report no change
    const changed = tickGrid(grid);
    expect(changed).toBe(false);
  });

  it('should report change when grid is moving toward target', () => {
    const grid = createGrid();
    setCannonTarget(grid, 0, 0, 0, 0);
    const changed = tickGrid(grid);
    expect(changed).toBe(true);
  });
});
