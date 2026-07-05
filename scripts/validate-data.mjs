import { BASE_VOCABULARY } from "../data/vocabulary.js";
import { JUNIOR_1200_VOCABULARY } from "../data/junior1200.js";
import { HIGH_SCHOOL_VOCABULARY } from "../data/highschool.js";
import { HIGH_FREQUENCY_VOCABULARY } from "../data/highFrequency.js";
import { QUESTION_BANK } from "../data/questions.js";

const DEFAULT_SERIES = "南山國中單字表";
const JUNIOR_SERIES = "教育部 1200 基本字彙";
const HIGH_SCHOOL_SERIES = "大考中心高中英文參考詞彙表";
const HIGH_FREQUENCY_SERIES = "高中英文高頻率單字庫";

const words = [
  ...BASE_VOCABULARY.map((word) => ({ ...word, series: word.series || DEFAULT_SERIES })),
  ...JUNIOR_1200_VOCABULARY.map((word) => ({ ...word, series: word.series || JUNIOR_SERIES })),
  ...HIGH_SCHOOL_VOCABULARY.map((word) => ({ ...word, series: word.series || HIGH_SCHOOL_SERIES })),
  ...HIGH_FREQUENCY_VOCABULARY.map((word) => ({ ...word, series: word.series || HIGH_FREQUENCY_SERIES }))
];

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\u4e00-\u9fff']+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasHyphenSpacing(value) {
  return /[A-Za-z]\s+-[A-Za-z]|[A-Za-z]-\s+[A-Za-z]/.test(String(value || ""));
}

function phraseExampleUsesPhrase(phrase, example) {
  const normalizedExample = normalizeText(example);
  if (!phrase || !normalizedExample) return false;
  return phraseCoreOptions(phrase).some((option) => phraseWordsInExample(option, normalizedExample));
}

function exampleUsesWord(wordText, example) {
  const normalizedExample = normalizeText(example);
  if (!wordText || !normalizedExample) return false;
  return wordCoreOptions(wordText).some((option) => phraseWordsInExample(option, normalizedExample));
}

function wordCoreOptions(wordText) {
  return String(wordText)
    .replace(/[（(][^）)]*[）)]/g, "")
    .split(/\s*\/\s*|;|；|,|，/)
    .map((option) => normalizeText(option))
    .filter(Boolean);
}

function phraseCoreOptions(phrase) {
  return String(phrase)
    .replace(/[（(][^）)]*[）)]/g, "")
    .split(/[;；]/)
    .map((option) =>
      normalizeText(option)
        .replace(/\bsb's\b/g, " ")
        .replace(/\b(sb|sth|someone|something|one's|one|a|the)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean)
    .map((option) => (option.startsWith("be ") ? option.slice(3) : option));
}

function phraseWordsInExample(option, normalizedExample) {
  const wordsToFind = option.split(" ").filter(Boolean);
  if (!wordsToFind.length) return false;
  const exampleWords = normalizedExample.split(" ");
  let cursor = 0;
  return wordsToFind.every((target) => {
    const targetStem = simpleStem(target);
    const index = exampleWords.findIndex((word, currentIndex) => {
      if (currentIndex < cursor) return false;
      const wordStem = simpleStem(word);
      return wordStem === targetStem || (targetStem.length > 3 && wordStem.endsWith(targetStem));
    });
    if (index === -1) return false;
    cursor = index + 1;
    return true;
  });
}

function simpleStem(word) {
  const irregular = {
    am: "be",
    is: "be",
    are: "be",
    was: "be",
    were: "be",
    been: "be",
    being: "be",
    came: "come",
    coming: "come",
    has: "have",
    had: "have",
    does: "do",
    did: "do",
    done: "do",
    made: "make",
    making: "make",
    fell: "fall",
    falling: "fall",
    foreseen: "foresee",
    dug: "dig",
    digs: "dig",
    drove: "drive",
    driven: "drive",
    dried: "dry",
    kept: "keep",
    wrote: "write",
    argued: "argue",
    arguing: "argue",
    arrived: "arrive",
    arriving: "arrive",
    bacteria: "bacterium",
    became: "become",
    blown: "blow",
    blew: "blow",
    bought: "buy",
    buying: "buy",
    built: "build",
    building: "build",
    calves: "calf",
    clapped: "clap",
    clapping: "clap",
    chose: "choose",
    chosen: "choose",
    cookies: "cookie",
    died: "die",
    dipped: "dip",
    dying: "die",
    feet: "foot",
    geese: "goose",
    hit: "hit",
    hits: "hit",
    hurt: "hurt",
    hurts: "hurt",
    left: "leave",
    lying: "lie",
    lost: "lose",
    mops: "mop",
    oxen: "ox",
    owns: "own",
    overcame: "overcome",
    overgrown: "overgrow",
    impressed: "impress",
    oppressed: "oppress",
    prettier: "pretty",
    proceeded: "proceed",
    ran: "run",
    running: "run",
    saw: "see",
    seen: "see",
    sat: "sit",
    sitting: "sit",
    smaller: "small",
    spent: "spend",
    teeth: "tooth",
    tossed: "toss",
    wrote: "write",
    written: "write",
    writing: "write"
  };
  let value = String(word || "").replace(/'s$/, "");
  value = irregular[value] || value;
  if (value.length > 4) value = value.replace(/ied$/, "y");
  if (value.length > 4) value = value.replace(/ies$/, "y");
  if (value.length > 3) value = value.replace(/s$/, "");
  if (value.length > 4) value = value.replace(/(ing|ed|es)$/, "");
  if (value.length > 3) value = value.replace(/e$/, "");
  if (value.length > 5) value = value.replace(/(tion|sion)$/, "t");
  if (/(.)\1$/.test(value) && value.length > 4) value = value.slice(0, -1);
  return value;
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

const issues = [];
const warnings = [];
const duplicates = new Map();

for (const word of words) {
  const required = word.referenceOnly
    ? [
        ["word", word.word],
        ["pos", word.pos]
      ]
    : [
        ["word", word.word],
        ["translation", word.translation],
        ["pos", word.pos],
        ["example", word.example],
        ["exampleTr", word.exampleTr]
      ];

  for (const [label, value] of required) {
    if (!String(value || "").trim()) issues.push(`${word.series} Unit ${word.unit || "-"} ${word.word || "(empty)"} missing ${label}`);
  }

  for (const [label, value] of [
    ["word", word.word],
    ["example", word.example],
    ["phrase", word.phrase || word.collocation],
    ["phraseExample", word.phraseExample]
  ]) {
    if (hasHyphenSpacing(value)) {
      issues.push(`${word.series} Unit ${word.unit || "-"} ${word.word || "(empty)"} ${label} has extra hyphen spacing`);
    }
  }

  const phrase = phraseInfo(word);
  if (phrase.phrase && phrase.phraseExample && !phraseExampleUsesPhrase(phrase.phrase, phrase.phraseExample)) {
    issues.push(`${word.series} Unit ${word.unit || "-"} ${word.word}: phrase example does not contain "${phrase.phrase}"`);
  }
  if (phrase.phrase && !phrase.phraseExample) {
    issues.push(`${word.series} Unit ${word.unit || "-"} ${word.word}: missing phrase example`);
  }
  if (!word.referenceOnly && word.example && !exampleUsesWord(word.word, word.example)) {
    warnings.push(`example may not contain word: ${word.series} Unit ${word.unit || "-"} ${word.word}`);
  }
  if (word.needsReview) {
    warnings.push(`OCR review suggested: ${word.series}::${word.word}`);
  }

  if (word.series === HIGH_FREQUENCY_SERIES) {
    const example = String(word.example || "").trim();
    if (String(word.phonetic || "").trim()) {
      issues.push(`${word.series} Unit ${word.unit || "-"} ${word.word}: high-frequency OCR phonetic should be blank until verified`);
    }
    if (/^Please learn how to use\b/i.test(example)) {
      issues.push(`${word.series} Unit ${word.unit || "-"} ${word.word}: placeholder example`);
    }
    if (example && example.length < 18) {
      issues.push(`${word.series} Unit ${word.unit || "-"} ${word.word}: example is too short`);
    }
  }

  for (const [label, value] of [
    ["exampleTr", word.exampleTr],
    ["phraseExampleTr", word.phraseExampleTr]
  ]) {
    const text = String(value || "").trim();
    if (/^請學會如何在句子中使用\b/i.test(text)) {
      issues.push(`${word.series} Unit ${word.unit || "-"} ${word.word}: placeholder ${label}`);
    }
    if (/^[-－]/.test(text)) {
      issues.push(`${word.series} Unit ${word.unit || "-"} ${word.word}: ${label} starts with a stray hyphen`);
    }
  }

  const key = `${word.series}::${normalizeText(word.word)}`;
  duplicates.set(key, [...(duplicates.get(key) || []), word]);
}

for (const [key, items] of duplicates) {
  if (items.length > 1) warnings.push(`duplicate word: ${key} (${items.length})`);
}

for (const question of QUESTION_BANK) {
  if (!String(question.answer || "").trim()) issues.push(`question ${question.id || "(no id)"} missing answer`);
  if (!String(question.explanation || "").trim()) issues.push(`question ${question.id || "(no id)"} missing explanation`);
  if (question.type === "mcq") {
    const options = Array.isArray(question.options) ? question.options : [];
    if (!options.length) issues.push(`question ${question.id || "(no id)"} missing options`);
    if (question.answer && !options.map(normalize).includes(normalize(question.answer))) {
      issues.push(`question ${question.id || "(no id)"} answer is not in options`);
    }
  }
  if (question.type === "fill") {
    const choices = Array.isArray(question.choices) ? question.choices : [];
    if (question.answer && !choices.map(normalize).includes(normalize(question.answer))) {
      issues.push(`question ${question.id || "(no id)"} hint choices do not include answer`);
    }
  }
}

console.log(JSON.stringify({ totalWords: words.length, totalBankQuestions: QUESTION_BANK.length, issues: issues.length, warnings: warnings.length }, null, 2));

if (issues.length) {
  console.log(issues.slice(0, 80).join("\n"));
  if (issues.length > 80) console.log(`... ${issues.length - 80} more`);
  process.exitCode = 1;
}

if (warnings.length) {
  console.log(warnings.slice(0, 80).join("\n"));
  if (warnings.length > 80) console.log(`... ${warnings.length - 80} more`);
}
