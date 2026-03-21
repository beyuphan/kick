// src/components/Particles.jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Sayıyı varsayılan olarak 30'dan 150'ye çıkardık, ekranı daha iyi dolduracak
export default function Particles({ count = 300 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Karmaşık RGB yerine sade, şık ve mekana uygun tonlar (Beyaz ve Altın Sarısı)
    const colors = ['#ffffff', '#ffd700', '#fdf5e6'];

    const temp = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, 
      y: Math.random() * 100, 
      size: Math.random() * 4 + 2, // 2px ile 6px arası (biraz daha belirgin)
      duration: Math.random() * 4 + 2, // 2-6 saniye arası animasyon
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      // Sadece yukarı çıkmasınlar, rüzgar varmış gibi sağa sola da hafif uçuşsunlar
      driftX: (Math.random() - 0.5) * 10 
    }));
    setParticles(temp);
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '50%',
            // Etraflarına kendi renklerinde hafif bir parlama (glow) verdik
            boxShadow: `0 0 15px 3px ${p.color}80` 
          }}
          animate={{
            y: [`${p.y}%`, `${p.y - 15}%`], 
            x: [`${p.x}%`, `${p.x + p.driftX}%`], // Sağa sola süzülme hareketi
            opacity: [0, 0.9, 0], // Parlayıp sönme
            scale: [0.6, 1.3, 0.6] // Büyüyüp küçülme
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