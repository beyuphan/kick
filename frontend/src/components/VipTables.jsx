// src/components/VipTables.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';
import './VipTables.css';

// DİKKAT: Uzantıyı PNG yapmalısın ve public klasöründe olmalı.
const VIPTablePNG = '/loca.png'; 

const VipTable = ({ title, members, side }) => (
  <div className={`vip-table-container ${side}`}>
    
    <img src={VIPTablePNG} className="real-table-png" alt="vip-table"/>
    
    <div className="members-list">
      <AnimatePresence>
        {members.map((user, index) => (
          <motion.div
            key={user + index}
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`vip-member seat-${index}`} 
          >
            {/* Oraya gerçekten biri oturmuş hissi vermek için avatar */}
            <div className="avatar-ikon">👤</div> 
            <span className="vip-name">
              {user.substring(0, 10)}{user.length > 10 ? '..' : ''}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
);

export const VipTables = () => {
  const { table1, table2 } = usePavyonStore((state) => state.vipTables);

  return (
    <div className="vip-section-wrapper">
      <VipTable title="Loca 1" members={table1} side="left" />
      <VipTable title="Loca 2" members={table2} side="right" />
    </div>
  );
};