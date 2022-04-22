#!/usr/bin/env node
import { render } from "ink";
import meow from "meow";
import React from "react";
import { testStates } from "./state/game-states";
import App from "./ui";

const cli = meow(
  `
	Usage
	  $ inkle

	Options
		--test ${Object.keys(testStates).join("|")}

	Examples
	  $ inkle --test midgame
`,
  {
    flags: {
      test: {
        type: "string",
      },
    },
  }
);

function chooseState(stateName?: string) {
  if (stateName == undefined) {
    return undefined;
  }
  const state = testStates[stateName];
  if (state === undefined) {
    console.log(`Unknown test state '${stateName}'`);
    process.exit(1);
  }
  return state;
}

render(<App initialState={chooseState(cli.flags.test)} />);
