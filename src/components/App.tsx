import { useAppStore } from '../store/useAppStore';
import { useDarkMode } from '../utils/useDarkMode';
import { HomeTab } from './tabs/HomeTab';
import { ScheduleTab } from './tabs/ScheduleTab';
import { CouponTab } from './tabs/CouponTab';
import { StatsTab } from './tabs/StatsTab';
import { SettingsTab } from './tabs/SettingsTab';

function App() {
  const { settings, updateSettings, plays, activePlayId, setActivePlayId } = useAppStore();
  useDarkMode();

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
        <button className="btn-add-record">＋ 기록</button>
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
    </>
  );
}

export default App;