#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import App from '../../src/ui.js';
import { newGame } from '../../src/state/game-states.js';

render(<App initialState={{ ...newGame({ numBoards: 3, numGuesses: 8 }), exitPlease: true }} />);
