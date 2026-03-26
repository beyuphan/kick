import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';

export const MoneyRain = () => {
  const isActive = usePavyonStore((state) => state.moneyRainActive);

  const bills = useMemo(() =>
    Array.from({ length: 50 }).map((_, i) => ({ // Sayıyı 50'ye çıkardım, daha zengin dursun
      id: i,
      // YAYILIM: Ekranın %-60 solundan %60 sağına kadar geniş bir alan
      targetX: (Math.random() - 0.5) * 120 + 'vw', 
      
      // YÜKSEKLİK: Ekranın %40 ile %90'ı arasına kadar fırlasın
      targetY: -(Math.random() * 50 + 40) + 'vh',
      
      delay: Math.random() * 2.5, // Daha uzun süreli bir saçılma
      duration: 3 + Math.random() * 2, // Havada kalma süresi (biraz daha yavaş süzülsün)
      
      // Kaç tur döneceği (Daha fazla rotasyon)
      rotate: Math.random() * 1440 - 720, 
      
      // Paranın boyutu (bazıları büyük bazıları küçük gelirse derinlik katar)
      scale: 0.5 + Math.random() * 0.8
    })), []);

  if (!isActive) return null;

  return (
    <div style={{ 
      position: 'absolute', 
      inset: 0, 
      pointerEvents: 'none', 
      overflow: 'hidden',
      zIndex: 100 
    }}>
      {bills.map((bill) => (
        <motion.div
          key={bill.id}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 0, 
            scale: 0,
            left: '50%', // Tam ortadan başla
            bottom: '5%' // En alttan
          }}
          animate={{
            // X: Ortadan başla, fırlarken rastgele genişliğe yayıl
            x: [0, bill.targetX],
            
            // Y: Fırlat, tepe noktada yavaşlasın, sonra yer çekimiyle düş
            y: [0, bill.targetY, '110vh'], 
            
            opacity: [0, 1, 1, 0], // Çıkarken belir, düşerken kaybol
            scale: [0, bill.scale, bill.scale, 0.5],
            rotate: bill.rotate
          }}
          transition={{
            duration: bill.duration,
            delay: bill.delay,
            // Animasyonun %35'inde yukarı varır, kalanda aşağı düşer
            times: [0, 0.35, 1], 
            ease: "easeOut" // Daha organik bir fırlama
          }}
          style={{
            position: 'absolute',
            fontSize: '3.5rem',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' // Paralar daha belirgin
          }}
        >
          💵
        </motion.div>
      ))}
    </div>
  );
};