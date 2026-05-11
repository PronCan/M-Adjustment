import { SecTitle } from '../ui';

export function HomeTab() {
  return (
    <div className="tab-page active">
      {/* <Card label="🎟 할인권 현황">
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
      </Card> */}

      <SecTitle>📑 재관람카드</SecTitle>
      {/* Rewatch cards list will go here */}
      
      {/* <SecTitle>📌 예매 확정 내역</SecTitle> */}
      {/* Confirmed schedules will go here */}
    </div>
  );
}
