// src/components/PavyonTicker.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';
import './PavyonTicker.css';


export const PavyonTicker = () => {
  const pavyonList = usePavyonStore((state) => state.pavyonList);

  if (pavyonList.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      width: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      borderTop: '3px solid #ff00ff',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '10px 0'
    }}>
      <motion.div
        animate={{ x: [1920, -2000] }} // Ekranın sağından girip solundan çıkacak
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ display: 'inline-block' }}
      >
        {pavyonList.map((user, index) => (
          <span key={index} style={{
            color: '#00ffff',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginRight: '50px',
            textShadow: '0 0 10px #00ffff'
          }}>
            🌟 {user.toUpperCase()} MASADA! 🌟
          </span>
        ))}
      </motion.div>
    </div>
  );
};