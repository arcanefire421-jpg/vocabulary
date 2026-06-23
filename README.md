# VocabMaster 單字學習

這是一個可部署到 GitHub Pages 的靜態單字學習網站，包含閃記卡、熟練度、答對率、單字庫與題庫練習。

## 功能

- 閃記卡翻面練習
- 每個單字的熟練度 Lv.0-5
- 答對率與練習次數統計
- 題庫練習與詳解
- 從例句自動產生練習題
- 新增、刪除自訂單字
- 匯入與匯出學習資料

## 資料檔案

- `data/vocabulary.js`：基礎單字庫
- `data/questions.js`：手寫題庫與詳解
- `src/app.js`：主要互動程式
- `src/styles.css`：畫面樣式

## 本機預覽

可以直接用靜態伺服器開啟：

```bash
python -m http.server 4174
```

然後打開：

```text
http://127.0.0.1:4174/
```

## 部署

上傳到 GitHub 後，可在 GitHub Pages 選擇從 `main` 分支的根目錄發布。
