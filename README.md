# Math Flip Cards

A lively, browser-based flip-card math game aimed at 6–8 year olds. Kids tap (or press Enter/Space) on colourful cards to reveal the answer to simple addition and multiplication problems.

## Live demo

Hosted via GitHub Pages on the `main` branch: `https://<your-username>.github.io/math-flip-cards/`

## Features

- 12 randomised cards per round (4 × 3 grid, responsive to 3 × 4 on narrow screens)
- Addition (`+`) and multiplication (`×`) with operands in the 1–10 range
- Smooth 3-D CSS flip animation revealing question + answer
- Celebration screen with emoji bounce animation after all cards are flipped
- Fully keyboard-navigable (Tab, Enter/Space to flip, Escape to start a new round)
- Accessible: semantic HTML, ARIA roles/attributes, `aria-live` celebration region, visible focus rings
- No dependencies — a single HTML + CSS + JS triple that runs straight from the file system or any static host

## Getting started

```bash
# Clone and open — no build step required
git clone https://github.com/<your-username>/math-flip-cards.git
cd math-flip-cards
open index.html   # macOS; or just drag it into a browser
```

## Deploying to GitHub Pages

1. Push `main` to GitHub.
2. Go to **Settings → Pages** and set the source to the `main` branch, `/ (root)` folder.
3. Save — the site is live within seconds.

## Project structure

```
index.html   – markup & layout
style.css    – all visual styles and animations
game.js      – game logic (card generation, flip, round management)
```

## Accessibility notes

- All interactive cards have `role="button"`, `tabindex="0"`, and descriptive `aria-label` attributes.
- `aria-pressed` tracks flip state; screen readers announce "flipped" state changes.
- The celebration banner uses `aria-live="polite"` so screen readers announce it without interrupting.
- Focus is moved programmatically after each round start and after the celebration button is shown.

## License

[MIT](LICENSE)
