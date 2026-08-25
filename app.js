const STORAGE_KEY = "fast-portuguese-vocabulary-progress-v2";
const DATASETS = window.FAST_PORTUGUESE_DATASETS || {};

const unitSelect = document.getElementById("unitSelect");
const categorySelect = document.getElementById("categorySelect");
const scopeSelect = document.getElementById("scopeSelect");
const directionSelect = document.getElementById("directionSelect");
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

let progress = loadProgress();
let deck = [];
let currentIndex = 0;

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
  render();
}

function render() {
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
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  currentIndex = 0;
  flashcard.classList.remove("flipped");
  render();
}

unitSelect.addEventListener("change", () => {
  populateCategories();
  buildDeck();
});
categorySelect.addEventListener("change", buildDeck);
scopeSelect.addEventListener("change", buildDeck);
directionSelect.addEventListener("change", () => {
  flashcard.classList.remove("flipped");
  render();
});

flashcard.addEventListener("click", () => flashcard.classList.toggle("flipped"));
document.getElementById("prevBtn").addEventListener("click", () => move(-1));
document.getElementById("nextBtn").addEventListener("click", () => move(1));
document.getElementById("shuffleBtn").addEventListener("click", shuffleDeck);
document.getElementById("knowBtn").addEventListener("click", () => mark("known"));
document.getElementById("againBtn").addEventListener("click", () => mark("review"));

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

populateUnits();
populateCategories();
buildDeck();
