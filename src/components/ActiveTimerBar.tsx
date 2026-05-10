import { useSkillStore } from '../store/useSkillStore';
import { useElapsedTime } from '../hooks/useElapsedTime';
import { formatElapsedMs } from '../utils/skillLevel';

// Sticky banner that appears at the top of the page whenever a timer is running
const ActiveTimerBar = () => {
  const { timer, skills, pauseTimer, resumeTimer, stopTimer } = useSkillStore();
  const elapsedMs = useElapsedTime(timer.activeSkillId !== null);

  if (!timer.activeSkillId) return null;
  const skill = skills.find((s) => s.id === timer.activeSkillId);
  if (!skill) return null;

  return (
    <div className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 bg-green-950/60 border-b border-green-500/30 backdrop-blur-md">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-2xl">{skill.icon}</span>
        <div className="min-w-0">
          <p className="text-xs text-green-400 uppercase tracking-wider font-medium">練習中</p>
          <p className="font-semibold truncate">{skill.name}</p>
        </div>
      </div>

      <div className="font-mono text-xl text-green-400 tabular-nums shrink-0">
        {formatElapsedMs(elapsedMs)}
      </div>

      <div className="flex gap-2 shrink-0">
        {timer.isRunning ? (
          <button
            type="button"
            onClick={pauseTimer}
            className="px-3 py-1.5 rounded-lg bg-yellow-600/80 hover:bg-yellow-600 text-sm font-medium transition-colors"
          >
            ⏸ 暫停
          </button>
        ) : (
          <button
            type="button"
            onClick={resumeTimer}
            className="px-3 py-1.5 rounded-lg bg-green-700/80 hover:bg-green-700 text-sm font-medium transition-colors"
          >
            ▶ 繼續
          </button>
        )}
        <button
          type="button"
          onClick={stopTimer}
          className="px-3 py-1.5 rounded-lg bg-red-700/80 hover:bg-red-700 text-sm font-medium transition-colors"
        >
          ⏹ 結束
        </button>
      </div>
    </div>
  );
};

export default ActiveTimerBar;
