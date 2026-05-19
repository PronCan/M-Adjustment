import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, SecTitle, Button } from './ui';

export function RewatchBoard() {
  const { activePlayId, rewatchCards, plays, addRewatchCard, deleteRewatchCard, addStamp, updateStamp, deleteStamp } = useAppStore();
  
  const [stampModal, setStampModal] = useState<{ isOpen: boolean, cardId: string | null, stampId: string | null, date: string, status: '완료' | '예정' }>({ isOpen: false, cardId: null, stampId: null, date: '', status: '완료' });
  
  const currentPlay = plays.find(p => p.id === activePlayId);

  if (!activePlayId) return null;

  return (
    <>
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
                  const stamp = hasStamp ? card.stamps[i] : null;
                  const isPlanned = stamp?.status === '예정';
                  const isMilestone = currentPlay?.rewatchBenefits.some(b => b.count === i + 1);
                  const stampDate = stamp?.date ? stamp.date.substring(5).replace('-', '.') : '';
                  
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div 
                        style={{ 
                          flexShrink: 0,
                          width: '48px', height: '48px', 
                          borderRadius: '50%', 
                          border: hasStamp ? 'none' : (isMilestone ? '2px solid var(--accent)' : '2px dashed var(--border)'),
                          background: hasStamp ? (isPlanned ? 'var(--primary-l)' : 'var(--primary)') : (isMilestone ? 'rgba(122, 184, 150, 0.1)' : 'transparent'),
                          color: hasStamp ? (isPlanned ? 'var(--primary)' : 'var(--bg)') : (isMilestone ? 'var(--accent)' : 'var(--text2)'),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '16px', fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => {
                          if (i === card.stamps.length) {
                            // Add new stamp
                            setStampModal({ isOpen: true, cardId: card.id, stampId: null, date: new Date().toISOString().split('T')[0], status: '완료' });
                          } else if (i < card.stamps.length) {
                            // Edit existing stamp
                            setStampModal({ isOpen: true, cardId: card.id, stampId: card.stamps[i].id, date: card.stamps[i].date, status: card.stamps[i].status || '완료' });
                          } else {
                            alert('이전 스탬프를 먼저 채워주세요!');
                          }
                        }}
                      >
                        {hasStamp ? '✓' : i + 1}
                      </div>
                      {hasStamp && (
                        <span style={{ fontSize: '10px', color: 'var(--text2)', fontWeight: 600, letterSpacing: '-0.5px' }}>
                          {stampDate}
                        </span>
                      )}
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

      {stampModal.isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-md)',
            width: '100%', maxWidth: '320px', boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: 'var(--text)' }}>
              {stampModal.stampId ? '관람 날짜 수정' : '관람 날짜 입력'}
            </h3>
            <div className="form-group">
              <label className="form-label">날짜</label>
              <input 
                type="date" 
                className="form-input" 
                value={stampModal.date}
                onChange={(e) => {
                  const newDate = e.target.value;
                  const todayStr = new Date().toISOString().split('T')[0];
                  const newStatus = newDate > todayStr ? '예정' : '완료';
                  setStampModal({ ...stampModal, date: newDate, status: newStatus });
                }}
                autoFocus
              />
            </div>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">상태</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: stampModal.date > new Date().toISOString().split('T')[0] ? 0.5 : 1 }}>
                  <input 
                    type="radio" 
                    name="stamp-status" 
                    value="완료" 
                    checked={stampModal.status === '완료'} 
                    disabled={stampModal.date > new Date().toISOString().split('T')[0]}
                    onChange={() => setStampModal({ ...stampModal, status: '완료' })} 
                  />
                  <span style={{ fontSize: '14px' }}>완료</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="stamp-status" 
                    value="예정" 
                    checked={stampModal.status === '예정'} 
                    onChange={() => setStampModal({ ...stampModal, status: '예정' })} 
                  />
                  <span style={{ fontSize: '14px' }}>예정</span>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              <Button 
                type="button" 
                variant="secondary" 
                size="full" 
                onClick={() => setStampModal({ isOpen: false, cardId: null, stampId: null, date: '', status: '완료' })}
              >
                취소
              </Button>
              {stampModal.stampId && (
                <Button 
                  type="button" 
                  variant="danger" 
                  size="full" 
                  onClick={() => {
                    if (window.confirm('이 스탬프를 삭제하시겠습니까?')) {
                      deleteStamp(stampModal.cardId!, stampModal.stampId!);
                      setStampModal({ isOpen: false, cardId: null, stampId: null, date: '', status: '완료' });
                    }
                  }}
                >
                  삭제
                </Button>
              )}
              <Button 
                type="button" 
                variant="primary" 
                size="full" 
                disabled={!stampModal.date}
                onClick={() => {
                  if (stampModal.stampId) {
                    updateStamp(stampModal.cardId!, stampModal.stampId, { date: stampModal.date, status: stampModal.status });
                  } else {
                    addStamp(stampModal.cardId!, {
                      id: Date.now().toString(),
                      date: stampModal.date,
                      time: '',
                      holiday: false,
                      discount: '',
                      memo: '',
                      hasReceipt: false,
                      qty: 1,
                      status: stampModal.status
                    });
                  }
                  setStampModal({ isOpen: false, cardId: null, stampId: null, date: '', status: '완료' });
                }}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
