// src/components/MoneyRain.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';

export const MoneyRain = () => {
  const isActive = usePavyonStore((state) => state.moneyRainActive);

  // Performans için paraları memoize ediyoruz
  const bills = useMemo(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2
    })), []);

  if (!isActive) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {bills.map((bill) => (
        <motion.div
          key={bill.id}
          initial={{ y: '110vh', opacity: 1, rotate: 0 }}
          animate={{ y: '-20vh', opacity: 0, rotate: 360 }}
          transition={{ 
            duration: bill.duration, 
            delay: bill.delay, 
            ease: "linear" 
          }}
          style={{
            position: 'absolute',
            left: bill.left,
            fontSize: '3rem',
            zIndex: 100
          }}
        >
          💵
        </motion.div>
      ))}
    </div>
  );
};