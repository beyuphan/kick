import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';

export const RoseRain = () => {
  const isActive = usePavyonStore((state) => state.roseRainActive);

  const roses = useMemo(() => 
    Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      delay: Math.random() * 2, // Güller biraz daha dağınık düşsün
      duration: 4 + Math.random() * 5, // Paraya göre daha yavaş süzülürler (4-9 saniye)
      rotation: Math.random() * 360,
      size: 2 + Math.random() * 2 // Farklı boyutlarda güller
    })), []);

  if (!isActive) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 105 }}>
      {roses.map((rose) => (
        <motion.div
          key={rose.id}
          initial={{ y: '-20vh', opacity: 1, rotate: rose.rotation }}
          animate={{ y: '110vh', opacity: 0.8, rotate: rose.rotation + 360 }} // Döne döne düşer
          transition={{ 
            duration: rose.duration, 
            delay: rose.delay, 
            ease: "linear" 
          }}
          style={{
            position: 'absolute',
            left: rose.left,
            fontSize: `${rose.size}rem`,
            filter: 'drop-shadow(0px 0px 5px rgba(255, 0, 0, 0.8))' // Kırmızı parlama
          }}
        >
          🌹
        </motion.div>
      ))}
    </div>
  );
};