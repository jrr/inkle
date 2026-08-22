#!/usr/bin/env node
import { render } from "ink";
import meow from "meow";
import React from "react";
import { knownStateNames, parseFlags } from "./cli-options.js";
import App from "./ui.js";

const cli = meow(
  `
	Usage
	  $ inkle

	Options
    --test ${knownStateNames}
    --num-boards 3
    --num-guesses 10

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
        shortFlag: "n",
        default: 1,
      },
      numGuesses: {
        type: "number",
        shortFlag: "g",
      },
    },
    importMeta: import.meta,
  },
);

const parsed = parseFlags(cli.flags);

if (!parsed.ok) {
  console.log(parsed.error);
  process.exit(1);
}

const _app = render(<App {...parsed.options} />);

// this was cauing a 'Warning: Detected unsettled top-level await' with exit code 13:
// await app.waitUntilExit();
