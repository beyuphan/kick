import { useEffect } from 'react';
import io from 'socket.io-client';
import { usePavyonStore } from '../store/usePavyonStore';

// 'localhost' yerine '127.0.0.1' dene ve transport ayarını ekle
const socket = io('http://127.0.0.1:5000', {
  transports: ['websocket', 'polling'], // Önce websocket dene
  forceNew: true,
  reconnectionAttempts: 5
});

export const useSocket = () => {
  const addEvent = usePavyonStore((state) => state.addEvent);
  const addPavyonUser = usePavyonStore((state) => state.addPavyonUser);
  const occupyTable = usePavyonStore((state) => state.occupyTable);
  const resetUI = usePavyonStore((state) => state.resetUI);

  useEffect(() => {
    // !pavyon komutu gelince
    socket.on('pavyon_join', (data) => {
      console.log('🕺 Altyazıya ekleniyor:', data.user);
      addPavyonUser(data.user);
    });

    // !vip komutu gelince
    socket.on('occupy_table', (data) => {
      console.log('🛋️ VIP Masaya ekleniyor:', data.user);
      occupyTable(data.user);
    });
    socket.on('money_rain', (data) => {
      console.log('💸 Para yağmuru başlıyor:', data.user);
      usePavyonStore.getState().triggerMoneyRain();
    });

    socket.on('dance_trigger', (data) => {
      console.log('💃 Yeni dansçı sahneye çıktı:', data.user);
      usePavyonStore.getState().addDancer();
    });

    socket.on('show_balance', (data) => {
      // Ekranın bir köşesinde 3 saniyelik bakiye uyarısı gösterilebilir
      alert(`${data.user} bakiyeniz: ${data.balance} TL`); // Şimdilik basitçe alert
    });
    // Sıfırlama komutu gelince
    socket.on('reset_ui', () => {
      console.log('🧹 Ekran temizleniyor...');
      resetUI();
    });

    // Eski dinleyiciler (Meyve vb.)
    socket.on('action', (data) => addEvent({ type: 'ACTION', actionType: data.type, user: data.user }));
    
    return () => socket.off();
  }, [addEvent, addPavyonUser, occupyTable, resetUI]);
};