import React, { useState, memo } from "react";
import LazyLoad from "react-lazyload";
import "./Card.css";

// 使用 React.memo 來優化性能，只有當 props 改變時才重新渲染
const Card = memo(({ front, back, isFlipped, onClick }) => {
  // 用於控制圖片模態框的顯示狀態
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // 如果卡片數據無效，顯示錯誤消息
  if (!front || !back) {
    return (
      <div className="card error-card">
        <p>無效的卡片數據</p>
      </div>
    );
  }

  // 打開圖片模態框的處理函數
  const openImageModal = (e) => {
    e.stopPropagation(); // 防止事件冒泡到卡片的點擊事件
    setIsImageModalOpen(true);
  };

  // 關閉圖片模態框的處理函數
  const closeImageModal = (e) => {
    e.stopPropagation(); // 防止事件冒泡到卡片的點擊事件
    setIsImageModalOpen(false);
  };

  return (
    <div className={`card ${isFlipped ? "flipped" : ""}`} onClick={onClick}>
      <div className="card-inner">
        {/* 卡片正面 */}
        <div className="card-face card-front">
          <h2>{front.title || "無標題"}</h2>
          {/* 顯示卡片要點，如果沒有則顯示 "沒有要點" */}
          {front.points && front.points.length > 0 ? (
            <ul>
              {front.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          ) : (
            <p>沒有要點</p>
          )}
          {/* 如果有圖片，使用 LazyLoad 延遲加載 */}
          {front.image && (
            <LazyLoad height={150} once>
              <div className="card-image-container">
                <img
                  src={front.image}
                  alt={front.title || "卡片圖片"}
                  className="card-image"
                  onClick={openImageModal}
                />
              </div>
            </LazyLoad>
          )}
        </div>
        {/* 卡片背面 */}
        <div className="card-face card-back">
          <p>{back.explanation || "沒有解釋"}</p>
          {/* 如果背面有圖片，也使用 LazyLoad */}
          {back.image && (
            <LazyLoad height={150} once>
              <img
                src={back.image}
                alt="Back illustration"
                className="card-image"
              />
            </LazyLoad>
          )}
          <div className="prompts">
            <div className="prompt">
              <h3>認知提示:</h3>
              <p>{back.metacognitionPrompt || "沒有認知提示"}</p>
            </div>
            <div className="prompt">
              <h3>自我解釋提示:</h3>
              <p>{back.selfExplanationPrompt || "沒有自我解釋提示"}</p>
            </div>
          </div>
        </div>
      </div>
      {/* 圖片模態框 */}
      {isImageModalOpen && (
        <div className="image-modal" onClick={closeImageModal}>
          <img src={front.image} alt={front.title || "卡片圖片"} />
        </div>
      )}
    </div>
  );
});

export default Card;