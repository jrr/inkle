# inkle

<img src="inkle.png" width="300" align="right" />

Wordle in your Terminal, built with [Ink](https://github.com/vadimdemedes/ink).
I blogged about it a little bit
[here](https://spin.atomicobject.com/2022/04/21/terminal-wordle-react-ink/).

This is a work-in-progress. If you just want to play Wordle in your Terminal,
than you should probably go check out
[clidle](https://github.com/ajeetdsouza/clidle) instead.

## Running it

Using Node.js 18+:

- From NPM: `npx inkle`
- From git: clone the repo and `yarn build-start`
- Quit with esc or ctrl+C

You can also play multiple boards (a la
[Dordle](https://zaratustra.itch.io/dordle)/[Quordle](https://www.quordle.com/#/)),
and override the number of guesses:

`--num-boards 3 --num-guesses 12`

## Future

- Hard mode
- Daily vs. Practice mode. (deterministic, but not attempting to use Wordle's
  exact word for a given day)
- Option to copy emoji results to clipboard
