import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useDarkMode } from '../utils/useDarkMode';
import { HomeTab } from './tabs/HomeTab';
import { ScheduleTab } from './tabs/ScheduleTab';
import { CouponTab } from './tabs/CouponTab';
import { StatsTab } from './tabs/StatsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { Button } from './ui';

function App() {
  const { settings, updateSettings, plays, activePlayId, setActivePlayId, addPlay, deletePlay } = useAppStore();
  const [showAddPlayModal, setShowAddPlayModal] = useState(false);
  const [showPlaysListModal, setShowPlaysListModal] = useState(false);
  const [newPlayTitle, setNewPlayTitle] = useState('');
  const [hasForty, setHasForty] = useState(false);
  const [hasFifty, setHasFifty] = useState(false);
  const [packForty, setPackForty] = useState(1);
  const [packFifty, setPackFifty] = useState(1);
  const [packProof, setPackProof] = useState(1);
  useDarkMode();

  const handleAddPlaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayTitle.trim()) {
      const benefits = [];
      if (hasForty) benefits.push({ count: 3, label: '40% 할인권' });
      if (hasFifty) benefits.push({ count: 6, label: '50% 할인권' });

      const newPlay = {
        id: `play-${Date.now()}`,
        title: newPlayTitle.trim(),
        layout: 'none' as const,
        cast: {},
        rewatchBenefits: benefits,
        couponPackConfig: { forty: packForty, fifty: packFifty, proofpass: packProof }
      };
      addPlay(newPlay);
      setActivePlayId(newPlay.id);
      setShowAddPlayModal(false);
      setNewPlayTitle('');
      setHasForty(false);
      setHasFifty(false);
      setPackForty(1);
      setPackFifty(1);
      setPackProof(1);
    }
  };

  const renderTab = () => {
    if (!activePlayId) {
      return (
        <div className="tab-page active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text2)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎭</div>
          <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>선택된 작품이 없습니다</p>
          <p style={{ fontSize: '13px', textAlign: 'center', lineHeight: 1.5 }}>
            상단에서 작품을 선택하거나<br/>새로운 작품을 추가해주세요.
          </p>
        </div>
      );
    }

    switch (settings.activeTab) {
      case 'home': return <HomeTab key={`home-${activePlayId}`} />;
      case 'schedule': return <ScheduleTab key={`schedule-${activePlayId}`} />;
      case 'coupon': return <CouponTab key={`coupon-${activePlayId}`} />;
      case 'stats': return <StatsTab key={`stats-${activePlayId}`} />;
      case 'settings': return <SettingsTab key={`settings-${activePlayId}`} />;
      default: return <HomeTab key={`home-${activePlayId}`} />;
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="app-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{plays.find(p => p.id === activePlayId)?.emoji || settings.titleEmoji}</span>
          <select 
            value={activePlayId || ''} 
            onChange={(e) => setActivePlayId(e.target.value)}
            style={{ 
              border: 'none', 
              background: 'transparent', 
              fontSize: '18px', 
              fontWeight: 800, 
              color: 'var(--primary)', 
              outline: 'none',
              fontFamily: 'inherit',
              cursor: 'pointer'
            }}
          >
            {plays.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <button
          className="btn-view-plays"
          style={{ background: 'var(--surface2)', border: 'none', borderRadius: '22px', padding: '0 14px', height: '34px', fontSize: '12px', fontWeight: 700, marginRight: '8px', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          onClick={() => setShowPlaysListModal(true)}
        >
          작품 목록
        </button>
        <button className="btn-add-record" onClick={() => setShowAddPlayModal(true)}>＋ 작품 추가</button>
      </header>

      <main className="main-content">
        {renderTab()}
      </main>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${settings.activeTab === 'home' ? 'active' : ''}`}
          onClick={() => updateSettings({ activeTab: 'home' })}
        >
          <span className="nav-icon">🏠</span>홈
        </button>
        <button 
          className={`nav-item ${settings.activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => updateSettings({ activeTab: 'schedule' })}
        >
          <span className="nav-icon">📅</span>일정
        </button>
        <button 
          className={`nav-item ${settings.activeTab === 'coupon' ? 'active' : ''}`}
          onClick={() => updateSettings({ activeTab: 'coupon' })}
        >
          <span className="nav-icon">🎟</span>할인권
        </button>
        <button 
          className={`nav-item ${settings.activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => updateSettings({ activeTab: 'stats' })}
        >
          <span className="nav-icon">📊</span>통계
        </button>
        <button 
          className={`nav-item ${settings.activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => updateSettings({ activeTab: 'settings' })}
        >
          <span className="nav-icon">⚙️</span>설정
        </button>
      </nav>

      {showAddPlayModal && (
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
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: 'var(--text)' }}>새 작품 추가</h3>
            <form onSubmit={handleAddPlaySubmit}>
              <div className="form-group">
                <label className="form-label">작품 이름</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newPlayTitle}
                  onChange={(e) => setNewPlayTitle(e.target.value)}
                  placeholder="예: 사의 찬미"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">재관람 혜택</label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={hasForty} 
                      onChange={(e) => setHasForty(e.target.checked)} 
                    />
                    <span style={{ fontSize: '14px' }}>40% 할인권</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={hasFifty} 
                      onChange={(e) => setHasFifty(e.target.checked)} 
                    />
                    <span style={{ fontSize: '14px' }}>50% 할인권</span>
                  </label>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">쿠폰팩 구성 (1팩당 장수)</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>40%</label>
                    <input type="number" min="0" className="form-input" value={packForty} onChange={e => setPackForty(Number(e.target.value))} style={{ padding: '8px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>50%</label>
                    <input type="number" min="0" className="form-input" value={packFifty} onChange={e => setPackFifty(Number(e.target.value))} style={{ padding: '8px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>증빙패스</label>
                    <input type="number" min="0" className="form-input" value={packProof} onChange={e => setPackProof(Number(e.target.value))} style={{ padding: '8px' }} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <Button type="button" variant="secondary" size="full" onClick={() => setShowAddPlayModal(false)}>취소</Button>
                <Button type="submit" variant="primary" size="full" disabled={!newPlayTitle.trim()}>추가</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPlaysListModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-md)',
            width: '100%', maxWidth: '320px', boxShadow: 'var(--shadow)',
            maxHeight: '80vh', display: 'flex', flexDirection: 'column'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: 'var(--text)' }}>작품 목록</h3>
            <div style={{ overflowY: 'auto', flex: 1, marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plays.map(p => (
                <div key={p.id} style={{ 
                  padding: '12px', 
                  background: 'var(--surface2)', 
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{p.title}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => { setActivePlayId(p.id); setShowPlaysListModal(false); }}
                      style={{ background: 'var(--primary)', color: 'var(--bg)', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      선택
                    </button>
                    <button 
                      onClick={() => { 
                        if (window.confirm(`'${p.title}' 작품을 정말 삭제하시겠습니까?\n관련된 모든 기록이 함께 삭제될 수 있습니다.`)) {
                          deletePlay(p.id);
                        }
                      }}
                      style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              {plays.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '20px 0', fontSize: '13px' }}>등록된 작품이 없습니다.</div>
              )}
            </div>
            <Button type="button" variant="secondary" size="full" onClick={() => setShowPlaysListModal(false)}>닫기</Button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;