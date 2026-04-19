# AGENTS.md — guidance for AI coding agents

## Repository overview

`math-flip-cards` is a zero-dependency, pure HTML/CSS/JS flip-card math game for young children (ages 6–8). There is no build step, no package manager, and no framework. Everything runs directly from the three source files.

## File map

| File | Role |
|------|------|
| `index.html` | Document structure and static markup |
| `style.css` | All visual styles, animations, colour palette, responsive layout |
| `game.js` | Game logic — card generation, flip handling, round transitions |

## Key invariants

- **No external dependencies.** Do not introduce `npm`, bundlers, or CDN imports.
- **Three files only** (`index.html`, `style.css`, `game.js`). Do not split logic into multiple JS modules unless explicitly asked.
- **CARD_COUNT is 12** and the grid is always 4 × 3 (or 3 × 4 on narrow screens). Do not change this without being asked.
- **Operands stay in the 1–10 range** (inclusive). Do not widen or narrow this range silently.
- **Accessibility is non-negotiable.** Every interactive element must have a keyboard handler, visible focus style, and appropriate ARIA attributes. Do not remove or weaken any a11y feature.

## Conventions

- Vanilla JS with `'use strict'`. No TypeScript, no transpilation.
- CSS custom properties (variables) defined on `:root` for all design tokens — colours, radius, transitions. Prefer editing these over hardcoding values.
- Animation delays on cards are driven by the CSS custom property `--i` set inline from JS (see `makeCard`).
- The celebration overlay is toggled with the native `hidden` attribute, not a class.

## What to check before submitting changes

1. Open `index.html` directly in a browser (no server needed) and verify the game is playable.
2. Tab through all 12 cards with the keyboard; confirm focus rings are visible and Enter/Space flips the focused card.
3. Flip all 12 cards and confirm the celebration screen appears and the "Next Round" button receives focus automatically.
4. Press Escape on the celebration screen and confirm a new round starts.
5. Resize the browser to a narrow viewport (< 560 px) and confirm the grid switches to 3 columns.
6. Run a quick screen-reader pass (VoiceOver / NVDA) to verify card labels and the live region announcement.
