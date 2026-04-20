# Math Flip Cards

A lively, browser-based flip-card math game aimed at 6–8 year olds. Kids tap a card, type their answer, and flip it to see if they were right.

## Live demo

[bence-toth.github.io/math-flip-cards](https://bence-toth.github.io/math-flip-cards/)

## Features

- 12 randomised cards per round (4 × 3 grid, responsive to 3 × 4 on narrow screens)
- Choose operation: addition only, multiplication only, or both
- Maximum-number selector (1–10) caps the smaller operand, e.g. selecting 3 allows 3 × 7 but not 4 × 5
- Two modes: type-in (tap a card, type your answer, press Enter or ✓ to flip) or flip-only (tap to instantly flip)
- Back face shows your guess with `=` (correct) or `≠` (incorrect); card gets a green or red border accordingly
- Smooth 3-D CSS flip animation; question shrinks and input fades in with a CSS transform transition before flipping
- After all cards are answered, a short pause then cards animate out and a new round deals automatically
- Sound effects on flip, correct, and wrong answers; sound can be toggled on/off
- Settings (operation, max number, type-in mode, sound) are persisted to `localStorage` and restored on page load
- Fully keyboard-navigable (Tab to cards, Enter/Space to activate, type answer, Enter to submit; toolbar buttons also keyboard-operable)
- Respects `prefers-reduced-motion` — all animations collapse to instant
- Accessible: semantic HTML, ARIA roles/attributes, visible focus rings
- No dependencies — runs straight from `index.html` in any modern browser or static host

## Getting started

```bash
# Clone and open — no build step required
git clone https://github.com/bence-toth/math-flip-cards.git
cd math-flip-cards
open index.html # macOS; or just drag it into a browser
```

## Project structure

```
index.html   – markup & layout
style.css    – all visual styles, animations, colour palette, responsive layout
game.js      – game logic: card generation, weighted sampling, flip handling, round transitions
```

## Accessibility notes

- All interactive cards have `role="button"`, `tabindex="0"`, and descriptive `aria-label` attributes updated on flip.
- Card state is tracked via `data-state` (`idle` / `answering` / `flipped`); `aria-pressed` tracks active state on toolbar buttons.
- When a card is activated its `tabindex` is removed and focus moves to the number input inside it. The input and submit button each carry their own `aria-label` so screen readers announce them correctly; decorative card content is marked `aria-hidden`.
- Focus is moved programmatically to the first card at the start of each new round.
- All animations and transitions are suppressed when `prefers-reduced-motion: reduce` is set.

## License

[MIT](LICENSE), do what you will.
