import { Card, SecTitle } from '../ui';
import { Heatmap } from './Heatmap';

export function StatsTab() {
  return (
    <div className="tab-page active">
      <SecTitle>🗺 좌석 히트맵</SecTitle>
      <Card>
        <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '8px' }}>색이 짙을수록 많이 앉은 자리입니다</div>
        <Heatmap />
      </Card>
      
      <SecTitle> 캐스트별 관람 횟수</SecTitle>
      <Card>
        <div className="empty"><div className="empty-icon">🎭</div><p>기록이 없습니다</p></div>
      </Card>
      
      <SecTitle>👫 페어 조합별 관람</SecTitle>
      <Card>
        <div className="empty"><div className="empty-icon">👫</div><p>기록이 없습니다</p></div>
      </Card>
    </div>
  );
}
