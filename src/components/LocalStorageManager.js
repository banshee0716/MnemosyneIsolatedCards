import React from 'react';
import { useFlashcards } from '../FlashcardContext';

const LocalStorageManager = () => {
  const { resetToInitialState } = useFlashcards();

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data and reset to initial state? This action cannot be undone.')) {
      resetToInitialState();
      window.location.reload(); // 重新加載頁面以重置狀態
    }
  };

  return (
    <div className="local-storage-manager">
      <h2>數據管理</h2>
      <button onClick={clearAllData}>清除所有數據並重置</button>
    </div>
  );
};

export default LocalStorageManager;