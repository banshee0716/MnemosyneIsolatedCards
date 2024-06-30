import React, { createContext, useState, useEffect, useContext } from "react";
import { initialCards } from "./initialCards";

// 創建 FlashcardContext
const FlashcardContext = createContext();

export const FlashcardProvider = ({ children }) => {
  // 從本地存儲或初始數據中獲取卡片數據
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem("flashcards");
    return savedCards ? JSON.parse(savedCards) : initialCards;
  });

  // 從本地存儲或初始數據中獲取主題列表
  const [topics, setTopics] = useState(() => {
    const savedTopics = localStorage.getItem("topics");
    return savedTopics ? JSON.parse(savedTopics) : Object.keys(initialCards);
  });

  // 從本地存儲或初始數據中獲取當前主題
  const [currentTopic, setCurrentTopic] = useState(() => {
    const savedTopic = localStorage.getItem("currentTopic");
    return savedTopic || Object.keys(initialCards)[0];
  });

  // 如果卡片數據為空，重置為初始狀態
  useEffect(() => {
    if (Object.keys(cards).length === 0) {
      setCards(initialCards);
      setTopics(Object.keys(initialCards));
      setCurrentTopic(Object.keys(initialCards)[0]);
    }
  }, [cards]);

  // 當卡片、主題或當前主題改變時，更新本地存儲
  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(cards));
    localStorage.setItem("topics", JSON.stringify(topics));
    localStorage.setItem("currentTopic", currentTopic);
  }, [cards, topics, currentTopic]);

  // 添加新卡片
  const addCard = (topic, newCard) => {
    if (!newCard.front || !newCard.front.title) {
      console.error("Invalid card structure");
      return;
    }
    setCards((prevCards) => ({
      ...prevCards,
      [topic]: [...(prevCards[topic] || []), newCard],
    }));
  };

  // 刪除卡片
  const deleteCard = (topic, index) => {
    setCards((prevCards) => ({
      ...prevCards,
      [topic]: prevCards[topic].filter((_, i) => i !== index),
    }));
  };

  // 添加新主題
  const addTopic = (newTopic) => {
    if (!topics.includes(newTopic)) {
      setTopics((prevTopics) => [...prevTopics, newTopic]);
      setCards((prevCards) => ({
        ...prevCards,
        [newTopic]: [],
      }));
      setCurrentTopic(newTopic);
    }
  };

  // 刪除主題
  const deleteTopic = (topicToDelete) => {
    if (topics.length > 1) {
      setTopics((prevTopics) =>
        prevTopics.filter((topic) => topic !== topicToDelete)
      );
      setCards((prevCards) => {
        const { [topicToDelete]: deletedTopic, ...restCards } = prevCards;
        return restCards;
      });
      if (currentTopic === topicToDelete) {
        setCurrentTopic(topics.find((topic) => topic !== topicToDelete));
      }
    }
  };

  // 重置為初始狀態
  const resetToInitialState = () => {
    setCards(initialCards);
    setTopics(Object.keys(initialCards));
    setCurrentTopic(Object.keys(initialCards)[0]);
    localStorage.removeItem("flashcards");
    localStorage.removeItem("topics");
    localStorage.removeItem("currentTopic");
  };

  // 提供給子組件的值
  const value = {
    cards,
    setCards,
    topics,
    setTopics,
    currentTopic,
    setCurrentTopic,
    addCard,
    deleteCard,
    addTopic,
    deleteTopic,
    resetToInitialState,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};

// 自定義 hook 用於在其他組件中使用 FlashcardContext
export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcards must be used within a FlashcardProvider");
  }
  return context;
};

export default FlashcardContext;