export default {
  // Directory for storing baseline images
  baselineDir: '.ink-visual/baseline',

  // Directory for storing diff images when tests fail
  diffDir: '.ink-visual/diff',

  // Directory for storing actual images from test runs
  actualDir: '.ink-visual/actual',

  // Terminal size presets
  presets: {
    // Standard sizes
    tiny: { cols: 40, rows: 15 },
    narrow: { cols: 60, rows: 20 },
    standard: { cols: 80, rows: 24 },
    wide: { cols: 120, rows: 40 },
    'ultra-wide': { cols: 160, rows: 50 },

    // CI-friendly sizes
    ci: { cols: 100, rows: 30 },
    'ci-narrow': { cols: 80, rows: 25 },

    // Game-specific sizes
    'game-small': { cols: 50, rows: 20 },
    'game-medium': { cols: 80, rows: 30 },
    'game-large': { cols: 120, rows: 40 },
  },

  // Default terminal size
  defaultPreset: 'standard',

  // Pixel difference tolerance (0-1, where 0 is exact match)
  threshold: 0.1,

  // Maximum number of pixels that can differ
  maxDiffPixels: 100,

  // Whether to update baselines on mismatch
  updateBaselines: false,

  // Timeout for rendering (ms)
  timeout: 5000,
};
