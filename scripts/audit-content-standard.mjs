import { BASE_VOCABULARY } from "../data/vocabulary.js";
import { JUNIOR_1200_VOCABULARY } from "../data/junior1200.js";
import { HIGH_SCHOOL_VOCABULARY } from "../data/highschool.js";
import { HIGH_FREQUENCY_VOCABULARY } from "../data/highFrequency.js";
import { QUESTION_BANK } from "../data/questions.js";

const DEFAULT_SERIES = "南山國中單字表";
const HIGH_SCHOOL_SERIES = "大考中心高中英文參考詞彙表";

const words = [
  ...BASE_VOCABULARY.map((word) => ({ ...word, series: word.series || DEFAULT_SERIES })),
  ...JUNIOR_1200_VOCABULARY,
  ...HIGH_SCHOOL_VOCABULARY.map((word) => ({ ...word, series: word.series || HIGH_SCHOOL_SERIES })),
  ...HIGH_FREQUENCY_VOCABULARY
];

const formalWords = words.filter((word) => !word.referenceOnly);
const validTargetLevels = new Set(["JH", "SH_BASIC", "SH_ADVANCED"]);

function hasText(value) {
  return String(value || "").trim().length > 0;
}

function wordCount(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean).length;
}

function posParts(pos) {
  return String(pos || "")
    .split(/\s*\/\s*|[;,；，、]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function exampleCount(word) {
  if (Array.isArray(word.examples)) return word.examples.filter(Boolean).length;
  return hasText(word.example) ? 1 : 0;
}

function phraseText(word) {
  return String(word.phrase || word.collocation || "").trim();
}

function hasPhrase(word) {
  return hasText(phraseText(word));
}

function hasTargetLevel(word) {
  if (validTargetLevels.has(word.targetLevel)) return true;
  if (Array.isArray(word.targetLevels)) {
    return word.targetLevels.every((level) => validTargetLevels.has(level));
  }
  return false;
}

function hasPrimarySense(word) {
  if (typeof word.primarySense === "string") return hasText(word.primarySense);
  if (word.primarySense && typeof word.primarySense === "object") {
    const levels = Object.keys(word.primarySense);
    return levels.length > 0 && levels.every((level) => validTargetLevels.has(level) && hasText(word.primarySense[level]));
  }
  return false;
}

function metricRows(source) {
  const phraseRows = source.filter(hasPhrase);
  return {
    vocabularyRecords: source.length,
    missingTargetLevel: source.filter((word) => !hasTargetLevel(word)).length,
    missingPrimarySense: source.filter((word) => !hasPrimarySense(word)).length,
    missingKkOrPhonetic: source.filter((word) => !hasText(word.phonetic)).length,
    missingPosZh: source.filter((word) => !hasText(word.posZh)).length,
    multiPosSingleExample: source.filter((word) => posParts(word.pos).length > 1 && exampleCount(word) <= 1).length,
    exampleOver14Words: source.filter((word) => wordCount(word.example) > 14).length,
    phraseRows: phraseRows.length,
    phraseMissingEvidence: phraseRows.filter((word) => !hasText(word.phraseEvidence)).length,
    questionBankRecords: QUESTION_BANK.length
  };
}

function pilotScore(word) {
  let score = 0;
  if (hasPhrase(word) && !hasText(word.phraseEvidence)) score += 5;
  if (posParts(word.pos).length > 1 && exampleCount(word) <= 1) score += 4;
  if (wordCount(word.example) > 14) score += 3;
  if (!hasText(word.posZh)) score += 2;
  if (!hasTargetLevel(word)) score += 2;
  if (!hasPrimarySense(word)) score += 2;
  if (!hasText(word.phonetic)) score += 1;
  return score;
}

const pilotBatch = formalWords
  .map((word) => ({
    id: word.id,
    series: word.series,
    unit: word.unit,
    word: word.word,
    pos: word.pos,
    score: pilotScore(word),
    reasons: [
      hasPhrase(word) && !hasText(word.phraseEvidence) ? "片語缺 evidence" : "",
      posParts(word.pos).length > 1 && exampleCount(word) <= 1 ? "多詞性但單一例句" : "",
      wordCount(word.example) > 14 ? "例句超過 14 字" : "",
      !hasText(word.posZh) ? "缺中文詞性" : "",
      !hasTargetLevel(word) ? "缺 targetLevel" : "",
      !hasPrimarySense(word) ? "缺 primarySense" : "",
      !hasText(word.phonetic) ? "缺 KK 音標" : ""
    ].filter(Boolean)
  }))
  .filter((item) => item.score > 0)
  .sort((a, b) => b.score - a.score || a.id - b.id)
  .slice(0, 40);

const report = {
  scope: "Phase 0 / Phase 1 content standard audit",
  allWords: metricRows(words),
  formalLearningWords: metricRows(formalWords),
  pilotBatch
};

console.log(JSON.stringify(report, null, 2));
