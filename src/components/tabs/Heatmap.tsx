import { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SEAT_LAYOUT_DREAM2, SEAT_LAYOUT_BUGS } from '../../config/seatLayout';

export function Heatmap() {
  const schedules = useAppStore((state) => state.schedules);
  const activePlayId = useAppStore((state) => state.activePlayId);
  const plays = useAppStore((state) => state.plays);
  
  const activePlay = plays.find(p => p.id === activePlayId);
  const layout = activePlay?.layout || 'none';

  const seatCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    schedules.filter(s => s.playId === activePlayId).forEach(s => {
      if (s.seatRow && s.seatNum) {
        const key = `${s.seatRow.toUpperCase()}${s.seatNum}`;
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [schedules, activePlayId]);

  const getHeatmapClass = (count: number) => {
    if (count === 0) return 'hm-0';
    if (count === 1) return 'hm-1';
    if (count === 2) return 'hm-2';
    if (count === 3) return 'hm-3';
    if (count === 4) return 'hm-4';
    return 'hm-5plus';
  };

  if (layout === 'none') {
    return <div className="empty"><p>좌석 배치도가 없는 극입니다.</p></div>;
  }

  return (
    <div className="hm-outer" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
      <div className="hm-inner" style={{ minWidth: 'max-content', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="seatmap-stage">STAGE</div>
        <div className="seatmap-stage-foot"></div>
        
        {layout === 'dream2' ? SEAT_LAYOUT_DREAM2.map((row) => (
          <div key={row.row} className="seatmap-row" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '3px' }}>
            <div className="seatmap-lbl">{row.row}</div>
            {row.groups.map((group, gIdx) => (
              <div key={gIdx} style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: group[1] - group[0] + 1 }, (_, i) => {
                  const num = group[0] + i;
                  const seatKey = `${row.row}${num}`;
                  const count = seatCounts[seatKey] || 0;
                  return (
                    <div 
                      key={num} 
                      className={`seatmap-seat ${getHeatmapClass(count)}`}
                      title={`${seatKey} (${count}회)`}
                      style={{
                        width: '17px', height: '17px', 
                        borderRadius: '4px 4px 2px 2px',
                        border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: count > 0 ? '7px' : '0',
                        fontWeight: 700,
                        position: 'relative'
                      }}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  );
                })}
                {gIdx < row.groups.length - 1 && <div className="seatmap-aisle" style={{ width: '14px' }}></div>}
              </div>
            ))}
          </div>
          )) : layout === 'bugs' ? SEAT_LAYOUT_BUGS.map((row) => (
          <div key={row.row} className="seatmap-row" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '3px' }}>
            <div className="seatmap-lbl">{row.row}</div>
            {row.groups.map((group, gIdx) => (
              <div key={gIdx} style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: group[1] - group[0] + 1 }, (_, i) => {
                  const num = group[0] + i;
                  const seatKey = `${row.row}${num}`;
                  const count = seatCounts[seatKey] || 0;
                  return (
                    <div 
                      key={num} 
                      className={`seatmap-seat ${getHeatmapClass(count)}`}
                      title={`${seatKey} (${count}회)`}
                      style={{
                        width: '17px', height: '17px', 
                        borderRadius: '4px 4px 2px 2px',
                        border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: count > 0 ? '7px' : '0',
                        fontWeight: 700,
                        position: 'relative'
                      }}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  );
                })}
                {gIdx < row.groups.length - 1 && <div className="seatmap-aisle" style={{ width: '14px' }}></div>}
              </div>
            ))}
          </div>
        )) : null}
      </div>
    </div>
  );
}