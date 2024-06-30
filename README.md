# 認知負荷理論導向的卡片式學習應用

這是一個基於認知負荷理論（Cognitive Load Theory）和獨立元素效應（Isolate Elements Effect）開發的互動式學習應用程序。本應用旨在通過優化信息呈現方式，提高學習效率和知識保留率。

## 理論基礎

本應用的設計基於以下關鍵理論和原則：

1. **工作記憶的限制**：
   - 人類工作記憶容量有限，通常為7±2個信息單元。
   - 處理高元素互動性的信息時，容易超出工作記憶容量。

2. **元素隔離效應**（Pollock et al, 2002）：
   - 學習初期應聚焦於個別元素，而非元素間的複雜互動。
   - 先將個別元素存儲於長期記憶，後續再學習它們之間的互動關係。

3. **循序漸進的學習策略**（van Merriënboer et al, 2003；van Merriënboer & Sweller, 2005 ; 2010）：
   - 採用由簡單到複雜的學習順序。
   - 先處理低元素互動性的任務，再逐漸過渡到更複雜的任務。

## 卡片設計原則

基於上述理論，我們的卡片設計遵循以下原則：

1. **分組呈現**：每個知識點分為約10張卡片的族群。
2. **控制信息量**：每張卡片的內容限制在7±2個工作記憶單元內。
3. **逐步整合**：先學習個別元素，後整合元素間的互動關係。
4. **元認知提示**：使用元認知提示促進學習者思考元素間的關聯性。

## 功能特點

- 主題式卡片群組：使用者可以創建和管理不同學習主題的卡片群組。
- 漸進式學習路徑：按照認知負荷理論設計的學習順序。
- 元認知提示系統：促進深度學習和知識整合。
- 交互式卡片界面：支持卡片翻轉、左右滑動切換。
- 學習進度追踪：記錄每個主題和卡片群組的學習狀態。
- 暗黑模式：提供舒適的夜間學習體驗。
- 響應式設計：適配桌面和移動設備。
- 本地存儲：自動保存學習進度和卡片數據。

## 卡片設計實例

以下是一個關於"光合作用"主題的卡片設計實例：

群組1：光合作用基礎（5張卡片）
1. 光合作用定義
2. 反應場所：葉綠體
3. 主要原料：二氧化碳和水
4. 主要產物：葡萄糖和氧氣
5. 能量來源：光能

群組2：光反應（5張卡片）
1. 光反應定義
2. 發生場所：類囊體膜
3. 光系統I的作用
4. 光系統II的作用
5. 產物：ATP和NADPH

群組3：暗反應（卡爾文循環）（5張卡片）
1. 暗反應定義
2. 發生場所：基質
3. CO2固定階段
4. 還原階段
5. 再生階段

元認知提示卡：
- 思考光反應和暗反應之間的關係。
- 解釋為什麼光合作用被稱為"光合"作用，即使暗反應不需要光。
- 比較光合作用和呼吸作用的異同。

整合卡：
- 總結光合作用的完整過程，包括光反應和暗反應的連接。
- 分析影響光合作用效率的因素（如光照、CO2濃度、溫度等）。

## 技術棧

- React
- CSS3
- LocalStorage for data persistence

## 安裝

1. 克隆儲存庫：
   ```
   git clone https://github.com/banshee0716/MnemosyneIsolatedCards.git
   ```
2. 進入項目目錄：
   ```
   cd MnemosyneIsolatedCards
   ```
3. 安裝依賴：
   ```
   npm install
   ```
4. 啟動開發服務器：
   ```
   npm start
   ```

## 使用方法

1. 選擇或創建學習主題。
2. 按照設計的學習路徑，逐個學習卡片群組。
3. 使用鍵盤箭頭鍵或滑動手勢瀏覽卡片。
4. 完成每個群組後，思考元認知提示卡的問題。
5. 最後學習整合卡，鞏固知識點之間的聯繫。

## 貢獻

我們歡迎社區成員的貢獻，特別是在以下方面：
- 改進卡片設計以更好地符合認知負荷理論
- 擴展學習主題和內容
- 優化使用者界面和體驗
- 添加新的學習輔助功能

請提交問題和拉取請求。對於重大變更，請先開 issue 討論您想要改變的內容。

## 許可證

[MIT](https://choosealicense.com/licenses/mit/)

## 參考文獻

- Pollock, E., Chandler, P., & Sweller, J. (2002). Assimilating complex information. Learning and instruction, 12(1), 61-86.
- van Merriënboer, J. J., Kirschner, P. A., & Kester, L. (2003). Taking the load off a learner's mind: Instructional design for complex learning. Educational psychologist, 38(1), 5-13.
- van Merriënboer, J. J., & Sweller, J. (2005). Cognitive load theory and complex learning: Recent developments and future directions. Educational psychology review, 17(2), 147-177.
- van Merriënboer, J. J., & Sweller, J. (2010). Cognitive load theory in health professional education: design principles and strategies. Medical education, 44(1), 85-93.
