import { useAppStore } from '../../store/useAppStore';
import { Card, Button } from '../ui';
import { APP_CONFIG } from '../../config';
import { downloadJson, readJsonFile, getBackupFilename } from '../../utils/backup';
import { useRef } from 'react';

export function SettingsTab() {
  const { settings, updateSettings, resetAll, restoreData } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    const state = useAppStore.getState();
    const dataToBackup = {
      schedules: state.schedules,
      rewatchCards: state.rewatchCards,
      coupons: state.coupons,
      couponLogs: state.couponLogs,
      settings: state.settings
    };
    downloadJson(dataToBackup, getBackupFilename());
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJsonFile(file);
      if (confirm('현재 데이터가 모두 덮어씌워집니다. 복원하시겠습니까?')) {
        restoreData(data);
        alert('데이터가 성공적으로 복원되었습니다.');
      }
    } catch (err) {
      alert('올바른 백업 파일이 아닙니다.');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="tab-page active">
      <Card label="⚙️ 앱 설정">
        <div className="setting-row">
          <div>
            <div className="setting-lbl">다크 모드</div>
            <div className="setting-desc">어두운 테마로 변경합니다</div>
          </div>
          <label className="toggle-wrap">
            <input 
              type="checkbox" 
              checked={settings.theme === 'dark'}
              onChange={(e) => updateSettings({ theme: e.target.checked ? 'dark' : 'light' })}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-row" style={{ borderBottom: 'none' }}>
          <div>
            <div className="setting-lbl">타이틀 아이콘</div>
            <div className="setting-desc">앱 상단 제목 옆 아이콘</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {APP_CONFIG.availableEmojis.map(emoji => (
              <button 
                key={emoji}
                className={`emoji-pick-btn ${settings.titleEmoji === emoji ? 'active' : ''}`}
                onClick={() => updateSettings({ titleEmoji: emoji })}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card label="📡 구글시트 연동">
        <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '12px', lineHeight: 1.6 }}>
          {APP_CONFIG.title} 공연 일정 시트와 연결되어 있습니다.<br/>버튼을 눌러 최신 일정을 불러오세요.
        </div>
        <Button variant="primary" size="full" onClick={() => {
          // TODO: Implement Google Sheets fetch logic
          alert('구글 시트 연동 기능은 설정 파일에 URL을 추가한 후 동작합니다.');
        }}>🔄 일정 업데이트</Button>
      </Card>

      <Card label="💾 데이터 관리">
        <div className="setting-row">
          <div>
            <div className="setting-lbl">데이터 백업</div>
            <div className="setting-desc">JSON 파일로 다운로드</div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleBackup}>백업</Button>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-lbl">데이터 복원</div>
            <div className="setting-desc">JSON 파일 업로드</div>
          </div>
          <input 
            type="file" 
            accept=".json" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={handleRestore}
          />
          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>복원</Button>
        </div>
        <div className="setting-row" style={{ borderBottom: 'none' }}>
          <div>
            <div className="setting-lbl">전체 초기화</div>
            <div className="setting-desc">모든 데이터를 삭제합니다</div>
          </div>
          <Button variant="danger" size="sm" onClick={() => {
            if (confirm('모든 데이터가 삭제됩니다. 계속하시겠습니까?')) {
              resetAll();
            }
          }}>초기화</Button>
        </div>
      </Card>

      <Card label="ℹ️ 앱 정보">
        <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6 }}>
          {APP_CONFIG.title} 앱<br/>
          재관람카드 도장 시스템:<br/>
          {APP_CONFIG.rewatchBenefits.map(b => (
            <div key={b.count}>&nbsp;• {b.count}회차 → {b.label}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}
