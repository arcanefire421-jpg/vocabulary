import { BASE_VOCABULARY } from "../data/vocabulary.js?v=v1.2-showcase-heroes";
import { JUNIOR_1200_VOCABULARY } from "../data/junior1200.js?v=v1.2-showcase-heroes";
import { QUESTION_BANK } from "../data/questions.js?v=v1.2-showcase-heroes";

const APP_VERSION = "V1.2 勇者傳說版";

const STORAGE_KEY = "vocabmaster-state-v1";
const CUSTOM_KEY = "vocabmaster-custom-v1";
const ADVENTURE_KEY = "vocabmaster-adventure-v1";
const DEFAULT_SERIES = "南山國中單字表";
const JUNIOR_SERIES = "教育部 1200 基本字彙";
const HIGH_SCHOOL_SERIES = "大考中心高中英文參考詞彙表";
const HIGH_FREQUENCY_SERIES = "高中英文高頻率單字庫";
const CUSTOM_SERIES = "自訂單字";
const SERIES_WORD_COUNTS = {
  [DEFAULT_SERIES]: 400,
  [JUNIOR_SERIES]: 1200,
  [HIGH_SCHOOL_SERIES]: 6007,
  [HIGH_FREQUENCY_SERIES]: 1399
};
const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const REVIEW_INTERVALS = [0, 1 * 60 * 60 * 1000, 1 * DAY_MS, 3 * DAY_MS, 7 * DAY_MS, 14 * DAY_MS];
const ENCOURAGEMENTS = ["我會了", "我好棒", "我真棒", "我真聰明", "我真厲害", "超厲害", "100分", "真讚"];
const ADVENTURE_MAX_LEVEL = 60;
const ADVENTURE_MAP_ZONES = [
  {
    from: 1,
    to: 10,
    title: "星火荒原",
    className: "zone-star",
    stages: ["點亮第一束星火", "穿過晨霧步道", "找到能量羅盤", "喚醒小小營火", "收集星塵碎片", "踏上發光石階", "聽見遠方鐘聲", "越過微光草原", "抵達星門前哨", "開啟第一座星門"]
  },
  {
    from: 11,
    to: 20,
    title: "古語小徑",
    className: "zone-sentence",
    stages: ["讀懂石碑上的句子", "修復斷裂的語橋", "穿越回音走廊", "收集句意水晶", "點亮文法路標", "打開例句寶箱", "走過語感溪谷", "辨認隱藏線索", "完成小徑試煉", "抵達句光涼亭"]
  },
  {
    from: 21,
    to: 30,
    title: "記憶森林",
    className: "zone-flash",
    stages: ["翻開森林入口卡", "遇見記憶樹影", "喚醒沉睡字根", "越過熟練藤蔓", "採集回想果實", "穿過閃光葉道", "找到複習泉水", "點亮熟字營地", "完成森林巡禮", "登上樹冠瞭望台"]
  },
  {
    from: 31,
    to: 40,
    title: "試煉山谷",
    className: "zone-practice",
    stages: ["進入第一道試煉門", "破解填空符文", "避開選項迷霧", "修正錯題軌跡", "打開解說卷軸", "越過答案石橋", "累積勇氣刻印", "挑戰混合題陣", "通過山谷考驗", "抵達題庫烽火台"]
  },
  {
    from: 41,
    to: 50,
    title: "徽章聖原",
    className: "zone-badge",
    stages: ["踏上收藏高原", "擦亮第一枚徽章", "修復榮耀旗幟", "守住連勝營地", "解開成就封印", "收納星星獎章", "穿越金色風口", "完成高原巡守", "點亮徽章方尖碑", "開啟榮耀大門"]
  },
  {
    from: 51,
    to: 60,
    title: "吳限高塔",
    className: "zone-tower",
    stages: ["抵達高塔底層", "啟動吳限升降台", "穿越能量迴廊", "修復塔心齒輪", "守住知識核心", "點亮塔身符文", "攀上雲端階梯", "聽見頂樓號角", "完成究極試煉", "登上吳限塔頂"]
  }
];
const AVATAR_ITEMS = [
  { id: "w", icon: "W", name: "吳限起點", cost: 0, className: "avatar-core", stats: { hp: 0, mp: 0, atk: 0, def: 0, hit: 0, evade: 0, move: 0 } },
  { id: "warrior", icon: "戰", name: "戰士", cost: 30, className: "avatar-warrior", stats: { hp: 18, mp: 0, atk: 6, def: 3, hit: 2, evade: 0, move: 0 } },
  { id: "mage", icon: "法", name: "法師", cost: 45, className: "avatar-mage", stats: { hp: 0, mp: 24, atk: 5, def: 0, hit: 3, evade: 0, move: 0 } },
  { id: "priest", icon: "牧", name: "牧師", cost: 45, className: "avatar-priest", stats: { hp: 8, mp: 18, atk: 2, def: 2, hit: 2, evade: 1, move: 0 } },
  { id: "paladin", icon: "聖", name: "聖騎士", cost: 60, className: "avatar-paladin", stats: { hp: 16, mp: 10, atk: 4, def: 6, hit: 1, evade: 0, move: 0 } },
  { id: "assassin", icon: "刺", name: "刺客", cost: 65, className: "avatar-assassin", stats: { hp: 4, mp: 4, atk: 5, def: 0, hit: 5, evade: 7, move: 1 } },
  { id: "death-knight", icon: "死", name: "死亡騎士", cost: 85, className: "avatar-death-knight", stats: { hp: 22, mp: 8, atk: 7, def: 4, hit: 1, evade: -1, move: 0 } },
  { id: "druid", icon: "德", name: "德魯伊", cost: 75, className: "avatar-druid", stats: { hp: 10, mp: 14, atk: 3, def: 3, hit: 2, evade: 3, move: 1 } }
];
const AVATAR_SKILLS = {
  w: ["吳限覺醒！", "星火連線！", "知識護盾！"],
  warrior: ["龍破斬！！！", "烈刃突擊！", "勇氣咆哮！"],
  mage: ["星塵爆裂！", "魔力洪流！", "冰晶閃耀！"],
  priest: ["聖光祝福！", "治癒之環！", "希望禱言！"],
  paladin: ["神聖壁壘！", "榮耀衝鋒！", "誓約守護！"],
  assassin: ["月影突襲！", "疾風連斬！", "暗影步！"],
  "death-knight": ["霜魂斬！", "冥界召喚！", "黑鋼意志！"],
  druid: ["翠葉新生！", "自然守護！", "野性奔流！"]
};
const FRAME_ITEMS = [
  { id: "plain", name: "簡約框", cost: 0, className: "frame-plain" },
  { id: "mint", name: "方形能量框", cost: 25, className: "frame-square" },
  { id: "gold", name: "斜角金屬框", cost: 50, className: "frame-bevel" },
  { id: "purple", name: "尖刺戰鬥框", cost: 75, className: "frame-spike" },
  { id: "tower", name: "吳限塔晶框", cost: 100, className: "frame-tower" }
];
const EQUIPMENT_CATEGORIES = [
  { id: "weapon", title: "單手武器" },
  { id: "shield", title: "防禦類" },
  { id: "armor", title: "護甲類" },
  { id: "boots", title: "鞋子類" }
];
const EQUIPMENT_ITEMS = [
  ...[
    ["wood-dagger", "練習短劍", "短劍", 12], ["iron-dagger", "鐵製短劍", "短劍", 18], ["long-sword", "青銅長劍", "長劍", 28], ["steel-sword", "鋼鐵長劍", "長劍", 42],
    ["oak-club", "橡木戰棍", "棍", 14], ["war-club", "碎岩戰棍", "棍", 30], ["novice-staff", "見習法杖", "杖", 20], ["star-staff", "星塵法杖", "杖", 48],
    ["moon-blade", "月影彎刀", "刀", 36], ["falcon-blade", "獵鷹戰刀", "刀", 50], ["rapier", "銀光細劍", "刺劍", 34], ["rune-rapier", "古文刺劍", "刺劍", 58],
    ["hand-axe", "戰士手斧", "斧", 26], ["silver-axe", "白銀戰斧", "斧", 52], ["mace", "晨星戰錘", "錘", 32], ["holy-mace", "聖光戰錘", "錘", 62],
    ["crystal-wand", "水晶魔棒", "魔棒", 24], ["shadow-wand", "暗影魔棒", "魔棒", 55], ["knight-saber", "騎士軍刀", "軍刀", 46], ["dragon-tooth", "焰龍牙刃", "短刃", 80]
  ].map(([id, name, kind, cost]) => ({ id, name, kind, cost, slot: "weapon", icon: weaponIcon(kind) })),
  ...[
    ["wood-shield", "木盾", 15, "⬟"], ["round-shield", "小圓盾", 24, "◉"], ["iron-shield", "鐵盾", 42, "⬢"], ["tower-shield", "塔盾", 70, "▣"],
    ["bronze-buckler", "青銅小盾", 30, "◍"], ["silver-buckler", "銀紋小盾", 46, "◎"], ["kite-shield", "鳶形盾", 55, "⬨"], ["rune-shield", "符文盾", 66, "⬡"],
    ["crystal-guard", "水晶護盾", 78, "◇"], ["thorn-shield", "荊棘盾", 84, "✦"], ["lion-shield", "獅心盾", 92, "♜"], ["moon-guard", "月光盾", 98, "☽"],
    ["sun-aegis", "日耀聖盾", 110, "☼"], ["shadow-ward", "暗影護盾", 118, "◒"], ["storm-shield", "雷鳴戰盾", 126, "ϟ"], ["dragon-scale-shield", "焰龍鱗盾", 138, "◆"],
    ["star-barrier", "星界屏障", 150, "✹"], ["ancient-aegis", "古王聖盾", 165, "♛"], ["infinity-guard", "吳限守護盾", 180, "∞"], ["tower-aegis", "天塔王盾", 200, "▰"]
  ].map(([id, name, cost, icon]) => ({ id, name, kind: "盾", cost, slot: "shield", icon })),
  ...[
    ["cloth-robe", "布衣", 12, "◇"], ["leather-armor", "皮甲", 26, "⬧"], ["hard-leather", "硬皮甲", 40, "⬥"], ["chain-mail", "鎖子甲", 60, "⬡"],
    ["traveler-coat", "旅人外套", 18, "◈"], ["apprentice-robe", "見習長袍", 30, "✧"], ["hunter-vest", "獵人背心", 38, "▱"], ["iron-mail", "鐵環甲", 54, "▧"],
    ["knight-armor", "騎士胸甲", 72, "▣"], ["sage-robe", "賢者法袍", 76, "✦"], ["shadow-cloak", "影行斗篷", 82, "◒"], ["holy-plate", "聖光板甲", 96, "☼"],
    ["storm-mail", "雷鳴鎖甲", 108, "ϟ"], ["crystal-robe", "水晶長袍", 116, "◇"], ["beast-hide", "荒獸皮甲", 122, "◆"], ["moon-armor", "月銀護甲", 136, "☽"],
    ["star-robe", "星界法袍", 148, "✹"], ["dragon-plate", "焰龍戰甲", 165, "⬢"], ["infinity-armor", "吳限核心甲", 185, "∞"], ["tower-regalia", "天塔王裝", 210, "♛"]
  ].map(([id, name, cost, icon]) => ({ id, name, kind: "護甲", cost, slot: "armor", icon })),
  ...[
    ["cloth-boots", "布鞋", 10, "⌁"], ["leather-boots", "皮靴", 22, "⌂"], ["runner-boots", "疾行靴", 45, "↯"], ["tower-greaves", "高塔戰靴", 68, "▰"],
    ["traveler-shoes", "旅人鞋", 16, "▱"], ["soft-boots", "靜音短靴", 28, "◒"], ["iron-greaves", "鐵護脛", 40, "⬢"], ["wind-boots", "風行靴", 52, "ϟ"],
    ["hunter-boots", "獵人長靴", 58, "◆"], ["mage-sandals", "法師涼靴", 62, "✧"], ["paladin-greaves", "聖騎護靴", 78, "☼"], ["shadow-steps", "影步靴", 86, "◐"],
    ["moon-boots", "月影長靴", 94, "☽"], ["crystal-greaves", "水晶護脛", 104, "◇"], ["storm-steps", "雷鳴戰靴", 116, "↯"], ["dragon-boots", "龍鱗長靴", 130, "⬥"],
    ["star-walkers", "星行者靴", 144, "✹"], ["ancient-greaves", "古王護脛", 158, "♜"], ["infinity-boots", "吳限旅靴", 176, "∞"], ["sky-tower-boots", "天塔戰靴", 198, "▣"]
  ].map(([id, name, cost, icon]) => ({ id, name, kind: "鞋子", cost, slot: "boots", icon }))
];
const ACHIEVEMENT_SPECS = [
  ["first_step", "sparkles", "第一步", "完成第一次練習", "attempts", 1, 5],
  ["first_correct", "badge-check", "亮起一格", "第一次答對", "correct", 1, 8],
  ["ten_steps", "footprints", "小小前進", "累積練習 10 次", "attempts", 10, 12],
  ["streak_five", "flame-kindling", "能量連線", "最高連續答對 5 次", "bestStreak", 5, 15],
  ["daily_ten", "sun", "今日小探險", "今天完成 10 次練習", "todayAttempts", 10, 18],
  ["first_mastered", "gem", "熟練之星", "第一個單字達到 Lv.5", "mastered", 1, 20],
  ["correct_10", "badge-check", "準星初現", "累積答對 10 題", "correct", 10, 10],
  ["correct_25", "target", "準星連發", "累積答對 25 題", "correct", 25, 14],
  ["correct_50", "crosshair", "準星獵手", "累積答對 50 題", "correct", 50, 18],
  ["correct_100", "medal", "百答勇者", "累積答對 100 題", "correct", 100, 25],
  ["correct_200", "award", "雙百之證", "累積答對 200 題", "correct", 200, 34],
  ["correct_400", "trophy", "四百榮光", "累積答對 400 題", "correct", 400, 48],
  ["correct_700", "crown", "七百王冠", "累積答對 700 題", "correct", 700, 64],
  ["correct_1000", "star", "千答星辰", "累積答對 1000 題", "correct", 1000, 88],
  ["attempt_25", "map", "旅程開卷", "累積練習 25 次", "attempts", 25, 12],
  ["attempt_50", "route", "走過小徑", "累積練習 50 次", "attempts", 50, 16],
  ["attempt_100", "compass", "百步指南", "累積練習 100 次", "attempts", 100, 24],
  ["attempt_250", "flag", "遠征旗手", "累積練習 250 次", "attempts", 250, 36],
  ["attempt_500", "mountain", "登峰旅人", "累積練習 500 次", "attempts", 500, 54],
  ["attempt_1000", "castle", "千練城門", "累積練習 1000 次", "attempts", 1000, 82],
  ["mastered_3", "gem", "三顆熟練石", "3 個單字達到 Lv.5", "mastered", 3, 18],
  ["mastered_5", "diamond", "五芒熟練", "5 個單字達到 Lv.5", "mastered", 5, 24],
  ["mastered_10", "shield-check", "十字熟練盾", "10 個單字達到 Lv.5", "mastered", 10, 36],
  ["mastered_20", "shield", "熟練守衛", "20 個單字達到 Lv.5", "mastered", 20, 50],
  ["mastered_40", "landmark", "熟練碑文", "40 個單字達到 Lv.5", "mastered", 40, 68],
  ["mastered_80", "crown", "熟練王座", "80 個單字達到 Lv.5", "mastered", 80, 90],
  ["streak_10", "flame", "十連火花", "最高連續答對 10 次", "bestStreak", 10, 20],
  ["streak_20", "flame-kindling", "二十連炎", "最高連續答對 20 次", "bestStreak", 20, 32],
  ["streak_30", "zap", "三十閃電", "最高連續答對 30 次", "bestStreak", 30, 46],
  ["streak_50", "swords", "五十連斬", "最高連續答對 50 次", "bestStreak", 50, 70],
  ["daily_correct_5", "sun-medium", "今日準備", "今天答對 5 題", "todayCorrect", 5, 10],
  ["daily_correct_10", "sun", "今日發光", "今天答對 10 題", "todayCorrect", 10, 16],
  ["daily_correct_20", "sunrise", "晨光連勝", "今天答對 20 題", "todayCorrect", 20, 28],
  ["daily_star_5", "star", "今日星屑", "今天取得 5 顆星星", "todayStars", 5, 12],
  ["daily_star_15", "stars", "今日星雨", "今天取得 15 顆星星", "todayStars", 15, 24],
  ["daily_star_30", "sparkles", "今日星河", "今天取得 30 顆星星", "todayStars", 30, 40],
  ["energy_100", "battery-charging", "能量啟動", "累積 100 究極吳限能量", "inspiration", 100, 20],
  ["energy_250", "bolt", "能量奔流", "累積 250 究極吳限能量", "inspiration", 250, 32],
  ["energy_500", "activity", "能量迴路", "累積 500 究極吳限能量", "inspiration", 500, 48],
  ["energy_1000", "rocket", "能量破空", "累積 1000 究極吳限能量", "inspiration", 1000, 72],
  ["level_5", "chevrons-up", "冒險五階", "冒險等級達到 Lv.5", "level", 5, 24],
  ["level_10", "trending-up", "冒險十階", "冒險等級達到 Lv.10", "level", 10, 38],
  ["level_20", "mountain-snow", "冒險二十階", "冒險等級達到 Lv.20", "level", 20, 58],
  ["level_30", "tower-control", "高塔三十階", "冒險等級達到 Lv.30", "level", 30, 82],
  ["level_45", "cloud-lightning", "雲端四十五階", "冒險等級達到 Lv.45", "level", 45, 112],
  ["level_60", "crown", "吳限頂點", "冒險等級達到 Lv.60", "level", 60, 150],
  ["avatar_2", "user-round-plus", "夥伴集結", "解鎖 2 個職業頭像", "ownedAvatars", 2, 18],
  ["avatar_4", "users-round", "四職同行", "解鎖 4 個職業頭像", "ownedAvatars", 4, 30],
  ["avatar_8", "sparkles", "全職開放", "解鎖全部職業頭像", "ownedAvatars", 8, 60],
  ["frame_2", "panel-top", "框之初光", "解鎖 2 個頭像框", "ownedFrames", 2, 18],
  ["frame_4", "panel-top-open", "框之收藏", "解鎖 4 個頭像框", "ownedFrames", 4, 34],
  ["frame_5", "badge", "框之殿堂", "解鎖全部頭像框", "ownedFrames", 5, 50],
  ["equipment_1", "sword", "第一件裝備", "擁有 1 件裝備", "ownedEquipment", 1, 12],
  ["equipment_5", "shield", "裝備小隊", "擁有 5 件裝備", "ownedEquipment", 5, 22],
  ["equipment_10", "wand-sparkles", "十件收藏", "擁有 10 件裝備", "ownedEquipment", 10, 36],
  ["equipment_20", "package-check", "二十件寶庫", "擁有 20 件裝備", "ownedEquipment", 20, 58],
  ["equipment_40", "boxes", "四十件軍械庫", "擁有 40 件裝備", "ownedEquipment", 40, 86],
  ["equipment_80", "warehouse", "全裝備傳說", "擁有 80 件裝備", "ownedEquipment", 80, 128],
  ["earned_stars_100", "coins", "百星袋", "累積獲得 100 顆星星", "totalEarnedStars", 100, 25],
  ["earned_stars_500", "badge-dollar-sign", "五星寶庫", "累積獲得 500 顆星星", "totalEarnedStars", 500, 80]
];
const ADVENTURE_ACHIEVEMENTS = ACHIEVEMENT_SPECS.map(([id, icon, title, description, metric, target, reward]) => ({
  id,
  icon,
  title,
  description,
  metric,
  target,
  reward,
  test: (context) => achievementValue({ metric }, context) >= target
}));

let stats = loadJson(STORAGE_KEY, {});
let customWords = loadJson(CUSTOM_KEY, []);
let adventure = normalizeAdventure(loadJson(ADVENTURE_KEY, {}));
let highSchoolVocabulary = [];
let highFrequencyVocabulary = [];
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
let speechUnlocked = false;
let speechVoiceLoadStarted = false;
const loadedSeries = new Set([DEFAULT_SERIES, JUNIOR_SERIES, CUSTOM_SERIES]);
const loadingSeries = new Map();

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
  localStorage.setItem(ADVENTURE_KEY, JSON.stringify(adventure));
}

function normalizeAdventure(value) {
  const data = value && typeof value === "object" ? value : {};
  const ownedAvatars = Array.isArray(data.ownedAvatars) ? data.ownedAvatars : ["w"];
  const ownedFrames = Array.isArray(data.ownedFrames) ? data.ownedFrames : ["plain"];
  const ownedEquipment = Array.isArray(data.ownedEquipment) ? data.ownedEquipment : [];
  const equippedEquipment = data.equippedEquipment && typeof data.equippedEquipment === "object" ? data.equippedEquipment : {};
  return {
    stars: Number(data.stars) || 0,
    inspiration: Number(data.inspiration) || 0,
    totalEarnedStars: Number(data.totalEarnedStars) || 0,
    currentStreak: Number(data.currentStreak) || 0,
    bestStreak: Number(data.bestStreak) || 0,
    lastActiveDate: data.lastActiveDate || todayKey(),
    daily: data.daily && typeof data.daily === "object" ? data.daily : {},
    achievements: data.achievements && typeof data.achievements === "object" ? data.achievements : {},
    showcaseBadges: Array.isArray(data.showcaseBadges) ? data.showcaseBadges.filter((id) => typeof id === "string").slice(0, 6) : [],
    missionClaims: data.missionClaims && typeof data.missionClaims === "object" ? data.missionClaims : {},
    ownedAvatars: ownedAvatars.includes("w") ? ownedAvatars : ["w", ...ownedAvatars],
    ownedFrames: ownedFrames.includes("plain") ? ownedFrames : ["plain", ...ownedFrames],
    ownedEquipment,
    equippedEquipment: {
      weapon: equippedEquipment.weapon || "",
      shield: equippedEquipment.shield || "",
      armor: equippedEquipment.armor || "",
      boots: equippedEquipment.boots || ""
    },
    characterName: String(data.characterName || "吳限勇者").slice(0, 12),
    activeAvatar: ownedAvatars.includes(data.activeAvatar) ? data.activeAvatar : "w",
    activeFrame: ownedFrames.includes(data.activeFrame) ? data.activeFrame : "plain"
  };
}

function weaponIcon(kind) {
  const icons = {
    "短劍": "🗡",
    "長劍": "⚔",
    "棍": "✦",
    "杖": "✧",
    "刀": "☽",
    "刺劍": "♢",
    "斧": "◈",
    "錘": "⬢",
    "魔棒": "✹",
    "軍刀": "◆",
    "短刃": "▴"
  };
  return icons[kind] || "武";
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function todayAdventure(source = adventure) {
  const key = todayKey();
  source.daily[key] ??= { attempts: 0, correct: 0, stars: 0, inspiration: 0 };
  return source.daily[key];
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
  const highSchool = highSchoolVocabulary.map((word) => baseWord({ ...word, series: word.series || HIGH_SCHOOL_SERIES }));
  const highFrequency = highFrequencyVocabulary.map((word) => baseWord({ ...word, series: word.series || HIGH_FREQUENCY_SERIES }));
  const custom = customWords.map((word) => baseWord({ ...word, series: word.series || CUSTOM_SERIES }));
  return [...base, ...junior, ...highSchool, ...highFrequency, ...custom];
}

function normalizeHeadword(value) {
  return String(value || "")
    .toLowerCase()
    .split(/[/(]/)[0]
    .replace(/[^a-z'-]/g, "")
    .trim();
}

function enrichHighSchoolWord(word, knownWords) {
  const known = knownWords.get(normalizeHeadword(word.word));
  if (!known) return word;
  const enriched = {
    ...word,
    translation: known.translation || word.translation,
    collocation: known.collocation || word.collocation,
    phrase: known.phrase || word.phrase,
    phraseTr: known.phraseTr || word.phraseTr,
    phraseExample: known.phraseExample || word.phraseExample,
    phraseExampleTr: known.phraseExampleTr || word.phraseExampleTr,
    example: known.example || word.example,
    exampleTr: known.exampleTr || word.exampleTr
  };
  if (enriched.translation && enriched.example && enriched.exampleTr) {
    enriched.referenceOnly = false;
  }
  return enriched;
}

function prepareHighSchoolVocabulary(source) {
  const knownWords = new Map();
  [...BASE_VOCABULARY, ...JUNIOR_1200_VOCABULARY, ...customWords].forEach((word) => {
    const key = normalizeHeadword(word.word);
    if (key && !knownWords.has(key) && word.translation && word.example && word.exampleTr) {
      knownWords.set(key, word);
    }
  });
  return source.map((word) => enrichHighSchoolWord(word, knownWords));
}

async function ensureSeriesLoaded(seriesValue) {
  if (seriesValue === HIGH_SCHOOL_SERIES) {
    await ensureLazySeriesLoaded({
      series: HIGH_SCHOOL_SERIES,
      label: "高中單字庫",
      path: "../data/highschool.js?v=v1.2-showcase-heroes",
      exportName: "HIGH_SCHOOL_VOCABULARY",
      apply: (items) => {
        highSchoolVocabulary = prepareHighSchoolVocabulary(items);
      }
    });
  }
  if (seriesValue === HIGH_FREQUENCY_SERIES) {
    await ensureLazySeriesLoaded({
      series: HIGH_FREQUENCY_SERIES,
      label: "高中高頻單字庫",
      path: "../data/highFrequency.js?v=v1.2-showcase-heroes",
      exportName: "HIGH_FREQUENCY_VOCABULARY",
      apply: (items) => {
        highFrequencyVocabulary = items;
      }
    });
  }
}

async function ensurePracticeSeriesLoaded(seriesValue) {
  if (seriesValue === "all") {
    await ensureSeriesLoaded(HIGH_FREQUENCY_SERIES);
    return;
  }
  await ensureSeriesLoaded(seriesValue);
}

async function ensureLazySeriesLoaded({ series, label, path, exportName, apply }) {
  if (loadedSeries.has(series)) return;
  if (!loadingSeries.has(series)) {
    toast(`正在載入${label}...`);
    loadingSeries.set(
      series,
      import(path).then((module) => {
        apply(module[exportName] || []);
        loadedSeries.add(series);
        words = buildWords();
        toast(`${label}已載入`);
      })
    );
  }
  await loadingSeries.get(series);
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
  const adventureUnlocks = recordAdventureProgress(isCorrect, { word, activity: options.activity || "practice" });
  words = buildWords();
  saveState();
  if (options.render !== false) {
    renderAll();
  }
  return {
    word: words.find((item) => item.id === wordId),
    previousProficiency,
    nextProficiency: current.proficiency,
    adventureUnlocks
  };
}

function recordAdventureProgress(isCorrect, { word, activity }) {
  const daily = todayAdventure();
  const baseInspiration = isCorrect ? 3 : 1;
  const baseStars = isCorrect ? 1 : 0;
  const flashBonus = activity === "flashcard" && isCorrect ? 1 : 0;

  adventure.inspiration += baseInspiration;
  adventure.stars += baseStars + flashBonus;
  adventure.totalEarnedStars += baseStars + flashBonus;
  adventure.currentStreak = isCorrect ? (adventure.currentStreak || 0) + 1 : 0;
  adventure.bestStreak = Math.max(adventure.bestStreak || 0, adventure.currentStreak || 0);
  adventure.lastActiveDate = todayKey();

  daily.attempts += 1;
  daily.correct += isCorrect ? 1 : 0;
  daily.stars += baseStars + flashBonus;
  daily.inspiration += baseInspiration;

  return unlockAdventureAchievements({ word });
}

function adventureLevelInfo() {
  const inspiration = Math.max(0, Number(adventure.inspiration) || 0);
  let level = 1;
  while (level < ADVENTURE_MAX_LEVEL && inspiration >= adventureEnergyForLevel(level + 1)) level += 1;
  const previousAt = adventureEnergyForLevel(level);
  const nextAt = level >= ADVENTURE_MAX_LEVEL ? previousAt : adventureEnergyForLevel(level + 1);
  const progress = level >= ADVENTURE_MAX_LEVEL || nextAt === previousAt
    ? 100
    : Math.round(((inspiration - previousAt) / (nextAt - previousAt)) * 100);
  return {
    level,
    inspiration,
    previousAt,
    nextAt,
    progress: Math.max(0, Math.min(100, progress)),
    remaining: Math.max(0, nextAt - inspiration),
    maxLevel: ADVENTURE_MAX_LEVEL
  };
}

function adventureRequirementForLevel(level) {
  return 30 + level * 8;
}

function adventureEnergyForLevel(level) {
  let total = 0;
  for (let current = 1; current < level; current += 1) {
    total += adventureRequirementForLevel(current);
  }
  return total;
}

function adventureStatsSnapshot() {
  const trackedStats = Object.values(stats).filter((item) => item && typeof item === "object");
  const attempts = trackedStats.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const correct = trackedStats.reduce((sum, item) => sum + (Number(item.correct) || 0), 0);
  const mastered = trackedStats.filter((item) => (Number(item.proficiency) || 0) >= 5).length;
  return { attempts, correct, mastered, adventure };
}

function unlockAdventureAchievements(context = {}) {
  const snapshot = adventureStatsSnapshot();
  const newlyUnlocked = [];
  ADVENTURE_ACHIEVEMENTS.forEach((achievement) => {
    if (adventure.achievements[achievement.id]) return;
    if (!achievement.test({ ...snapshot, ...context })) return;
    adventure.achievements[achievement.id] = {
      unlockedAt: Date.now(),
      reward: achievement.reward
    };
    adventure.stars += achievement.reward;
    adventure.totalEarnedStars += achievement.reward;
    newlyUnlocked.push(achievement);
  });
  return newlyUnlocked;
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
  const preferred = [DEFAULT_SERIES, JUNIOR_SERIES, HIGH_SCHOOL_SERIES, HIGH_FREQUENCY_SERIES, CUSTOM_SERIES];
  const available = new Set(words.map((word) => word.series || DEFAULT_SERIES));
  const ordered = preferred.filter((series) => series !== CUSTOM_SERIES || available.has(series));
  const remaining = [...available].filter((series) => !preferred.includes(series)).sort((a, b) => a.localeCompare(b));
  return [...ordered, ...remaining];
}

function fillSeriesSelect(select) {
  const current = select.value || "all";
  select.innerHTML = `<option value="all">全部系列</option>${getSeries()
    .map((series) => `<option value="${escapeAttr(series)}">${escapeHtml(series)}</option>`)
    .join("")}`;
  select.value = [...select.options].some((option) => option.value === current) ? current : "all";
}

function getUnits(seriesValue = "all") {
  if (seriesValue === HIGH_SCHOOL_SERIES && !loadedSeries.has(HIGH_SCHOOL_SERIES)) {
    return [1, 2, 3, 4, 5, 6];
  }
  if (seriesValue === HIGH_FREQUENCY_SERIES && !loadedSeries.has(HIGH_FREQUENCY_SERIES)) {
    return Array.from({ length: 26 }, (_, index) => index + 1);
  }
  const source = filteredBySeries(words, seriesValue);
  const units = [...new Set(source.map((word) => word.unit).filter(Boolean))].sort((a, b) => a - b);
  return units;
}

function fillUnitSelect(select, label = "全部單元", seriesValue = "all") {
  const current = select.value || "all";
  const hasCustom = filteredBySeries(words, seriesValue).some((word) => !word.unit);
  select.innerHTML = `<option value="all">${label}</option>${getUnits(seriesValue)
    .map((unit) => `<option value="${unit}">${escapeHtml(unitLabel(seriesValue, unit))}</option>`)
    .join("")}${hasCustom ? `<option value="custom">自訂單字</option>` : ""}`;
  select.value = [...select.options].some((option) => option.value === current) ? current : "all";
}

function unitLabel(seriesValue, unit) {
  if (seriesValue === HIGH_FREQUENCY_SERIES) {
    return `字母 ${String.fromCharCode(64 + Number(unit))}`;
  }
  return seriesValue === HIGH_SCHOOL_SERIES ? `Level ${unit}` : `Unit ${unit}`;
}

function wordUnitLabel(word) {
  if (!word.unit) return "自訂";
  return unitLabel(word.series || DEFAULT_SERIES, word.unit);
}

function questionUnitLabel(question) {
  if (!question.unit) return "自訂";
  return unitLabel(question.series || DEFAULT_SERIES, question.unit);
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
  const total = dashboardTotalWords();
  const trackedStats = Object.values(stats).filter((item) => item && typeof item === "object");
  const attempts = trackedStats.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const correct = trackedStats.reduce((sum, item) => sum + (Number(item.correct) || 0), 0);
  const levelCounts = dashboardLevelCounts(total, trackedStats);
  const mastered = levelCounts.mastered;
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;

  $("#totalWords").textContent = total;
  $("#masteredWords").textContent = mastered;
  $("#totalAttempts").textContent = attempts;
  $("#accuracyRate").textContent = `${accuracy}%`;

  const levels = [
    ["Lv.0 新單字", levelCounts.newWords, "#9aa5b1"],
    ["Lv.1-2 初學", levelCounts.learning, "#b7791f"],
    ["Lv.3-4 熟悉", levelCounts.familiar, "#235f9c"],
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

function renderAdventure() {
  const level = adventureLevelInfo();
  const today = todayAdventure();
  const snapshot = adventureStatsSnapshot();
  const unlockedCount = Object.keys(adventure.achievements || {}).length;
  const companion = companionInfo(today, snapshot, unlockedCount);

  $("#adventureLevel").textContent = `Lv.${level.level}`;
  $("#adventureStars").textContent = adventure.stars;
  $("#adventureInspiration").textContent = level.inspiration;
  $("#adventureStreak").textContent = adventure.currentStreak || 0;
  $("#adventureToday").textContent = `${today.attempts}/10`;
  $("#adventureNextLevel").textContent = level.level >= level.maxLevel
    ? `已抵達 Lv.${level.maxLevel}`
    : `${level.inspiration} / ${level.nextAt} · 還差 ${level.remaining}`;
  $("#adventureLevelBar").style.width = `${level.progress}%`;
  const avatar = activeAvatarItem();
  const frame = activeFrameItem();
  $("#companionAvatar").textContent = avatar.icon;
  $("#companionAvatar").dataset.mood = companion.mood;
  $("#companionAvatar").dataset.avatar = avatar.id;
  $("#companionAvatar").dataset.frame = frame.id;
  $("#companionTitle").textContent = companion.title;
  $("#companionMessage").textContent = companion.message;
  renderHeroRewards(avatar, frame);

  const missionGroups = adventureMissionGroups(today, snapshot, level);
  $("#adventureDailyTasks").innerHTML = missionGroups.map((group) => `
    <section class="mission-group">
      <h4>${escapeHtml(group.title)}</h4>
      ${group.tasks.map((task) => renderMissionTask(task)).join("")}
    </section>
  `).join("");
  $$("[data-claim-mission]").forEach((button) => {
    button.addEventListener("click", () => claimMissionReward(button.dataset.claimMission));
  });

  $("#adventureMap").innerHTML = adventureMapNodes(level)
    .map((node) => `
      <div class="map-node ${node.zoneClass}${node.done ? " is-done" : ""}${node.current ? " is-current" : ""}" aria-label="${escapeHtml(node.zoneTitle)} Lv.${node.level}">
        <span>${node.level}</span>
        <strong>${escapeHtml(node.title)}</strong>
        <small>${escapeHtml(node.text)}</small>
      </div>
    `)
    .join("");

  renderShop("#avatarShop", AVATAR_ITEMS, "avatar");
  renderShop("#frameShop", FRAME_ITEMS, "frame");
  renderEquipmentShop();
  $("#characterNameInput").value = adventure.characterName || "吳限勇者";
  $("#characterNameInput").onchange = (event) => {
    adventure.characterName = String(event.target.value || "吳限勇者").trim().slice(0, 12) || "吳限勇者";
    event.target.value = adventure.characterName;
    saveState();
  };
  $$("[data-shop-action]").forEach((button) => {
    button.addEventListener("click", () => handleShopAction(button.dataset.shopAction, button.dataset.itemId));
  });
  $$("[data-equipment-action]").forEach((button) => {
    button.addEventListener("click", () => handleEquipmentAction(button.dataset.equipmentAction, button.dataset.itemId));
  });

  const sortedAchievements = ADVENTURE_ACHIEVEMENTS
    .map((achievement, index) => {
      const unlocked = Boolean(adventure.achievements?.[achievement.id]);
      const progress = achievementProgress(achievement.id, snapshot, today);
      return { achievement, index, unlocked, progress };
    })
    .sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? 1 : -1;
      if (!a.unlocked && b.progress.pct !== a.progress.pct) return b.progress.pct - a.progress.pct;
      if (!a.unlocked && b.progress.current !== a.progress.current) return b.progress.current - a.progress.current;
      return a.index - b.index;
    });
  $("#achievementGrid").innerHTML = sortedAchievements.map(({ achievement, unlocked, progress }) => {
    const isShowcased = Array.isArray(adventure.showcaseBadges) && adventure.showcaseBadges.includes(achievement.id);
    const canShowcaseMore = (adventure.showcaseBadges?.length || 0) < 6;
    return `
      <div class="achievement-item${unlocked ? " is-unlocked" : ""}">
        <div class="achievement-icon badge-art badge-art-${escapeHtml(achievement.metric)}"><i data-lucide="${achievement.icon}"></i></div>
        <div>
          <strong>${escapeHtml(achievement.title)}</strong>
          <p>${escapeHtml(achievement.description)}</p>
          <small>${unlocked ? `已解鎖 · +${achievement.reward} 星星` : `未解鎖 · +${achievement.reward} 星星`}</small>
          <div class="achievement-progress">
            <div class="level-track"><span style="width:${progress.pct}%"></span></div>
            <span>${escapeHtml(progress.label)}</span>
          </div>
          ${unlocked ? `
            <button class="achievement-showcase-button${isShowcased ? " is-active" : ""}" type="button" data-showcase-badge="${escapeHtml(achievement.id)}">
              ${isShowcased ? "展示中" : canShowcaseMore ? "放到榮耀展示" : "替換展示"}
            </button>
          ` : ""}
        </div>
      </div>
    `;
  }).join("");
  $$("[data-showcase-badge]").forEach((button) => {
    button.addEventListener("click", () => toggleShowcaseBadge(button.dataset.showcaseBadge));
  });

  const heroText = unlockedCount
    ? `已解鎖 ${unlockedCount} 枚徽章，累積 ${snapshot.attempts} 次練習。`
    : "完成第一次練習後，第一枚徽章就會亮起來。";
  $(".adventure-hero p:last-child").textContent = heroText;
  if (window.lucide) window.lucide.createIcons();
}

function renderHeroRewards(avatar, frame) {
  const level = adventureLevelInfo();
  const equipped = $("#heroEquippedAvatar");
  equipped.textContent = avatar.icon;
  equipped.dataset.avatar = avatar.id;
  equipped.dataset.frame = frame.id;
  const skillList = AVATAR_SKILLS[avatar.id] || AVATAR_SKILLS.w;
  const skillIndex = Math.floor(Date.now() / 9000) % skillList.length;
  $("#characterSkillName").textContent = skillList[skillIndex];

  const equippedItems = EQUIPMENT_CATEGORIES
    .map((category) => ({
      ...category,
      item: EQUIPMENT_ITEMS.find((item) => item.id === adventure.equippedEquipment?.[category.id])
    }));
  $("#heroLoadout").innerHTML = equippedItems.map(({ id, title, item }) => `
    <div class="loadout-slot ${item ? `has-item equipment-${item.slot}` : ""}" title="${escapeHtml(item ? item.name : title)}">
      <span class="loadout-icon equipment-art equipment-${escapeHtml(item?.slot || id)} equipment-tier-${item ? equipmentTier(item) : 0}"></span>
      <small>${escapeHtml(item?.name || title)}</small>
    </div>
  `).join("");

  const unlockedBadges = ADVENTURE_ACHIEVEMENTS.filter((achievement) => adventure.achievements?.[achievement.id]);
  const selectedBadgeIds = (adventure.showcaseBadges || []).filter((id) => adventure.achievements?.[id]).slice(0, 6);
  const showcasedBadges = selectedBadgeIds.length
    ? selectedBadgeIds.map((id) => ADVENTURE_ACHIEVEMENTS.find((achievement) => achievement.id === id)).filter(Boolean)
    : unlockedBadges.slice(-6);

  $("#heroRewardShelf").innerHTML = showcasedBadges.length
    ? showcasedBadges.map((achievement) => `
      <div class="hero-reward badge-showcase badge-art badge-art-${escapeHtml(achievement.metric)}" title="${escapeHtml(achievement.title)}">
        <i data-lucide="${achievement.icon}"></i>
        <span>${escapeHtml(achievement.title)}</span>
      </div>
    `).join("")
    : `
      <div class="hero-reward reward-locked">?</div>
      <span class="hero-reward-hint">完成任務後，可以挑選徽章放到這裡展示。</span>
    `;

  const stats = characterStats(level.level, avatar);
  $("#heroStats").innerHTML = `
    <h4>角色數值</h4>
    <div class="hero-stat-grid hero-stat-grid-primary">
      ${RPG_STAT_LABELS.slice(0, 4).map(({ key, label, suffix }) => `
        <div class="hero-stat">
          <span>${escapeHtml(label)}</span>
          <strong>${stats[key]}${suffix || ""}</strong>
        </div>
      `).join("")}
    </div>
    <div class="hero-stat-grid hero-stat-grid-secondary">
      ${RPG_STAT_LABELS.slice(4).map(({ key, label, suffix }) => `
        <div class="hero-stat">
          <span>${escapeHtml(label)}</span>
          <strong>${stats[key]}${suffix || ""}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function toggleShowcaseBadge(badgeId) {
  if (!adventure.achievements?.[badgeId]) return;
  const current = Array.isArray(adventure.showcaseBadges) ? adventure.showcaseBadges.filter((id) => adventure.achievements?.[id]) : [];
  if (current.includes(badgeId)) {
    adventure.showcaseBadges = current.filter((id) => id !== badgeId);
  } else {
    adventure.showcaseBadges = current.length >= 6 ? [...current.slice(1), badgeId] : [...current, badgeId];
  }
  saveState();
  renderAdventure();
}

function slotIcon(slot) {
  return { weapon: "武", shield: "盾", armor: "甲", boots: "靴" }[slot] || "?";
}

function equipmentTier(item) {
  return Math.max(1, Math.min(5, Math.ceil((Number(item.cost) || 1) / 45)));
}

const RPG_STAT_LABELS = [
  { key: "hp", label: "HP" },
  { key: "mp", label: "MP" },
  { key: "atk", label: "攻擊" },
  { key: "def", label: "防禦" },
  { key: "hit", label: "命中", suffix: "%" },
  { key: "evade", label: "閃避", suffix: "%" },
  { key: "move", label: "移動" }
];

function characterStats(level, avatar) {
  const base = {
    hp: 80 + level * 8,
    mp: 28 + level * 3,
    atk: 10 + level * 2,
    def: 8 + level * 2,
    hit: Math.min(96, 78 + Math.floor(level / 3)),
    evade: Math.min(35, 5 + Math.floor(level / 5)),
    move: 3 + Math.floor(level / 20)
  };
  const total = addStats(base, avatar.stats || {});
  Object.values(adventure.equippedEquipment || {}).forEach((itemId) => {
    const item = EQUIPMENT_ITEMS.find((entry) => entry.id === itemId);
    if (item) addStats(total, equipmentStats(item));
  });
  total.hit = Math.max(40, Math.min(99, total.hit));
  total.evade = Math.max(0, Math.min(60, total.evade));
  return total;
}

function addStats(target, source) {
  RPG_STAT_LABELS.forEach(({ key }) => {
    target[key] = (Number(target[key]) || 0) + (Number(source[key]) || 0);
  });
  return target;
}

function equipmentStats(item) {
  const tier = Math.max(1, Math.ceil(item.cost / 24));
  const stats = { hp: 0, mp: 0, atk: 0, def: 0, hit: 0, evade: 0, move: 0 };
  if (item.slot === "weapon") {
    stats.atk = 2 + tier * 2;
    stats.hit = Math.min(8, tier);
  }
  if (item.slot === "shield") {
    stats.def = 2 + tier * 2;
    stats.evade = Math.min(6, Math.floor(tier / 2));
  }
  if (item.slot === "armor") {
    stats.hp = tier * 5;
    stats.def = 1 + tier * 2;
  }
  if (item.slot === "boots") {
    stats.evade = 1 + tier;
    stats.move = item.cost >= 120 ? 2 : item.cost >= 45 ? 1 : 0;
  }
  return stats;
}

function companionInfo(today, snapshot, unlockedCount) {
  if (!snapshot.attempts) {
    return {
      mood: "sleepy",
      title: "準備出發",
      message: "完成一個小練習，冒險就會開始。"
    };
  }
  if ((adventure.currentStreak || 0) >= 5) {
    return {
      mood: "spark",
      title: "能量連線中",
      message: "連續答對讓究極吳限能量整個亮起來了。"
    };
  }
  if (today.attempts >= 10) {
    return {
      mood: "done",
      title: "今天前進很多",
      message: "今日小探險已經完成，剩下的都是加分旅程。"
    };
  }
  if (unlockedCount > 0) {
    return {
      mood: "happy",
      title: "徽章亮起來了",
      message: "慢慢累積也很好，每一次練習都算數。"
    };
  }
  return {
    mood: "calm",
    title: "正在暖身",
    message: "答錯也沒關係，那只是提醒我們再看一次。"
  };
}

function adventureMapNodes(level) {
  return Array.from({ length: ADVENTURE_MAX_LEVEL }, (_, index) => {
    const nodeLevel = index + 1;
    const zone = ADVENTURE_MAP_ZONES.find((item) => nodeLevel >= item.from && nodeLevel <= item.to) || ADVENTURE_MAP_ZONES[0];
    const stageIndex = nodeLevel - zone.from;
    const stage = zone.stages?.[stageIndex] || `通過 ${zone.title}`;
    const done = nodeLevel <= level.level;
    const current = nodeLevel === level.level;
    return {
      level: nodeLevel,
      zoneTitle: zone.title,
      zoneClass: zone.className,
      title: stage,
      text: current ? `正在挑戰 ${zone.title}` : done ? "已完成這段旅程" : `抵達 Lv.${nodeLevel} 後解鎖`,
      done,
      current
    };
  });
}

function adventureMissionGroups(today, snapshot, level) {
  const consecutiveDays = adventureConsecutiveDays();
  const unlockedCount = Object.keys(adventure.achievements || {}).length;
  const todayId = todayKey();
  const missions = [
    {
      title: "每日型任務",
      tasks: [
        missionTask("daily_attempt_5", "每日", "完成 5 次練習", "先讓今天的學習開始流動。", today.attempts, 5, 5, todayId),
        missionTask("daily_correct_3", "每日", "答對 3 題", "不用一次全對，慢慢累積就好。", today.correct, 3, 6, todayId),
        missionTask("daily_flash_10", "每日", "取得 3 顆星星", "閃卡或題庫答對都可以累積星星。", today.stars, 3, 8, todayId)
      ]
    },
    {
      title: "多日連續型任務",
      tasks: [
        missionTask("streak_days_2", "連續", "連續學習 2 天", "每天一點點，比一次衝很多更穩。", consecutiveDays, 2, 12, "once"),
        missionTask("streak_days_5", "連續", "連續學習 5 天", "讓學習變成固定的小習慣。", consecutiveDays, 5, 25, "once"),
        missionTask("streak_correct_10", "連續", "連續答對 10 題", "進入專注狀態時，小夥伴會一起發光。", adventure.bestStreak || 0, 10, 18, "once")
      ]
    },
    {
      title: "累積型任務",
      tasks: [
        missionTask("total_attempt_50", "累積", "累積練習 50 次", "每一次點擊都算在冒險裡。", snapshot.attempts, 50, 30, "once"),
        missionTask("total_correct_30", "累積", "累積答對 30 題", "把會的單字慢慢變成自己的。", snapshot.correct, 30, 35, "once"),
        missionTask("level_10", "累積", "冒險等級 Lv.10", "抵達第一張地圖的終點。", level.level, 10, 45, "once"),
        missionTask("badge_3", "累積", "解鎖 3 枚徽章", "徽章收藏冊開始有故事了。", unlockedCount, 3, 40, "once")
      ]
    }
  ];
  return missions;
}

function missionTask(id, type, title, text, current, total, reward, period) {
  const safeCurrent = Math.min(Math.max(0, Number(current) || 0), total);
  const claimKey = missionClaimKey(id, period);
  const claimed = Boolean(adventure.missionClaims?.[claimKey]);
  return {
    id,
    type,
    title,
    text,
    current: safeCurrent,
    total,
    reward,
    period,
    claimKey,
    complete: safeCurrent >= total,
    claimed
  };
}

function missionClaimKey(id, period) {
  return `${id}:${period || "once"}`;
}

function renderMissionTask(task) {
  const pct = task.total ? Math.round((task.current / task.total) * 100) : 0;
  const buttonLabel = task.claimed ? "已領取" : task.complete ? `領取 +${task.reward}` : "進行中";
  return `
    <div class="daily-task mission-task${task.complete ? " is-done" : ""}${task.claimed ? " is-claimed" : ""}">
      <header>
        <strong><span>${escapeHtml(task.type)}</span>${escapeHtml(task.title)}</strong>
        <em>${task.current}/${task.total}</em>
      </header>
      <p>${escapeHtml(task.claimed ? "獎勵已收進星星袋。" : task.complete ? "完成了，可以領取星星。" : task.text)}</p>
      <div class="level-track"><span style="width:${pct}%"></span></div>
      <button type="button" data-claim-mission="${escapeHtml(task.claimKey)}" ${task.complete && !task.claimed ? "" : "disabled"}>${escapeHtml(buttonLabel)}</button>
    </div>
  `;
}

function claimMissionReward(claimKey) {
  const today = todayAdventure();
  const snapshot = adventureStatsSnapshot();
  const level = adventureLevelInfo();
  const task = adventureMissionGroups(today, snapshot, level).flatMap((group) => group.tasks).find((item) => item.claimKey === claimKey);
  if (!task || !task.complete || task.claimed) return;
  adventure.missionClaims[claimKey] = { claimedAt: Date.now(), reward: task.reward };
  adventure.stars += task.reward;
  adventure.totalEarnedStars += task.reward;
  saveState();
  renderAdventure();
}

function adventureConsecutiveDays() {
  const activeDays = new Set(
    Object.entries(adventure.daily || {})
      .filter(([, value]) => (Number(value?.attempts) || 0) > 0)
      .map(([key]) => key)
  );
  let count = 0;
  const cursor = new Date(`${todayKey()}T00:00:00`);
  while (activeDays.has(cursor.toISOString().slice(0, 10))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function activeAvatarItem() {
  return AVATAR_ITEMS.find((item) => item.id === adventure.activeAvatar) || AVATAR_ITEMS[0];
}

function activeFrameItem() {
  return FRAME_ITEMS.find((item) => item.id === adventure.activeFrame) || FRAME_ITEMS[0];
}

function renderShop(selector, items, type) {
  const ownedKey = type === "avatar" ? "ownedAvatars" : "ownedFrames";
  const activeKey = type === "avatar" ? "activeAvatar" : "activeFrame";
  $(selector).innerHTML = items.map((item) => {
    const owned = adventure[ownedKey].includes(item.id);
    const active = adventure[activeKey] === item.id;
    const canBuy = adventure.stars >= item.cost;
    const action = owned ? `equip-${type}` : `buy-${type}`;
    const label = active ? "使用中" : owned ? "裝備" : `${item.cost} 星星`;
    const previewContent = type === "avatar" ? escapeHtml(item.icon) : '<span class="frame-inner">W</span>';
    return `
      <div class="shop-item${active ? " is-active" : ""}">
        <div class="shop-preview ${type === "avatar" ? item.className || "" : `frame-preview ${item.className || ""}`}">${previewContent}</div>
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <small>${owned ? "已解鎖" : `需要 ${item.cost} 星星`}</small>
        </div>
        <button type="button" data-shop-action="${action}" data-item-id="${escapeHtml(item.id)}" ${active || (!owned && !canBuy) ? "disabled" : ""}>${escapeHtml(label)}</button>
      </div>
    `;
  }).join("");
}

function handleShopAction(action, itemId) {
  if (action === "buy-avatar") buyShopItem(itemId, AVATAR_ITEMS, "ownedAvatars", "activeAvatar");
  if (action === "buy-frame") buyShopItem(itemId, FRAME_ITEMS, "ownedFrames", "activeFrame");
  if (action === "equip-avatar") adventure.activeAvatar = itemId;
  if (action === "equip-frame") adventure.activeFrame = itemId;
  saveState();
  renderAdventure();
}

function buyShopItem(itemId, items, ownedKey, activeKey) {
  const item = items.find((entry) => entry.id === itemId);
  if (!item || adventure[ownedKey].includes(item.id) || adventure.stars < item.cost) return;
  adventure.stars -= item.cost;
  adventure[ownedKey].push(item.id);
  adventure[activeKey] = item.id;
}

function renderEquipmentShop() {
  $("#equipmentShop").innerHTML = EQUIPMENT_CATEGORIES.map((category) => {
    const items = EQUIPMENT_ITEMS.filter((item) => item.slot === category.id);
    return `
      <section class="equipment-category">
        <h5>${escapeHtml(category.title)}</h5>
        <div class="equipment-list">
          ${items.map((item) => renderEquipmentItem(item)).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function renderEquipmentItem(item) {
  const owned = adventure.ownedEquipment.includes(item.id);
  const active = adventure.equippedEquipment?.[item.slot] === item.id;
  const canBuy = adventure.stars >= item.cost;
  const label = active ? "裝備中" : owned ? "裝備" : `${item.cost} 星星`;
  const action = owned ? "equip" : "buy";
  return `
    <div class="equipment-item${active ? " is-active" : ""}">
      <div class="equipment-icon equipment-art equipment-${escapeHtml(item.slot)} equipment-tier-${equipmentTier(item)}" aria-hidden="true"></div>
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <small>${owned ? "已擁有" : `需要 ${item.cost} 星星`}</small>
      </div>
      <button type="button" data-equipment-action="${action}" data-item-id="${escapeHtml(item.id)}" ${active || (!owned && !canBuy) ? "disabled" : ""}>${escapeHtml(label)}</button>
    </div>
  `;
}

function handleEquipmentAction(action, itemId) {
  const item = EQUIPMENT_ITEMS.find((entry) => entry.id === itemId);
  if (!item) return;
  if (action === "buy") {
    if (adventure.ownedEquipment.includes(item.id) || adventure.stars < item.cost) return;
    adventure.stars -= item.cost;
    adventure.ownedEquipment.push(item.id);
  }
  if (adventure.ownedEquipment.includes(item.id)) {
    adventure.equippedEquipment[item.slot] = item.id;
  }
  saveState();
  renderAdventure();
}

function achievementValue(achievement, snapshot = adventureStatsSnapshot()) {
  const daily = todayAdventure(snapshot.adventure || adventure);
  const level = adventureLevelInfo();
  const metricMap = {
    attempts: Number(snapshot.attempts) || 0,
    correct: Number(snapshot.correct) || 0,
    mastered: Number(snapshot.mastered) || 0,
    bestStreak: Math.max(Number(adventure.bestStreak) || 0, Number(adventure.currentStreak) || 0),
    todayAttempts: Number(daily.attempts) || 0,
    todayCorrect: Number(daily.correct) || 0,
    todayStars: Number(daily.stars) || 0,
    inspiration: Number(adventure.inspiration) || 0,
    level: Number(level.level) || 1,
    ownedAvatars: Array.isArray(adventure.ownedAvatars) ? adventure.ownedAvatars.length : 0,
    ownedFrames: Array.isArray(adventure.ownedFrames) ? adventure.ownedFrames.length : 0,
    ownedEquipment: Array.isArray(adventure.ownedEquipment) ? adventure.ownedEquipment.length : 0,
    totalEarnedStars: Number(adventure.totalEarnedStars) || 0
  };
  return metricMap[achievement.metric] ?? 0;
}

function achievementProgress(id, snapshot, today) {
  const achievement = ADVENTURE_ACHIEVEMENTS.find((entry) => entry.id === id);
  const total = Math.max(1, Number(achievement?.target) || 1);
  const current = Math.min(total, achievement ? achievementValue(achievement, snapshot) : 0);
  return {
    current,
    total,
    pct: total ? Math.round((current / total) * 100) : 0,
    label: `${current}/${total}`
  };
}

function dashboardTotalWords() {
  const catalogTotal = Object.values(SERIES_WORD_COUNTS).reduce((sum, count) => sum + count, 0);
  return catalogTotal + customWords.length;
}

function dashboardLevelCounts(total, trackedStats) {
  const counts = {
    newWords: total,
    learning: 0,
    familiar: 0,
    mastered: 0
  };

  trackedStats.forEach((item) => {
    const proficiency = Math.max(0, Math.min(5, Number(item.proficiency) || 0));
    if (proficiency <= 0) return;
    counts.newWords = Math.max(0, counts.newWords - 1);
    if (proficiency <= 2) counts.learning += 1;
    else if (proficiency <= 4) counts.familiar += 1;
    else counts.mastered += 1;
  });

  return counts;
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
  if (tabName === "practice") {
    ensurePracticeSeriesLoaded($("#practiceSeries").value || "all").then(() => {
      refreshUnitSelectFor("#practiceSeries", "#practiceUnit");
      nextQuestion();
    });
  }
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
  $("#spellPanel").hidden = ($("#flashMode")?.value || "standard") !== "spelling";
  $("#spellAnswer").value = "";
  $("#spellResult").textContent = "";
  if (!flashList.length) {
    $("#flashWord").textContent = "沒有單字";
    return;
  }
  const word = flashList[flashIndex];
  const mode = $("#flashMode")?.value || "standard";
  $("#flashProgress").textContent = `${flashIndex + 1} / ${flashList.length}`;
  $("#flashBadge").textContent = `${word.series || DEFAULT_SERIES} · ${wordUnitLabel(word)} · Lv.${word.proficiency || 0}`;
  if (mode === "reverse") {
    $("#flashWord").textContent = word.translation || "中文提示";
    $("#flashPhonetic").textContent = "";
    $("#flashPos").textContent = "中文猜英文";
  } else if (mode === "listening") {
    $("#flashWord").textContent = "聽力模式";
    $("#flashPhonetic").textContent = "先按發音，再翻面確認";
    $("#flashPos").textContent = word.pos || "";
  } else if (mode === "spelling") {
    $("#flashWord").textContent = word.translation || "拼字提示";
    $("#flashPhonetic").textContent = word.phonetic || "";
    $("#flashPos").textContent = "拼字";
  } else {
    $("#flashWord").textContent = word.word;
    $("#flashPhonetic").textContent = word.phonetic || "";
    $("#flashPos").textContent = word.pos || "";
  }
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
  if (mode === "spelling") window.setTimeout(() => $("#spellAnswer")?.focus(), 0);
}

function speechTextFor(text) {
  return (text || "")
    .replace(/\s*\/\s*/g, ", ")
    .replace(/\([^)]*\)/g, "")
    .replace(/_{2,}/g, "")
    .trim();
}

function speechApi() {
  return "speechSynthesis" in window ? window.speechSynthesis : null;
}

function loadSpeechVoices() {
  const synth = speechApi();
  if (!synth) return [];
  const voices = synth.getVoices();
  if (!speechVoiceLoadStarted) {
    speechVoiceLoadStarted = true;
    synth.onvoiceschanged = () => synth.getVoices();
  }
  return voices;
}

function speechVoiceFor(lang) {
  const voices = loadSpeechVoices();
  if (!voices.length) return null;
  const langPrefix = lang.split("-")[0].toLowerCase();
  return (
    voices.find((voice) => voice.lang.toLowerCase() === lang.toLowerCase()) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(langPrefix)) ||
    null
  );
}

function makeUtterance(text, lang = "en-US") {
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = lang.startsWith("zh") ? 0.95 : 0.85;
  utterance.pitch = 1;
  const voice = speechVoiceFor(lang);
  if (voice) utterance.voice = voice;
  return utterance;
}

function stopSpeech() {
  speechApi()?.cancel();
}

function canSpeak() {
  if (!speechApi() || typeof window.SpeechSynthesisUtterance === "undefined") {
    toast("這個瀏覽器不支援發音");
    return false;
  }
  loadSpeechVoices();
  return true;
}

function unlockSpeech() {
  const synth = speechApi();
  if (!synth || typeof window.SpeechSynthesisUtterance === "undefined" || speechUnlocked) return;
  try {
    synth.resume?.();
    const utterance = new window.SpeechSynthesisUtterance(" ");
    utterance.volume = 0;
    synth.speak(utterance);
    speechUnlocked = true;
  } catch {
    speechUnlocked = false;
  }
}

function enableSpeechManually() {
  if (!canSpeak()) return;
  unlockSpeech();
  loadSpeechVoices();
  toast(speechUnlocked ? "發音已啟用" : "請再點一次發音按鈕啟用");
}

function speakUtterance(utterance) {
  const synth = speechApi();
  if (!synth) return false;
  unlockSpeech();
  synth.cancel();
  synth.resume?.();
  synth.speak(utterance);
  if (synth.paused) synth.resume?.();
  return true;
}

function speakText(rawText, label, message) {
  if (!canSpeak()) return false;
  const text = speechTextFor(rawText);
  if (!text) return false;

  speakUtterance(makeUtterance(text, "en-US"));
  toast(message || `播放發音：${label || text}`);
  return true;
}

function speakTextAsync(rawText, lang = "en-US") {
  if (!canSpeak()) return Promise.resolve(false);
  const text = speechTextFor(rawText);
  if (!text) return Promise.resolve(false);

  return new Promise((resolve) => {
    const utterance = makeUtterance(text, lang);
    const fallbackMs = Math.min(12000, Math.max(1800, text.length * (lang.startsWith("zh") ? 190 : 95)));
    let finished = false;
    const done = (result) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      resolve(result);
    };
    const timer = window.setTimeout(() => done(true), fallbackMs);
    utterance.onend = () => done(true);
    utterance.onerror = () => done(false);
    speakUtterance(utterance);
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
  const mode = $("#flashMode")?.value || "standard";
  const rawText = isBack && word.example ? word.example : word.word;
  speakText(rawText, word.word, isBack ? "播放例句發音" : `播放發音：${word.word}`);
  if (mode === "listening" && !isBack) toast("聽完後可以翻面確認答案");
}

function checkSpellingAnswer() {
  if (!flashList.length) return;
  const answer = $("#spellAnswer").value.trim();
  const word = flashList[flashIndex];
  const isCorrect = normalize(answer) === normalize(word.word);
  $("#spellResult").textContent = isCorrect ? "拼對了" : `再試一次，正確拼法是 ${word.word}`;
  recordFlashcard(isCorrect);
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

  const result = updateWordStats(currentWordId, isCorrect, { render: false, activity: "flashcard" });
  const updatedWord = result?.word || words.find((word) => word.id === currentWordId) || flashList[currentIndex];
  flashList[currentIndex] = updatedWord;
  renderDashboard();
  renderAdventure();
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
  const unlockText = result?.adventureUnlocks?.length ? `｜徽章亮起：${result.adventureUnlocks[0].title}` : "";
  toast(`${currentWordLabel} ${isCorrect ? randomEncouragement() : "還不熟"}：Lv.${previous} → Lv.${next}${unlockText}`);
}

function beginFlashDrag(event) {
  if (event.pointerType === "touch" && event.isPrimary === false) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  startFlashDrag(event.pointerId, event.clientX, event.clientY);
  $("#flashcard").setPointerCapture?.(event.pointerId);
}

function startFlashDrag(id, startX, startY) {
  stopAutoPlay();
  flashDrag = {
    id,
    startX,
    startY,
    moved: false
  };
}

function moveFlashDrag(event) {
  updateFlashDrag(event.pointerId, event.clientX, event.clientY, event);
}

function updateFlashDrag(id, clientX, clientY, event) {
  if (!flashDrag || flashDrag.id !== id) return;
  const dx = clientX - flashDrag.startX;
  const dy = clientY - flashDrag.startY;
  if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
  flashDrag.moved = true;
  if (Math.abs(dx) > Math.abs(dy)) event?.preventDefault?.();

  const card = $("#flashcard");
  const rotate = Math.max(-10, Math.min(10, dx / 18));
  card.classList.add("is-dragging");
  card.dataset.swipe = dx > 24 ? "known" : dx < -24 ? "unknown" : "";
  card.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
}

function endFlashDrag(event) {
  finishFlashDrag(event.pointerId, event.clientX);
}

function finishFlashDrag(id, clientX) {
  if (!flashDrag || flashDrag.id !== id) return;
  const dx = clientX - flashDrag.startX;
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

function beginFlashTouch(event) {
  if (window.PointerEvent) return;
  if (event.touches.length !== 1) return;
  const touch = event.touches[0];
  startFlashDrag("touch", touch.clientX, touch.clientY);
}

function moveFlashTouch(event) {
  if (window.PointerEvent) return;
  if (!flashDrag || flashDrag.id !== "touch" || event.touches.length !== 1) return;
  const touch = event.touches[0];
  updateFlashDrag("touch", touch.clientX, touch.clientY, event);
}

function endFlashTouch(event) {
  if (window.PointerEvent) return;
  const touch = event.changedTouches?.[0];
  if (!touch) return;
  finishFlashDrag("touch", touch.clientX);
}

function cancelFlashDrag() {
  flashDrag = null;
  $("#flashcard").classList.remove("is-dragging");
  $("#flashcard").dataset.swipe = "";
  $("#flashcard").style.transform = "";
}

function generatedQuestions() {
  return words.flatMap((word) => {
    if (word.referenceOnly) return [];
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
        if (phrase.phraseTr) {
          questions.push({
            id: `auto-${word.id}-phrase-zh-to-en`,
            series: word.series || DEFAULT_SERIES,
            unit: word.unit,
            type: "mcq",
            difficulty: "auto",
            targetWord: word.word,
            prompt: `「${phrase.phraseTr}」對應哪個英文片語？`,
            options: phraseOptions,
            answer: phrase.phrase,
            explanation: `${phrase.phrase} 的意思是「${phrase.phraseTr}」。${phrase.phraseExample ? `片語例句：${phrase.phraseExample}${phrase.phraseExampleTr ? `（${phrase.phraseExampleTr}）` : ""}` : ""}`
          });
        }

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

      const phraseExamplePrompt = blankPhraseExampleFor(phrase);
      if (phraseExamplePrompt) {
        questions.push({
          id: `auto-${word.id}-phrase-fill`,
          series: word.series || DEFAULT_SERIES,
          unit: word.unit,
          type: "fill",
          difficulty: "auto",
          targetWord: word.word,
          prompt: phraseExamplePrompt,
          choices: buildFillChoices({ word: phrase.phrase }, phraseOptions),
          answer: phrase.phrase,
          explanation: `${phrase.phrase} 是片語${phrase.phraseTr ? `，意思是「${phrase.phraseTr}」` : ""}。片語例句：${phrase.phraseExample}${phrase.phraseExampleTr ? `（${phrase.phraseExampleTr}）` : ""}`
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

function blankPhraseExampleFor(phrase) {
  if (!phrase.phraseExample || !phrase.phrase) return "";
  const escaped = phrase.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  const prompt = phrase.phraseExample.replace(new RegExp(`\\b${escaped}\\b`, "gi"), "____");
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
  const scope = $("#practiceScope")?.value || "all";
  let pool = [
    ...QUESTION_BANK.map((question) => ({ ...question, series: question.series || DEFAULT_SERIES })),
    ...generatedQuestions()
  ].map(normalizeQuestion);
  if (series !== "all") pool = pool.filter((question) => (question.series || DEFAULT_SERIES) === series);
  if (unit !== "all") pool = pool.filter((question) => String(question.unit) === unit || (unit === "custom" && !question.unit));
  if (mode !== "mixed") pool = pool.filter((question) => question.type === mode);
  if (scope !== "all") pool = pool.filter((question) => questionMatchesPracticeScope(question, scope));
  return pool;
}

function questionTargetWord(question) {
  return wordKeyFromText(question.targetWord || question.answer, question.unit, question.series || "all");
}

function questionMatchesPracticeScope(question, scope) {
  const word = questionTargetWord(question);
  if (!word) return false;
  if (scope === "wrong") return word.lastResult === "wrong";
  if (scope === "recentWrong") {
    const reviewedAt = Number(word.lastReviewed || 0);
    return word.lastResult === "wrong" && reviewedAt && Date.now() - reviewedAt <= 7 * 24 * 60 * 60 * 1000;
  }
  if (scope === "weak") return (word.proficiency || 0) <= 1 || (word.total > 0 && accuracyFor(word) < 70);
  return true;
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
    card.innerHTML = "<h3>目前沒有符合條件的題目</h3><p>可以切換單元、題型或錯題篩選後再試一次。</p>";
    return;
  }

  const label = `${currentQuestion.series || DEFAULT_SERIES} · ${questionUnitLabel(currentQuestion)} · ${currentQuestion.type === "fill" ? "填空題" : "選擇題"}`;
  const choiceText = currentQuestion.choices?.length ? `<p>小提示：${formatChoices(currentQuestion)}</p>` : "";

  if (currentQuestion.type === "fill") {
    card.innerHTML = `
      <h3>${escapeHtml(label)}</h3>
      ${choiceText}
      <div class="question-prompt">${escapeHtml(currentQuestion.prompt)}</div>
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
      <h3>${escapeHtml(label)}</h3>
      <div class="question-prompt">${escapeHtml(currentQuestion.prompt)}</div>
      <div class="choice-list">
        ${currentQuestion.options.map((option) => `<button type="button" data-option="${escapeAttr(option)}">${escapeHtml(option)}</button>`).join("")}
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
  const choices = Array.isArray(question.choices) ? question.choices.map(cleanQuestionText) : [];
  const answer = cleanQuestionText(question.answer || "");
  const hasAnswer = choices.some((choice) => normalize(choice) === normalize(answer));

  if (answer && !hasAnswer) {
    choices.unshift(answer);
  }

  return uniqueOptions(choices);
}

function answerUsesChangedForm(question) {
  if (!question.targetWord || !question.answer) return false;
  return normalize(question.targetWord) !== normalize(question.answer);
}

function checkQuestion(answer) {
  if (!currentQuestion) return;
  const isCorrect = normalize(answer) === normalize(currentQuestion.answer);
  const target = wordKeyFromText(currentQuestion.targetWord || currentQuestion.answer, currentQuestion.unit, currentQuestion.series || "all");
  const statResult = target ? updateWordStats(target.id, isCorrect, { activity: "practice" }) : null;

  const result = $("#questionResult");
  result.className = `result-box${isCorrect ? "" : " is-wrong"}`;
  result.innerHTML = `<strong>${escapeHtml(isCorrect ? "答對了" : `答錯了，正解是 ${currentQuestion.answer}`)}</strong><p>${escapeHtml(currentQuestion.explanation)}</p>`;
  const unlockText = statResult?.adventureUnlocks?.length ? `，徽章亮起：${statResult.adventureUnlocks[0].title}` : "";
  toast(isCorrect ? `已記錄答對${unlockText}` : `已記錄答錯${unlockText}`);
}

function normalizeQuestion(question) {
  return {
    ...question,
    prompt: cleanQuestionText(question.prompt),
    answer: cleanQuestionText(question.answer),
    explanation: cleanQuestionText(question.explanation),
    choices: Array.isArray(question.choices) ? uniqueOptions(question.choices.map(cleanQuestionText)) : question.choices,
    options: Array.isArray(question.options) ? uniqueOptions(question.options.map(cleanQuestionText)) : question.options
  };
}

function cleanQuestionText(value) {
  return String(value || "")
    .replace(/([A-Za-z])\s+-\s*([A-Za-z])/g, "$1-$2")
    .replace(/([A-Za-z])\s*-\s+([A-Za-z])/g, "$1-$2")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalize(value) {
  return cleanQuestionText(value).toLowerCase();
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

function issueItem(type, word, message) {
  return {
    type,
    word: word?.word || "",
    series: word?.series || DEFAULT_SERIES,
    unit: word?.unit || null,
    message
  };
}

function selectedAuditWords() {
  const series = $("#auditSeries")?.value || "all";
  const unit = $("#auditUnit")?.value || "all";
  return filteredBySeriesAndUnit(words, series, unit);
}

function dataHealthReport() {
  const scopedWords = selectedAuditWords();
  const auditSeries = $("#auditSeries")?.value || "all";
  const auditUnit = $("#auditUnit")?.value || "all";
  const issues = [];
  const warnings = [];
  const duplicateMap = new Map();

  scopedWords.forEach((word) => {
    const required = word.referenceOnly
      ? [
          ["英文單字", word.word],
          ["詞性", word.pos]
        ]
      : [
          ["英文單字", word.word],
          ["中文翻譯", word.translation],
          ["詞性", word.pos],
          ["英文例句", word.example],
          ["例句翻譯", word.exampleTr]
        ];
    required.forEach(([label, value]) => {
      if (!String(value || "").trim()) issues.push(issueItem("缺資料", word, `缺少${label}`));
    });

    [
      ["英文單字", word.word],
      ["英文例句", word.example],
      ["片語", word.phrase || word.collocation],
      ["片語例句", word.phraseExample]
    ].forEach(([label, value]) => {
      if (hasHyphenSpacing(value)) issues.push(issueItem("格式", word, `${label} 有多餘連字號空格`));
    });

    const phrase = phraseInfo(word);
    if (phrase.phrase && !phrase.phraseTr) issues.push(issueItem("片語", word, `片語「${phrase.phrase}」缺少中文解釋`));
    if (phrase.phrase && !phrase.phraseExample) issues.push(issueItem("片語", word, `片語「${phrase.phrase}」缺少片語例句`));
    if (phrase.phrase && phrase.phraseExample && !phraseExampleUsesPhrase(phrase.phrase, phrase.phraseExample)) {
      issues.push(issueItem("片語", word, `片語例句沒有使用「${phrase.phrase}」`));
    }
    if (phrase.phraseExample && !phrase.phraseExampleTr) issues.push(issueItem("片語", word, "片語例句缺少中文翻譯"));

    if (!word.referenceOnly && word.example && word.word && !exampleUsesWord(word.word, word.example)) {
      warnings.push(issueItem("例句提醒", word, `單字例句可能沒有使用「${word.word}」`));
    }
    if (word.needsReview) {
      warnings.push(issueItem("OCR校正", word, word.reviewNote || "OCR 匯入資料建議人工確認"));
    }

    const key = `${word.series || DEFAULT_SERIES}::${normalizeText(word.word)}`;
    duplicateMap.set(key, [...(duplicateMap.get(key) || []), word]);
  });

  duplicateMap.forEach((items) => {
    if (items.length > 1) {
      items.forEach((word) => warnings.push(issueItem("重複提醒", word, `同系列有重複單字「${word.word}」`)));
    }
  });

  let allQuestions = [
    ...QUESTION_BANK.map((question) => ({ ...question, series: question.series || DEFAULT_SERIES })),
    ...generatedQuestions()
  ].map(normalizeQuestion);
  if (auditSeries !== "all") allQuestions = allQuestions.filter((question) => (question.series || DEFAULT_SERIES) === auditSeries);
  if (auditUnit !== "all") allQuestions = allQuestions.filter((question) => String(question.unit) === auditUnit || (auditUnit === "custom" && !question.unit));
  const questionIssues = allQuestions.flatMap((question) => {
    const result = [];
    if (!String(question.answer || "").trim()) result.push(`題目 ${question.id || ""} 缺少答案`);
    if (!String(question.explanation || "").trim()) result.push(`題目 ${question.id || ""} 缺少詳解`);
    if (question.type === "mcq") {
      const options = Array.isArray(question.options) ? question.options : [];
      const normalizedOptions = options.map(normalize);
      if (!options.length) result.push(`選擇題 ${question.id || ""} 缺少選項`);
      if (question.answer && !normalizedOptions.includes(normalize(question.answer))) result.push(`選擇題 ${question.id || ""} 選項沒有正確答案`);
      if (new Set(normalizedOptions).size !== normalizedOptions.length) result.push(`選擇題 ${question.id || ""} 有重複選項`);
    }
    if (question.type === "fill") {
      const choices = ensureAnswerInChoices(question);
      if (question.answer && !choices.some((choice) => normalize(choice) === normalize(question.answer))) {
        result.push(`填空題 ${question.id || ""} 小提示沒有正確答案`);
      }
    }
    return result;
  });

  return {
    totalWords: scopedWords.length,
    totalQuestions: allQuestions.length,
    issues,
    warnings,
    questionIssues
  };
}

function renderAudit() {
  const reportBox = $("#auditReport");
  if (!reportBox) return;
  const report = dataHealthReport();
  const grouped = ["缺資料", "格式", "片語"].map((type) => ({
    type,
    items: report.issues.filter((issue) => issue.type === type)
  }));
  const warningGrouped = ["OCR校正", "例句提醒", "重複提醒"].map((type) => ({
    type,
    items: report.warnings.filter((issue) => issue.type === type)
  }));
  const issueTotal = report.issues.length + report.questionIssues.length;
  const warningTotal = report.warnings.length;

  reportBox.innerHTML = `
    <div class="audit-summary">
      <div><strong>${report.totalWords}</strong><span>已載入檢查單字</span></div>
      <div><strong>${report.totalQuestions}</strong><span>可練習題</span></div>
      <div class="${issueTotal ? "is-warning" : "is-ok"}"><strong>${issueTotal}</strong><span>待修項目</span></div>
      <div><strong>${warningTotal}</strong><span>提醒</span></div>
    </div>
    <div class="audit-grid">
      ${grouped
        .map(
          ({ type, items }) => `
          <article class="audit-card">
            <h3>${type}<span>${items.length}</span></h3>
            ${items.length ? renderAuditList(items) : `<p class="audit-empty">目前沒有發現問題</p>`}
          </article>
        `
        )
        .join("")}
      <article class="audit-card">
        <h3>題庫<span>${report.questionIssues.length}</span></h3>
        ${
          report.questionIssues.length
            ? `<ul>${report.questionIssues.slice(0, 30).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>${report.questionIssues.length > 30 ? `<p class="audit-more">另有 ${report.questionIssues.length - 30} 筆</p>` : ""}`
            : `<p class="audit-empty">目前沒有發現問題</p>`
        }
      </article>
      ${warningGrouped
        .map(
          ({ type, items }) => `
          <article class="audit-card">
            <h3>${type}<span>${items.length}</span></h3>
            ${items.length ? renderAuditList(items) : `<p class="audit-empty">目前沒有提醒</p>`}
          </article>
        `
        )
        .join("")}
    </div>
  `;
}

function renderAuditList(items) {
  return `<ul>${items
    .slice(0, 30)
    .map(
      (issue) => `
        <li>
          <strong>${escapeHtml(issue.word)}</strong>
          <span>${escapeHtml(issue.series)}${issue.unit ? ` · ${escapeHtml(unitLabel(issue.series, issue.unit))}` : ""}</span>
          <p>${escapeHtml(issue.message)}</p>
        </li>
      `
    )
    .join("")}</ul>${items.length > 30 ? `<p class="audit-more">另有 ${items.length - 30} 筆</p>` : ""}`;
}

function renderLibrary() {
  const series = $("#librarySeries").value || "all";
  const unit = $("#libraryUnit").value || "all";
  const filter = $("#libraryFilter")?.value || "all";
  const query = $("#searchWord").value.trim().toLowerCase();
  let list = filteredBySeriesAndUnit(words, series, unit);
  if (query) {
    list = list.filter((word) => {
      const phrase = phraseInfo(word);
      return `${word.word} ${word.translation} ${phrase.phrase} ${phrase.phraseTr} ${word.exampleTr || ""}`.toLowerCase().includes(query);
    });
  }
  if (filter !== "all") {
    list = list.filter((word) => {
      const phrase = phraseInfo(word);
      if (filter === "phrases") return Boolean(phrase.phrase);
      if (filter === "missingExamples") return !word.example || !word.exampleTr;
      if (filter === "new") return (word.proficiency || 0) === 0;
      if (filter === "wrong") return word.lastResult === "wrong";
      return true;
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
          <span class="tag">${escapeHtml(wordUnitLabel(word))}</span>
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

function cleanCustomDataValue(value) {
  return String(value || "")
    .replace(/([A-Za-z])\s+-\s*([A-Za-z])/g, "$1-$2")
    .replace(/([A-Za-z])\s*-\s+([A-Za-z])/g, "$1-$2")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/^[\s-]+(?=[\u4e00-\u9fff])/u, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function fixCommonDataIssues() {
  if (!customWords.length) {
    toast("目前沒有自訂或匯入單字可自動修正");
    return;
  }
  let changed = 0;
  customWords = customWords.map((word) => {
    const next = { ...word };
    ["word", "translation", "pos", "phonetic", "phrase", "phraseTr", "phraseExample", "phraseExampleTr", "example", "exampleTr"].forEach((key) => {
      const cleaned = cleanCustomDataValue(next[key]);
      if ((next[key] || "") !== cleaned) changed += 1;
      next[key] = cleaned;
    });
    return next;
  });
  saveState();
  words = buildWords();
  setupUnitSelects();
  renderAll();
  toast(changed ? `已修正 ${changed} 個格式問題` : "沒有找到需要自動修正的格式問題");
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
    stats,
    adventure
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
  adventure = normalizeAdventure(payload.adventure || adventure);
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
  fillSeriesSelect($("#auditSeries"));
  fillUnitSelect($("#flashUnit"), "全部單元", $("#flashSeries").value || "all");
  fillUnitSelect($("#practiceUnit"), "全部單元", $("#practiceSeries").value || "all");
  fillUnitSelect($("#libraryUnit"), "全部單元", $("#librarySeries").value || "all");
  fillUnitSelect($("#auditUnit"), "全部單元", $("#auditSeries").value || "all");
}

function refreshUnitSelectFor(seriesSelector, unitSelector) {
  fillUnitSelect($(unitSelector), "全部單元", $(seriesSelector).value || "all");
}

function renderAll() {
  renderDashboard();
  renderAdventure();
  renderLibrary();
  renderAudit();
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
  loadSpeechVoices();
  ["pointerdown", "touchstart", "click"].forEach((eventName) => {
    document.addEventListener(eventName, unlockSpeech, { once: true, passive: true });
  });
  setupTabs();
  setupUnitSelects();
  renderAll();
  nextQuestion();

  $("#flashSeries").addEventListener("change", async () => {
    stopAutoPlay();
    await ensureSeriesLoaded($("#flashSeries").value || "all");
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
  $("#flashMode").addEventListener("change", () => {
    stopAutoPlay();
    renderFlashcard();
  });
  $("#flashcard").addEventListener("pointerdown", beginFlashDrag);
  $("#flashcard").addEventListener("pointermove", moveFlashDrag);
  $("#flashcard").addEventListener("pointerup", endFlashDrag);
  $("#flashcard").addEventListener("pointercancel", cancelFlashDrag);
  $("#flashcard").addEventListener("touchstart", beginFlashTouch, { passive: true });
  $("#flashcard").addEventListener("touchmove", moveFlashTouch, { passive: false });
  $("#flashcard").addEventListener("touchend", endFlashTouch);
  $("#flashcard").addEventListener("touchcancel", cancelFlashDrag);
  $("#prevCard").addEventListener("click", () => moveFlashcard(-1));
  $("#nextCard").addEventListener("click", () => moveFlashcard(1));
  $("#speakBtn").addEventListener("click", speakFlashcard);
  $("#enableSpeechBtn").addEventListener("click", enableSpeechManually);
  $("#spellCheck").addEventListener("click", checkSpellingAnswer);
  $("#spellAnswer").addEventListener("keydown", (event) => {
    if (event.key === "Enter") checkSpellingAnswer();
  });
  $("#autoPlayBtn").addEventListener("click", toggleAutoPlay);
  $("#dimScreenBtn").addEventListener("click", toggleDimMode);
  $("#knownBtn").addEventListener("click", () => recordFlashcard(true));
  $("#unknownBtn").addEventListener("click", () => recordFlashcard(false));
  $("#practiceSeries").addEventListener("change", async () => {
    await ensurePracticeSeriesLoaded($("#practiceSeries").value || "all");
    refreshUnitSelectFor("#practiceSeries", "#practiceUnit");
    nextQuestion();
  });
  $("#practiceUnit").addEventListener("change", nextQuestion);
  $("#practiceMode").addEventListener("change", nextQuestion);
  $("#practiceScope").addEventListener("change", nextQuestion);
  $("#newQuestion").addEventListener("click", nextQuestion);
  $("#searchWord").addEventListener("input", renderLibrary);
  $("#librarySeries").addEventListener("change", async () => {
    await ensureSeriesLoaded($("#librarySeries").value || "all");
    refreshUnitSelectFor("#librarySeries", "#libraryUnit");
    renderLibrary();
  });
  $("#libraryUnit").addEventListener("change", renderLibrary);
  $("#libraryFilter").addEventListener("change", renderLibrary);
  $("#wordGrid").addEventListener("click", handleLibraryClick);
  $("#auditSeries").addEventListener("change", async () => {
    await ensureSeriesLoaded($("#auditSeries").value || "all");
    refreshUnitSelectFor("#auditSeries", "#auditUnit");
    renderAudit();
  });
  $("#auditUnit").addEventListener("change", renderAudit);
  $("#runAudit").addEventListener("click", async () => {
    const auditSeries = $("#auditSeries").value || "all";
    if (auditSeries === "all") {
      await ensureSeriesLoaded(HIGH_SCHOOL_SERIES);
      await ensureSeriesLoaded(HIGH_FREQUENCY_SERIES);
    } else {
      await ensureSeriesLoaded(auditSeries);
    }
    refreshUnitSelectFor("#auditSeries", "#auditUnit");
    renderAudit();
    toast("資料健檢已更新");
  });
  $("#fixAuditData").addEventListener("click", fixCommonDataIssues);
  $("#addWordForm").addEventListener("submit", addCustomWord);
  $("#exportBtn").addEventListener("click", exportData);
  $("#importInput").addEventListener("change", importData);

  if (window.lucide) window.lucide.createIcons();
  window.addEventListener("load", () => window.lucide?.createIcons());
}

boot();
