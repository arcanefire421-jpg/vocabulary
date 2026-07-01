import { BASE_VOCABULARY } from "../data/vocabulary.js?v=20260702-jr1200u1";
import { JUNIOR_1200_VOCABULARY } from "../data/junior1200.js?v=20260702-jr1200u1";
import { QUESTION_BANK } from "../data/questions.js?v=20260702-jr1200u1";

const APP_VERSION = "20260702-jr1200u1";

const STORAGE_KEY = "vocabmaster-state-v1";
const CUSTOM_KEY = "vocabmaster-custom-v1";
const DEFAULT_SERIES = "東山英文單字表";
const JUNIOR_SERIES = "教育部 1200 基本字彙";
const CUSTOM_SERIES = "自訂單字";
const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const REVIEW_INTERVALS = [0, 1 * 60 * 60 * 1000, 1 * DAY_MS, 3 * DAY_MS, 7 * DAY_MS, 14 * DAY_MS];
const ENCOURAGEMENTS = ["我會了", "我好棒", "我真棒", "我真聰明", "我真厲害", "超厲害", "100分", "真讚"];

let stats = loadJson(STORAGE_KEY, {});
let customWords = loadJson(CUSTOM_KEY, []);
let words = buildWords();
let flashList = [];
let flashIndex = 0;
let currentQuestion = null;
let flashDrag = null;
let autoPlayEnabled = false;
let autoPlayRunId = 0;
let autoPlayTimer = null;
let autoPlayEndsAt = 0;
let wakeLock = null;
let wakeLockReleaseTimer = null;
let dimModeEnabled = false;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function randomEncouragement() {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

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
    series: word.series || (word.unit ? DEFAULT_SERIES : CUSTOM_SERIES),
    correct: wordStats.correct ?? word.correct ?? 0,
    total: wordStats.total ?? word.total ?? 0,
    proficiency: wordStats.proficiency ?? word.proficiency ?? 0,
    lastReviewed: wordStats.lastReviewed ?? word.lastReviewed ?? 0,
    nextReview: wordStats.nextReview ?? word.nextReview ?? 0,
    lastResult: wordStats.lastResult ?? word.lastResult ?? null
  };
}

function buildWords() {
  const base = BASE_VOCABULARY.map((word) => baseWord({ ...word, series: word.series || DEFAULT_SERIES }));
  const junior = JUNIOR_1200_VOCABULARY.map((word) => baseWord({ ...word, series: word.series || JUNIOR_SERIES }));
  const custom = customWords.map((word) => baseWord({ ...word, series: word.series || CUSTOM_SERIES }));
  return [...base, ...junior, ...custom];
}

function phraseInfo(word) {
  const source = word.phrase || word.collocation || "";
  const match = source.match(/^(.+?)\s*[（(]([^）)]+)[）)]\s*$/);
  return {
    phrase: (word.phrase || (match ? match[1] : source)).trim(),
    phraseTr: (word.phraseTr || word.phraseTranslation || (match ? match[2] : "")).trim(),
    phraseExample: (word.phraseExample || "").trim(),
    phraseExampleTr: (word.phraseExampleTr || "").trim()
  };
}

function wordKeyFromText(text, unit, series = "all") {
  const lower = text.toLowerCase();
  return words.find((word) => {
    const candidates = word.word.toLowerCase().split("/").map((part) => part.trim());
    const sameSeries = series === "all" || (word.series || DEFAULT_SERIES) === series;
    return sameSeries && word.unit === unit && candidates.some((part) => part === lower || part.includes(lower));
  });
}

function updateWordStats(wordId, isCorrect, options = {}) {
  const word = words.find((item) => item.id === wordId);
  if (!word) return null;

  const current = stats[wordId] ?? {
    correct: word.correct ?? 0,
    total: word.total ?? 0,
    proficiency: word.proficiency ?? 0,
    lastReviewed: word.lastReviewed ?? 0,
    nextReview: word.nextReview ?? 0,
    lastResult: word.lastResult ?? null
  };
  const previousProficiency = current.proficiency ?? 0;
  const now = Date.now();

  current.total += 1;
  if (isCorrect) {
    current.correct += 1;
    current.proficiency = Math.min(5, current.proficiency + 1);
  } else {
    current.proficiency = Math.max(0, current.proficiency - 1);
  }
  current.lastReviewed = now;
  current.lastResult = isCorrect ? "correct" : "wrong";
  current.nextReview = isCorrect ? now + REVIEW_INTERVALS[current.proficiency] : now;

  stats[wordId] = current;
  words = buildWords();
  saveState();
  if (options.render !== false) {
    renderAll();
  }
  return {
    word: words.find((item) => item.id === wordId),
    previousProficiency,
    nextProficiency: current.proficiency
  };
}

function setProficiency(wordId, offset) {
  const word = words.find((item) => item.id === wordId);
  if (!word) return;
  const current = stats[wordId] ?? {
    correct: word.correct ?? 0,
    total: word.total ?? 0,
    proficiency: word.proficiency ?? 0,
    lastReviewed: word.lastReviewed ?? 0,
    nextReview: word.nextReview ?? 0,
    lastResult: word.lastResult ?? null
  };
  const previous = current.proficiency ?? 0;
  current.proficiency = Math.max(0, Math.min(5, current.proficiency + offset));
  stats[wordId] = current;
  words = buildWords();
  saveState();
  renderAll();
  toast(`${word.word} 熟練度：Lv.${previous} → Lv.${current.proficiency}`);
}

function getSeries() {
  const preferred = [DEFAULT_SERIES, JUNIOR_SERIES, CUSTOM_SERIES];
  const available = new Set(words.map((word) => word.series || DEFAULT_SERIES));
  return preferred.filter((series) => available.has(series));
}

function fillSeriesSelect(select) {
  const current = select.value || "all";
  select.innerHTML = `<option value="all">全部系列</option>${getSeries()
    .map((series) => `<option value="${escapeAttr(series)}">${escapeHtml(series)}</option>`)
    .join("")}`;
  select.value = [...select.options].some((option) => option.value === current) ? current : "all";
}

function getUnits(seriesValue = "all") {
  const source = filteredBySeries(words, seriesValue);
  const units = [...new Set(source.map((word) => word.unit).filter(Boolean))].sort((a, b) => a - b);
  return units;
}

function fillUnitSelect(select, label = "全部單元", seriesValue = "all") {
  const current = select.value || "all";
  const hasCustom = filteredBySeries(words, seriesValue).some((word) => !word.unit);
  select.innerHTML = `<option value="all">${label}</option>${getUnits(seriesValue)
    .map((unit) => `<option value="${unit}">Unit ${unit}</option>`)
    .join("")}${hasCustom ? `<option value="custom">自訂單字</option>` : ""}`;
  select.value = [...select.options].some((option) => option.value === current) ? current : "all";
}

function filteredBySeries(list, seriesValue) {
  if (seriesValue === "all") return list;
  return list.filter((word) => (word.series || DEFAULT_SERIES) === seriesValue);
}

function filteredByUnit(list, unitValue) {
  if (unitValue === "all") return list;
  if (unitValue === "custom") return list.filter((word) => !word.unit);
  return list.filter((word) => String(word.unit) === unitValue);
}

function filteredBySeriesAndUnit(list, seriesValue, unitValue) {
  return filteredByUnit(filteredBySeries(list, seriesValue), unitValue);
}

function reviewInfo(word, now = Date.now()) {
  const total = word.total || 0;
  const proficiency = word.proficiency || 0;
  const wrongRate = total ? 1 - (word.correct || 0) / total : 0.45;
  const due = !word.nextReview || word.nextReview <= now;
  const daysSinceReview = word.lastReviewed ? Math.max(0, (now - word.lastReviewed) / DAY_MS) : 30;
  const overdueDays = word.nextReview && word.nextReview < now ? Math.min(14, (now - word.nextReview) / DAY_MS) : 0;

  const score =
    (due ? 45 : 0) +
    (5 - proficiency) * 12 +
    wrongRate * 35 +
    Math.min(18, daysSinceReview * 2) +
    overdueDays * 3 +
    (word.lastResult === "wrong" ? 24 : 0) +
    (total === 0 ? 12 : 0);

  let reason = "新單字";
  if (word.lastResult === "wrong") reason = "剛答錯";
  else if (total && wrongRate >= 0.5) reason = "錯誤率高";
  else if (due && word.nextReview) reason = "到期複習";
  else if (proficiency <= 1) reason = "熟練度低";
  else if (daysSinceReview >= 7) reason = "久未練習";

  return {
    score,
    reason,
    meta: `Lv.${proficiency} · ${accuracyFor(word)}% · ${reason}`
  };
}

function reviewStatusText(word) {
  if (!word.lastReviewed) return "尚未練習";
  if (!word.nextReview || word.nextReview <= Date.now()) return "現在可複習";
  const hours = Math.ceil((word.nextReview - Date.now()) / (60 * 60 * 1000));
  if (hours < 24) return `${hours} 小時後複習`;
  return `${Math.ceil(hours / 24)} 天後複習`;
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

  const now = Date.now();
  const reviewWords = [...words]
    .map((word) => ({ word, review: reviewInfo(word, now) }))
    .sort((a, b) => b.review.score - a.review.score || (a.word.total || 0) - (b.word.total || 0))
    .slice(0, 6);
  $("#reviewList").innerHTML = reviewWords
    .map(
      ({ word, review }) => `
        <button class="review-pill" type="button" data-review-word="${word.id}">
          <strong>${escapeHtml(word.word)}</strong>
          <span>${review.meta}</span>
        </button>
      `
    )
    .join("");
  $$("[data-review-word]").forEach((button) => {
    button.addEventListener("click", () => openFlashcardForWord(Number(button.dataset.reviewWord)));
  });
}

function accuracyFor(word) {
  return word.total ? Math.round((word.correct / word.total) * 100) : 0;
}

function initFlashcards() {
  const series = $("#flashSeries").value || "all";
  const unit = $("#flashUnit").value || "all";
  const level = $("#flashLevel").value || "all";
  flashList = filteredBySeriesAndUnit(words, series, unit);
  if (level === "new") flashList = flashList.filter((word) => word.proficiency === 0);
  if (level === "learning") flashList = flashList.filter((word) => word.proficiency >= 1 && word.proficiency <= 4);
  if (level === "mastered") flashList = flashList.filter((word) => word.proficiency >= 5);
  if (!flashList.length) flashList = filteredBySeriesAndUnit(words, series, unit);
  flashList = shuffle(flashList);
  flashIndex = 0;
  renderFlashcard();
}

function activateTab(tabName, options = {}) {
  if (tabName !== "flashcards") stopAutoPlay();
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === tabName));
  $$(".panel").forEach((panel) => panel.classList.toggle("is-active", panel.id === tabName));
  if (tabName === "flashcards" && options.initFlashcards !== false) initFlashcards();
  if (tabName === "practice" && !currentQuestion) nextQuestion();
}

function openFlashcardForWord(id) {
  const word = words.find((item) => item.id === id);
  if (!word) return;
  stopAutoPlay();

  $("#flashSeries").value = word.series || DEFAULT_SERIES;
  fillUnitSelect($("#flashUnit"), "全部單元", $("#flashSeries").value || "all");
  $("#flashUnit").value = word.unit ? String(word.unit) : "custom";
  $("#flashLevel").value = "all";
  flashList = shuffle(filteredBySeriesAndUnit(words, $("#flashSeries").value || "all", $("#flashUnit").value || "all"));
  flashIndex = Math.max(0, flashList.findIndex((item) => item.id === id));
  activateTab("flashcards", { initFlashcards: false });
  renderFlashcard();
  toast(`已開啟 ${word.word} 的閃卡`);
}

function renderFlashcard() {
  if (!autoPlayEnabled) stopSpeech();
  const card = $("#flashcard");
  card.style.transform = "";
  card.classList.remove("is-flipped");
  if (!flashList.length) {
    $("#flashWord").textContent = "沒有單字";
    return;
  }
  const word = flashList[flashIndex];
  $("#flashProgress").textContent = `${flashIndex + 1} / ${flashList.length}`;
  $("#flashBadge").textContent = `${word.series || DEFAULT_SERIES} · ${word.unit ? `Unit ${word.unit}` : "自訂"} · Lv.${word.proficiency || 0}`;
  $("#flashWord").textContent = word.word;
  $("#flashPhonetic").textContent = word.phonetic || "";
  $("#flashPos").textContent = word.pos || "";
  $("#flashLevelBadge").textContent = `Lv.${word.proficiency || 0}`;
  $("#flashTranslation").textContent = word.translation || "";
  $("#flashExampleLabel").hidden = !word.example;
  $("#flashExampleBlock").hidden = !word.example;
  const phrase = phraseInfo(word);
  $("#flashPhrasePanel").hidden = !phrase.phrase;
  $("#flashPhrase").textContent = phrase.phrase;
  $("#flashPhraseTr").textContent = phrase.phraseTr ? `（${phrase.phraseTr}）` : "";
  $("#flashPhraseExampleBlock").hidden = !phrase.phraseExample;
  $("#flashPhraseExampleLabel").hidden = !phrase.phraseExample;
  $("#flashPhraseExample").textContent = phrase.phraseExample;
  $("#flashPhraseExampleTr").textContent = phrase.phraseExampleTr;
  $("#flashExample").textContent = word.example || "尚未設定例句";
  $("#flashExampleTr").textContent = word.exampleTr || "";
}

function speechTextFor(text) {
  return (text || "")
    .replace(/\s*\/\s*/g, ", ")
    .replace(/\([^)]*\)/g, "")
    .replace(/_{2,}/g, "")
    .trim();
}

function stopSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function canSpeak() {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    toast("這個瀏覽器不支援發音");
    return false;
  }
  return true;
}

function speakText(rawText, label, message) {
  if (!canSpeak()) return false;
  const text = speechTextFor(rawText);
  if (!text) return false;

  stopSpeech();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
  toast(message || `播放發音：${label || text}`);
  return true;
}

function speakTextAsync(rawText, lang = "en-US") {
  if (!canSpeak()) return Promise.resolve(false);
  const text = speechTextFor(rawText);
  if (!text) return Promise.resolve(false);

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = lang.startsWith("zh") ? 0.95 : 0.85;
    utterance.pitch = 1;
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    window.speechSynthesis.speak(utterance);
  });
}

function waitAutoPlay(ms, runId) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(autoPlayEnabled && runId === autoPlayRunId), ms);
  });
}

function updateAutoPlayButton() {
  const button = $("#autoPlayBtn");
  if (!button) return;
  button.classList.toggle("is-active", autoPlayEnabled);
  button.setAttribute("aria-pressed", String(autoPlayEnabled));
  button.querySelector("span").textContent = autoPlayEnabled ? "停止播放" : "自動播放";
  button.querySelector("i")?.setAttribute("data-lucide", autoPlayEnabled ? "pause-circle" : "play-circle");
  $("#autoPlayDuration").disabled = autoPlayEnabled;
  if (window.lucide) window.lucide.createIcons();
}

function updateDimButton() {
  const button = $("#dimScreenBtn");
  if (!button) return;
  document.body.classList.toggle("is-dimmed", dimModeEnabled);
  button.classList.toggle("is-active", dimModeEnabled);
  button.setAttribute("aria-pressed", String(dimModeEnabled));
  button.querySelector("span").textContent = dimModeEnabled ? "關閉暗屏" : "暗屏";
  button.querySelector("i")?.setAttribute("data-lucide", dimModeEnabled ? "sun" : "moon");
  if (window.lucide) window.lucide.createIcons();
}

function toggleDimMode() {
  dimModeEnabled = !dimModeEnabled;
  updateDimButton();
  toast(dimModeEnabled ? "已開啟暗屏" : "已關閉暗屏");
}

function stopAutoPlay(message, options = {}) {
  if (!autoPlayEnabled && !message) return;
  const shouldReleaseWakeLock = options.releaseWakeLock ?? true;
  autoPlayEnabled = false;
  autoPlayRunId += 1;
  if (autoPlayTimer) window.clearTimeout(autoPlayTimer);
  autoPlayTimer = null;
  autoPlayEndsAt = 0;
  if (wakeLockReleaseTimer) window.clearTimeout(wakeLockReleaseTimer);
  wakeLockReleaseTimer = null;
  if (shouldReleaseWakeLock) {
    releaseWakeLock();
  } else {
    wakeLockReleaseTimer = window.setTimeout(() => releaseWakeLock(), 10 * 60 * 1000);
  }
  stopSpeech();
  updateAutoPlayButton();
  if (message) toast(message);
}

function startAutoPlayTimer() {
  const minutes = Number($("#autoPlayDuration").value || 0);
  if (!minutes) return;
  const durationMs = minutes * MINUTE_MS;
  autoPlayEndsAt = Date.now() + durationMs;

  if ($("#sleepAfterAutoplay")?.checked !== false) {
    const earlyReleaseMs = Math.max(0, durationMs - 3 * MINUTE_MS);
    wakeLockReleaseTimer = window.setTimeout(() => {
      releaseWakeLock();
      toast("播放即將結束，已允許螢幕休眠");
    }, earlyReleaseMs);
  }

  autoPlayTimer = window.setTimeout(() => {
    stopAutoPlay("自動播放時間到，已停止");
  }, durationMs);
}

async function requestWakeLock() {
  if (!("wakeLock" in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      wakeLock = null;
    });
  } catch {
    wakeLock = null;
  }
}

async function releaseWakeLock() {
  if (!wakeLock) return;
  try {
    await wakeLock.release();
  } catch {
    // Some browsers release wake locks automatically when the tab is hidden.
  }
  wakeLock = null;
}

function autoplayParts() {
  return Object.fromEntries(
    $$("[data-autoplay-part]").map((input) => [input.dataset.autoplayPart, input.checked])
  );
}

function hasAutoplayParts() {
  return Object.values(autoplayParts()).some(Boolean);
}

function showFlashcardBack() {
  $("#flashcard").classList.add("is-flipped");
}

async function autoPlayLoop(runId) {
  while (autoPlayEnabled && runId === autoPlayRunId && flashList.length) {
    const word = flashList[flashIndex];
    const parts = autoplayParts();
    $("#flashcard").classList.remove("is-flipped");
    toast(`自動播放：${word.word}`);

    if (parts.word && speechTextFor(word.word)) {
      await speakTextAsync(word.word, "en-US");
      if (!(await waitAutoPlay(1000, runId))) return;
    }
    if (parts.translation && speechTextFor(word.translation)) {
      showFlashcardBack();
      await speakTextAsync(word.translation, "zh-TW");
      if (!(await waitAutoPlay(1000, runId))) return;
    }
    const phrase = phraseInfo(word);
    if (parts.example || parts.exampleTr || parts.phrase || parts.phraseTr || parts.phraseExample || parts.phraseExampleTr) showFlashcardBack();
    if (parts.example && speechTextFor(word.example)) {
      await speakTextAsync(word.example, "en-US");
      if (!(await waitAutoPlay(1000, runId))) return;
    }
    if (parts.exampleTr && speechTextFor(word.exampleTr)) {
      await speakTextAsync(word.exampleTr, "zh-TW");
      if (!(await waitAutoPlay(1000, runId))) return;
    }
    if (parts.phrase && speechTextFor(phrase.phrase)) {
      await speakTextAsync(phrase.phrase, "en-US");
      if (!(await waitAutoPlay(1000, runId))) return;
    }
    if (parts.phraseTr && speechTextFor(phrase.phraseTr)) {
      await speakTextAsync(phrase.phraseTr, "zh-TW");
      if (!(await waitAutoPlay(1000, runId))) return;
    }
    if (parts.phraseExample && speechTextFor(phrase.phraseExample)) {
      await speakTextAsync(phrase.phraseExample, "en-US");
      if (!(await waitAutoPlay(1000, runId))) return;
    }
    if (parts.phraseExampleTr && speechTextFor(phrase.phraseExampleTr)) {
      await speakTextAsync(phrase.phraseExampleTr, "zh-TW");
      if (!(await waitAutoPlay(1000, runId))) return;
    }

    if (!autoPlayEnabled || runId !== autoPlayRunId) return;
    flashIndex = (flashIndex + 1) % flashList.length;
    renderFlashcard();
    if (!(await waitAutoPlay(1000, runId))) return;
  }
}

function toggleAutoPlay() {
  if (autoPlayEnabled) {
    stopAutoPlay("已停止自動播放");
    return;
  }
  if (!flashList.length) return;
  if (!canSpeak()) return;
  if (!hasAutoplayParts()) {
    toast("請至少選擇一個自動播放內容");
    return;
  }

  autoPlayEnabled = true;
  autoPlayRunId += 1;
  stopSpeech();
  startAutoPlayTimer();
  requestWakeLock();
  updateAutoPlayButton();
  const minutes = Number($("#autoPlayDuration").value || 0);
  toast(minutes ? `自動播放開始，${minutes === 60 ? "1小時" : `${minutes}分鐘`}後停止` : "自動播放開始");
  autoPlayLoop(autoPlayRunId);
}

function speakFlashcard() {
  stopAutoPlay();
  if (!flashList.length) return;
  const word = flashList[flashIndex];
  const isBack = $("#flashcard").classList.contains("is-flipped");
  const rawText = isBack && word.example ? word.example : word.word;
  speakText(rawText, word.word, isBack ? "播放例句發音" : `播放發音：${word.word}`);
}

function speakLibraryWord(id) {
  stopAutoPlay();
  const word = words.find((item) => item.id === id);
  if (!word) return;
  speakText(word.word, word.word);
}

function speakLibraryExample(id) {
  stopAutoPlay();
  const word = words.find((item) => item.id === id);
  if (!word?.example) return;
  speakText(word.example, word.word, `播放例句：${word.word}`);
}

function speakLibraryPhrase(id) {
  stopAutoPlay();
  const word = words.find((item) => item.id === id);
  const phrase = word ? phraseInfo(word) : null;
  if (!phrase?.phrase) return;
  speakText(phrase.phrase, phrase.phrase, `播放片語：${phrase.phrase}`);
}

function speakLibraryPhraseExample(id) {
  stopAutoPlay();
  const word = words.find((item) => item.id === id);
  const phrase = word ? phraseInfo(word) : null;
  if (!phrase?.phraseExample) return;
  speakText(phrase.phraseExample, phrase.phrase || word.word, `播放片語例句：${phrase.phrase || word.word}`);
}

function moveFlashcard(offset) {
  if (!flashList.length) return;
  stopAutoPlay();
  flashIndex = (flashIndex + offset + flashList.length) % flashList.length;
  renderFlashcard();
}

function recordFlashcard(isCorrect) {
  if (!flashList.length) return;
  stopAutoPlay();
  const currentIndex = flashIndex;
  const currentWordId = flashList[currentIndex].id;
  const currentWordLabel = flashList[currentIndex].word;

  const result = updateWordStats(currentWordId, isCorrect, { render: false });
  const updatedWord = result?.word || words.find((word) => word.id === currentWordId) || flashList[currentIndex];
  flashList[currentIndex] = updatedWord;
  renderDashboard();
  renderLibrary();

  const level = $("#flashLevel").value || "all";
  if (
    (level === "new" && updatedWord.proficiency > 0) ||
    (level === "learning" && (updatedWord.proficiency === 0 || updatedWord.proficiency >= 5)) ||
    (level === "mastered" && updatedWord.proficiency < 5)
  ) {
    flashList.splice(currentIndex, 1);
    if (!flashList.length) {
      initFlashcards();
    } else {
      flashIndex = currentIndex % flashList.length;
      renderFlashcard();
    }
  } else {
    moveFlashcard(1);
  }

  const previous = result?.previousProficiency ?? updatedWord.proficiency ?? 0;
  const next = result?.nextProficiency ?? updatedWord.proficiency ?? 0;
  toast(`${currentWordLabel} ${isCorrect ? randomEncouragement() : "還不熟"}：Lv.${previous} → Lv.${next}`);
}

function beginFlashDrag(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  stopAutoPlay();
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
  return words.flatMap((word) => {
    const questions = [];
    const wordOptions = buildOptions(word);
    const translationOptions = buildTranslationOptions(word);
    const examplePrompt = blankExampleFor(word);

    if (examplePrompt) {
      questions.push({
        id: `auto-${word.id}-example-fill`,
        series: word.series || DEFAULT_SERIES,
        unit: word.unit,
        type: "fill",
        difficulty: "auto",
        targetWord: word.word,
        prompt: examplePrompt,
        choices: buildFillChoices(word, wordOptions),
        answer: word.word,
        explanation: `${word.word} 是「${word.translation}」。這題要依照例句語意填入正確英文單字。例句：${word.example}${word.exampleTr ? `（${word.exampleTr}）` : ""}`
      });
    }

    questions.push({
      id: `auto-${word.id}-zh-to-en`,
      series: word.series || DEFAULT_SERIES,
      unit: word.unit,
      type: "mcq",
      difficulty: "auto",
      targetWord: word.word,
      prompt: `「${word.translation}」對應哪個英文單字？`,
      options: wordOptions,
      answer: word.word,
      explanation: `${word.word} 的中文是「${word.translation}」。${word.example ? `例句：${word.example}` : ""}`
    });

    if (translationOptions.length >= 2) {
      questions.push({
        id: `auto-${word.id}-en-to-zh`,
        series: word.series || DEFAULT_SERIES,
        unit: word.unit,
        type: "mcq",
        difficulty: "auto",
        targetWord: word.word,
        prompt: `${word.word} 的中文意思最接近哪一個？`,
        options: translationOptions,
        answer: word.translation,
        explanation: `${word.word} 是「${word.translation}」。${word.exampleTr ? `可搭配例句理解：${word.exampleTr}` : ""}`
      });
    }

    const phrase = phraseInfo(word);
    if (phrase.phrase) {
      const phraseOptions = buildPhraseOptions(word);
      if (phraseOptions.length >= 2) {
        questions.push({
          id: `auto-${word.id}-phrase`,
          series: word.series || DEFAULT_SERIES,
          unit: word.unit,
          type: "mcq",
          difficulty: "auto",
          targetWord: word.word,
          prompt: `${word.word} 的常見片語是哪一個？`,
          options: phraseOptions,
          answer: phrase.phrase,
          explanation: `${phrase.phrase} 是 ${word.word} 的片語${phrase.phraseTr ? `，意思是「${phrase.phraseTr}」` : ""}。${phrase.phraseExample ? `片語例句：${phrase.phraseExample}` : ""}`
        });
      }
    }

    return questions;
  });
}

function blankExampleFor(word) {
  if (!word.example || !word.word || word.word.includes("/")) return "";
  const escaped = word.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prompt = word.example.replace(new RegExp(`\\b${escaped}\\b`, "gi"), "____");
  return prompt.includes("____") ? prompt : "";
}

function buildFillChoices(answerWord, options) {
  const answer = answerWord.word;
  const distractors = options.filter((option) => normalize(option) !== normalize(answer));
  return uniqueOptions(shuffle([answer, ...distractors.slice(0, 1)]));
}

function buildOptions(answerWord) {
  const pool = words
    .filter((word) => word.id !== answerWord.id && word.unit === answerWord.unit && (word.series || DEFAULT_SERIES) === (answerWord.series || DEFAULT_SERIES))
    .map((word) => word.word)
    .filter((word) => !word.includes("/"));
  return uniqueOptions(shuffle([answerWord.word, ...shuffle(pool).slice(0, 3)]));
}

function buildPhraseOptions(answerWord) {
  const answer = phraseInfo(answerWord).phrase;
  const pool = words
    .filter((word) => word.id !== answerWord.id && word.unit === answerWord.unit && (word.series || DEFAULT_SERIES) === (answerWord.series || DEFAULT_SERIES))
    .map((word) => phraseInfo(word).phrase)
    .filter(Boolean);
  return uniqueOptions(shuffle([answer, ...shuffle(pool).slice(0, 3)]));
}

function buildTranslationOptions(answerWord) {
  const pool = words
    .filter((word) => word.id !== answerWord.id && word.unit === answerWord.unit && (word.series || DEFAULT_SERIES) === (answerWord.series || DEFAULT_SERIES) && word.translation)
    .map((word) => word.translation);
  return uniqueOptions(shuffle([answerWord.translation, ...shuffle(pool).slice(0, 3)]));
}

function uniqueOptions(options) {
  const seen = new Set();
  return options.filter((option) => {
    const key = normalize(option);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function questionPool() {
  const series = $("#practiceSeries").value || "all";
  const unit = $("#practiceUnit").value || "all";
  const mode = $("#practiceMode").value || "mixed";
  let pool = [
    ...QUESTION_BANK.map((question) => ({ ...question, series: question.series || DEFAULT_SERIES })),
    ...generatedQuestions()
  ];
  if (series !== "all") pool = pool.filter((question) => (question.series || DEFAULT_SERIES) === series);
  if (unit !== "all") pool = pool.filter((question) => String(question.unit) === unit || (unit === "custom" && !question.unit));
  if (mode !== "mixed") pool = pool.filter((question) => question.type === mode);
  return pool;
}

function nextQuestion() {
  const pool = questionPool();
  $("#practiceCount").textContent = `目前可練習 ${pool.length} 題`;
  currentQuestion = pool.length ? shuffle(pool)[0] : null;
  renderQuestion();
}

function renderQuestion() {
  const card = $("#questionCard");
  if (!currentQuestion) {
    card.innerHTML = "<h3>目前沒有符合條件的題目</h3><p>可以新增單字或切換單元後再試一次。</p>";
    return;
  }

  const label = `${currentQuestion.series || DEFAULT_SERIES} · ${currentQuestion.unit ? `Unit ${currentQuestion.unit}` : "自訂"} · ${currentQuestion.type === "fill" ? "填空題" : "選擇題"}`;
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
  const target = wordKeyFromText(currentQuestion.targetWord || currentQuestion.answer, currentQuestion.unit, currentQuestion.series || "all");
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
  const series = $("#librarySeries").value || "all";
  const unit = $("#libraryUnit").value || "all";
  const query = $("#searchWord").value.trim().toLowerCase();
  let list = filteredBySeriesAndUnit(words, series, unit);
  if (query) {
    list = list.filter((word) => {
      const phrase = phraseInfo(word);
      return `${word.word} ${word.translation} ${phrase.phrase} ${phrase.phraseTr} ${word.exampleTr || ""}`.toLowerCase().includes(query);
    });
  }

  $("#wordGrid").innerHTML = list
    .sort((a, b) => a.word.localeCompare(b.word))
    .map((word) => {
      const phrase = phraseInfo(word);
      return `
      <article class="word-card">
        <div class="word-title-row">
          <button class="word-speak-button" type="button" data-speak-word="${word.id}" title="播放 ${escapeAttr(word.word)} 發音">
            <span>${escapeHtml(word.word)}</span>
            <i data-lucide="volume-2"></i>
          </button>
        </div>
        <div class="tag-row">
          <span class="tag">${escapeHtml(word.series || DEFAULT_SERIES)}</span>
          <span class="tag">${word.pos || "詞性未填"}</span>
          <span class="tag">${word.unit ? `Unit ${word.unit}` : "自訂"}</span>
          <span class="tag">Lv.${word.proficiency || 0}</span>
        </div>
        <p class="translation">${word.translation}</p>
        <p>${word.phonetic || ""}</p>
        ${
          word.example
            ? `<button class="example example-speak-button" type="button" data-speak-example="${word.id}" title="播放 ${escapeAttr(word.word)} 例句">
                <strong class="example-label">單字例句</strong>
                <span>${escapeHtml(word.example)}</span>
                ${word.exampleTr ? `<small>${escapeHtml(word.exampleTr)}</small>` : ""}
              </button>`
            : ""
        }
        ${
          phrase.phrase
            ? `<button class="phrase-chip phrase-speak-button" type="button" data-speak-phrase="${word.id}" title="播放片語 ${escapeAttr(phrase.phrase)}">
                <strong>片語</strong>
                <span>${escapeHtml(phrase.phrase)}${phrase.phraseTr ? `（${escapeHtml(phrase.phraseTr)}）` : ""}</span>
              </button>`
            : ""
        }
        ${
          phrase.phraseExample
            ? `<button class="example phrase-example example-speak-button" type="button" data-speak-phrase-example="${word.id}" title="播放片語例句">
                <strong class="example-label">片語例句</strong>
                <span>${escapeHtml(phrase.phraseExample)}</span>
                ${phrase.phraseExampleTr ? `<small>${escapeHtml(phrase.phraseExampleTr)}</small>` : ""}
              </button>`
            : ""
        }
        <footer class="word-footer">
          <span>答對率 ${accuracyFor(word)}% (${word.correct || 0}/${word.total || 0}) · ${reviewStatusText(word)}</span>
          <div class="mini-actions">
            <button type="button" data-level="${word.id}" data-offset="-1" title="降低熟練度">-</button>
            <button type="button" data-level="${word.id}" data-offset="1" title="提高熟練度">+</button>
            ${word.unit ? "" : `<button type="button" data-delete="${word.id}" title="刪除自訂單字">刪</button>`}
          </div>
        </footer>
      </article>
    `;
    })
    .join("");

  if (window.lucide) window.lucide.createIcons();
}

function handleLibraryClick(event) {
  const levelButton = event.target.closest("[data-level]");
  if (levelButton) {
    setProficiency(Number(levelButton.dataset.level), Number(levelButton.dataset.offset));
    return;
  }

  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton) {
    deleteCustomWord(Number(deleteButton.dataset.delete));
    return;
  }

  const wordButton = event.target.closest("[data-speak-word]");
  if (wordButton) {
    speakLibraryWord(Number(wordButton.dataset.speakWord));
    return;
  }

  const exampleButton = event.target.closest("[data-speak-example]");
  if (exampleButton) {
    speakLibraryExample(Number(exampleButton.dataset.speakExample));
    return;
  }

  const phraseButton = event.target.closest("[data-speak-phrase]");
  if (phraseButton) {
    speakLibraryPhrase(Number(phraseButton.dataset.speakPhrase));
    return;
  }

  const phraseExampleButton = event.target.closest("[data-speak-phrase-example]");
  if (phraseExampleButton) {
    speakLibraryPhraseExample(Number(phraseExampleButton.dataset.speakPhraseExample));
  }
}

function addCustomWord(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const word = {
    id: Date.now(),
    series: CUSTOM_SERIES,
    unit: null,
    word: data.get("word").trim(),
    translation: data.get("translation").trim(),
    pos: data.get("pos").trim(),
    phonetic: data.get("phonetic").trim(),
    phrase: data.get("phrase").trim(),
    phraseTr: data.get("phraseTr").trim(),
    phraseExample: data.get("phraseExample").trim(),
    phraseExampleTr: data.get("phraseExampleTr").trim(),
    collocation: "",
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
    button.addEventListener("click", () => activateTab(button.dataset.tab));
  });
}

function setupUnitSelects() {
  fillSeriesSelect($("#flashSeries"));
  fillSeriesSelect($("#practiceSeries"));
  fillSeriesSelect($("#librarySeries"));
  fillUnitSelect($("#flashUnit"), "全部單元", $("#flashSeries").value || "all");
  fillUnitSelect($("#practiceUnit"), "全部單元", $("#practiceSeries").value || "all");
  fillUnitSelect($("#libraryUnit"), "全部單元", $("#librarySeries").value || "all");
}

function refreshUnitSelectFor(seriesSelector, unitSelector) {
  fillUnitSelect($(unitSelector), "全部單元", $(seriesSelector).value || "all");
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

  $("#flashSeries").addEventListener("change", () => {
    stopAutoPlay();
    refreshUnitSelectFor("#flashSeries", "#flashUnit");
    initFlashcards();
  });
  $("#flashUnit").addEventListener("change", () => {
    stopAutoPlay();
    initFlashcards();
  });
  $("#flashLevel").addEventListener("change", () => {
    stopAutoPlay();
    initFlashcards();
  });
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
  $("#speakBtn").addEventListener("click", speakFlashcard);
  $("#autoPlayBtn").addEventListener("click", toggleAutoPlay);
  $("#dimScreenBtn").addEventListener("click", toggleDimMode);
  $("#knownBtn").addEventListener("click", () => recordFlashcard(true));
  $("#unknownBtn").addEventListener("click", () => recordFlashcard(false));
  $("#practiceSeries").addEventListener("change", () => {
    refreshUnitSelectFor("#practiceSeries", "#practiceUnit");
    nextQuestion();
  });
  $("#practiceUnit").addEventListener("change", nextQuestion);
  $("#practiceMode").addEventListener("change", nextQuestion);
  $("#newQuestion").addEventListener("click", nextQuestion);
  $("#searchWord").addEventListener("input", renderLibrary);
  $("#librarySeries").addEventListener("change", () => {
    refreshUnitSelectFor("#librarySeries", "#libraryUnit");
    renderLibrary();
  });
  $("#libraryUnit").addEventListener("change", renderLibrary);
  $("#wordGrid").addEventListener("click", handleLibraryClick);
  $("#addWordForm").addEventListener("submit", addCustomWord);
  $("#exportBtn").addEventListener("click", exportData);
  $("#importInput").addEventListener("change", importData);

  if (window.lucide) window.lucide.createIcons();
  window.addEventListener("load", () => window.lucide?.createIcons());
}

boot();
