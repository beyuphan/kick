import React from 'react';
import { AmbienceLights } from './AmbienceLights'; 
import './Atmosphere.css';

export const Atmosphere = () => {
  return (
    <div className="pavyon-overlay-container">
      {/* Arka plan dumanı ve spot ışıklar */}
      <AmbienceLights />
      
      {/* YENİ: Sahneyi çerçeveleyen kadife perdeler */}
      <div className="curtain-left" />
      <div className="curtain-right" />

      <div className="header-container">
        {/* Üstteki URL PAVYON Tabelası */}
        <img src="/header-ribbon.png" style={{ width: '700px' }} alt="banner" />
        <h1 className="pavyon-title" style={{ fontFamily: "'Pacifico', cursive" }}>URL PAVYON</h1>
      </div>
    </div>
  );
};