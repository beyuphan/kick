// src/components/Dancer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './Dancer.css';

export const Dancer = ({ id, x, y, onComplete }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onAnimationComplete={() => {
        // Dansçı 8 saniye sahnede kalsın
        setTimeout(onComplete, 8000);
      }}
      className="dancer-container"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="pavyon-dancer-sprite" />
    </motion.div>
  );
};