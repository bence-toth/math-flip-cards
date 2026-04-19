# Math Flip Cards

A lively, browser-based flip-card math game aimed at 6–8 year olds. Kids tap (or press Enter/Space) on colourful cards to reveal the answer to simple addition and multiplication problems.

## Live demo

[bence-toth.github.io/math-flip-cards](https://bence-toth.github.io/math-flip-cards/)

## Features

- 12 randomised cards per round (4 × 3 grid, responsive to 3 × 4 on narrow screens)
- Choose operation: addition only, multiplication only, or both
- Three difficulty levels — Easy (bias toward 1–5 and 10), Medium (flat), Hard (bias toward 6–9) — using weighted sampling without replacement so no two cards share the same problem
- Smooth 3-D CSS flip animation revealing question + answer on each card
- After all cards are flipped, a short pause then cards animate out and a new round deals automatically — no interaction required
- Fully keyboard-navigable (Tab, Enter/Space to flip; toolbar buttons switchable by keyboard)
- Respects `prefers-reduced-motion` — all animations collapse to instant
- Accessible: semantic HTML, ARIA roles/attributes, `aria-pressed` state on cards and toolbar buttons, visible focus rings
- No dependencies — runs straight from `index.html` in any modern browser or static host

## Getting started

```bash
# Clone and open — no build step required
git clone https://github.com/bence-toth/math-flip-cards.git
cd math-flip-cards
open index.html   # macOS; or just drag it into a browser
```

## Project structure

```
index.html   – markup & layout
style.css    – all visual styles, animations, colour palette, responsive layout
game.js      – game logic: card generation, weighted sampling, flip handling, round transitions
```

## Accessibility notes

- All interactive cards have `role="button"`, `tabindex="0"`, and descriptive `aria-label` attributes updated on flip.
- `aria-pressed` tracks flip state on cards and active state on toolbar buttons.
- Focus is moved programmatically to the first card at the start of each new round.
- All animations and transitions are suppressed when `prefers-reduced-motion: reduce` is set.

## License

[MIT](LICENSE), do what you will.
