import React from 'react';
import './DanceFloor.css';

export const DanceFloor = () => {
  // Let's make an 8x4 grid = 32 panels
  const panels = Array.from({ length: 32 });

  return (
    <div className="dance-floor-container">
      <div className="dance-floor-grid">
        {panels.map((_, i) => {
          // Add some random classes for different animation timings
          const randomClass = `panel-type-${(i % 5) + 1}`;
          return <div key={i} className={`floor-panel ${randomClass}`}></div>;
        })}
      </div>
    </div>
  );
};