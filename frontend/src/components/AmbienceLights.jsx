// src/components/AmbienceLights.jsx
import React from 'react';

export const AmbienceLights = () => (
  <>
    {/* CSS'te yazdığımız duman katmanı */}
    <div className="smoke-overlay" />
    
    {/* CSS'te yazdığımız dönen neon disko ışıltıları */}
    <div className="disco-sparkles" />

    {/* YENİ: Sahneyi Tarayan Hareketli Spotlar */}
    <div className="spotlight-left" />
    <div className="spotlight-right" />
  </>
);