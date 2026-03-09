import React from 'react';
import { SpotLight } from './SpotLight';
import './Atmosphere.css';

export const Atmosphere = () => {
  return (
    <div className="pavyon-overlay-container">
      <SpotLight side="left" />
      <SpotLight side="right" />

      <div className="header-container">
        {/* Senin yapacağın o kurdele buraya gelecek aşko */}
        <img src="/header-ribbon.png" style={{ width: '700px' }} alt="banner" />
        <h1 className="pavyon-title">URL PAVYON</h1>
      </div>
    </div>
  );
};