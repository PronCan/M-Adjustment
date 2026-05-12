import { useAppStore } from '../../store/useAppStore';
import { Card, Button } from '../ui';
import { APP_CONFIG } from '../../config';
import { downloadJson, readJsonFile, getBackupFilename } from '../../utils/backup';
import { fetchPlayDataFromSheets } from '../../utils/sheets';
import { useRef, useState } from 'react';

export function SettingsTab() {
  const { settings, updateSettings, resetAll, restoreData, syncPlaysFromSheets } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!settings.sheetsUrl) {
      alert('구글 시트 URL을 입력해주세요.');
      return;
    }
    
    setIsSyncing(true);
    try {
      const plays = await fetchPlayDataFromSheets(settings.sheetsUrl);
      if (plays.length === 0) {
        alert('시트에서 극 데이터를 찾을 수 없습니다.');
        return;
      }
      syncPlaysFromSheets(plays);
      alert('극 데이터가 성공적으로 업데이트되었습니다.');
    } catch (error: any) {
      alert(error.message || '데이터 연동 중 오류가 발생했습니다.');
    } finally {
      setIsSyncing(false);
    }
  };

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
          극(작품) 데이터 시트와 연결하여 최신 정보를 불러옵니다.
        </div>
        <div className="form-group">
          <input 
            type="text" 
            className="form-input" 
            placeholder="구글 시트 공유 URL 입력"
            value={settings.sheetsUrl}
            onChange={(e) => updateSettings({ sheetsUrl: e.target.value })}
            style={{ marginBottom: '8px' }}
          />
        </div>
        <Button 
          variant="primary" 
          size="full" 
          onClick={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? '업데이트 중...' : '🔄 극 데이터 업데이트'}
        </Button>
        <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '12px', lineHeight: 1.5, background: 'var(--surface2)', padding: '10px', borderRadius: '8px' }}>
          <strong>💡 시트 설정 방법</strong><br/>
          1. 구글 시트에 <code>Plays</code>, <code>Casts</code>, <code>Benefits</code> 시트를 만듭니다.<br/>
          2. [파일] - [공유] - [웹에 게시]를 선택하여 전체 문서를 웹에 게시합니다.<br/>
          3. 브라우저 주소창의 URL을 복사하여 위 칸에 붙여넣습니다.
        </div>
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
          (극 별 재관람 혜택은 홈 탭에서 확인하세요)
        </div>
      </Card>
    </div>
  );
}
