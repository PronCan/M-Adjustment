export interface CastMember {
  role: string;
  actors: string[];
}

export interface PlayConfig {
  id: string;
  title: string;
  layout: 'dream2' | 'bugs' | 'payco' | 'none';
  cast: Record<string, CastMember>;
  rewatchBenefits: { count: number; label: string }[];
}

export const DEFAULT_PLAYS: PlayConfig[] = [
  {
    id: 'play-1',
    title: '사의 찬미',
    layout: 'dream2',
    cast: {
      woojin: { role: '김우진', actors: ['온주완', '임준혁', '선한국', '이진혁'] },
      simdeok: { role: '윤심덕', actors: ['최연우', '여은', '정우연', '김수연'] },
      sane: { role: '사내', actors: ['김지온', '유현석', '원태민', '김찬종'] }
    },
    rewatchBenefits: [
      { count: 5, label: '폴라 📸' },
      { count: 7, label: 'OST 🎶' }
    ]
  }
];

export const APP_CONFIG = {
  title: '뮤지컬 관람 기록',
  themeColor: '#dbebe1',
  defaultEmoji: '🛳️',
  availableEmojis: ['🛳️', '🛥️', '🚢'],
  
  // 할인 종류
  discounts: [
    { id: 'none', label: '없음' },
    { id: 'preview', label: '프리뷰 할인' },
    { id: 'rewatch', label: '재관람 할인' },
    { id: 'forty', label: '40% 할인권' },
    { id: 'fifty', label: '50% 할인권' },
    { id: 'proofpass', label: '증빙패스' },
    { id: 'timesale', label: '타임세일' },
    { id: 'onsite', label: '현매 할인' }
  ]
};

export function getRoleByActor(play: PlayConfig, name: string): string | null {
  for (const key in play.cast) {
    if (play.cast[key].actors.includes(name)) return play.cast[key].role;
  }
  return null;
}
