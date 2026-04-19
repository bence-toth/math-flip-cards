'use strict';

const CARD_COUNT   = 12;
const PAUSE_MS     = 2000;
const EXIT_STAGGER = 40;
const EXIT_DUR     = 350;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const board       = document.getElementById('board');
const modeButtons = document.querySelectorAll('.mode-btn');
const maxButtons  = document.querySelectorAll('.max-btn');

let flippedCount  = 0;
let transitioning = false;
let mode          = 'add';  // 'add' | 'multiply' | 'both'
let maxNum        = 10; // 1–10: highest number that can appear on a card

function dealCards() {
  const nums = [1,2,3,4,5,6,7,8,9,10];
  const ops  = mode === 'both' ? ['+', '×'] : mode === 'add' ? ['+'] : ['×'];
  const candidates = [];

  for (const op of ops) {
    for (let i = 0; i < nums.length; i++) {
      const a = nums[i];
      if (a > maxNum) break; // a is the smaller operand; all further i also exceed limit
      for (let j = i; j < nums.length; j++) {
        const b = nums[j];
        const score = Math.random();
        candidates.push({ op, a, b, score });
      }
    }
  }

  candidates.sort((x, y) => y.score - x.score);
  return candidates.slice(0, Math.min(CARD_COUNT, candidates.length));
}

function makeCard(index, { op, a, b }) {
  // Randomly swap a/b so e.g. "3 + 7" and "7 + 3" both appear across rounds
  const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
  const isMultiply = op === '×';
  const result = isMultiply ? x * y : x + y;

  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-pressed', 'false');
  card.setAttribute('aria-label', `Card ${index + 1}: ${x} ${op} ${y}`);
  card.style.setProperty('--i', index);

  card.innerHTML = `
    <div class="card-inner" aria-hidden="true">
      <div class="card-face card-front">
        <span class="question">${x} ${op} ${y}</span>
      </div>
      <div class="card-face card-back">
        <span class="equation">${x} ${op} ${y} =</span>
        <span class="answer">${result}</span>
      </div>
    </div>
  `;

  card.addEventListener('click', () => flipCard(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flipCard(card);
    }
  });

  return card;
}

function flipCard(card) {
  if (transitioning) return;
  if (card.getAttribute('aria-pressed') === 'true') return;

  card.setAttribute('aria-pressed', 'true');
  const eq  = card.querySelector('.equation').textContent;
  const ans = card.querySelector('.answer').textContent;
  card.setAttribute('aria-label', `${eq} ${ans}`);

  flippedCount++;

  const totalCards = board.querySelectorAll('.card').length;
  if (flippedCount === totalCards) {
    transitioning = true;
    setTimeout(exitCards, reducedMotion.matches ? 0 : PAUSE_MS);
  }
}

function exitCards() {
  const cards = [...board.querySelectorAll('.card')];
  cards.forEach((card, i) => {
    card.style.setProperty('--i', i);
    card.classList.add('exiting');
  });

  const totalExitMs = reducedMotion.matches
    ? 0
    : EXIT_STAGGER * (cards.length - 1) + EXIT_DUR;
  setTimeout(newRound, totalExitMs);
}

function newRound() {
  flippedCount  = 0;
  transitioning = false;

  board.innerHTML = '';
  dealCards().forEach((pair, i) => board.appendChild(makeCard(i, pair)));

  board.querySelector('.card')?.focus();
}

function setupToggleGroup(buttons, getCurrent, setCurrent) {
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset[Object.keys(btn.dataset)[0]] === getCurrent() || transitioning) return;

      setCurrent(btn.dataset[Object.keys(btn.dataset)[0]]);

      buttons.forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });

      transitioning = true;
      exitCards();
    });
  });
}

setupToggleGroup(modeButtons, () => mode, (v) => { mode = v; });
setupToggleGroup(maxButtons, () => String(maxNum), (v) => { maxNum = Number(v); });

// Initial deal
newRound();
