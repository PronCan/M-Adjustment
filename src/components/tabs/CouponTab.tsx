import { useAppStore } from '../../store/useAppStore';
import { Card, SecTitle, Button } from '../ui';

export function CouponTab() {
  const { coupons, updateCoupon } = useAppStore();

  return (
    <div className="tab-page active">
      <Card label="🎟 쿠폰 현황">
        <div className="coupon-grid">
          <div className="coupon-box forty">
            <div className="coupon-count">{coupons.forty}</div>
            <div className="coupon-name">40% 할인권</div>
          </div>
          <div className="coupon-box fifty">
            <div className="coupon-count">{coupons.fifty}</div>
            <div className="coupon-name">50% 할인권</div>
          </div>
          <div className="coupon-box proof">
            <div className="coupon-count">{coupons.proofpass}</div>
            <div className="coupon-name">증빙패스</div>
          </div>
        </div>
      </Card>

      <Card label="➕ 할인권 추가 / 차감">
        <div id="coupon-counters">
          <div className="counter-row">
            <span className="counter-label">40% 할인권</span>
            <div className="counter-ctrl">
              <button className="cnt-btn" onClick={() => updateCoupon('forty', -1)}>−</button>
              <span className="cnt-val">{coupons.forty}</span>
              <button className="cnt-btn" onClick={() => updateCoupon('forty', 1)}>＋</button>
            </div>
          </div>
          <div className="counter-row">
            <span className="counter-label">50% 할인권</span>
            <div className="counter-ctrl">
              <button className="cnt-btn" onClick={() => updateCoupon('fifty', -1)}>−</button>
              <span className="cnt-val">{coupons.fifty}</span>
              <button className="cnt-btn" onClick={() => updateCoupon('fifty', 1)}>＋</button>
            </div>
          </div>
          <div className="counter-row" style={{ borderBottom: 'none' }}>
            <span className="counter-label">증빙패스</span>
            <div className="counter-ctrl">
              <button className="cnt-btn" onClick={() => updateCoupon('proofpass', -1)}>−</button>
              <span className="cnt-val">{coupons.proofpass}</span>
              <button className="cnt-btn" onClick={() => updateCoupon('proofpass', 1)}>＋</button>
            </div>
          </div>
        </div>
      </Card>
      
      <Button variant="outline" size="full" className="mb-3">📦 쿠폰팩 추가</Button>

      <SecTitle>📋 할인권 상세 기록</SecTitle>
      <Card>
        <div className="empty"><div className="empty-icon">📋</div><p>기록이 없습니다</p></div>
      </Card>
    </div>
  );
}
