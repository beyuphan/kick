import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';

// Public klasörüne atacağın gif dosyalarının isimleri
const gifler = ['/dancer1.gif', '/dancer2.gif', '/dancer3.gif', '/dancer4.gif'];

export const Dancers = () => {
  const { dancers, removeDancer } = usePavyonStore();

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <AnimatePresence>
        {dancers.map((dancer) => {
          // Gelen adamın ID'sine göre diziden rastgele bir GIF seçiyoruz
          const selectedGif = gifler[dancer.id % gifler.length];

          return (
            <motion.div
              key={dancer.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onAnimationComplete={() => {
                // 5 saniye çok az, sahnede 10 saniye oynasınlar
                setTimeout(() => removeDancer(dancer.id), 10000);
              }}
              style={{
                position: 'absolute',
                left: `${dancer.x}%`,
                top: `${dancer.y}%`,
                transform: 'translate(-50%, -50%)', // Tam koordinata ortalar
                zIndex: 50
              }}
            >
              <img 
                src={selectedGif} 
                alt="Pavyon Dansçısı" 
                style={{ 
                  width: '180px', // Dansçıların büyüklüğü
                  height: 'auto',
                  // Pavyon havası için arkalarına pembe neon bir gölge veriyoruz
                  filter: 'drop-shadow(0px 0px 15px rgba(255, 20, 147, 0.8))' 
                }} 
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};