import { create } from 'zustand';

export const usePavyonStore = create((set, get) => ({
  // --- STATE ---
  queue: [],
  current: null,
  pavyonList: [],
  vipTables: { table1: [], table2: [] },
  moneyRainActive: false,
  dancers: [],
  strobeActive: false,
  roseRainActive: false,
  alertQueue: [], // Alert kuyruğu
  currentAlert: null, // Şu an ekranda olan yazı

  // --- ACTIONS ---

  // VIP Masaya Oturma ve 3 Dakika Sınırı
  occupyTable: (user) => {
    const { table1, table2 } = get().vipTables;
    const shortName = user.length > 10 ? user.substring(0, 10) + ".." : user;
    
    let targetTable = null;
    
    // Masa kapasite kontrolü (Her masa 2 kişi)
    if (table1.length < 2) {
      targetTable = 'table1';
    } else if (table2.length < 2) {
      targetTable = 'table2';
    }

    if (targetTable) {
      // Masaya yerleştir
      set((state) => ({
        vipTables: {
          ...state.vipTables,
          [targetTable]: [...state.vipTables[targetTable], shortName]
        }
      }));

      // 3 Dakika (180.000 ms) sonra otomatik masadan kaldırma
      setTimeout(() => {
        get().leaveTable(targetTable, shortName);
      }, 180000);
    }
  },

  // Masadan Kalkma Fonksiyonu
  leaveTable: (tableName, userName) => set((state) => ({
    vipTables: {
      ...state.vipTables,
      [tableName]: state.vipTables[tableName].filter(name => name !== userName)
    }
  })),

  // Pavyona Giriş Yapanları Listeye Ekleme
  addPavyonUser: (user) => set((state) => {
    if (state.pavyonList.includes(user)) return state;
    return { pavyonList: [...state.pavyonList, user] };
  }),

  // Meyve/Para Kuyruğu İşlemleri
  addEvent: (event) => {
    set((state) => ({ queue: [...state.queue, event] }));
    if (!get().current) get().next();
  },

  next: () => {
    const { queue } = get();
    if (queue.length === 0) {
      set({ current: null });
      return;
    }
    const nextEvent = queue[0];
    set({ current: nextEvent, queue: queue.slice(1) });
    setTimeout(() => get().next(), 4000); // 4 saniye sonra sıradaki animasyon
  },

  // Efekt Tetikleyiciler
  triggerMoneyRain: () => {
    set({ moneyRainActive: true });
    setTimeout(() => set({ moneyRainActive: false }), 5000);
  },

  triggerStrobe: () => {
    set({ strobeActive: true });
    setTimeout(() => set({ strobeActive: false }), 2000);
  },

  triggerRoseRain: () => {
    set({ roseRainActive: true });
    setTimeout(() => set({ roseRainActive: false }), 6000);
  },

  // Dansçı Yönetimi
  addDancer: () => set((state) => {
  // Ekranda zaten 8 kişi varsa daha fazla ekleme
  if (state.dancers.length >= 8) {
    console.log("🚫 [SİSTEM] Pist dolu, maksimum 8 dansçı!");
    return state;
  }
  
  return {
    dancers: [
      ...state.dancers, 
      { id: Date.now() + Math.random(), x: Math.random() * 80, y: 20 + Math.random() * 40 }
    ]
  };
}),

  removeDancer: (id) => set((state) => ({
    dancers: state.dancers.filter(d => d.id !== id)
  })),

  // Alert (Uyarı/Duyuru) Sistemi
  triggerAlert: (msg, type = 'default') => {
    set((state) => {
      const newAlert = { id: Date.now() + Math.random(), msg, type };
      if (!state.currentAlert) {
        return { currentAlert: newAlert };
      }
      return { alertQueue: [...state.alertQueue, newAlert] };
    });
  },
  
  nextAlert: () => {
    set((state) => {
      if (state.alertQueue.length > 0) {
        return { 
          currentAlert: state.alertQueue[0], 
          alertQueue: state.alertQueue.slice(1) 
        };
      }
      return { currentAlert: null };
    });
  },

  // Arayüzü Sıfırlama (Admin Komutu için)
  resetUI: () => set({ 
    vipTables: { table1: [], table2: [] }, 
    pavyonList: [], 
    current: null,
    dancers: []
  }),

}));