export interface CastMember {
  role: string;
  actors: string[];
}

export interface PlayConfig {
  id: string;
  title: string;
  emoji?: string;
  layout: 'dream2' | 'bugs' | 'payco' | 'none';
  cast: Record<string, CastMember>;
  rewatchBenefits: { count: number; label: string }[];
  couponPackConfig?: {
    forty: number;
    fifty: number;
    proofpass: number;
  };
}

export const DEFAULT_PLAYS: PlayConfig[] = [
  {
    id: 'play-1',
    title: '사의 찬미',
    emoji: '🛳️',
    layout: 'dream2',
    cast: {
      woojin: { role: '김우진', actors: ['온주완', '임준혁', '선한국', '이진혁'] },
      simdeok: { role: '윤심덕', actors: ['최연우', '여은', '정우연', '김수연'] },
      sane: { role: '사내', actors: ['김지온', '유현석', '원태민', '김찬종'] }
    },
    rewatchBenefits: [
      { count: 5, label: '폴라 📸' },
      { count: 7, label: 'OST 🎶' }
    ],
    couponPackConfig: { forty: 1, fifty: 1, proofpass: 1 }
  },
  {
    id: 'play-2',
    title: '비스티',
    emoji: '🍾',
    layout: 'bugs',
    cast: {
      ljh: { role: '이재현', actors: ['김종구', '정동화', '박규원','최호승'] },
      kjn: { role: '김주노', actors: ['정민', '조풍래', '온주완','선한국'] },
      alex: { role: '알렉스', actors: ['송상훈', '문경초', '노희찬','김한결'] },
      lsw: { role: '이승우', actors: ['임태현', '조훈', '박준형','김서형'] },
      kmh: { role: '강민혁', actors: ['남민우', '반정모', '박정혁', '홍기범'] },
    },
    rewatchBenefits: [
      { count: 5, label: '쿠폰팩/솔로 OST/페어 OST' },
    ],
    couponPackConfig: { forty: 1, fifty: 2, proofpass: 1 }
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
