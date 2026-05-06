import { SecTitle } from '../ui';

export function ScheduleTab() {
  return (
    <div className="tab-page active">
      <SecTitle>🗓 다가오는 일정</SecTitle>
      {/* Upcoming schedules will go here */}
      
      <SecTitle>🎟️ 지난 관람 기록</SecTitle>
      {/* Past schedules will go here */}
    </div>
  );
}
