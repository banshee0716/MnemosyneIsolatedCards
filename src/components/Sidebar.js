import React, { useState } from 'react';
import { useFlashcards } from '../FlashcardContext';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { topics, currentTopic, setCurrentTopic, addTopic, deleteTopic } = useFlashcards();
  const [newTopic, setNewTopic] = useState('');

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (newTopic.trim()) {
      addTopic(newTopic.trim());
      setNewTopic('');
    }
  };

  const handleDeleteTopic = (topic) => {
    if (window.confirm(`確定要刪除 "${topic}" 分類嗎？這將刪除該分類下的所有卡片。`)) {
      deleteTopic(topic);
    }
  };

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