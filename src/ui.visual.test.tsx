import { visualTest } from 'ink-visual-testing';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Inkle Visual Tests', () => {
  describe('Game States', () => {
    it('should render midgame state correctly', async () => {
      await visualTest(
        'midgame',
        path.join(__dirname, '../tests/visual/midgame.tsx'),
        {
          cols: 80,
          rows: 24,
          maxDiffPixels: 100,
          threshold: 0.1,
        },
      );
    });

    it('should render win state correctly', async () => {
      await visualTest(
        'win',
        path.join(__dirname, '../tests/visual/win.tsx'),
        {
          cols: 80,
          rows: 24,
          maxDiffPixels: 100,
          threshold: 0.1,
        },
      );
    });

    it('should render lose state correctly', async () => {
      await visualTest(
        'lose',
        path.join(__dirname, '../tests/visual/lose.tsx'),
        {
          cols: 80,
          rows: 24,
          maxDiffPixels: 100,
          threshold: 0.1,
        },
      );
    });
  });

  describe('Multi-board Games', () => {
    it('should render dual board game', async () => {
      await visualTest(
        'dual-board',
        path.join(__dirname, '../tests/visual/dual-board.tsx'),
        {
          cols: 120,
          rows: 30,
          maxDiffPixels: 150,
          threshold: 0.1,
        },
      );
    });

    it('should render triple board game', async () => {
      await visualTest(
        'triple-board',
        path.join(__dirname, '../tests/visual/triple-board.tsx'),
        {
          cols: 160,
          rows: 35,
          maxDiffPixels: 200,
          threshold: 0.1,
        },
      );
    });
  });

  describe('New Game States', () => {
    it('should render fresh game start', async () => {
      await visualTest(
        'fresh-start',
        path.join(__dirname, '../tests/visual/fresh-start.tsx'),
        {
          cols: 80,
          rows: 24,
          maxDiffPixels: 100,
          threshold: 0.1,
        },
      );
    });
  });
});
