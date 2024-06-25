import React, { useState } from 'react';
import './AddCardForm.css';

const AddCardForm = ({ onAddCard }) => {
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(['', '', '']);
  const [explanation, setExplanation] = useState('');
  const [metacognitionPrompt, setMetacognitionPrompt] = useState('');
  const [selfExplanationPrompt, setSelfExplanationPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCard = {
      front: {
        title,
        points: points.filter(point => point.trim() !== '')
      },
      back: {
        explanation,
        metacognitionPrompt,
        selfExplanationPrompt
      }
    };
    onAddCard(newCard);
    // Reset form
    setTitle('');
    setPoints(['', '', '']);
    setExplanation('');
    setMetacognitionPrompt('');
    setSelfExplanationPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-card-form">
      <h2>添加新卡片</h2>
      <input
        type="text"
        placeholder="標題"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
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
      <textarea
        placeholder="解釋"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="認知提示"
        value={metacognitionPrompt}
        onChange={(e) => setMetacognitionPrompt(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="自我解釋提示"
        value={selfExplanationPrompt}
        onChange={(e) => setSelfExplanationPrompt(e.target.value)}
        required
      />
      <button type="submit">添加卡片</button>
    </form>
  );
};

export default AddCardForm;