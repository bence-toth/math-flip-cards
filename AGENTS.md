# AGENTS.md — guidance for AI coding agents

## Repository overview

`math-flip-cards` is a zero-dependency, pure HTML/CSS/JS flip-card math game for young children (ages 6–8). There is no build step, no package manager, and no framework. Everything runs directly from the three source files.

## File map

| File         | Role                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| `index.html` | Document structure and static markup                                                      |
| `style.css`  | All visual styles, animations, colour palette, responsive layout                          |
| `game.js`    | Game logic — card sampling, activate/submit flow, correctness feedback, round transitions |

## Key invariants

- **No external dependencies** except the Mali Google Font. Do not introduce `npm`, bundlers, or additional CDN imports.
- **Three files only** (`index.html`, `style.css`, `game.js`). Do not split logic into multiple JS modules unless explicitly asked.
- **CARD_COUNT is 12** and the grid is always 4 × 3 (or 3 × 4 on narrow screens). Do not change this without being asked.
- **The larger operand always stays in the 1–10 range.** The `maxNum` setting (1–10) caps the _smaller_ operand only; the larger one is always drawn from the full 1–10 pool.
- **Accessibility is non-negotiable.** Every interactive element must have a keyboard handler, visible focus style, and appropriate ARIA attributes. Do not remove or weaken any a11y feature.
- **`prefers-reduced-motion` must be respected.** CSS collapses animations to near-instant; JS skips the post-flip pause and exit stagger.

## Conventions

- Vanilla JS with `'use strict'`. No TypeScript, no transpilation.
- CSS custom properties (variables) defined on `:root` for all design tokens — colours, shadows, radius, transitions. Prefer editing these over hardcoding values.
- Animation delays on cards are driven by the CSS custom property `--i` set inline from JS (see `makeCard`).
- Card uniqueness per round is guaranteed via random scoring + sort (reservoir-style) in `dealCards`. Do not replace this with a retry loop.
- Operation mode (`add` / `multiply` / `both`) and maximum number (`maxNum`, 1–10) are stored in module-level `let` variables and toggled via `setupToggleGroup`.
- Changing either setting triggers the card exit animation before dealing a new round (`transitioning = true; exitCards()`).
- Cards have three states tracked via `data-state`: `idle` (waiting for click), `answering` (input visible), `flipped` (submitted, showing answer). CSS transitions for the question scale and input fade-in are driven by these states — keep `answering` and `flipped` visually identical on the front face so the layout doesn't revert during the flip animation.
- `data-correct` (`yes` / `no`) is set on submit and drives the green/red `box-shadow` ring on `.card-inner`.

## What to check before submitting changes

1. Open `index.html` directly in a browser (no server needed) and verify the game is playable.
2. Tab through all 12 cards; confirm focus rings are visible and Enter/Space activates the focused card.
3. With a card in "answering" state, type a number and press Enter (or click ✓); confirm the card flips and the back shows the guess with `=` or `≠`.
4. Answer all cards and confirm they animate out after a short pause and a new round deals automatically.
5. Switch operation mode or maximum number mid-round and confirm the exit animation plays before the new round.
6. Resize the browser to a narrow viewport (< 560 px) and confirm the grid switches to 3 columns.
7. Enable `prefers-reduced-motion` in the OS and confirm no animations play and rounds transition instantly.
8. Run a quick screen-reader pass (VoiceOver / NVDA) to verify card labels update on flip and toolbar button states are announced.
