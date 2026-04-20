"use strict";

const CARD_COUNT = 12;
const PAUSE_MS = 2000;
const EXIT_STAGGER = 40;
const EXIT_DUR = 350;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const board = document.getElementById("board");
const modeButtons = document.querySelectorAll(".mode-btn");
const maxButtons = document.querySelectorAll(".max-btn");
const typeInButton = document.querySelector(".type-in-toggle");
const typeInLabel = document.querySelector(".type-in-label");
const soundButton = document.querySelector(".sound-toggle");
const soundLabel = document.querySelector(".sound-label");

const sfx = Object.freeze({
  flip: new Audio("sound_flip.mp3"),
  correct: new Audio("sound_correct.mp3"),
  wrong: new Audio("sound_wrong.mp3"),
});

const SETTINGS_KEY = "math-flip-cards-settings";

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const saveSettings = () => {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ mode, maxNum, typeIn, soundOn }),
  );
};

const _saved = loadSettings();

let soundOn = _saved.soundOn ?? true;

const playSound = (name) => {
  if (!soundOn) return;
  const audio = sfx[name];
  audio.currentTime = 0;
  audio.play();
};

let flippedCount = 0;
let transitioning = false;
let mode = _saved.mode ?? "add"; // 'add' | 'multiply' | 'both'
let maxNum = _saved.maxNum ?? 10; // 1–10: highest number that can appear on a card
let typeIn = _saved.typeIn ?? true;

const dealCards = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const ops = mode === "both" ? ["+", "×"] : mode === "add" ? ["+"] : ["×"];
  const candidates = [];

  for (const op of ops) {
    for (let i = 0; i < numbers.length; i++) {
      const a = numbers[i];
      if (a > maxNum) break; // a is the smaller operand; all further i also exceed limit
      for (let j = i; j < numbers.length; j++) {
        const b = numbers[j];
        const score = Math.random();
        candidates.push({ op, a, b, score });
      }
    }
  }

  candidates.sort((x, y) => y.score - x.score);
  return candidates.slice(0, Math.min(CARD_COUNT, candidates.length));
};

const makeCard = (index, { op, a, b }) => {
  // Randomly swap a/b so e.g. "3 + 7" and "7 + 3" both appear across rounds
  const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
  const isMultiply = op === "×";
  const result = isMultiply ? x * y : x + y;

  const card = document.createElement("div");
  card.className = "card";
  card.dataset.state = "idle";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `Card ${index + 1}: ${x} ${op} ${y}`);
  card.style.setProperty("--i", index);

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front">
        <span class="question" aria-hidden="true">${x} ${op} ${y}</span>
        <div class="card-answer-clip">
          <div class="card-answer">
            <input class="card-input" type="number" min="0" max="9999" name="answer" autocomplete="off" tabindex="-1" aria-label="Your answer to ${x} ${op} ${y}" />
            <button class="card-submit" type="button" tabindex="-1" aria-label="Submit answer">✓</button>
          </div>
        </div>
      </div>
      <div class="card-face card-back" aria-hidden="true">
        <span class="guess" hidden></span>
        <span class="equation">${x} ${op} ${y} =</span>
        <span class="answer">${result}</span>
      </div>
    </div>
  `;

  card.addEventListener("click", () => activateCard(card));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activateCard(card);
    }
  });

  const input = card.querySelector(".card-input");
  const submitButton = card.querySelector(".card-submit");

  input.addEventListener("click", (e) => e.stopPropagation());
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      submitCard(card);
    }
  });

  submitButton.addEventListener("click", (e) => {
    e.stopPropagation();
    submitCard(card);
  });

  return card;
};

const deactivateCard = (card) => {
  card.dataset.state = "idle";
  card.setAttribute("tabindex", "0");
  card.querySelector(".card-input").value = "";
};

const activateCard = (card) => {
  if (transitioning) return;
  if (card.dataset.state === "answering") return;
  if (card.dataset.state === "flipped") return;

  if (!typeIn) {
    card.dataset.state = "flipped";
    playSound("flip");
    flippedCount++;
    const totalCards = board.querySelectorAll(".card").length;
    if (flippedCount === totalCards) {
      transitioning = true;
      setTimeout(exitCards, reducedMotion.matches ? 0 : PAUSE_MS);
    }
    return;
  }

  board
    .querySelectorAll('.card[data-state="answering"]')
    .forEach(deactivateCard);

  card.dataset.state = "answering";
  card.setAttribute("tabindex", "-1");
  card.querySelector(".card-input").focus();
};

const submitCard = (card) => {
  if (card.dataset.state !== "answering") return;

  const input = card.querySelector(".card-input");
  const guess = input.value.trim();
  const correct =
    Number(guess) === Number(card.querySelector(".answer").textContent);

  card.dataset.state = "flipped";

  if (guess !== "") {
    card.dataset.correct = correct ? "yes" : "no";
    playSound(correct ? "correct" : "wrong");
    card.dataset.guessed = "yes";
    const guessEl = card.querySelector(".guess");
    const eqBase = card
      .querySelector(".equation")
      .textContent.replace(/\s*=$/, "");
    const symbol = correct ? "=" : "≠";
    guessEl.textContent = `${eqBase} ${symbol} ${guess}`;
    guessEl.hidden = false;
  } else {
    playSound("flip");
  }

  const eq = card.querySelector(".equation").textContent;
  const ans = card.querySelector(".answer").textContent;
  card.setAttribute("aria-label", `${eq} ${ans}`);

  flippedCount++;

  const totalCards = board.querySelectorAll(".card").length;
  if (flippedCount === totalCards) {
    transitioning = true;
    setTimeout(exitCards, reducedMotion.matches ? 0 : PAUSE_MS);
  }
};

const exitCards = () => {
  const cards = Array.from(board.querySelectorAll(".card"));
  cards.forEach((card, i) => {
    card.style.setProperty("--i", i);
    card.classList.add("exiting");
  });

  const totalExitMs = reducedMotion.matches
    ? 0
    : EXIT_STAGGER * (cards.length - 1) + EXIT_DUR;
  setTimeout(newRound, totalExitMs);
};

const newRound = () => {
  flippedCount = 0;
  transitioning = false;

  board.innerHTML = "";
  dealCards().forEach((pair, i) => board.appendChild(makeCard(i, pair)));

  board.querySelector(".card")?.focus();
};

const setupToggleGroup = (buttons, getCurrent, setCurrent) => {
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (
        btn.dataset[Object.keys(btn.dataset)[0]] === getCurrent() ||
        transitioning
      )
        return;

      setCurrent(btn.dataset[Object.keys(btn.dataset)[0]]);

      buttons.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      transitioning = true;
      exitCards();
    });
  });
};

setupToggleGroup(
  modeButtons,
  () => mode,
  (v) => {
    mode = v;
    saveSettings();
  },
);
setupToggleGroup(
  maxButtons,
  () => String(maxNum),
  (v) => {
    maxNum = Number(v);
    saveSettings();
  },
);

typeInLabel.addEventListener("click", () => typeInButton.click());
soundLabel.addEventListener("click", () => soundButton.click());

soundButton.addEventListener("click", () => {
  soundOn = !soundOn;
  soundButton.classList.toggle("active", soundOn);
  soundButton.setAttribute("aria-pressed", soundOn ? "true" : "false");
  saveSettings();
});

typeInButton.addEventListener("click", () => {
  if (transitioning) return;
  typeIn = !typeIn;
  typeInButton.classList.toggle("active", typeIn);
  typeInButton.setAttribute("aria-pressed", typeIn ? "true" : "false");
  document.body.dataset.typeIn = typeIn ? "on" : "off";
  saveSettings();
  transitioning = true;
  exitCards();
});

document.body.dataset.typeIn = typeIn ? "on" : "off";

modeButtons.forEach((btn) => {
  const active = btn.dataset.mode === mode;
  btn.classList.toggle("active", active);
  btn.setAttribute("aria-pressed", active ? "true" : "false");
});

maxButtons.forEach((btn) => {
  const active = Number(btn.dataset.max) === maxNum;
  btn.classList.toggle("active", active);
  btn.setAttribute("aria-pressed", active ? "true" : "false");
});

typeInButton.classList.toggle("active", typeIn);
typeInButton.setAttribute("aria-pressed", typeIn ? "true" : "false");

soundButton.classList.toggle("active", soundOn);
soundButton.setAttribute("aria-pressed", soundOn ? "true" : "false");

// Initial deal
newRound();
