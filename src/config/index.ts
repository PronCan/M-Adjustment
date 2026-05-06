export const APP_CONFIG = {
  title: '아웃캐스트 관람 기록',
  themeColor: '#84643E',
  defaultEmoji: '🕊️',
  availableEmojis: ['🕊️', '🦋', '🦌'],
  
  // 캐스트 정보
  cast: {
    alex: { role: '알렉산드로스', actors: ['이승준', '이세헌', '함태규'] },
    philos: { role: '필로스', actors: ['이동연', '박경호', '차규민'] }
  },

  // 할인 종류
  discounts: [
    { id: 'none', label: '없음' },
    { id: 'preview', label: '프리뷰 할인' },
    { id: 'rewatch', label: '재관람 할인' },
    { id: 'forty', label: '40% 할인권' },
    { id: 'fifty', label: '50% 할인권' },
    { id: 'proofpass', label: '증빙패스' },
    { id: 'onsite', label: '현매 할인' }
  ],

  // 재관람 혜택
  rewatchBenefits: [
    { count: 3, label: '40% 할인권 2장 🎫' },
    { count: 5, label: '폴라 📸' },
    { count: 7, label: '50% 할인권 + OST 🎶' }
  ]
};

export function getRoleByActor(name: string): string | null {
  if (APP_CONFIG.cast.alex.actors.includes(name)) return APP_CONFIG.cast.alex.role;
  if (APP_CONFIG.cast.philos.actors.includes(name)) return APP_CONFIG.cast.philos.role;
  return null;
}
