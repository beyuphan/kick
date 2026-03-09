// src/components/Particles.jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Particles({ count = 30 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Rastgele başlangıç pozisyonları ve boyutlar oluşturuyoruz
    const temp = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // Ekranda X pozisyonu (%)
      y: Math.random() * 100, // Ekranda Y pozisyonu (%)
      size: Math.random() * 4 + 1, // 1px ile 5px arası büyüklük
      duration: Math.random() * 3 + 2, // 2-5 saniye arası animasyon süresi
      delay: Math.random() * 2,
    }));
    setParticles(temp);
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#fff',
            borderRadius: '50%',
            boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.4)'
          }}
          animate={{
            y: [`${p.y}%`, `${p.y - 10}%`], // Hafif yukarı doğru süzülme
            opacity: [0, 0.8, 0], // Rastgele parlayıp sönme
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}