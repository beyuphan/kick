// src/components/Dancers.jsx
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';
import { Dancer } from './Dancer';

export const Dancers = () => {
  const { dancers, removeDancer } = usePavyonStore();

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <AnimatePresence>
        {dancers.map((dancer) => (
          <Dancer 
            key={dancer.id}
            id={dancer.id}
            x={dancer.x}
            y={dancer.y}
            onComplete={() => removeDancer(dancer.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};