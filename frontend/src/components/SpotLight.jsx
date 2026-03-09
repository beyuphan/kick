// src/components/SpotLight.jsx
import React from 'react';

export const SpotLight = ({ side }) => {
  const isLeft = side === 'left';
  
  return (
    <svg 
      className={`spot-light ${isLeft ? 'left-beam' : 'right-beam'}`}
      viewBox="0 0 200 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: '-50px',
        [isLeft ? 'left' : 'right']: '-100px',
        width: '600px',
        height: 'auto',
        pointerEvents: 'none',
        zIndex: 5
      }}
    >
      <defs>
        {/* Işığa yumuşaklık veren blur filtresi */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
        </filter>
      </defs>
      
      {/* Işık Huzmesi (Koni şeklinde) */}
      <path 
        d="M100 0 L0 400 L200 400 Z" 
        fill="url(#lightGradient)" 
        filter="url(#glow)"
        opacity="0.6"
      />
      
      <linearGradient id="lightGradient" x1="100" y1="0" x2="100" y2="400" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={isLeft ? "#FF00FF" : "#00FFFF"} stopOpacity="0.8" />
        <stop offset="100%" stopColor={isLeft ? "#FF00FF" : "#00FFFF"} stopOpacity="0" />
      </linearGradient>
    </svg>
  );
};