// src/components/VipTables.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';
import './VipTables.css';

// Yeni Assetlerimizi public klasöründen referans alıyoruz
const VIPTablePNG = '/vip-table.png'; 
const UIFramePNG = '/ui-frame.png'; 

const VipTable = ({ title, members, side }) => (
  <div className={`vip-table-container ${side}`}>
    {/* Gerçek, Derinlikli Masa Asseti */}
    <img src={VIPTablePNG} className="real-table-png" alt="table"/>
    
    <div className="members-list">
      <AnimatePresence>
        {members.map((user, index) => (
          <motion.div
            key={user + index}
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="vip-member"
            /* Yeni Glassmorphism UI Kutusu Asseti */
            style={{ 
              backgroundImage: `url(${UIFramePNG})`, 
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <span className="vip-name pavyon-neon-text">
              {user.substring(0, 15)}{user.length > 15 ? '..' : ''}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
    <h3 className="table-label pavyon-neon-text">{title}</h3>
  </div>
);

export const VipTables = () => {
  const { table1, table2 } = usePavyonStore((state) => state.vipTables);

  return (
    <div className="vip-section-wrapper">
      <VipTable title="" members={table1} side="left" />
      <VipTable title="" members={table2} side="right" />
    </div>
  );
};