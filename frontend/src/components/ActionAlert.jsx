import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';

export const ActionAlert = () => {
  const currentAlert = usePavyonStore((state) => state.currentAlert);
  const nextAlert = usePavyonStore((state) => state.nextAlert);

  useEffect(() => {
    if (currentAlert) {
      const timer = setTimeout(() => {
        nextAlert();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentAlert, nextAlert]);

  return (
    // Kapsayıcıyı sol üste sabitledik
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      left: '20px', 
      pointerEvents: 'none', 
      zIndex: 9999, 
      display: 'flex', 
      flexDirection: 'column',
      gap: '10px' 
    }}>
      <AnimatePresence mode="wait">
        {currentAlert && (
          <motion.div
            key={currentAlert.id}
            // Soldan içeri girme efekti daha şık durur
            initial={{ x: -100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -20, opacity: 0, filter: 'blur(5px)' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: 'rgba(20, 0, 20, 0.85)',
              backdropFilter: 'blur(8px)', // Arkayı hafif bulanıklaştırır, kalite katar
              border: '2px solid #ff007f',
              boxShadow: '0 0 15px rgba(255, 0, 127, 0.4)',
              color: '#fff',
              padding: '12px 20px', // Daha dar padding
              borderRadius: '12px', // Daha modern köşe
              fontSize: '0.9rem', // Küçük ve okunaklı
              fontWeight: '700',
              textAlign: 'left',
              textTransform: 'uppercase',
              textShadow: '0 0 8px #ff007f',
              maxWidth: '250px', // Genişliği sınırladık
              wordWrap: 'break-word',
              borderLeft: '5px solid #ff007f' // Sol tarafa vurgu çizgisi
            }}
          >
            {currentAlert.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};