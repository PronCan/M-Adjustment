import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONFIG, DEFAULT_PLAYS } from '../config';
import type { PlayConfig } from '../config';

export interface Schedule {
  id: string;
  playId: string;
  date: string;
  time: string;
  holiday: boolean;
  seatRow: string;
  seatNum: string;
  cast: Record<string, string>;
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
  playId: string;
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
  plays: PlayConfig[];
  activePlayId: string | null;
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
  addPlay: (play: PlayConfig) => void;
  updatePlay: (id: string, play: Partial<PlayConfig>) => void;
  deletePlay: (id: string) => void;
  setActivePlayId: (id: string) => void;

  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  
  addRewatchCard: (playId: string, name: string) => void;
  deleteRewatchCard: (id: string) => void;
  addStamp: (cardId: string, stamp: Stamp) => void;
  updateStamp: (cardId: string, stampId: string, stamp: Partial<Stamp>, newCardId?: string) => void;
  deleteStamp: (cardId: string, stampId: string) => void;
  
  updateCoupon: (type: 'forty' | 'fifty' | 'proofpass', delta: number, memo?: string) => void;
  addCouponPack: (date: string, memo?: string) => void;
  
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  setShowSchedule: (data: any[]) => void;
  syncPlaysFromSheets: (plays: PlayConfig[]) => void;
  
  resetAll: () => void;
  restoreData: (data: any) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      plays: DEFAULT_PLAYS,
      activePlayId: DEFAULT_PLAYS[0].id,
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

      addPlay: (play) => set((state) => ({ plays: [...state.plays, play] })),
      updatePlay: (id, updated) => set((state) => ({
        plays: state.plays.map(p => p.id === id ? { ...p, ...updated } : p)
      })),
      deletePlay: (id) => set((state) => {
        const newPlays = state.plays.filter(p => p.id !== id);
        return {
          plays: newPlays,
          activePlayId: state.activePlayId === id ? (newPlays[0]?.id || null) : state.activePlayId
        };
      }),
      setActivePlayId: (id) => set({ activePlayId: id }),

      addSchedule: (schedule) => set((state) => ({ schedules: [...state.schedules, schedule] })),
      updateSchedule: (id, updated) => set((state) => ({
        schedules: state.schedules.map(s => s.id === id ? { ...s, ...updated } : s)
      })),
      deleteSchedule: (id) => set((state) => ({
        schedules: state.schedules.filter(s => s.id !== id)
      })),

      addRewatchCard: (playId, name) => set((state) => ({
        rewatchCards: [...state.rewatchCards, { id: Date.now().toString(), playId, name, stamps: [], rewards: [] }]
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

      syncPlaysFromSheets: (plays) => set((state) => {
        // Merge or replace plays. Here we replace but keep activePlayId if it still exists.
        const newActivePlayId = plays.find(p => p.id === state.activePlayId) ? state.activePlayId : (plays[0]?.id || null);
        return { plays, activePlayId: newActivePlayId };
      }),

      resetAll: () => set({
        plays: DEFAULT_PLAYS,
        activePlayId: DEFAULT_PLAYS[0].id,
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