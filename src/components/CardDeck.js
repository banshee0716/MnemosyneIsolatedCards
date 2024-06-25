import React, { useState, useEffect, useCallback, useMemo } from "react";
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
    if (currentCards.length > 0) {
      setDirection("left");
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % currentCards.length);
      setIsFlipped(false);
    }
  }, [currentCards]);

  const prevCard = useCallback(() => {
    if (currentCards.length > 0) {
      setDirection("right");
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + currentCards.length) % currentCards.length
      );
      setIsFlipped(false);
    }
  }, [currentCards]);

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
          disabled={currentCards.length <= 1}
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
          disabled={currentCards.length <= 1}
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

/*import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFlashcards } from '../FlashcardContext';
import Card from './Card';
import AddCardForm from './AddCardForm';
import './CardDeck.css';

const CardDeck = () => {
  const { cards, currentTopic, addCard, deleteCard } = useFlashcards();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCards = useMemo(() => cards[currentTopic] || [], [cards, currentTopic]);

  const resetDeck = useCallback(() => {
    console.log('Resetting deck');
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, []);

  useEffect(() => {
    console.log('Current topic changed:', currentTopic);
    console.log('Current cards:', currentCards);
    resetDeck();
  }, [currentTopic, currentCards, resetDeck]);

  const nextCard = useCallback(() => {
    if (currentCards.length > 0) {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % currentCards.length);
      setIsFlipped(false);
    }
  }, [currentCards]);

  const prevCard = useCallback(() => {
    if (currentCards.length > 0) {
      setCurrentCardIndex((prevIndex) => (prevIndex - 1 + currentCards.length) % currentCards.length);
      setIsFlipped(false);
    }
  }, [currentCards]);

  const handleDelete = useCallback(() => {
    if (currentCards.length === 0) return;

    if (window.confirm('確定要刪除這張卡片嗎？')) {
      deleteCard(currentTopic, currentCardIndex);
      if (currentCardIndex === currentCards.length - 1) {
        setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
      }
    }
  }, [currentCards, currentTopic, currentCardIndex, deleteCard]);

  const handleAddCard = useCallback((newCard) => {
    addCard(currentTopic, newCard);
    setShowAddForm(false);
  }, [addCard, currentTopic]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  if (currentCards.length === 0) {
    return (
      <div className="card-deck-container">
        <div className="no-cards">沒有卡片。請添加新卡片。</div>
        <div className="button-group">
          <button onClick={() => setShowAddForm((prev) => !prev)} className="action-btn">
            {showAddForm ? '隱藏表單' : '添加新卡片'}
          </button>
        </div>
        {showAddForm && <AddCardForm onAddCard={handleAddCard} />}
      </div>
    );
  }

  const currentCard = currentCards[currentCardIndex];
  console.log('Current card:', currentCard);

  return (
    <div className="card-deck-container">
      <div className="card-deck">
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
      <div className="navigation">
        <button
          onClick={prevCard}
          className="nav-button prev"
          aria-label="上一張卡片"
          disabled={currentCards.length <= 1}
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
          disabled={currentCards.length <= 1}
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
        <button onClick={() => setShowAddForm((prev) => !prev)} className="action-btn">
          {showAddForm ? '隱藏表單' : '添加新卡片'}
        </button>
      </div>
      {showAddForm && <AddCardForm onAddCard={handleAddCard} />}
    </div>
  );
};

export default CardDeck;

/*import React, { useState } from 'react';
import Card from './Card';
import AddCardForm from './AddCardForm';
import { useFlashcards } from '../FlashcardContext';
import './CardDeck.css';

const CardDeck = () => {
  const { cards, currentTopic, addCard, deleteCard } = useFlashcards();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCards = cards[currentTopic] || [];

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % currentCards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + currentCards.length) % currentCards.length);
    setIsFlipped(false);
  };

  const handleDelete = () => {
    if (window.confirm('確定要刪除這張卡片嗎？')) {
      deleteCard(currentTopic, currentCardIndex);
      if (currentCardIndex === currentCards.length - 1) {
        setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
      }
    }
  };

  const handleAddCard = (newCard) => {
    addCard(currentTopic, newCard);
    setShowAddForm(false);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const renderAdjacentCard = (index, className) => {
    if (currentCards.length > 1) {
      const cardIndex = (index + currentCards.length) % currentCards.length;
      return (
        <div className={`card-wrapper ${className}`}>
          <Card {...currentCards[cardIndex]} isFlipped={false} onClick={() => {}} />
        </div>
      );
    }
    return null;
  };

  if (currentCards.length === 0) {
    return (
      <div className="card-deck-container">
        <div className="no-cards">沒有卡片，請添加新卡片。</div>
        <div className="button-group">
          <button onClick={() => setShowAddForm(!showAddForm)} className="action-btn">
            {showAddForm ? '隱藏表單' : '添加新卡片'}
          </button>
        </div>
        {showAddForm && <AddCardForm onAddCard={handleAddCard} />}
      </div>
    );
  }

  return (
    <div className="card-deck-container">
      <div className="card-deck">
        {renderAdjacentCard(currentCardIndex - 1, 'prev-card')}
        <div className="card-wrapper current-card">
          <Card {...currentCards[currentCardIndex]} isFlipped={isFlipped} onClick={toggleFlip} />
        </div>
        {renderAdjacentCard(currentCardIndex + 1, 'next-card')}
      </div>
      <div className="navigation">
        <button onClick={prevCard} className="nav-button prev" aria-label="Previous card">
          &#8249;
        </button>
        <div className="card-count">
          {currentCardIndex + 1} / {currentCards.length}
        </div>
        <button onClick={nextCard} className="nav-button next" aria-label="Next card">
          &#8250;
        </button>
        <button onClick={handleDelete} className="nav-button delete" aria-label="Delete card">
          &#128465;
        </button>
      </div>
      <div className="button-group">
        <button onClick={() => setShowAddForm(!showAddForm)} className="action-btn">
          {showAddForm ? '隱藏表單' : '添加新卡片'}
        </button>
      </div>
      {showAddForm && <AddCardForm onAddCard={handleAddCard} />}
    </div>
  );
};

export default CardDeck;*/
