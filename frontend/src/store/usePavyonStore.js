import { create } from 'zustand';

export const usePavyonStore = create((set, get) => ({
  queue: [],
  current: null,
  pavyonList: [],
  vipTables: {table1: [], table2: []},
  vipTables: { table1: [], table2: [] },
  moneyRainActive: false,
  dancers: [],
  occupyTable: (user) => set((state) => {
    const shortName = user.length > 10 ? user.substring(0, 10) + ".." : user;
    if (state.vipTables.table1.length < 2) {
      return { vipTables: { ...state.vipTables, table1: [...state.vipTables.table1, shortName] } };
    } else if (state.vipTables.table2.length < 2) {
      return { vipTables: { ...state.vipTables, table2: [...state.vipTables.table2, shortName] } };
    }
    return state; // Masalar doluysa bir şey yapma
  }),
  addPavyonUser: (user) => set((state) => {
    // Aynı isimden varsa tekrar ekleme (Set mantığı)
    if (state.pavyonList.includes(user)) return state;
    return { pavyonList: [...state.pavyonList, user] };
  }),
  // Kuyruğa yeni bir olay (para veya meyve) ekle
  addEvent: (event) => {
    set((state) => ({ queue: [...state.queue, event] }));
    if (!get().current) get().next();
  },
  triggerMoneyRain: () => {
    set({ moneyRainActive: true });
    setTimeout(() => set({ moneyRainActive: false }), 5000); // 5 saniye sürsün
  },

  addDancer: () => set((state) => ({
    dancers: [...state.dancers, { id: Date.now(), x: Math.random() * 80, y: Math.random() * 60 }]
  })),

  removeDancer: (id) => set((state) => ({
    dancers: state.dancers.filter(d => d.id !== id)
  })),
  // Sıradaki animasyona geç
  next: () => {
    const { queue } = get();
    if (queue.length === 0) {
      set({ current: null });
      return;
    }
    const nextEvent = queue[0];
    set({ current: nextEvent, queue: queue.slice(1) });

    // Animasyon süresi (Örn: 4 saniye) sonra sonrakine geç
    setTimeout(() => get().next(), 4000);
  },
  
  resetUI: () => set({ vipTables: { table1: [], table2: [] }, pavyonList: [], current: null }),

}));