// src/components/PavyonTicker.jsx
import React from 'react';
import { usePavyonStore } from '../store/usePavyonStore';
import './PavyonTicker.css';

export const PavyonTicker = () => {
  const pavyonList = usePavyonStore((state) => state.pavyonList);

  // Liste boşsa bant hiç gözükmesin
  if (pavyonList.length === 0) return null;

  return (
    <div className="ticker-container">
      <div className="ticker-track">
        {pavyonList.map((user, index) => (
          <div key={index} className="ticker-item">
            {/* Sol Yıldız */}
            <span className="ticker-icon">✦</span>
            
            {/* Parlayan İsim */}
            <span className="ticker-highlight">{user}</span>
            
            {/* Normal Yazı */}
            <span>MEKANA GİRİŞ YAPTI</span>
            
            {/* Sağ Yıldız */}
            <span className="ticker-icon" style={{ marginLeft: '12px' }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};