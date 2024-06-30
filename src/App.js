import React, { useState, useEffect } from 'react';
import { FlashcardProvider } from './FlashcardContext';
import CardDeck from './components/CardDeck';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import LocalStorageManager from './components/LocalStorageManager';
import './App.css';

function App() {
  // 設置深色模式狀態，初始值從本地存儲中獲取
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // 控制側邊欄的開關狀態
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 控制是否顯示本地存儲管理器
  const [showStorageManager, setShowStorageManager] = useState(false);

  // 當深色模式狀態改變時，更新 body 類名和本地存儲
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // 切換深色模式
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 切換側邊欄的開關狀態
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 切換本地存儲管理器的顯示狀態
  const toggleStorageManager = () => {
    setShowStorageManager(!showStorageManager);
  };

  return (
    <FlashcardProvider>
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <header className="App-header">
          <div className="header-left">
            {/* 側邊欄切換按鈕 */}
            <button onClick={toggleSidebar} className="sidebar-toggle">
              {isSidebarOpen ? '≡' : '☰'}
            </button>
            <h1>卡片式學習</h1>
          </div>
          <div className="header-right">
            {/* 主題切換組件 */}
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            {/* 本地存儲管理器切換按鈕 */}
            <button onClick={toggleStorageManager} className="storage-manager-toggle">
              ⚙️
            </button>
          </div>
        </header>
        <div className="App-content">
          {/* 側邊欄組件 */}
          <Sidebar isOpen={isSidebarOpen} />
          {/* 主要內容區域 */}
          <main className={isSidebarOpen ? '' : 'sidebar-closed'}>
            {showStorageManager ? <LocalStorageManager /> : <CardDeck />}
          </main>
        </div>
        <footer>
          <p>© 2024 閃卡學習應用. 保留所有權利。</p>
        </footer>
      </div>
    </FlashcardProvider>
  );
}

export default App;