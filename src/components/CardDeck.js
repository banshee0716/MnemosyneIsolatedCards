// 導入 React 和必要的 hooks
// React 是構建用戶界面的 JavaScript 庫
// useState 用於在函數組件中添加狀態
// useEffect 用於處理副作用，如數據獲取、訂閱或手動更改 DOM
// useCallback 用於記憶化函數，避免不必要的重新渲染
// useMemo 用於記憶化計算結果
// useRef 用於創建一個可變的 ref 對象
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

// 導入自定義 hook 和組件
import { useFlashcards } from "../FlashcardContext";
import Card from "./Card";
import AddCardForm from "./AddCardForm";

// 導入 CSS 文件
import "./CardDeck.css";

// 定義 CardDeck 函數組件
const CardDeck = () => {
  // 使用 useFlashcards hook 獲取全局狀態和方法
  const { cards, currentTopic, addCard, deleteCard } = useFlashcards();

  // 使用 useState hook 定義本地狀態
  // useState 返回一個數組，第一個元素是當前狀態值，第二個元素是更新狀態的函數
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  // useRef 創建一個可變的 ref 對象，用於存儲 DOM 元素引用
  const cardDeckRef = useRef(null);

  // useMemo 用於記憶化計算結果，只有當依賴項改變時才重新計算
  // 這裡用於獲取當前主題的卡片列表
  const currentCards = useMemo(
    () => cards[currentTopic] || [],
    [cards, currentTopic]
  );

  // useCallback 用於記憶化函數，避免在每次渲染時重新創建函數
  // 這個函數用於重置卡片組狀態
  const resetDeck = useCallback(() => {
    console.log("Resetting deck");
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setDirection(null);
  }, []);

  // useEffect hook 用於處理副作用
  // 這個 effect 在 currentTopic 或 currentCards 改變時執行
  useEffect(() => {
    console.log("Current topic changed:", currentTopic);
    console.log("Current cards:", currentCards);
    resetDeck();
  }, [currentTopic, currentCards, resetDeck]);

  // 切換到下一張卡片的函數
  const nextCard = useCallback(() => {
    if (currentCards.length > 0 && !isAnimating) {
      setIsAnimating(true);
      setDirection("left");
      // 使用 setTimeout 來控制動畫時間
      setTimeout(() => {
        setCurrentCardIndex(
          (prevIndex) => (prevIndex + 1) % currentCards.length
        );
        setIsFlipped(false);
        setTimeout(() => {
          setIsAnimating(false);
          setDirection(null);
        }, 50);
      }, 300);
    }
  }, [currentCards, isAnimating]);

  // 切換到上一張卡片的函數
  const prevCard = useCallback(() => {
    if (currentCards.length > 0 && !isAnimating) {
      setIsAnimating(true);
      setDirection("right");
      setTimeout(() => {
        setCurrentCardIndex(
          (prevIndex) =>
            (prevIndex - 1 + currentCards.length) % currentCards.length
        );
        setIsFlipped(false);
        setTimeout(() => {
          setIsAnimating(false);
          setDirection(null);
        }, 50);
      }, 300);
    }
  }, [currentCards, isAnimating]);

  // 翻轉卡片的函數
  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // 處理鍵盤事件的函數
  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "ArrowLeft":
          prevCard();
          break;
        case "ArrowRight":
          nextCard();
          break;
        case "ArrowUp":
        case "ArrowDown":
          toggleFlip();
          break;
        default:
          break;
      }
    },
    [prevCard, nextCard, toggleFlip]
  );

  // 添加鍵盤事件監聽器
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    // 清理函數：在組件卸載時移除事件監聽器
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // 處理刪除卡片的函數
  const handleDelete = useCallback(() => {
    if (currentCards.length === 0) return;

    if (window.confirm("確定要刪除這張卡片嗎？")) {
      deleteCard(currentTopic, currentCardIndex);
      if (currentCardIndex === currentCards.length - 1) {
        setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
      }
    }
  }, [currentCards, currentTopic, currentCardIndex, deleteCard]);

  // 處理添加新卡片的函數
  const handleAddCard = useCallback(
    (newCard) => {
      addCard(currentTopic, newCard);
      setShowAddForm(false);
    },
    [addCard, currentTopic]
  );

  // 處理拖曳開始的函數
  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    setCurrentX(0);
  }, []);

  // 處理拖曳移動的函數
  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const diff = x - startX;
      setCurrentX(diff);
    },
    [isDragging, startX]
  );

  // 處理拖曳結束的函數
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (currentX > 50) {
      prevCard();
    } else if (currentX < -50) {
      nextCard();
    }
    setCurrentX(0);
  }, [currentX, prevCard, nextCard]);

  // 添加拖曳相關的事件監聽器
  useEffect(() => {
    const cardDeck = cardDeckRef.current;
    if (cardDeck) {
      cardDeck.addEventListener("touchstart", handleDragStart);
      cardDeck.addEventListener("touchmove", handleDragMove);
      cardDeck.addEventListener("touchend", handleDragEnd);
      cardDeck.addEventListener("mousedown", handleDragStart);
      cardDeck.addEventListener("mousemove", handleDragMove);
      cardDeck.addEventListener("mouseup", handleDragEnd);
      cardDeck.addEventListener("mouseleave", handleDragEnd);

      // 清理函數：在組件卸載時移除事件監聽器
      return () => {
        cardDeck.removeEventListener("touchstart", handleDragStart);
        cardDeck.removeEventListener("touchmove", handleDragMove);
        cardDeck.removeEventListener("touchend", handleDragEnd);
        cardDeck.removeEventListener("mousedown", handleDragStart);
        cardDeck.removeEventListener("mousemove", handleDragMove);
        cardDeck.removeEventListener("mouseup", handleDragEnd);
        cardDeck.removeEventListener("mouseleave", handleDragEnd);
      };
    }
  }, [handleDragStart, handleDragMove, handleDragEnd]);

  // 如果當前主題沒有卡片，顯示添加卡片的界面
  if (currentCards.length === 0) {
    return (
      <div className="card-deck-container">
        <div className="no-cards">沒有卡片，請添加新卡片。</div>
        <div className="button-group">
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="action-btn"
          >
            {showAddForm ? "隱藏表單" : "新增新卡片"}
          </button>
        </div>
        {showAddForm && <AddCardForm onAddCard={handleAddCard} />}
      </div>
    );
  }

  // 獲取當前卡片、前一張卡片和下一張卡片的數據
  const currentCard = currentCards[currentCardIndex];
  const prevCardData =
    currentCardIndex > 0 ? currentCards[currentCardIndex - 1] : null;
  const nextCardData =
    currentCardIndex < currentCards.length - 1
      ? currentCards[currentCardIndex + 1]
      : null;

  // 渲染主要的卡片組界面
  return (
    <div className="card-deck-container">
      {/* 卡片組 */}
      <div
        ref={cardDeckRef}
        className={`card-deck ${direction}`}
        style={{
          transform: `translateX(${currentX}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
      >
        {/* 前一張卡片 */}
        {prevCardData && (
          <div className="card-wrapper prev-card">
            <Card
              front={prevCardData.front}
              back={prevCardData.back}
              isFlipped={false}
              onClick={() => { }}
            />
          </div>
        )}
        {/* 當前卡片 */}
        <div className="card-wrapper current-card">
          {currentCard ? (
            <Card
              front={currentCard.front}
              back={currentCard.back}
              isFlipped={isFlipped}
              onClick={toggleFlip}
            />
          ) : (
            <div className="error-card">無效的卡片數據</div>
          )}
        </div>
        {/* 下一張卡片 */}
        {nextCardData && (
          <div className="card-wrapper next-card">
            <Card
              front={nextCardData.front}
              back={nextCardData.back}
              isFlipped={false}
              onClick={() => { }}
            />
          </div>
        )}
      </div>
      {/* 導航按鈕 */}
      <div className="navigation">
        <button
          onClick={prevCard}
          className="nav-button prev"
          aria-label="上一張卡片"
          disabled={currentCards.length <= 1 || isAnimating}
        >
          &#8249;
        </button>
        <div className="card-count">
          {currentCardIndex + 1} / {currentCards.length}
        </div>
        <button
          onClick={nextCard}
          className="nav-button next"
          aria-label="下一張卡片"
          disabled={currentCards.length <= 1 || isAnimating}
        >
          &#8250;
        </button>
        <button
          onClick={handleDelete}
          className="nav-button delete"
          aria-label="刪除卡片"
          disabled={currentCards.length === 0}
        >
          &#128465;
        </button>
      </div>
      {/* 添加新卡片按鈕 */}
      <div className="button-group">
        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="action-btn"
        >
          {showAddForm ? "隱藏表單" : "新增新卡片"}
        </button>
      </div>
      {/* 添加新卡片表單 */}
      {showAddForm && <AddCardForm onAddCard={handleAddCard} />}
      {/* 鍵盤操作說明 */}
      <div className="keyboard-instructions">
        <span>使用鍵盤及滑鼠操作：</span>
        <br />
        <span>切換卡片：滑鼠點擊下方標示，或鍵盤← →，或左右拖曳卡片</span>
        <br />
        <span>翻轉卡片：滑鼠點擊卡片，或鍵盤↑ ↓</span>
      </div>
    </div>
  );
};

// 導出 CardDeck 組件，使其可以在其他文件中使用
export default CardDeck;


/*import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useFlashcards } from "../FlashcardContext";
import Card from "./Card";
import AddCardForm from "./AddCardForm";
import "./CardDeck.css";

const CardDeck = () => {
  const { cards, currentTopic, addCard, deleteCard } = useFlashcards();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentCards = useMemo(
    () => cards[currentTopic] || [],
    [cards, currentTopic]
  );

  const resetDeck = useCallback(() => {
    console.log("Resetting deck");
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setDirection(null);
  }, []);

  useEffect(() => {
    console.log("Current topic changed:", currentTopic);
    console.log("Current cards:", currentCards);
    resetDeck();
  }, [currentTopic, currentCards, resetDeck]);

  const nextCard = useCallback(() => {
    if (currentCards.length > 0 && !isAnimating) {
      setIsAnimating(true);
      setDirection("left");
      setTimeout(() => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % currentCards.length);
        setIsFlipped(false);
        setTimeout(() => {
          setIsAnimating(false);
          setDirection(null);
        }, 50);
      }, 300);
    }
  }, [currentCards, isAnimating]);

  const prevCard = useCallback(() => {
    if (currentCards.length > 0 && !isAnimating) {
      setIsAnimating(true);
      setDirection("right");
      setTimeout(() => {
        setCurrentCardIndex(
          (prevIndex) =>
            (prevIndex - 1 + currentCards.length) % currentCards.length
        );
        setIsFlipped(false);
        setTimeout(() => {
          setIsAnimating(false);
          setDirection(null);
        }, 50);
      }, 300);
    }
  }, [currentCards, isAnimating]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // 更新：鍵盤事件處理函數
  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "ArrowLeft":
          prevCard();
          break;
        case "ArrowRight":
          nextCard();
          break;
        case "ArrowUp":
        case "ArrowDown":
          toggleFlip();
          break;
        default:
          break;
      }
    },
    [prevCard, nextCard, toggleFlip]
  );

  // 設置和清理鍵盤事件監聽器
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleDelete = useCallback(() => {
    if (currentCards.length === 0) return;

    if (window.confirm("確定要刪除這張卡片嗎？")) {
      deleteCard(currentTopic, currentCardIndex);
      if (currentCardIndex === currentCards.length - 1) {
        setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
      }
    }
  }, [currentCards, currentTopic, currentCardIndex, deleteCard]);

  const handleAddCard = useCallback(
    (newCard) => {
      addCard(currentTopic, newCard);
      setShowAddForm(false);
    },
    [addCard, currentTopic]
  );

  if (currentCards.length === 0) {
    return (
      <div className="card-deck-container">
        <div className="no-cards">沒有卡片，請添加新卡片。</div>
        <div className="button-group">
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="action-btn"
          >
            {showAddForm ? "隱藏表單" : "新增新卡片"}
          </button>
        </div>
        {showAddForm && <AddCardForm onAddCard={handleAddCard} />}
      </div>
    );
  }

  const currentCard = currentCards[currentCardIndex];
  const prevCardData =
    currentCardIndex > 0 ? currentCards[currentCardIndex - 1] : null;
  const nextCardData =
    currentCardIndex < currentCards.length - 1
      ? currentCards[currentCardIndex + 1]
      : null;

  return (
    <div className="card-deck-container">
      <div className={`card-deck ${direction}`}>
        {prevCardData && (
          <div className="card-wrapper prev-card">
            <Card
              front={prevCardData.front}
              back={prevCardData.back}
              isFlipped={false}
              onClick={() => {}}
            />
          </div>
        )}
        <div className="card-wrapper current-card">
          {currentCard ? (
            <Card
              front={currentCard.front}
              back={currentCard.back}
              isFlipped={isFlipped}
              onClick={toggleFlip}
            />
          ) : (
            <div className="error-card">無效的卡片數據</div>
          )}
        </div>
        {nextCardData && (
          <div className="card-wrapper next-card">
            <Card
              front={nextCardData.front}
              back={nextCardData.back}
              isFlipped={false}
              onClick={() => {}}
            />
          </div>
        )}
      </div>
      <div className="navigation">
        <button
          onClick={prevCard}
          className="nav-button prev"
          aria-label="上一張卡片"
          disabled={currentCards.length <= 1 || isAnimating}
        >
          &#8249;
        </button>
        <div className="card-count">
          {currentCardIndex + 1} / {currentCards.length}
        </div>
        <button
          onClick={nextCard}
          className="nav-button next"
          aria-label="下一張卡片"
          disabled={currentCards.length <= 1 || isAnimating}
        >
          &#8250;
        </button>
        <button
          onClick={handleDelete}
          className="nav-button delete"
          aria-label="刪除卡片"
          disabled={currentCards.length === 0}
        >
          &#128465;
        </button>
      </div>
      <div className="button-group">
        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="action-btn"
        >
          {showAddForm ? "隱藏表單" : "新增新卡片"}
        </button>
      </div>
      {showAddForm && <AddCardForm onAddCard={handleAddCard} />}
      <div className="keyboard-instructions">
        <span>使用鍵盤及滑鼠操作：</span>
        <br />
        <span>切換卡片：滑鼠點擊下方標示，或鍵盤← →</span>
        <br />
        <span>翻轉卡片：滑鼠點擊卡片，或鍵盤↑ ↓</span>
      </div>
    </div>
  );
};

export default CardDeck;
*/
