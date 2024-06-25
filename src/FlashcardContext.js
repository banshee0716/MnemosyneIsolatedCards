import React, { createContext, useState, useEffect, useContext } from "react";
import { initialCards } from "./initialCards";

const FlashcardContext = createContext();

export const FlashcardProvider = ({ children }) => {
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem("flashcards");
    return savedCards ? JSON.parse(savedCards) : initialCards;
  });

  const [topics, setTopics] = useState(() => {
    const savedTopics = localStorage.getItem("topics");
    return savedTopics ? JSON.parse(savedTopics) : Object.keys(initialCards);
  });

  const [currentTopic, setCurrentTopic] = useState(() => {
    const savedTopic = localStorage.getItem("currentTopic");
    return savedTopic || Object.keys(initialCards)[0];
  });

  useEffect(() => {
    if (Object.keys(cards).length === 0) {
      setCards(initialCards);
      setTopics(Object.keys(initialCards));
      setCurrentTopic(Object.keys(initialCards)[0]);
    }
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(cards));
    localStorage.setItem("topics", JSON.stringify(topics));
    localStorage.setItem("currentTopic", currentTopic);
  }, [cards, topics, currentTopic]);

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

  const deleteCard = (topic, index) => {
    setCards((prevCards) => ({
      ...prevCards,
      [topic]: prevCards[topic].filter((_, i) => i !== index),
    }));
  };

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

  const resetToInitialState = () => {
    setCards(initialCards);
    setTopics(Object.keys(initialCards));
    setCurrentTopic(Object.keys(initialCards)[0]);
    localStorage.removeItem("flashcards");
    localStorage.removeItem("topics");
    localStorage.removeItem("currentTopic");
  };

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

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcards must be used within a FlashcardProvider");
  }
  return context;
};

export default FlashcardContext;
