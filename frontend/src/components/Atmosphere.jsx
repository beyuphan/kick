// src/components/Atmosphere.jsx
import React from 'react';
import { AmbienceLights } from './AmbienceLights'; 
import './Atmosphere.css';

export const Atmosphere = () => {
  return (
    <div className="pavyon-overlay-container">
      <AmbienceLights />
      <div className="center-glow" />
      <div className="smoke-layer" /> {/* SENİN DUMAN EFEKTİN */}
      
      
      <div className="curtain-left" />
      <div className="curtain-right" />

      <div className="header-container">
        {/* SENİN YAZDIĞIN NEON YAZI CLASS'I */}
        <h1 className="neon-sign">URL PAVYON</h1>
      </div>
    </div>
  );
};