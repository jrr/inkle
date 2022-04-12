# inkle

Worlde in your Terminal, built with [Ink](https://github.com/vadimdemedes/ink).

This is a work-in-progress. If you just want to play Wordle in your Terminal,
than you should probably go check out
[clidle](https://github.com/ajeetdsouza/clidle) instead.

Current status:

- there's a single hardcoded solution
- you can make guesses, but they aren't yet required to be valid words
- nothing special happens when you win or lose

## Running it

- Clone the repo.
- Use Node.js 16. (`nvm use`)
- `yarn install`
- `yarn start`
- quit with esc or ctrl+C

## Future

- Solution is random instead of hardcoded
- Guesses must be valid words
- Win/Loss screens
- Bundled build published to NPM
- Hard mode

## Further Future

- Daily vs. Practice mode. (deterministic, but not attempting to use Wordle's
  exact word for a given day)
- `--num-boards 3` to solve multiple boards at once, like
  [Dordle](https://zaratustra.itch.io/dordle) or
  [Quordle](https://www.quordle.com/#/)
- Option to copy emoji results to clipboard
