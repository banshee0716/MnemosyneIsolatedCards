import React, { useState } from 'react';
import './AddCardForm.css';

const AddCardForm = ({ onAddCard }) => {
  // 使用 useState 鉤子管理表單的各個字段
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [points, setPoints] = useState(['', '', '']); // 初始化三個空的要點
  const [explanation, setExplanation] = useState('');
  const [metacognitionPrompt, setMetacognitionPrompt] = useState('');
  const [selfExplanationPrompt, setSelfExplanationPrompt] = useState('');

  // 處理表單提交的函數
  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止表單的默認提交行為

    // 創建新卡片對象
    const newCard = {
      front: {
        title,
        image: imageUrl,
        points: points.filter(point => point.trim() !== '') // 過濾掉空的要點
      },
      back: {
        explanation,
        metacognitionPrompt,
        selfExplanationPrompt
      }
    };

    onAddCard(newCard); // 調用父組件傳入的函數來添加新卡片

    // 重置表單字段
    setTitle('');
    setImageUrl('');
    setPoints(['', '', '']);
    setExplanation('');
    setMetacognitionPrompt('');
    setSelfExplanationPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-card-form">
      <h2>添加新卡片</h2>
      {/* 標題輸入 */}
      <input
        type="text"
        placeholder="標題"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      {/* 圖片 URL 輸入 */}
      <input
        type="text"
        placeholder="圖片 URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      {/* 要點輸入，最多三個 */}
      {points.map((point, index) => (
        <input
          key={index}
          type="text"
          placeholder={`要點 ${index + 1}`}
          value={point}
          onChange={(e) => {
            const newPoints = [...points];
            newPoints[index] = e.target.value;
            setPoints(newPoints);
          }}
        />
      ))}
      {/* 解釋文本區域 */}
      <textarea
        placeholder="解釋"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        required
      />
      {/* 認知提示輸入 */}
      <input
        type="text"
        placeholder="認知提示"
        value={metacognitionPrompt}
        onChange={(e) => setMetacognitionPrompt(e.target.value)}
        required
      />
      {/* 自我解釋提示輸入 */}
      <input
        type="text"
        placeholder="自我解釋提示"
        value={selfExplanationPrompt}
        onChange={(e) => setSelfExplanationPrompt(e.target.value)}
        required
      />
      {/* 提交按鈕 */}
      <button type="submit">添加卡片</button>
    </form>
  );
};

export default AddCardForm;