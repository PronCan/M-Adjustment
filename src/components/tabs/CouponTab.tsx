import { useAppStore } from '../../store/useAppStore';
import { Card, Button } from '../ui';
import { DEFAULT_PLAYS } from '../../config';
import { RewatchBoard } from '../RewatchBoard';

export function CouponTab() {
  const { coupons, updateCoupon, activePlayId, addCouponPack, plays } = useAppStore();
  
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

      <RewatchBoard />
    </div>
  );
}
