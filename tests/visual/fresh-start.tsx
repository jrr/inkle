#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import App from '../../src/ui.js';
import { newGame } from '../../src/state/game-states.js';

render(<App initialState={{ ...newGame({ numBoards: 1, numGuesses: 6 }), exitPlease: true }} />);
