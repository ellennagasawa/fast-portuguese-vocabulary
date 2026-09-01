const STORAGE_KEY = "fast-portuguese-vocabulary-progress-v2";
const DATASETS = window.FAST_PORTUGUESE_DATASETS || {};

const unitSelect = document.getElementById("unitSelect");
const categorySelect = document.getElementById("categorySelect");
const scopeSelect = document.getElementById("scopeSelect");
const directionSelect = document.getElementById("directionSelect");
const voiceControl = document.getElementById("voiceControl");
const voiceSelect = document.getElementById("voiceSelect");
const audioRow = document.getElementById("audioRow");
const audioBtn = document.getElementById("audioBtn");
const audioStatus = document.getElementById("audioStatus");
const flashcard = document.getElementById("flashcard");
const frontText = document.getElementById("frontText");
const backText = document.getElementById("backText");
const exampleText = document.getElementById("exampleText");
const noteText = document.getElementById("noteText");
const essentialBadge = document.getElementById("essentialBadge");
const categoryLabel = document.getElementById("categoryLabel");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const knownCount = document.getElementById("knownCount");
const reviewCount = document.getElementById("reviewCount");
const unitKicker = document.getElementById("unitKicker");
const unitTitle = document.getElementById("unitTitle");
const deckCount = document.getElementById("deckCount");
const cardArea = document.getElementById("cardArea");
const emptyState = document.getElementById("emptyState");

const flashcardsPanel = document.getElementById("flashcardsPanel");
const practicePanel = document.getElementById("practicePanel");
const flashcardsTab = document.getElementById("flashcardsTab");
const practiceTab = document.getElementById("practiceTab");
const scopeControl = document.getElementById("scopeControl");
const directionControl = document.getElementById("directionControl");

const practiceUnitNotice = document.getElementById("practiceUnitNotice");
const practiceHome = document.getElementById("practiceHome");
const exerciseArea = document.getElementById("exerciseArea");
const quizResult = document.getElementById("quizResult");
const exerciseCounter = document.getElementById("exerciseCounter");
const exerciseBadge = document.getElementById("exerciseBadge");
const exerciseInstruction = document.getElementById("exerciseInstruction");
const exerciseListenBtn = document.getElementById("exerciseListenBtn");
const exercisePrompt = document.getElementById("exercisePrompt");
const choiceOptions = document.getElementById("choiceOptions");
const fillForm = document.getElementById("fillForm");
const fillAnswer = document.getElementById("fillAnswer");
const exerciseFeedback = document.getElementById("exerciseFeedback");
const nextExerciseBtn = document.getElementById("nextExerciseBtn");
const quizScore = document.getElementById("quizScore");

let progress = loadProgress();
let deck = [];
let currentIndex = 0;

let portugueseVoices = [];
const speechSupported =
  "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

function populatePortugueseVoices() {
  if (!speechSupported) {
    voiceControl.hidden = true;
    audioRow.hidden = true;
    return;
  }

  const allVoices = window.speechSynthesis.getVoices();
  portugueseVoices = allVoices.filter(voice => /^pt([-_]|$)/i.test(voice.lang));

  voiceSelect.innerHTML = "";

  if (!portugueseVoices.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Português — voz padrão do dispositivo";
    voiceSelect.appendChild(option);
    return;
  }

  portugueseVoices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent =
      `${voice.name} — ${voice.lang}${voice.default ? " (padrão)" : ""}`;
    voiceSelect.appendChild(option);
  });

  const preferredIndex = portugueseVoices.findIndex(
    voice => /^pt-BR$/i.test(voice.lang)
  );
  if (preferredIndex >= 0) {
    voiceSelect.value = String(preferredIndex);
  }
}

function updateAudioControls() {
  voiceControl.hidden = !speechSupported;
  audioRow.hidden = !speechSupported || !deck.length;

  if (!speechSupported) {
    audioStatus.textContent = "Pronúncia não disponível neste navegador.";
  } else if (audioStatus.textContent === "Pronúncia não disponível neste navegador.") {
    audioStatus.textContent = "";
  }
}

function currentPortugueseText() {
  if (!deck.length) return "";
  const card = deck[currentIndex];
  return card.speech || card.pt || "";
}

function speakPortuguese(text) {
  if (!speechSupported || !text) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const selectedIndex = Number(voiceSelect.value);
  const selectedVoice = portugueseVoices[selectedIndex];

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  } else {
    utterance.lang = "pt-BR";
  }

  utterance.rate = 0.85;
  utterance.pitch = 1;

  audioStatus.textContent = "Reproduzindo…";

  utterance.onend = () => {
    audioStatus.textContent = "";
  };

  utterance.onerror = () => {
    audioStatus.textContent = "Não foi possível reproduzir esta pronúncia.";
  };

  window.speechSynthesis.speak(utterance);
}

if (speechSupported) {
  populatePortugueseVoices();
  window.speechSynthesis.onvoiceschanged = populatePortugueseVoices;
}


let currentMode = "flashcards";
let practiceType = null;
let practiceQuestion = null;
let practiceQueue = [];
let practicePosition = 0;
let practiceCorrect = 0;
let practiceAnswered = false;

function setMode(mode) {
  currentMode = mode;
  const practiceMode = mode === "practice";

  flashcardsPanel.hidden = practiceMode;
  practicePanel.hidden = !practiceMode;
  scopeControl.hidden = practiceMode;
  directionControl.hidden = practiceMode;

  flashcardsTab.classList.toggle("active", !practiceMode);
  practiceTab.classList.toggle("active", practiceMode);
  flashcardsTab.setAttribute("aria-selected", String(!practiceMode));
  practiceTab.setAttribute("aria-selected", String(practiceMode));

  if (speechSupported) window.speechSynthesis.cancel();

  if (practiceMode) {
    resetPracticeHome();
    updatePracticeAvailability();
  }
}

function updatePracticeAvailability() {
  const available = selectedDataset().unit === 1;
  practiceUnitNotice.hidden = available;
  practiceHome.hidden = !available;
  exerciseArea.hidden = true;
  quizResult.hidden = true;
}

function resetPracticeHome() {
  practiceType = null;
  practiceQuestion = null;
  practiceQueue = [];
  practicePosition = 0;
  practiceCorrect = 0;
  practiceAnswered = false;
  exerciseArea.hidden = true;
  quizResult.hidden = true;
  exerciseFeedback.textContent = "";
  choiceOptions.innerHTML = "";
  fillAnswer.value = "";
}

function unit1PracticeCards() {
  const data = DATASETS.unit1;
  if (!data || !Array.isArray(data.cards)) return [];

  const category = categorySelect.value;
  return data.cards.filter(card => {
    if (category !== "__all__" && card.category !== category) return false;
    return card.pt && card.en;
  });
}

function normalizedAnswer(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("pt-BR")
    .replace(/[“”"'.!?;,]/g, "")
    .replace(/\s+/g, " ");
}

function fillEligibleCards(cards) {
  return cards.filter(card =>
    card.pt.length <= 34 &&
    !/[\/()]/.test(card.pt) &&
    !card.pt.includes("(o)") &&
    !card.pt.includes("(a)")
  );
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeChoiceOptions(card, cards) {
  const distractors = shuffled(
    cards.filter(candidate => candidate !== card && candidate.en !== card.en)
  )
    .slice(0, 3)
    .map(candidate => candidate.en);

  return shuffled([card.en, ...distractors]);
}

function makeQuestion(type, cards) {
  let effectiveType = type;

  if (type === "mixed") {
    effectiveType = randomItem(["choice", "fill", "listening"]);
  }

  let pool = cards;
  if (effectiveType === "fill") {
    pool = fillEligibleCards(cards);
    if (!pool.length) effectiveType = "choice";
  }

  const card = randomItem(pool.length ? pool : cards);

  if (effectiveType === "fill") {
    return {
      type: "fill",
      card,
      instruction: "Escreva em português.",
      prompt: card.en
    };
  }

  if (effectiveType === "listening") {
    return {
      type: "listening",
      card,
      instruction: "Escute e escolha o significado em inglês.",
      prompt: "",
      options: makeChoiceOptions(card, cards)
    };
  }

  return {
    type: "choice",
    card,
    instruction: "Escolha o significado em inglês.",
    prompt: card.pt,
    options: makeChoiceOptions(card, cards)
  };
}

function startPractice(type) {
  const cards = unit1PracticeCards();

  if (!cards.length) {
    exerciseArea.hidden = false;
    practiceHome.hidden = true;
    exerciseInstruction.textContent = "Nenhum item disponível nesta categoria.";
    exercisePrompt.textContent = "";
    choiceOptions.innerHTML = "";
    fillForm.hidden = true;
    nextExerciseBtn.hidden = true;
    return;
  }

  practiceType = type;
  practiceCorrect = 0;
  practicePosition = 0;

  if (type === "mixed") {
    practiceQueue = Array.from({ length: 10 }, () => makeQuestion("mixed", cards));
  } else {
    const count = Math.min(10, cards.length);
    const selected = shuffled(cards).slice(0, count);
    practiceQueue = selected.map(card => {
      if (type === "fill" && !fillEligibleCards([card]).length) {
        return makeQuestion("fill", cards);
      }
      if (type === "choice") {
        return {
          type: "choice",
          card,
          instruction: "Escolha o significado em inglês.",
          prompt: card.pt,
          options: makeChoiceOptions(card, cards)
        };
      }
      if (type === "listening") {
        return {
          type: "listening",
          card,
          instruction: "Escute e escolha o significado em inglês.",
          prompt: "",
          options: makeChoiceOptions(card, cards)
        };
      }
      return {
        type: "fill",
        card,
        instruction: "Escreva em português.",
        prompt: card.en
      };
    });
  }

  practiceHome.hidden = true;
  quizResult.hidden = true;
  exerciseArea.hidden = false;
  renderPracticeQuestion();
}

function practiceLabel(type) {
  if (type === "choice") return "Escolha";
  if (type === "fill") return "Complete";
  if (type === "listening") return "Escuta";
  return "Prática";
}

function renderPracticeQuestion() {
  if (speechSupported) window.speechSynthesis.cancel();

  practiceAnswered = false;
  practiceQuestion = practiceQueue[practicePosition];
  const question = practiceQuestion;

  exerciseCounter.textContent = `Questão ${practicePosition + 1} de ${practiceQueue.length}`;
  exerciseBadge.textContent = practiceLabel(question.type);
  exerciseInstruction.textContent = question.instruction;
  exercisePrompt.textContent = question.prompt;
  exerciseFeedback.textContent = "";
  exerciseFeedback.className = "exercise-feedback";
  nextExerciseBtn.hidden = true;
  choiceOptions.innerHTML = "";
  fillAnswer.value = "";

  exerciseListenBtn.hidden = question.type !== "listening";
  fillForm.hidden = question.type !== "fill";

  if (question.type === "choice" || question.type === "listening") {
    question.options.forEach(optionText => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-option";
      button.textContent = optionText;
      button.addEventListener("click", () => checkChoice(button, optionText));
      choiceOptions.appendChild(button);
    });
  }

  if (question.type === "fill") {
    setTimeout(() => fillAnswer.focus(), 0);
  }
}

function finishAnswer(correct, correctText) {
  practiceAnswered = true;

  if (correct) {
    practiceCorrect += 1;
    exerciseFeedback.textContent = "✓ Correto!";
    exerciseFeedback.className = "exercise-feedback correct";
  } else {
    exerciseFeedback.innerHTML = `Ainda não. Resposta: <strong>${correctText}</strong>`;
    exerciseFeedback.className = "exercise-feedback incorrect";
  }

  nextExerciseBtn.hidden = false;

  choiceOptions.querySelectorAll("button").forEach(button => {
    button.disabled = true;
    if (button.textContent === practiceQuestion.card.en) {
      button.classList.add("correct-option");
    }
  });
}

function checkChoice(button, answer) {
  if (practiceAnswered) return;

  const correct = answer === practiceQuestion.card.en;
  if (!correct) button.classList.add("incorrect-option");
  finishAnswer(correct, practiceQuestion.card.en);
}

function checkFillAnswer() {
  if (practiceAnswered) return;

  const expected = normalizedAnswer(practiceQuestion.card.pt);
  const actual = normalizedAnswer(fillAnswer.value);
  finishAnswer(actual === expected, practiceQuestion.card.pt);
}

function nextPracticeQuestion() {
  if (practicePosition + 1 >= practiceQueue.length) {
    showPracticeResult();
    return;
  }
  practicePosition += 1;
  renderPracticeQuestion();
}

function showPracticeResult() {
  if (speechSupported) window.speechSynthesis.cancel();

  exerciseArea.hidden = true;
  quizResult.hidden = false;

  const total = practiceQueue.length;
  const percent = total ? Math.round((practiceCorrect / total) * 100) : 0;
  quizScore.innerHTML =
    `<strong>${practiceCorrect}/${total}</strong> respostas corretas — ${percent}%`;
}

function speakPracticePrompt() {
  if (!practiceQuestion) return;
  const card = practiceQuestion.card;
  speakPortuguese(card.speech || card.pt);
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function selectedUnitKey() {
  return unitSelect.value || "unit1";
}

function selectedDataset() {
  return DATASETS[selectedUnitKey()] || { unit: 1, title: "", cards: [] };
}

function cardId(card) {
  return `${selectedUnitKey()}::${card.category}::${card.pt}`;
}

function setUrlState() {
  const params = new URLSearchParams(window.location.search);
  params.set("unit", selectedDataset().unit);
  if (categorySelect.value && categorySelect.value !== "__all__") {
    params.set("category", categorySelect.value);
  } else {
    params.delete("category");
  }
  history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}

function populateUnits() {
  unitSelect.innerHTML = "";
  Object.keys(DATASETS)
    .sort((a, b) => DATASETS[a].unit - DATASETS[b].unit)
    .forEach(key => {
      const data = DATASETS[key];
      const option = document.createElement("option");
      option.value = key;
      option.textContent = `Unidade ${data.unit} — ${data.title}`;
      unitSelect.appendChild(option);
    });

  const params = new URLSearchParams(window.location.search);
  const requested = Number(params.get("unit"));
  if (requested >= 1 && requested <= 15 && DATASETS[`unit${requested}`]) {
    unitSelect.value = `unit${requested}`;
  }
}

function categories(cards) {
  return [...new Set(cards.map(card => card.category))];
}

function populateCategories(preferred = null) {
  const cards = selectedDataset().cards || [];
  categorySelect.innerHTML = `<option value="__all__">Todas as categorias</option>`;
  categories(cards).forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = preferred || params.get("category");
  if (requestedCategory && [...categorySelect.options].some(o => o.value === requestedCategory)) {
    categorySelect.value = requestedCategory;
  }
}

function buildDeck() {
  const data = selectedDataset();
  const cards = data.cards || [];
  const category = categorySelect.value;
  const scope = scopeSelect.value;

  unitKicker.textContent = `Unidade ${data.unit}`;
  unitTitle.textContent = data.title;
  deckCount.textContent = `${cards.length} cartões`;

  if (!cards.length) {
    deck = [];
    emptyState.hidden = false;
    cardArea.hidden = true;
    categoryLabel.textContent = "";
    progressText.textContent = "";
    progressBar.style.width = "0%";
    updateAudioControls();
    return;
  }

  emptyState.hidden = true;
  cardArea.hidden = false;

  deck = cards.filter(card => {
    if (category !== "__all__" && card.category !== category) return false;
    if (scope === "essential" && !card.essential) return false;
    if (scope === "review" && progress[cardId(card)] !== "review") return false;
    return true;
  });

  currentIndex = 0;
  flashcard.classList.remove("flipped");
  setUrlState();
  updateAudioControls();
  render();
}

function render() {
  updateAudioControls();

  if (!deck.length) {
    categoryLabel.textContent = "Nenhum cartão neste filtro";
    progressText.textContent = "0 / 0";
    progressBar.style.width = "0%";
    frontText.textContent = "Nenhum cartão para mostrar.";
    backText.textContent = "";
    exampleText.textContent = "";
    noteText.textContent = "";
    essentialBadge.hidden = true;
    updateStats();
    return;
  }

  const card = deck[currentIndex];
  const direction = directionSelect.value;
  frontText.textContent = direction === "pt-en" ? card.pt : card.en;
  backText.textContent = direction === "pt-en" ? card.en : card.pt;
  exampleText.textContent = card.example || "";
  noteText.textContent = card.note || "";
  essentialBadge.hidden = !card.essential;

  categoryLabel.textContent = card.category;
  progressText.textContent = `${currentIndex + 1} / ${deck.length}`;
  progressBar.style.width = `${((currentIndex + 1) / deck.length) * 100}%`;

  updateStats();
}

function updateStats() {
  const ids = new Set(deck.map(cardId));
  let known = 0;
  let review = 0;
  Object.entries(progress).forEach(([id, status]) => {
    if (!ids.has(id)) return;
    if (status === "known") known++;
    if (status === "review") review++;
  });
  knownCount.textContent = known;
  reviewCount.textContent = review;
}

function move(delta) {
  if (!deck.length) return;
  if (speechSupported) window.speechSynthesis.cancel();
  currentIndex = (currentIndex + delta + deck.length) % deck.length;
  flashcard.classList.remove("flipped");
  render();
}

function mark(status) {
  if (!deck.length) return;
  progress[cardId(deck[currentIndex])] = status;
  saveProgress();
  updateStats();
  move(1);
}

function shuffleDeck() {
  if (speechSupported) window.speechSynthesis.cancel();
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  currentIndex = 0;
  flashcard.classList.remove("flipped");
  render();
}

unitSelect.addEventListener("change", () => {
  if (speechSupported) window.speechSynthesis.cancel();
  populateCategories();
  buildDeck();
  if (currentMode === "practice") updatePracticeAvailability();
});
categorySelect.addEventListener("change", () => {
  buildDeck();
  if (currentMode === "practice") {
    resetPracticeHome();
    updatePracticeAvailability();
  }
});
scopeSelect.addEventListener("change", buildDeck);
directionSelect.addEventListener("change", () => {
  if (speechSupported) window.speechSynthesis.cancel();
  flashcard.classList.remove("flipped");
  render();
});

flashcard.addEventListener("click", () => flashcard.classList.toggle("flipped"));
document.getElementById("prevBtn").addEventListener("click", () => move(-1));
document.getElementById("nextBtn").addEventListener("click", () => move(1));
document.getElementById("shuffleBtn").addEventListener("click", shuffleDeck);
document.getElementById("knowBtn").addEventListener("click", () => mark("known"));
document.getElementById("againBtn").addEventListener("click", () => mark("review"));

audioBtn.addEventListener("click", () => {
  speakPortuguese(currentPortugueseText());
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const unitPrefix = `${selectedUnitKey()}::`;
  if (confirm("Limpar o progresso salvo desta unidade neste navegador?")) {
    Object.keys(progress).forEach(key => {
      if (key.startsWith(unitPrefix)) delete progress[key];
    });
    saveProgress();
    buildDeck();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") move(-1);
  if (event.key === "ArrowRight") move(1);
});


flashcardsTab.addEventListener("click", () => setMode("flashcards"));
practiceTab.addEventListener("click", () => setMode("practice"));

document.querySelectorAll("[data-practice]").forEach(button => {
  button.addEventListener("click", () => startPractice(button.dataset.practice));
});

document.getElementById("backToPracticeBtn").addEventListener("click", () => {
  if (speechSupported) window.speechSynthesis.cancel();
  resetPracticeHome();
  updatePracticeAvailability();
});

document.getElementById("goUnit1Btn").addEventListener("click", () => {
  unitSelect.value = "unit1";
  populateCategories();
  buildDeck();
  updatePracticeAvailability();
});

exerciseListenBtn.addEventListener("click", speakPracticePrompt);
nextExerciseBtn.addEventListener("click", nextPracticeQuestion);

fillForm.addEventListener("submit", event => {
  event.preventDefault();
  checkFillAnswer();
});

document.getElementById("retryQuizBtn").addEventListener("click", () => {
  startPractice(practiceType || "mixed");
});

document.getElementById("resultHomeBtn").addEventListener("click", () => {
  resetPracticeHome();
  updatePracticeAvailability();
});

populateUnits();
populateCategories();
buildDeck();
