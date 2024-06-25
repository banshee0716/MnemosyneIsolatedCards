import React from 'react';
import './Card.css';

const Card = ({ front, back, isFlipped, onClick }) => {
  // 檢查是否有有效的前面和後面數據
  if (!front || !back) {
    return (
      <div className="card error-card">
        <p>無效的卡片數據</p>
      </div>
    );
  }

  return (
    <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={onClick}>
      <div className="card-inner">
        <div className="card-face card-front">
          <h2>{front.title || '無標題'}</h2>
          {front.image && <img src={front.image} alt={front.title || '卡片圖片'} className="card-image" />}
          {front.points && front.points.length > 0 ? (
            <ul>
              {front.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          ) : (
            <p>沒有要點</p>
          )}
        </div>
        <div className="card-face card-back">
          <p>{back.explanation || '沒有解釋'}</p>
          {back.image && <img src={back.image} alt="Back illustration" className="card-image" />}
          <div className="prompts">
            <div className="prompt">
              <h3>認知提示:</h3>
              <p>{back.metacognitionPrompt || '沒有認知提示'}</p>
            </div>
            <div className="prompt">
              <h3>自我解釋提示:</h3>
              <p>{back.selfExplanationPrompt || '沒有自我解釋提示'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;