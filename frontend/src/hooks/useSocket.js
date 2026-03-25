import { useEffect } from 'react';
import io from 'socket.io-client';
import { usePavyonStore } from '../store/usePavyonStore';

const socket = io('http://127.0.0.1:5000', {
  transports: ['websocket', 'polling'], 
  forceNew: true,
  reconnectionAttempts: 5
});


const playSound = (type) => {
  let audio;
  if (type === 'champagne') audio = new Audio('/sounds/champagne.mp3');
  if (type === 'airhorn') audio = new Audio('/sounds/airhorn.mp3'); 
  
  if (audio) {
    audio.volume = 1.0;
    audio.play().catch(e => console.log("Ses çalınamadı (Tarayıcı izni gerekebilir):", e));
  }
};

export const useSocket = () => {
  // Eski Aksiyonlar
  const addEvent = usePavyonStore((state) => state.addEvent);
  const addPavyonUser = usePavyonStore((state) => state.addPavyonUser);
  const occupyTable = usePavyonStore((state) => state.occupyTable);
  const resetUI = usePavyonStore((state) => state.resetUI);
  const triggerMoneyRain = usePavyonStore((state) => state.triggerMoneyRain);

  // YENİ Aksiyonlar (Şampanya, Çakar, Gül)
  const triggerAlert = usePavyonStore((state) => state.triggerAlert);
  const triggerStrobe = usePavyonStore((state) => state.triggerStrobe);
  const triggerRoseRain = usePavyonStore((state) => state.triggerRoseRain);

  useEffect(() => {
    socket.on('pavyon_join', (data) => addPavyonUser(data.user));
    socket.on('occupy_table', (data) => occupyTable(data.user));
    socket.on('reset_ui', () => resetUI());
    socket.on('action', (data) => addEvent({ type: 'ACTION', actionType: data.type, user: data.user }));

    socket.on('money_rain', (data) => {
      console.log('💸 Para yağmuru başlıyor:', data.user);
      triggerAlert(`💸 ${data.user} PARALARI SAÇIYOR!`); 
      triggerMoneyRain();
    });




  
    socket.on('action_alert', (data) => {
      console.log('🍾 Özel Uyarı:', data.message);
      triggerAlert(data.message);
      if (data.type === 'champagne') playSound('champagne');
    });

    // Çakar Işıklar (Ekranda flaş patlaması ve korna sesi)
    socket.on('strobe_lights', (data) => {
      console.log('🚨 Çakar Işıklar Açıldı:', data?.user);
      triggerAlert(`🚨 ${data.user} MEKANI KOPARIYOR!`); 
      triggerStrobe();
      playSound('airhorn'); // Çakarlarla beraber korna süper gider
    });

    // Gül Yağmuru
    socket.on('rose_rain', (data) => {
      console.log('🌹 Gül yağıyor:', data?.user);
      triggerAlert(`🌹 ${data.user} MASALARA GÜL DÖKTÜRDÜ!`); 
      triggerRoseRain();
    });


    socket.on('meyve_trigger', (data) => {
      console.log('🍊 Meyve tabağı geldi:', data.user);
      
      // O muazzam alert ekranında yazıyı patlatıyoruz
      triggerAlert(`🍊 ${data.user.toUpperCase()} VİP MASALARA MEYVE TABAĞI GÖNDERDİ!`);
      
     
    });



    socket.on('show_balance', (data) => {
      alert(`${data.user} bakiyeniz: ${data.balance} TL`);
    });

    
    return () => {
      socket.off('pavyon_join');
      socket.off('occupy_table');
      socket.off('money_rain');
      socket.off('show_balance');
      socket.off('reset_ui');
      socket.off('action');
      socket.off('action_alert');
      socket.off('strobe_lights');
      socket.off('rose_rain');
      socket.off('meyve_trigger');
    };
  }, [
    addEvent, addPavyonUser, occupyTable, resetUI, triggerMoneyRain,
    triggerAlert, triggerStrobe, triggerRoseRain
  ]);

};