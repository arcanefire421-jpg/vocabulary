import { BASE_VOCABULARY } from "../data/vocabulary.js?v=20260624-unit10-pages49-50";
import { QUESTION_BANK } from "../data/questions.js?v=20260624-unit10-pages49-50";

const APP_VERSION = "20260624-unit10-pages49-50";

const STORAGE_KEY = "vocabmaster-state-v1";
const CUSTOM_KEY = "vocabmaster-custom-v1";

let stats = loadJson(STORAGE_KEY, {});
let customWords = loadJson(CUSTOM_KEY, []);
let words = buildWords();
let flashList = [];
let flashIndex = 0;
let currentQuestion = null;
let flashDrag = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(customWords));
}

function baseWord(word) {
  const wordStats = stats[word.id] ?? {};
  return {
    ...word,
    correct: wordStats.correct ?? word.correct ?? 0,
    total: wordStats.total ?? word.total ?? 0,
    proficiency: wordStats.proficiency ?? word.proficiency ?? 0
  };
}

function buildWords() {
  return [...BASE_VOCABULARY.map(baseWord), ...customWords.map(baseWord)];
}

function wordKeyFromText(text, unit) {
  const lower = text.toLowerCase();
  return words.find((word) => {
    const candidates = word.word.toLowerCase().split("/").map((part) => part.trim());
    return word.unit === unit && candidates.some((part) => part === lower || part.includes(lower));
  });
}

function updateWordStats(wordId, isCorrect, options = {}) {
  const word = words.find((item) => item.id === wordId);
  if (!word) return;

  const current = stats[wordId] ?? {
    correct: word.correct ?? 0,
    total: word.total ?? 0,
    proficiency: word.proficiency ?? 0
  };

  current.total += 1;
  if (isCorrect) {
    current.correct += 1;
    current.proficiency = Math.min(5, current.proficiency + 1);
  } else {
    current.proficiency = Math.max(0, current.proficiency - 1);
  }

  stats[wordId] = current;
  words = buildWords();
  saveState();
  if (options.render !== false) {
    renderAll();
  }
}

function setProficiency(wordId, offset) {
  const word = words.find((item) => item.id === wordId);
  if (!word) return;
  const current = stats[wordId] ?? {
    correct: word.correct ?? 0,
    total: word.total ?? 0,
    proficiency: word.proficiency ?? 0
  };
  current.proficiency = Math.max(0, Math.min(5, current.proficiency + offset));
  stats[wordId] = current;
  words = buildWords();
  saveState();
  renderAll();
}

function getUnits() {
  const units = [...new Set(words.map((word) => word.unit).filter(Boolean))].sort((a, b) => a - b);
  return units;
}

function fillUnitSelect(select, label = "全部單元") {
  const current = select.value || "all";
  select.innerHTML = `<option value="all">${label}</option>${getUnits()
    .map((unit) => `<option value="${unit}">Unit ${unit}</option>`)
    .join("")}<option value="custom">自訂單字</option>`;
  select.value = [...select.options].some((option) => option.value === current) ? current : "all";
}

function filteredByUnit(list, unitValue) {
  if (unitValue === "all") return list;
  if (unitValue === "custom") return list.filter((word) => !word.unit);
  return list.filter((word) => String(word.unit) === unitValue);
}

function renderDashboard() {
  const total = words.length;
  const attempts = words.reduce((sum, word) => sum + (word.total || 0), 0);
  const correct = words.reduce((sum, word) => sum + (word.correct || 0), 0);
  const mastered = words.filter((word) => (word.proficiency || 0) >= 5).length;
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;

  $("#totalWords").textContent = total;
  $("#masteredWords").textContent = mastered;
  $("#totalAttempts").textContent = attempts;
  $("#accuracyRate").textContent = `${accuracy}%`;

  const levels = [
    ["Lv.0 新單字", words.filter((word) => word.proficiency === 0).length, "#9aa5b1"],
    ["Lv.1-2 初學", words.filter((word) => word.proficiency >= 1 && word.proficiency <= 2).length, "#b7791f"],
    ["Lv.3-4 熟悉", words.filter((word) => word.proficiency >= 3 && word.proficiency <= 4).length, "#235f9c"],
    ["Lv.5 已熟練", mastered, "#127a5a"]
  ];

  $("#levelBars").innerHTML = levels
    .map(([label, count, color]) => {
      const pct = total ? Math.round((count / total) * 100) : 0;
      return `<div class="level-row"><header><span>${label}</span><span>${count} / ${total}</span></header><div class="level-track"><span style="width:${pct}%;background:${color}"></span></div></div>`;
    })
    .join("");

  const reviewWords = [...words]
    .sort((a, b) => (a.proficiency || 0) - (b.proficiency || 0) || (a.total || 0) - (b.total || 0))
    .slice(0, 6);
  $("#reviewList").innerHTML = reviewWords
    .map((word) => `<div class="review-pill"><strong>${word.word}</strong><span>Lv.${word.proficiency || 0} · ${accuracyFor(word)}%</span></div>`)
    .join("");
}

function accuracyFor(word) {
  return word.total ? Math.round((word.correct / word.total) * 100) : 0;
}

function initFlashcards() {
  const unit = $("#flashUnit").value || "all";
  const level = $("#flashLevel").value || "all";
  flashList = filteredByUnit(words, unit);
  if (level === "new") flashList = flashList.filter((word) => word.proficiency === 0);
  if (level === "learning") flashList = flashList.filter((word) => word.proficiency >= 1 && word.proficiency <= 4);
  if (level === "mastered") flashList = flashList.filter((word) => word.proficiency >= 5);
  if (!flashList.length) flashList = filteredByUnit(words, unit);
  flashList = shuffle(flashList);
  flashIndex = 0;
  renderFlashcard();
}

function renderFlashcard() {
  const card = $("#flashcard");
  card.style.transform = "";
  card.classList.remove("is-flipped");
  if (!flashList.length) {
    $("#flashWord").textContent = "沒有單字";
    return;
  }
  const word = flashList[flashIndex];
  $("#flashProgress").textContent = `${flashIndex + 1} / ${flashList.length}`;
  $("#flashBadge").textContent = `${word.unit ? `Unit ${word.unit}` : "自訂"} · Lv.${word.proficiency || 0}`;
  $("#flashWord").textContent = word.word;
  $("#flashPhonetic").textContent = word.phonetic || "";
  $("#flashPos").textContent = word.pos || "";
  $("#flashLevelBadge").textContent = `Lv.${word.proficiency || 0}`;
  $("#flashTranslation").textContent = word.translation || "";
  $("#flashCollocation").textContent = word.collocation || "尚未設定搭配詞";
  $("#flashExample").textContent = word.example || "尚未設定例句";
  $("#flashExampleTr").textContent = word.exampleTr || "";
}

function moveFlashcard(offset) {
  if (!flashList.length) return;
  flashIndex = (flashIndex + offset + flashList.length) % flashList.length;
  renderFlashcard();
}

function recordFlashcard(isCorrect) {
  if (!flashList.length) return;
  const currentIndex = flashIndex;
  const currentWordId = flashList[currentIndex].id;

  updateWordStats(currentWordId, isCorrect, { render: false });
  flashList[currentIndex] = words.find((word) => word.id === currentWordId) || flashList[currentIndex];
  renderDashboard();
  renderLibrary();
  moveFlashcard(1);
  toast(isCorrect ? "已記錄答對，熟練度 +1" : "已記錄還不熟，熟練度 -1");
}

function beginFlashDrag(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  flashDrag = {
    id: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false
  };
  $("#flashcard").setPointerCapture?.(event.pointerId);
}

function moveFlashDrag(event) {
  if (!flashDrag || flashDrag.id !== event.pointerId) return;
  const dx = event.clientX - flashDrag.startX;
  const dy = event.clientY - flashDrag.startY;
  if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
  flashDrag.moved = true;
  if (Math.abs(dx) > Math.abs(dy)) event.preventDefault();

  const card = $("#flashcard");
  const rotate = Math.max(-10, Math.min(10, dx / 18));
  card.classList.add("is-dragging");
  card.dataset.swipe = dx > 24 ? "known" : dx < -24 ? "unknown" : "";
  card.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
}

function endFlashDrag(event) {
  if (!flashDrag || flashDrag.id !== event.pointerId) return;
  const dx = event.clientX - flashDrag.startX;
  const moved = flashDrag.moved;
  flashDrag = null;

  const card = $("#flashcard");
  card.classList.remove("is-dragging");
  card.dataset.swipe = "";
  card.style.transform = "";

  if (Math.abs(dx) >= 90) {
    recordFlashcard(dx > 0);
    return;
  }

  if (!moved) {
    card.classList.toggle("is-flipped");
  }
}

function generatedQuestions() {
  return words
    .filter((word) => word.example && word.word && !word.word.includes("/"))
    .map((word) => {
      const escaped = word.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const prompt = word.example.replace(new RegExp(`\\b${escaped}\\b`, "gi"), "____");
      const type = prompt.includes("____") ? "fill" : "mcq";
      const options = buildOptions(word);
      const choices = buildFillChoices(word, options);
      return {
        id: `auto-${word.id}`,
        unit: word.unit,
        type,
        difficulty: "auto",
        targetWord: word.word,
        prompt: type === "fill" ? prompt : `${word.example}\n\n這句話中的 ${word.translation} 對應哪個英文單字？`,
        options,
        choices,
        answer: word.word,
        explanation: `${word.word} 是「${word.translation}」。例句：${word.example}${word.exampleTr ? `（${word.exampleTr}）` : ""}`
      };
    });
}

function buildFillChoices(answerWord, options) {
  const answer = answerWord.word;
  const distractors = options.filter((option) => normalize(option) !== normalize(answer));
  return shuffle([answer, ...distractors.slice(0, 1)]);
}

function buildOptions(answerWord) {
  const pool = words
    .filter((word) => word.id !== answerWord.id && word.unit === answerWord.unit)
    .map((word) => word.word)
    .filter((word) => !word.includes("/"));
  return shuffle([answerWord.word, ...shuffle(pool).slice(0, 3)]);
}

function questionPool() {
  const unit = $("#practiceUnit").value || "all";
  const mode = $("#practiceMode").value || "mixed";
  let pool = [...QUESTION_BANK, ...generatedQuestions()];
  if (unit !== "all") pool = pool.filter((question) => String(question.unit) === unit || (unit === "custom" && !question.unit));
  if (mode !== "mixed") pool = pool.filter((question) => question.type === mode);
  return pool;
}

function nextQuestion() {
  const pool = questionPool();
  currentQuestion = pool.length ? shuffle(pool)[0] : null;
  renderQuestion();
}

function renderQuestion() {
  const card = $("#questionCard");
  if (!currentQuestion) {
    card.innerHTML = "<h3>目前沒有符合條件的題目</h3><p>可以新增單字或切換單元後再試一次。</p>";
    return;
  }

  const label = `${currentQuestion.unit ? `Unit ${currentQuestion.unit}` : "自訂"} · ${currentQuestion.type === "fill" ? "填空題" : "選擇題"}`;
  const choiceText = currentQuestion.choices?.length ? `<p>小提示：${formatChoices(currentQuestion)}</p>` : "";

  if (currentQuestion.type === "fill") {
    card.innerHTML = `
      <h3>${label}</h3>
      ${choiceText}
      <div class="question-prompt">${currentQuestion.prompt}</div>
      <div class="answer-row">
        <input id="fillAnswer" type="text" placeholder="輸入答案" autocomplete="off" />
        <button class="primary-button" id="checkFill" type="button"><i data-lucide="check"></i><span>檢查</span></button>
      </div>
      <div id="questionResult"></div>
    `;
    $("#checkFill").addEventListener("click", checkFillAnswer);
    $("#fillAnswer").addEventListener("keydown", (event) => {
      if (event.key === "Enter") checkFillAnswer();
    });
  } else {
    card.innerHTML = `
      <h3>${label}</h3>
      <div class="question-prompt">${currentQuestion.prompt}</div>
      <div class="choice-list">
        ${currentQuestion.options.map((option) => `<button type="button" data-option="${escapeAttr(option)}">${option}</button>`).join("")}
      </div>
      <div id="questionResult"></div>
    `;
    $$(".choice-list button").forEach((button) => {
      button.addEventListener("click", () => checkQuestion(button.dataset.option));
    });
  }
  if (window.lucide) window.lucide.createIcons();
}

function checkFillAnswer() {
  checkQuestion($("#fillAnswer").value.trim());
}

function formatChoices(question) {
  const choices = ensureAnswerInChoices(question).map((choice) => escapeHtml(choice));
  const note = answerUsesChangedForm(question) ? "（正確答案可能需要變化字形）" : "";
  return `${choices.join(" / ")}${note}`;
}

function ensureAnswerInChoices(question) {
  const choices = Array.isArray(question.choices) ? [...question.choices] : [];
  const answer = String(question.answer || "").trim();
  const target = String(question.targetWord || "").trim();
  const hasAnswer = choices.some((choice) => normalize(choice) === normalize(answer));
  const hasTarget = target && choices.some((choice) => normalize(choice) === normalize(target));

  if (!hasAnswer && !hasTarget) {
    choices.unshift(answer);
  }

  return [...new Set(choices.filter(Boolean))];
}

function answerUsesChangedForm(question) {
  if (!question.targetWord || !question.answer) return false;
  return normalize(question.targetWord) !== normalize(question.answer);
}

function checkQuestion(answer) {
  if (!currentQuestion) return;
  const isCorrect = normalize(answer) === normalize(currentQuestion.answer);
  const target = wordKeyFromText(currentQuestion.targetWord || currentQuestion.answer, currentQuestion.unit);
  if (target) updateWordStats(target.id, isCorrect);

  const result = $("#questionResult");
  result.className = `result-box${isCorrect ? "" : " is-wrong"}`;
  result.innerHTML = `<strong>${isCorrect ? "答對了" : `答錯了，正解是 ${currentQuestion.answer}`}</strong><p>${currentQuestion.explanation}</p>`;
  toast(isCorrect ? "已記錄答對" : "已記錄答錯");
}

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function escapeAttr(value) {
  return String(value).replaceAll('"', "&quot;");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderLibrary() {
  const unit = $("#libraryUnit").value || "all";
  const query = $("#searchWord").value.trim().toLowerCase();
  let list = filteredByUnit(words, unit);
  if (query) {
    list = list.filter((word) => `${word.word} ${word.translation} ${word.exampleTr || ""}`.toLowerCase().includes(query));
  }

  $("#wordGrid").innerHTML = list
    .sort((a, b) => a.word.localeCompare(b.word))
    .map((word) => `
      <article class="word-card">
        <h3>${word.word}</h3>
        <div class="tag-row">
          <span class="tag">${word.pos || "詞性未填"}</span>
          <span class="tag">${word.unit ? `Unit ${word.unit}` : "自訂"}</span>
          <span class="tag">Lv.${word.proficiency || 0}</span>
        </div>
        <p class="translation">${word.translation}</p>
        <p>${word.phonetic || ""}</p>
        ${word.collocation ? `<p><strong>搭配：</strong>${word.collocation}</p>` : ""}
        ${word.example ? `<div class="example">${word.example}<br />${word.exampleTr || ""}</div>` : ""}
        <footer class="word-footer">
          <span>答對率 ${accuracyFor(word)}% (${word.correct || 0}/${word.total || 0})</span>
          <div class="mini-actions">
            <button type="button" data-level="${word.id}" data-offset="-1" title="降低熟練度">-</button>
            <button type="button" data-level="${word.id}" data-offset="1" title="提高熟練度">+</button>
            ${word.unit ? "" : `<button type="button" data-delete="${word.id}" title="刪除自訂單字">刪</button>`}
          </div>
        </footer>
      </article>
    `)
    .join("");

  $$("[data-level]").forEach((button) => {
    button.addEventListener("click", () => setProficiency(Number(button.dataset.level), Number(button.dataset.offset)));
  });
  $$("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteCustomWord(Number(button.dataset.delete)));
  });
}

function addCustomWord(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const word = {
    id: Date.now(),
    unit: null,
    word: data.get("word").trim(),
    translation: data.get("translation").trim(),
    pos: data.get("pos").trim(),
    phonetic: data.get("phonetic").trim(),
    collocation: data.get("collocation").trim(),
    example: data.get("example").trim(),
    exampleTr: data.get("exampleTr").trim(),
    correct: 0,
    total: 0,
    proficiency: 0
  };
  customWords.push(word);
  saveState();
  words = buildWords();
  event.currentTarget.reset();
  setupUnitSelects();
  renderAll();
  toast(`已新增 ${word.word}`);
}

function deleteCustomWord(wordId) {
  const word = customWords.find((item) => item.id === wordId);
  if (!word) return;
  customWords = customWords.filter((item) => item.id !== wordId);
  delete stats[wordId];
  saveState();
  words = buildWords();
  setupUnitSelects();
  renderAll();
  toast(`已刪除 ${word.word}`);
}

function exportData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    customWords,
    stats
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vocabmaster-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const payload = JSON.parse(await file.text());
  customWords = Array.isArray(payload.customWords) ? payload.customWords : customWords;
  stats = payload.stats && typeof payload.stats === "object" ? payload.stats : stats;
  saveState();
  words = buildWords();
  setupUnitSelects();
  renderAll();
  toast("匯入完成");
}

function setupTabs() {
  $$(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".tab").forEach((tab) => tab.classList.remove("is-active"));
      $$(".panel").forEach((panel) => panel.classList.remove("is-active"));
      button.classList.add("is-active");
      $(`#${button.dataset.tab}`).classList.add("is-active");
      if (button.dataset.tab === "flashcards") initFlashcards();
      if (button.dataset.tab === "practice" && !currentQuestion) nextQuestion();
    });
  });
}

function setupUnitSelects() {
  fillUnitSelect($("#flashUnit"));
  fillUnitSelect($("#practiceUnit"));
  fillUnitSelect($("#libraryUnit"));
}

function renderAll() {
  renderDashboard();
  renderLibrary();
  if ($("#flashcards").classList.contains("is-active")) initFlashcards();
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

let toastTimer;
function toast(message) {
  const box = $("#toast");
  box.textContent = message;
  box.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove("is-visible"), 2200);
}

function boot() {
  document.documentElement.dataset.appVersion = APP_VERSION;
  setupTabs();
  setupUnitSelects();
  renderAll();
  nextQuestion();

  $("#flashUnit").addEventListener("change", initFlashcards);
  $("#flashLevel").addEventListener("change", initFlashcards);
  $("#flashcard").addEventListener("pointerdown", beginFlashDrag);
  $("#flashcard").addEventListener("pointermove", moveFlashDrag);
  $("#flashcard").addEventListener("pointerup", endFlashDrag);
  $("#flashcard").addEventListener("pointercancel", () => {
    flashDrag = null;
    $("#flashcard").classList.remove("is-dragging");
    $("#flashcard").dataset.swipe = "";
    $("#flashcard").style.transform = "";
  });
  $("#prevCard").addEventListener("click", () => moveFlashcard(-1));
  $("#nextCard").addEventListener("click", () => moveFlashcard(1));
  $("#knownBtn").addEventListener("click", () => recordFlashcard(true));
  $("#unknownBtn").addEventListener("click", () => recordFlashcard(false));
  $("#practiceUnit").addEventListener("change", nextQuestion);
  $("#practiceMode").addEventListener("change", nextQuestion);
  $("#newQuestion").addEventListener("click", nextQuestion);
  $("#searchWord").addEventListener("input", renderLibrary);
  $("#libraryUnit").addEventListener("change", renderLibrary);
  $("#addWordForm").addEventListener("submit", addCustomWord);
  $("#exportBtn").addEventListener("click", exportData);
  $("#importInput").addEventListener("change", importData);

  if (window.lucide) window.lucide.createIcons();
  window.addEventListener("load", () => window.lucide?.createIcons());
}

boot();
