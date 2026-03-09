// src/components/VipTables.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePavyonStore } from '../store/usePavyonStore';
import './VipTables.css';

const VIPTablePNG = '/vip-table.png'; 
const UIFramePNG = '/ui-frame.png'; 

const VipTable = ({ title, members, side }) => (
  <div className={`vip-table-container ${side}`}>
    
    {/* Üyeler Listesi (Havada duran isimlikler) */}
    <div className="members-list">
      <AnimatePresence>
        {members.map((user, index) => (
          <motion.div
            key={user + index}
            initial={{ scale: 0, y: 50, opacity: 0 }} /* Aşağıdan yukarı zıplayarak gelsin */
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="vip-member"
            style={{ 
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <span className="vip-name">
              {user.substring(0, 12)}{user.length > 12 ? '..' : ''}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    {/* Gerçek, Derinlikli Masa Asseti */}
    <img src={VIPTablePNG} className="real-table-png" alt="vip-table"/>
    
    <h3 className="table-label">{title}</h3>
  </div>
);

export const VipTables = () => {
  const { table1, table2 } = usePavyonStore((state) => state.vipTables);

  return (
    <div className="vip-section-wrapper">
      <VipTable title="Masa 1" members={table1} side="left" />
      <VipTable title="Masa 2" members={table2} side="right" />
    </div>
  );
};