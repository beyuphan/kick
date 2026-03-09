// src/components/Dancers.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';

export const Dancers = () => {
  const { dancers, removeDancer } = usePavyonStore();

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <AnimatePresence>
        {dancers.map((dancer) => (
          <motion.div
            key={dancer.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onAnimationComplete={() => {
              // 5 saniye sonra dansçıyı listeden kaldır ki state şişmesin
              setTimeout(() => removeDancer(dancer.id), 5000);
            }}
            style={{
              position: 'absolute',
              left: `${dancer.x}%`,
              top: `${dancer.y}%`,
              fontSize: '5rem',
              zIndex: 50
            }}
          >
            💃
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};