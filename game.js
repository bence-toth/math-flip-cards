'use strict';

const CARD_COUNT   = 12;
const PAUSE_MS     = 2000;
const EXIT_STAGGER = 40;
const EXIT_DUR     = 350;

const board       = document.getElementById('board');
const modeButtons = document.querySelectorAll('.mode-btn');

let flippedCount  = 0;
let transitioning = false;
let mode          = 'add'; // 'add' | 'multiply' | 'both'

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeCard(index) {
  let isMultiply;
  if (mode === 'add')      isMultiply = false;
  else if (mode === 'multiply') isMultiply = true;
  else                     isMultiply = Math.random() < 0.5;

  const x = rand(1, 10);
  const y = rand(1, 10);
  const op     = isMultiply ? '×' : '+';
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

  if (flippedCount === CARD_COUNT) {
    transitioning = true;
    setTimeout(exitCards, PAUSE_MS);
  }
}

function exitCards() {
  const cards = [...board.querySelectorAll('.card')];
  cards.forEach((card, i) => {
    card.style.setProperty('--i', i);
    card.classList.add('exiting');
  });

  const totalExitMs = EXIT_STAGGER * (CARD_COUNT - 1) + EXIT_DUR;
  setTimeout(newRound, totalExitMs);
}

function newRound() {
  flippedCount  = 0;
  transitioning = false;

  board.innerHTML = '';
  for (let i = 0; i < CARD_COUNT; i++) {
    board.appendChild(makeCard(i));
  }

  board.querySelector('.card')?.focus();
}

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.mode === mode || transitioning) return;

    mode = btn.dataset.mode;

    modeButtons.forEach((b) => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });

    transitioning = true;
    exitCards();
  });
});

// Initial deal
newRound();
