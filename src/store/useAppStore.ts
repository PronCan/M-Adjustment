import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONFIG } from '../config';

export interface Schedule {
  id: string;
  date: string;
  time: string;
  holiday: boolean;
  seatRow: string;
  seatNum: string;
  castAlex: string;
  castPhilos: string;
  event: string;
  discount: string;
  memo: string;
  cardId: string;
  stampQty: number;
  hasReceipt: boolean;
  isNanum: boolean;
}

export interface Stamp {
  id: string;
  date: string;
  time: string;
  holiday: boolean;
  discount: string;
  memo: string;
  hasReceipt: boolean;
  qty: number;
}

export interface RewatchCard {
  id: string;
  name: string;
  stamps: Stamp[];
  rewards: number[];
}

export interface CouponLog {
  id: string;
  date: string;
  type: 'forty' | 'fifty' | 'proofpass';
  delta: number;
  memo: string;
}

export interface AppState {
  schedules: Schedule[];
  rewatchCards: RewatchCard[];
  coupons: {
    forty: number;
    fifty: number;
    proofpass: number;
  };
  couponLogs: CouponLog[];
  showSchedule: any[]; // 구글 시트 데이터
  settings: {
    theme: 'light' | 'dark';
    sheetsUrl: string;
    titleEmoji: string;
    activeTab: string;
  };
  
  // Actions
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  
  addRewatchCard: (name: string) => void;
  deleteRewatchCard: (id: string) => void;
  addStamp: (cardId: string, stamp: Stamp) => void;
  updateStamp: (cardId: string, stampId: string, stamp: Partial<Stamp>, newCardId?: string) => void;
  deleteStamp: (cardId: string, stampId: string) => void;
  
  updateCoupon: (type: 'forty' | 'fifty' | 'proofpass', delta: number, memo?: string) => void;
  addCouponPack: (date: string, memo?: string) => void;
  
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  setShowSchedule: (data: any[]) => void;
  
  resetAll: () => void;
  restoreData: (data: any) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      schedules: [],
      rewatchCards: [],
      coupons: { forty: 0, fifty: 0, proofpass: 0 },
      couponLogs: [],
      showSchedule: [],
      settings: {
        theme: 'light',
        sheetsUrl: '',
        titleEmoji: APP_CONFIG.defaultEmoji,
        activeTab: 'home',
      },

      addSchedule: (schedule) => set((state) => ({ schedules: [...state.schedules, schedule] })),
      updateSchedule: (id, updated) => set((state) => ({
        schedules: state.schedules.map(s => s.id === id ? { ...s, ...updated } : s)
      })),
      deleteSchedule: (id) => set((state) => ({
        schedules: state.schedules.filter(s => s.id !== id)
      })),

      addRewatchCard: (name) => set((state) => ({
        rewatchCards: [...state.rewatchCards, { id: Date.now().toString(), name, stamps: [], rewards: [] }]
      })),
      deleteRewatchCard: (id) => set((state) => ({
        rewatchCards: state.rewatchCards.filter(c => c.id !== id)
      })),
      addStamp: (cardId, stamp) => set((state) => ({
        rewatchCards: state.rewatchCards.map(c => c.id === cardId ? { ...c, stamps: [...c.stamps, stamp] } : c)
      })),
      updateStamp: (cardId, stampId, updated, newCardId) => set((state) => {
        let cards = [...state.rewatchCards];
        
        if (newCardId && newCardId !== cardId) {
          // Move stamp to new card
          const oldCard = cards.find(c => c.id === cardId);
          const stampToMove = oldCard?.stamps.find(s => s.id === stampId);
          if (stampToMove) {
            const updatedStamp = { ...stampToMove, ...updated };
            cards = cards.map(c => {
              if (c.id === cardId) return { ...c, stamps: c.stamps.filter(s => s.id !== stampId) };
              if (c.id === newCardId) return { ...c, stamps: [...c.stamps, updatedStamp] };
              return c;
            });
          }
        } else {
          // Update in same card
          cards = cards.map(c => c.id === cardId ? {
            ...c,
            stamps: c.stamps.map(s => s.id === stampId ? { ...s, ...updated } : s)
          } : c);
        }
        
        return { rewatchCards: cards };
      }),
      deleteStamp: (cardId, stampId) => set((state) => ({
        rewatchCards: state.rewatchCards.map(c => c.id === cardId ? {
          ...c,
          stamps: c.stamps.filter(s => s.id !== stampId)
        } : c)
      })),

      updateCoupon: (type, delta, memo) => set((state) => {
        const newCount = Math.max(0, state.coupons[type] + delta);
        const actualDelta = newCount - state.coupons[type];
        
        if (actualDelta === 0) return state;

        const log: CouponLog = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          type,
          delta: actualDelta,
          memo: memo || ''
        };

        return {
          coupons: { ...state.coupons, [type]: newCount },
          couponLogs: [log, ...state.couponLogs]
        };
      }),

      addCouponPack: (date, memo) => set((state) => {
        const timestamp = Date.now();
        const logs: CouponLog[] = ['forty', 'fifty', 'proofpass'].map((type, i) => ({
          id: (timestamp + i).toString(),
          date,
          type: type as any,
          delta: 1,
          memo: memo || '쿠폰팩 추가'
        }));

        return {
          coupons: {
            forty: state.coupons.forty + 1,
            fifty: state.coupons.fifty + 1,
            proofpass: state.coupons.proofpass + 1,
          },
          couponLogs: [...logs, ...state.couponLogs]
        };
      }),

      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),
      
      setShowSchedule: (data) => set({ showSchedule: data }),

      resetAll: () => set({
        schedules: [],
        rewatchCards: [],
        coupons: { forty: 0, fifty: 0, proofpass: 0 },
        couponLogs: [],
        showSchedule: [],
      }),
      
      restoreData: (data) => set((state) => ({ ...state, ...data }))
    }),
    {
      name: 'adjust_app_state',
    }
  )
);
