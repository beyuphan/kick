import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';

export const ActionAlert = () => {
  const currentAlert = usePavyonStore((state) => state.currentAlert);
  const nextAlert = usePavyonStore((state) => state.nextAlert);

  // Ekranda bir alert varsa 4 saniye sonra sıradakine geç
  useEffect(() => {
    if (currentAlert) {
      const timer = setTimeout(() => {
        nextAlert();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentAlert, nextAlert]);

  return (
    // position: fixed ve inset: 0 ile ekranın tam ortasına sabitliyoruz
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '5vw' }}>      <AnimatePresence mode="wait">
        {currentAlert && (
          <motion.div
            key={currentAlert.id}
            initial={{ scale: 0.2, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            style={{
              background: 'rgba(15, 0, 15, 0.9)',
              border: '3px solid #ff007f',
              boxShadow: '0 0 30px #ff007f, inset 0 0 15px #ff007f',
              color: '#fff',
              padding: '2vw 4vw',
              borderRadius: '20px',
              fontSize: 'clamp(1rem, 2vw, 2rem)', // Ekran küçülse bile taşmaz! Dinamik boyut.
              fontWeight: '900',
              textAlign: 'center',
              textTransform: 'uppercase',
              textShadow: '0 0 10px #fff, 0 0 20px #ff007f',
              maxWidth: '40vw', // Ekranın %85'inden fazla genişlemez
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {currentAlert.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};