# Visual Regression Testing for Inkle

This document describes the visual regression testing setup for the Inkle project using [ink-visual-testing](https://github.com/hoteye/ink-visual-testing).

## Overview

Visual regression testing helps detect unexpected changes in the terminal UI by comparing screenshots of the rendered application against baseline images. This ensures that UI changes are intentional and don't introduce visual bugs.

## Setup

The visual testing framework has been configured with the following components:

### 1. Dependencies

The `ink-visual-testing` package is installed as a development dependency:

```bash
npm install -D ink-visual-testing
```

### 2. Configuration File

The `.ink-visual.config.js` file in the project root defines:

- **Baseline directory**: `.ink-visual/baseline` - stores reference images
- **Diff directory**: `.ink-visual/diff` - stores comparison images when tests fail
- **Actual directory**: `.ink-visual/actual` - stores current test run images
- **Terminal size presets**: predefined sizes for different testing scenarios
- **Tolerance settings**: pixel difference threshold and max allowed differences

### 3. Test Files

Visual tests are located in `inkle/src/ui.visual.test.tsx` and cover:

#### Game States
- **midgame**: Game in progress with partial guesses
- **win**: Winning state after successful guess
- **lose**: Losing state after exhausting all guesses

#### Multi-board Games
- **dual-board**: Two boards simultaneously (120×30 terminal)
- **triple-board**: Three boards simultaneously (160×35 terminal)

#### Different Terminal Sizes
- **small-terminal**: Narrow preset (60×20)
- **large-terminal**: Wide preset (120×40)

#### Initial States
- **fresh-start**: New game starting state

## Running Visual Tests

### Run all visual tests
```bash
npm run test:visual
```

### Watch mode (re-run on file changes)
```bash
npm run test:visual:watch
```

### Update baselines (use when visual changes are intentional)
```bash
npm run test:visual:update
```

## Baseline Images

Baseline images are stored in `inkle/tests/__baselines__/` directory:

```
tests/__baselines__/
├── dual-board.png        # 2-board game layout
├── fresh-start.png       # New game screen
├── large-terminal.png    # Wide terminal view
├── lose.png             # Losing game state
├── midgame.png          # Game in progress
├── small-terminal.png   # Narrow terminal view
├── triple-board.png     # 3-board game layout
└── win.png              # Winning game state
```

## How It Works

1. **First run**: When tests run for the first time, baseline images are automatically generated
2. **Subsequent runs**: New screenshots are compared against baselines
3. **Failures**: If differences exceed thresholds, the test fails and diff images are saved
4. **Updating**: Use `npm run test:visual:update` to accept visual changes as the new baseline

### File Path Mode

The tests use **file path mode** instead of component mode. This means:

- Each test scenario has a corresponding TypeScript file in `tests/visual/`
- These files render the App component with specific states and `exitPlease: true`
- The visual testing tool executes these files and captures the terminal output
- This approach supports custom components, context providers, and complex interactions

## Test Configuration

Each test can specify:

- `cols`: Terminal width (number of columns)
- `rows`: Terminal height (number of rows)
- `maxDiffPixels`: Maximum number of pixels allowed to differ (default: 100)
- `threshold`: Pixel difference tolerance 0-1, where 0 is exact match (default: 0.1)

Example:
```typescript
await visualTest(
  'test-name',
  <App initialState={testStates.midgame} />,
  {
    cols: 80,
    rows: 24,
    maxDiffPixels: 100,
    threshold: 0.1,
  },
);
```

## Adding New Visual Tests

To add a new visual test:

1. Open `inkle/src/ui.visual.test.tsx`
2. Add a new test case in the appropriate `describe` block:

```typescript
it('should render my new state correctly', async () => {
  await visualTest(
    'my-new-state',
    <App initialState={myState} />,
    {
      cols: 80,
      rows: 24,
      maxDiffPixels: 100,
      threshold: 0.1,
    },
  );
});
```

3. Run tests to generate baseline:
```bash
npm run test:visual
```

## CI/CD Integration

Visual tests can be integrated into CI/CD pipelines:

```bash
# In your CI configuration
npm run build
npm run test:visual
```

The tests will fail if visual differences are detected, preventing unintended UI changes from being merged.

## Troubleshooting

### Tests failing unexpectedly

1. **Review diff images**: Check `.ink-visual/diff/` directory for comparison images
2. **Check terminal size**: Ensure the test is using the correct terminal dimensions
3. **Font differences**: Different systems may render fonts slightly differently
4. **Update baselines**: If changes are intentional, run `npm run test:visual:update`

### Understanding test file structure

The visual test files in `tests/visual/` are simple entry points that:
- Import the App component and game states
- Render the component with `exitPlease: true` to prevent hanging
- Export the rendered component for the visual testing tool to capture

This structure ensures the terminal output is captured correctly without interaction.

## Best Practices

1. **Commit baselines**: Always commit baseline images to version control
2. **Review diffs**: Carefully review visual changes before updating baselines
3. **Test critical states**: Focus on important UI states and user flows
4. **Multiple sizes**: Test on different terminal sizes to ensure responsive behavior
5. **Keep tests fast**: Visual tests can be slower, so focus on key scenarios

## Resources

- [ink-visual-testing GitHub](https://github.com/hoteye/ink-visual-testing)
- [Ink Documentation](https://github.com/vadimdemedes/ink)
- [Vitest Documentation](https://vitest.dev/)
