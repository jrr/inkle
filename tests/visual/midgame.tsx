#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import App from '../../src/ui.js';
import { testStates } from '../../src/state/game-states.js';

render(<App initialState={{ ...testStates.midgame, exitPlease: true }} />);
