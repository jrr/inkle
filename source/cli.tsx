#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui";

const cli = meow(
  `
	Usage
	  $ inkle

	Options
		--name  Your name

	Examples
	  $ inkle --name=Jane
	  Hello, Jane
`,
  {
    flags: {
      name: {
        type: "string",
      },
    },
  }
);

render(<App />);
