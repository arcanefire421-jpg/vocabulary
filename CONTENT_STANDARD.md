# VocabMaster Content Standard

本網站定位是「學習與考試導向字卡」，不是完整英文字典。內容整理以學生能快速記憶、理解、朗讀、考試應用為優先。

## Target Levels

每個單字可出現在不同學習層級，但每個層級只允許一個主要義項。

- `JH`: 國中／會考導向。
- `SH_BASIC`: 高中基礎／學測導向。
- `SH_ADVANCED`: 高中進階／高分閱讀、分科、進階搭配導向。

## Required Content Shape

每筆正式學習資料應逐步補齊：

- `targetLevel`: `JH`, `SH_BASIC`, `SH_ADVANCED` 之一。
- `primarySense`: 該層級最適合優先學習的主要義項。
- `pos`: 英文詞性縮寫，例如 `n.`, `v.`, `adj.`, `adv.`, `prep.`。
- `posZh`: 中文詞性，例如 `名詞`, `動詞`, `形容詞`, `副詞`, `介系詞`。
- `phonetic`: 統一使用 KK 音標；未確認前保持空白，不用猜測。
- `translation`: 台灣自然中文，不使用中國大陸用語。
- `example`: 自然、清楚、可朗讀，避免過長或硬塞多個義項。
- `exampleTr`: 自然台灣中文，避免逐字硬翻。

## Phrase Rules

片語必須 evidence-based，不用 AI 語感判斷「常考」。

新增或保留片語時，需能附上至少一種證據：

- 教材或題本來源。
- 官方或權威詞表、考題、教學材料。
- 使用者提供的課本圖片。
- 已確認為課程目標的補充片語。

建議欄位：

- `phrase`
- `phraseTr`
- `phraseExample`
- `phraseExampleTr`
- `phraseEvidence`

## Phase Plan

### Phase 0: Standards and Audit

- 固定資料規格與用語規則。
- 盤點缺欄位、過長例句、多詞性單例句、片語證據缺口。
- 不直接全量重寫資料。

### Phase 1: Pilot Batch

- 先挑一批代表性單字修正。
- 優先處理：
  - 多詞性但只有單一例句。
  - 例句超過 14 個英文單字。
  - 有片語但缺證據或片語例句品質不穩。
  - 使用者已回報語意不自然的例句。
- 每批修正後跑資料驗證。

### Phase 2: Full Batch

- Phase 1 規則穩定後，再依系列、單元、targetLevel 分批修正。
- 高中內容不得因「國中不常考」直接刪除，只能調整顯示層級。
