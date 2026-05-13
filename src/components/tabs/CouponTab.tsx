import { useAppStore } from '../../store/useAppStore';
import { Card, SecTitle, Button } from '../ui';
import { DEFAULT_PLAYS } from '../../config';

export function CouponTab() {
  const { coupons, updateCoupon, activePlayId, addCouponPack, rewatchCards, plays, addRewatchCard, deleteRewatchCard } = useAppStore();
  
  const currentPlay = plays.find(p => p.id === activePlayId);
  const defaultPlay = DEFAULT_PLAYS.find(p => p.id === activePlayId);
  const packConfig = currentPlay?.couponPackConfig || defaultPlay?.couponPackConfig || { forty: 1, fifty: 1, proofpass: 1 };
  
  const currentCoupons = activePlayId && coupons[activePlayId] 
    ? coupons[activePlayId] 
    : { forty: 0, fifty: 0, proofpass: 0 };

  if (!activePlayId) {
    return (
      <div className="tab-page active">
        <div className="empty"><p>선택된 작품이 없습니다.</p></div>
      </div>
    );
  }

  return (
    <div className="tab-page active">
      <Card label="🎟 쿠폰 현황">
        <div className="coupon-grid">
          <div className="coupon-box forty">
            <div className="coupon-count">{currentCoupons.forty}</div>
            <div className="coupon-name">40% 할인권</div>
          </div>
          <div className="coupon-box fifty">
            <div className="coupon-count">{currentCoupons.fifty}</div>
            <div className="coupon-name">50% 할인권</div>
          </div>
          <div className="coupon-box proof">
            <div className="coupon-count">{currentCoupons.proofpass}</div>
            <div className="coupon-name">증빙패스</div>
          </div>
        </div>
      </Card>

      <Card label="➕ 할인권 추가 / 차감">
        <Button
          variant="danger"
          size="full"
          className="mb-2"
          onClick={() => {
            if(window.confirm("쿠폰을 모두 0으로 초기화하시겠습니까?")) {
              updateCoupon('forty', -currentCoupons.forty);
              updateCoupon('fifty', -currentCoupons.fifty);
              updateCoupon('proofpass', -currentCoupons.proofpass);
            }
          }}
        >
          🧹 쿠폰 초기화
        </Button>
   
        <div id="coupon-counters">
          <div className="counter-row">
            <span className="counter-label">40% 할인권</span>
            <div className="counter-ctrl">
              <button className="cnt-btn" onClick={() => updateCoupon('forty', -1)}>−</button>
              <span className="cnt-val">{currentCoupons.forty}</span>
              <button className="cnt-btn" onClick={() => updateCoupon('forty', 1)}>＋</button>
            </div>
          </div>
          <div className="counter-row">
            <span className="counter-label">50% 할인권</span>
            <div className="counter-ctrl">
              <button className="cnt-btn" onClick={() => updateCoupon('fifty', -1)}>−</button>
              <span className="cnt-val">{currentCoupons.fifty}</span>
              <button className="cnt-btn" onClick={() => updateCoupon('fifty', 1)}>＋</button>
            </div>
          </div>
          <div className="counter-row" style={{ borderBottom: 'none' }}>
            <span className="counter-label">증빙패스</span>
            <div className="counter-ctrl">
              <button className="cnt-btn" onClick={() => updateCoupon('proofpass', -1)}>−</button>
              <span className="cnt-val">{currentCoupons.proofpass}</span>
              <button className="cnt-btn" onClick={() => updateCoupon('proofpass', 1)}>＋</button>
            </div>
          </div>
        </div>
      </Card>
      
      <Button 
        variant="outline" 
        size="full" 
        className="mb-3"
        onClick={() => addCouponPack(new Date().toISOString().split('T')[0])}
      >
        📦 쿠폰팩 추가
      </Button>
      <p className="text-center text-sm text-gray-500" style={{ marginBottom: '20px' }}>
        {packConfig.forty > 0 && `40% ${packConfig.forty}장, `}
        {packConfig.fifty > 0 && `50% ${packConfig.fifty}장, `}
        {packConfig.proofpass > 0 && `증빙패스 ${packConfig.proofpass}장 `}
        추가됨
      </p>

      {/* <SecTitle>📋 할인권 상세 기록</SecTitle>
      <Card>
        <div className="empty"><div className="empty-icon">📋</div><p>기록이 없습니다</p></div>
      </Card> */}

      <SecTitle>📑 재관람판 현황</SecTitle>
      {rewatchCards.filter(c => c.playId === activePlayId).length === 0 ? (
        <div>
          <Card>
            <div className="empty"><div className="empty-icon">📑</div><p>등록된 재관람판이 없습니다</p></div>
            <Button 
              variant="outline" 
              size="full" 
              onClick={() => {
                const playCards = rewatchCards.filter(c => c.playId === activePlayId);
                const nextNumber = playCards.length + 1;
                addRewatchCard(activePlayId, `${nextNumber}판`);
              }}
            >
              📑 재관람판 추가
            </Button>
          </Card>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rewatchCards.filter(c => c.playId === activePlayId).map(card => (
            <div key={card.id} className="card" style={{ padding: '16px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--text)' }}>
                  📑 
                  <span 
                    style={{ outline: 'none', borderBottom: '1px dashed var(--border)', minWidth: '40px', maxWidth: '160px', cursor: 'text' }}
                  >
                    {card.name}
                  </span>
                </span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text2)' }}>{card.stamps.length}/5</span>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    style={{ marginLeft: '6px', padding: '3px 8px', fontSize: '10px', height: 'auto' }}
                    onClick={() => {
                      if (window.confirm('이 재관람판을 삭제하시겠습니까?')) {
                        deleteRewatchCard(card.id);
                      }
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const hasStamp = i < card.stamps.length;
                  const isMilestone = currentPlay?.rewatchBenefits.some(b => b.count === i + 1);
                  return (
                    <div 
                      key={i} 
                      style={{ 
                        flexShrink: 0,
                        width: '48px', height: '48px', 
                        borderRadius: '50%', 
                        border: hasStamp ? 'none' : (isMilestone ? '2px solid var(--accent)' : '2px dashed var(--border)'),
                        background: hasStamp ? 'var(--primary)' : (isMilestone ? 'rgba(122, 184, 150, 0.1)' : 'transparent'),
                        color: hasStamp ? 'var(--bg)' : (isMilestone ? 'var(--accent)' : 'var(--text2)'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => {
                        // TODO: handle stamp click
                      }}
                    >
                      {hasStamp ? '✓' : i + 1}
                    </div>
                  );
                })}
              </div>

              {currentPlay?.rewatchBenefits && currentPlay.rewatchBenefits.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {currentPlay.rewatchBenefits.map((benefit, idx) => {
                    const isReached = card.stamps.length >= benefit.count;
                    return (
                      <span 
                        key={idx}
                        style={{ 
                          fontSize: '11px', 
                          padding: '4px 8px', 
                          borderRadius: '12px',
                          background: isReached ? 'var(--primary)' : 'var(--surface2)',
                          color: isReached ? 'var(--bg)' : 'var(--text2)',
                          fontWeight: 700
                        }}
                      >
                        {benefit.count}회: {benefit.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <Button 
            variant="outline" 
            size="full" 
            onClick={() => {
              const playCards = rewatchCards.filter(c => c.playId === activePlayId);
              const nextNumber = playCards.length + 1;
              addRewatchCard(activePlayId, `${nextNumber}판`);
            }}
          >
            📑 새 재관람판 추가
          </Button>
        </div>
      )}
    </div>
  );
}
