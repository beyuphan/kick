import React from 'react';
import './App.css'; // Stil dosyasını import ettik
import { usePavyonStore } from './store/usePavyonStore';
import { useSocket } from './hooks/useSocket';
import { VipTables } from './components/VipTables';
import { motion, AnimatePresence } from 'framer-motion';
import { PavyonTicker } from './components/PavyonTicker';
import { MoneyRain } from './components/MoneyRain';
import { Dancers } from './components/Dancers';
import { Atmosphere } from './components/Atmosphere';
import Particles from './components/Particles';
function App() {
  useSocket(); // Socket dinleyicilerini başlatıyoruz
  const current = usePavyonStore((state) => state.current);

  return (
    // "pavyon-wrapper" class'ı ile App.css'teki ayarları çekiyoruz
    <div className="pavyon-wrapper">
      
      {/* 1. KATMAN: Görüntünü (yayıncıyı) loşlaştıracak olan efekt */}
      <div className="vignette-overlay" />

      {/* 2. KATMAN: Atmosfer ışıkları (Senin üzerine neon süzülmeleri vurur) */}
      <Atmosphere />
      <Particles count={40} />
      {/* 3. KATMAN: Para yağmuru ve dansçılar (Görsel şölen katmanı) */}
      <MoneyRain />
      <Dancers />

      {/* 4. KATMAN: VIP Masalar (Senin biraz önünde dururlar) */}
      <VipTables />

      {/* 5. KATMAN: Duyurular (Meyve tabağı vb. büyük aksiyonlar) */}
      <AnimatePresence>
        {current?.type === 'ACTION' && (
          <motion.div
            key="pavyon-action"
            initial={{ scale: 0, opacity: 0, rotate: -10 }}
            animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="action-notification"
            style={{ 
              position: 'absolute', 
              top: '35%', 
              width: '100%', 
              textAlign: 'center',
              zIndex: 100
            }}
          >
            <h1 className="neon-text" style={{ fontSize: '5rem' }}>
              🍊 {current.user.toUpperCase()} <br />
              MEYVE TABAĞI GÖNDERDİ!
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. KATMAN: En önde duran altyazı barı */}
      <PavyonTicker /> 
    </div>
  );
}

export default App;