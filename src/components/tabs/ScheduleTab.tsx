import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SecTitle, Button, Card } from '../ui';

export function ScheduleTab() {
  const { activePlayId, addSchedule, schedules, deleteSchedule } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  
  // 폼 상태
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [seatRow, setSeatRow] = useState('');
  const [seatNum, setSeatNum] = useState('');

  if (!activePlayId) {
    return (
      <div className="tab-page active">
        <div className="empty"><p>선택된 작품이 없습니다.</p></div>
      </div>
    );
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      addSchedule({
        id: `schedule-${Date.now()}`,
        playId: activePlayId,
        date,
        time,
        holiday: false,
        seatRow,
        seatNum,
        cast: {},
        event: '',
        discount: '',
        memo: '',
        cardId: '',
        stampQty: 0,
        hasReceipt: false,
        isNanum: false,
      });
      setShowAddModal(false);
      // 초기화
      setDate(new Date().toISOString().split('T')[0]);
      setTime('');
      setSeatRow('');
      setSeatNum('');
    }
  };

  const playSchedules = schedules.filter(s => s.playId === activePlayId);
  const today = new Date().toISOString().split('T')[0];

  const upcomingSchedules = playSchedules
    .filter(s => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    
  const pastSchedules = playSchedules
    .filter(s => s.date < today)
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  const renderScheduleCard = (s: any) => (
    <div key={s.id} className="card" style={{ padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px', color: 'var(--text)' }}>
          {s.date.replace(/-/g, '.')} <span style={{ color: 'var(--primary)', marginLeft: '4px' }}>{s.time}</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
          좌석: {s.seatRow ? `${s.seatRow}열` : ''} {s.seatNum ? `${s.seatNum}번` : ''}
          {!s.seatRow && !s.seatNum && '미지정'}
        </div>
      </div>
      <Button 
        variant="danger" 
        size="sm" 
        style={{ padding: '4px 10px', fontSize: '11px', height: 'auto' }}
        onClick={() => {
          if (window.confirm('이 일정을 삭제하시겠습니까?')) {
            deleteSchedule(s.id);
          }
        }}
      >
        삭제
      </Button>
    </div>
  );

  return (
    <div className="tab-page active">
      <Button 
        variant="primary" 
        size="full" 
        className="mb-3"
        onClick={() => setShowAddModal(true)}
      >
        ➕ 관극 일정 추가
      </Button>

      <SecTitle>🗓 다가오는 일정</SecTitle>
      {upcomingSchedules.length > 0 ? (
        upcomingSchedules.map(renderScheduleCard)
      ) : (
        <Card><div className="empty"><p>다가오는 일정이 없습니다.</p></div></Card>
      )}
      
      <SecTitle>🎟️ 지난 관람 기록</SecTitle>
      {pastSchedules.length > 0 ? (
        pastSchedules.map(renderScheduleCard)
      ) : (
        <Card><div className="empty"><p>지난 관람 기록이 없습니다.</p></div></Card>
      )}

      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-md)',
            width: '100%', maxWidth: '320px', boxShadow: 'var(--shadow)',
            maxHeight: '80vh', overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: 'var(--text)' }}>관극 일정 추가</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">날짜</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">시간</label>
                <select 
                  className="form-input" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="">선택 안함</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                </select>
              </div>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">좌석</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="열 (예: A)"
                    value={seatRow}
                    onChange={(e) => setSeatRow(e.target.value)}
                  />
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="번 (예: 12)"
                    value={seatNum}
                    onChange={(e) => setSeatNum(e.target.value)}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <Button type="button" variant="secondary" size="full" onClick={() => setShowAddModal(false)}>취소</Button>
                <Button type="submit" variant="primary" size="full" disabled={!date}>저장</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
