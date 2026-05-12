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
  const { settings, updateSettings, plays, activePlayId, setActivePlayId, addPlay } = useAppStore();
  const [showAddPlayModal, setShowAddPlayModal] = useState(false);
  const [newPlayTitle, setNewPlayTitle] = useState('');
  useDarkMode();

  const handleAddPlaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayTitle.trim()) {
      const newPlay = {
        id: `play-${Date.now()}`,
        title: newPlayTitle.trim(),
        layout: 'none' as const,
        cast: {},
        rewatchBenefits: []
      };
      addPlay(newPlay);
      setActivePlayId(newPlay.id);
      setShowAddPlayModal(false);
      setNewPlayTitle('');
    }
  };

  const renderTab = () => {
    switch (settings.activeTab) {
      case 'home': return <HomeTab />;
      case 'schedule': return <ScheduleTab />;
      case 'coupon': return <CouponTab />;
      case 'stats': return <StatsTab />;
      case 'settings': return <SettingsTab />;
      default: return <HomeTab />;
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="app-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{settings.titleEmoji}</span>
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
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <Button type="button" variant="secondary" size="full" onClick={() => setShowAddPlayModal(false)}>취소</Button>
                <Button type="submit" variant="primary" size="full" disabled={!newPlayTitle.trim()}>추가</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;