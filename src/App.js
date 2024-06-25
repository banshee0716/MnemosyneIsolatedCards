import React, { useState, useEffect } from 'react';
import { FlashcardProvider } from './FlashcardContext';
import CardDeck from './components/CardDeck';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import LocalStorageManager from './components/LocalStorageManager';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showStorageManager, setShowStorageManager] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleStorageManager = () => {
    setShowStorageManager(!showStorageManager);
  };

  return (
    <FlashcardProvider>
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <header className="App-header">
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {isSidebarOpen ? '≡' : '☰'}
          </button>
          <h1>閃卡學習應用</h1>
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <button onClick={toggleStorageManager} className="storage-manager-toggle">
            ⚙️
          </button>
        </header>
        <div className="App-content">
          <Sidebar isOpen={isSidebarOpen} />
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