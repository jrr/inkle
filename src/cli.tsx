#!/usr/bin/env node
import { render } from "ink";
import meow from "meow";
import React from "react";
import { isKnownState, testStates } from "./state/game-states.js";
import App from "./ui.js";

const knownStateNames = Object.keys(testStates).join("|");

const cli = meow(
  `
	Usage
	  $ inkle

	Options
		--test ${knownStateNames}
    --num-boards 3

	Examples
	  $ inkle --test midgame --quit
`,
  {
    flags: {
      test: {
        type: "string",
      },
      quit: {
        type: "boolean",
      },
      numBoards: {
        type: "number",
        alias: "n",
        default: 1,
      },
    },
    importMeta: import.meta,
  }
);

function chooseState(
  stateName: string | undefined,
  exitPlease: boolean | undefined
) {
  if (stateName == undefined) {
    return undefined;
  }
  if (!isKnownState(stateName)) {
    console.log(
      `Unknown test state '${stateName}'. Valid states are ${knownStateNames}`
    );
    process.exit(1);
  }

  const state = testStates[stateName];

  return { ...state, exitPlease };
}

const app = render(
  <App
    initialState={chooseState(cli.flags.test, cli.flags.quit)}
    numBoards={cli.flags.numBoards}
  />
);

await app.waitUntilExit();
