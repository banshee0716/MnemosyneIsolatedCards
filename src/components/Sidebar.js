import React, { useState } from 'react';
import { useFlashcards } from '../FlashcardContext';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  // 從 FlashcardContext 中獲取必要的狀態和函數
  const { topics, currentTopic, setCurrentTopic, addTopic, deleteTopic } = useFlashcards();
  
  // 用於新主題輸入的本地狀態
  const [newTopic, setNewTopic] = useState('');

  // 處理添加新主題
  const handleAddTopic = (e) => {
    e.preventDefault();
    if (newTopic.trim()) {
      addTopic(newTopic.trim());
      setNewTopic(''); // 清空輸入框
    }
  };

  // 處理刪除主題
  const handleDeleteTopic = (topic) => {
    if (window.confirm(`確定要刪除 "${topic}" 分類嗎？這將刪除該分類下的所有卡片。`)) {
      deleteTopic(topic);
    }
  };

  // 處理主題切換
  const handleTopicChange = (topic) => {
    console.log('Changing topic to:', topic);
    setCurrentTopic(topic);
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <h2>學習主題</h2>
      <ul>
        {topics.map((topic, index) => (
          <li key={index} className={currentTopic === topic ? 'active' : ''}>
            <button onClick={() => handleTopicChange(topic)}>
              {topic}
            </button>
            {/* 只有當有多於一個主題時才顯示刪除按鈕 */}
            {topics.length > 1 && (
              <button
                onClick={() => handleDeleteTopic(topic)}
                className="delete-topic"
                aria-label={`刪除 ${topic} 主題`}
              >
                &times;
              </button>
            )}
          </li>
        ))}
      </ul>
      {/* 添加新主題的表單 */}
      <form onSubmit={handleAddTopic} className="add-topic-form">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="新增主題"
          aria-label="新增主題"
        />
        <button type="submit" aria-label="添加新主題">+</button>
      </form>
    </nav>
  );
};

export default Sidebar;