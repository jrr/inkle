#!/usr/bin/env node
import { render } from "ink";
import meow from "meow";
import React from "react";
import App from "./ui";

const cli = meow(
  `
	Usage
	  $ inkle

	Options
		--test midgame|win|lose

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

if (cli.flags.test) {
  console.log('"--test" not implemented yet.');
  process.exit(0);
}

render(<App />);
