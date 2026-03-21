// src/components/AmbienceLights.jsx
import React from 'react';

export const AmbienceLights = () => (
  <>
    {/* Yerdeki duman katmanı */}
    <div className="smoke-overlay" />
    
    {/* KENARDAKİ İNCE SPOTLAR */}
   
    <div className="spot-container side-left">
      <img src="/spot-fixture.png" className="spot-fixture" alt="spot" />
      <div className="spotlight-beam beam-side-left" />
    </div>

    <div className="spot-container side-right">
      <img src="/spot-fixture.png" className="spot-fixture" alt="spot" />
      <div className="spotlight-beam beam-side-right" />
    </div>
   
 {/* 
    <div className="spot-container main-left">
      <div className="spotlight-beam beam-main-left" />
    </div>

    <div className="spot-container main-right">
      <div className="spotlight-beam beam-main-right" />
    </div>
    */}
  </>
);