import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SEAT_LAYOUT_DREAM2, SEAT_LAYOUT_BUGS, SEAT_LAYOUT_PAYCO } from '../../config/seatLayout';

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

  if (layout === 'none') {
    return <div className="empty"><p>좌석 배치도가 없는 극입니다.</p></div>;
  }

  const renderSeat = (num: number, row: string) => {
    const seatKey = `${row}${num}`;
    const count = seatCounts[seatKey] || 0;
    const heatmapClass = count >= 5 ? 'hm-5plus' : `hm-${count}`;
    return (
      <div 
        key={num} 
        className={`hm-seat ${heatmapClass}`}
        title={`${row}열 ${num}번: ${count}회`}
      >
        {num}
      </div>
    );
  };

  const renderGroup = (group: number[], row: string) => {
    const start = group[0];
    const end = group[1];
    const step = start <= end ? 1 : -1;
    const length = Math.abs(end - start) + 1;
    return (
      <div style={{ display: 'flex', gap: 'var(--hm-gap, 2px)' }}>
        {Array.from({ length }, (_, i) => renderSeat(start + i * step, row))}
      </div>
    );
  };

  return (
    <div id="stats-heatmap">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div 
          className="hm-outer" 
          id="hm-outer" 
          style={{ 
            '--hm-seat': '16px', 
            '--hm-gap': '2px', 
            '--hm-lbl': '18px', 
            '--hm-aisle': '14px', 
            '--hm-block': layout === 'dream2' ? '178px' : 'auto', 
            '--hm-font': '6px' 
          } as React.CSSProperties}
        >
          <div className="hm-inner">
            <div className="hm-stage-bar">S T A G E</div>
            <div className="hm-stage-foot"></div>
            
            {layout === 'dream2' && SEAT_LAYOUT_DREAM2.map((row) => (
              <React.Fragment key={row.row}>
                <div className="hm-row">
                  <div className="hm-lbl">{row.row}</div>
                  <div className="hm-left-block" style={row.row === 'J' || row.row === 'K' ? { justifyContent: 'space-between' } : {}}>
                    {row.row === 'J' || row.row === 'K' ? (
                      <>
                        {renderGroup(row.groups[0], row.row)}
                        {renderGroup(row.groups[1], row.row)}
                      </>
                    ) : (
                      renderGroup(row.groups[0], row.row)
                    )}
                  </div>
                  <div className="hm-center-aisle"></div>
                  <div className="hm-right-block">
                    {row.groups.length > (row.row === 'J' || row.row === 'K' ? 2 : 1) && renderGroup(row.groups[row.groups.length - 1], row.row)}
                  </div>
                </div>
                {row.row === 'D' && <div className="hm-divider"></div>}
              </React.Fragment>
            ))}

            {layout === 'bugs' && SEAT_LAYOUT_BUGS.map((row) => (
              <div key={row.row} className="hm-row">
                <div className="hm-lbl">{row.row}</div>
                {row.groups.map((group, gIdx) => (
                  <React.Fragment key={gIdx}>
                    <div 
                      className="hm-block"
                      style={(row.row === 'L' || row.row === 'M') && gIdx === 0 ? { marginLeft: '42px' } : {}}
                    >
                      {renderGroup(group, row.row)}
                    </div>
                    {gIdx < row.groups.length - 1 && <div className="hm-center-aisle"></div>}
                  </React.Fragment>
                ))}
              </div>
            ))}

            {layout === 'payco' && SEAT_LAYOUT_PAYCO.map((row) => (
              <div key={row.row} className="hm-row">
                <div className="hm-lbl">{row.row}</div>
                {row.groups.map((group, gIdx) => (
                  <React.Fragment key={gIdx}>
                    <div className="hm-block">
                      {renderGroup(group, row.row)}
                    </div>
                    {gIdx < row.groups.length - 1 && <div className="hm-center-aisle"></div>}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', fontSize: '10px', color: 'var(--text2)' }}>
            <div className="hm-seat hm-0" style={{ width: '14px', height: '14px', flexShrink: 0 }}></div><span>0회</span>
            <div className="hm-seat hm-1" style={{ width: '14px', height: '14px', flexShrink: 0 }}></div><span>1회</span>
            <div className="hm-seat hm-2" style={{ width: '14px', height: '14px', flexShrink: 0 }}></div><span>2회</span>
            <div className="hm-seat hm-3" style={{ width: '14px', height: '14px', flexShrink: 0 }}></div><span>3회</span>
            <div className="hm-seat hm-4" style={{ width: '14px', height: '14px', flexShrink: 0 }}></div><span>4회</span>
            <div className="hm-seat hm-5plus" style={{ width: '14px', height: '14px', flexShrink: 0 }}></div><span>5회+</span>
          </div>
        </div>
      </div>
    </div>
  );
}