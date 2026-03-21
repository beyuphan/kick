import React from 'react';
import './App.css';
import { usePavyonStore } from './store/usePavyonStore';
import { useSocket } from './hooks/useSocket';
import { VipTables } from './components/VipTables';
import { motion, AnimatePresence } from 'framer-motion';
import { PavyonTicker } from './components/PavyonTicker';
import { MoneyRain } from './components/MoneyRain';
import { Dancers } from './components/Dancers';
import { Atmosphere } from './components/Atmosphere';
import Particles from './components/Particles';
import { DjLasers } from './components/DjLasers'; 
import { DiscoBall } from './components/DiscoBall';
import { DanceFloor } from './components/DanceFloor';

function App() {
  useSocket();
  const current = usePavyonStore((state) => state.current);
  const moneyRainActive = usePavyonStore((state) => state.moneyRainActive);

  // Aksiyon varsa (meyve tabağı veya para yağmuru) ekranı sars!
  const isShaking = current?.type === 'ACTION' || moneyRainActive;

  return (
    // club-filter ve duruma göre camera-shake eklendi
    <div className={`pavyon-wrapper ${isShaking ? 'camera-shake' : ''}`}>
      
      {/* 1. KATMAN: Görüntünü (yayıncıyı) loşlaştıracak olan efekt */}
      <div className="vignette-overlay" />

      {/* 2. KATMAN: Atmosfer ışıkları ve Lazerler */}
      <Atmosphere />
      <DiscoBall />
      <DjLasers /> {/* DJ LAZERLERİ */}
      <Particles count={40} />
      
      {/* 3. KATMAN: Para yağmuru ve dansçılar */}
      <MoneyRain />
      <DanceFloor />
      <Dancers />

      {/* 4. KATMAN: VIP Masalar */}
      <VipTables />

      {/* 5. KATMAN: Duyurular */}
      <AnimatePresence>
        {current?.type === 'ACTION' && (
          <motion.div
            key="pavyon-action"
            initial={{ scale: 0, opacity: 0, rotate: -10 }}
            animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="action-notification disco-light" /* Disco animasyonu eklendi */
            style={{ 
              position: 'absolute', top: '35%', width: '100%', 
              textAlign: 'center', zIndex: 100
            }}
          >
            <h1 className="neon-sign" style={{ fontSize: '5rem' }}>
              🍊 {current.user.toUpperCase()} <br />
              MEYVE TABAĞI GÖNDERDİ!
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. KATMAN: Ticker */}
      <PavyonTicker /> 
    </div>
  );
}

export default App;