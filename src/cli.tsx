#!/usr/bin/env node
import { render } from "ink";
import meow from "meow";
import React from "react";
import { testStates } from "./state/game-states.js";
import App from "./ui.js";

const cli = meow(
  `
	Usage
	  $ inkle

	Options
		--test ${Object.keys(testStates).join("|")}

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
    },
    importMeta: import.meta,
  }
);

function chooseState(
  stateName: string | undefined,
  testQuit: boolean | undefined
) {
  if (stateName == undefined) {
    return undefined;
  }
  const state = testStates[stateName];
  if (state === undefined) {
    console.log(`Unknown test state '${stateName}'`);
    process.exit(1);
  }
  return { ...state, testQuit };
}

const app = render(
  <App initialState={chooseState(cli.flags.test, cli.flags.quit)} />
);

await app.waitUntilExit();
