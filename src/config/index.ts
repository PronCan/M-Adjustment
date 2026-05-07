export const APP_CONFIG = {
  title: '뮤지컬 관람 기록',
  themeColor: '#84643E',
  defaultEmoji: '🛳️',
  availableEmojis: ['🛳️', '🛥️', '🚢'],
  
  // 캐스트 정보
  cast: {
    woojin: { role: '김우진', actors: ['온주완', '임준혁', '선한국', '이진혁'] },
    simdeok: { role: '윤심덕', actors: ['최연우', '여은', '정우연', '김수연'] },
    sane: { role: '사내', actors: ['김지온', '유현석', '원태민', '김찬종'] }
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
    { count: 5, label: '폴라 📸' },
    { count: 7, label: 'OST 🎶' }
  ]
};

export function getRoleByActor(name: string): string | null {
  if (APP_CONFIG.cast.woojin.actors.includes(name)) return APP_CONFIG.cast.woojin.role;
  if (APP_CONFIG.cast.simdeok.actors.includes(name)) return APP_CONFIG.cast.simdeok.role;
  if (APP_CONFIG.cast.sane.actors.includes(name)) return APP_CONFIG.cast.sane.role;
  return null;
}
