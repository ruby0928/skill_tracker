import { useState } from 'react';
import { useSkillStore } from '../store/useSkillStore';

// Temporary testing panel — remove before production deploy
const DevPanel = () => {
  const { skills, addMinutesToSkill, clearAll } = useSkillStore();
  const [selectedId, setSelectedId] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const targetId = selectedId || skills[0]?.id || '';

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 px-3 py-1.5 bg-yellow-900/80 border border-yellow-600/40 rounded-lg text-yellow-400 text-xs font-mono hover:bg-yellow-900 transition-colors"
      >
        ⚗ DEV
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-56 bg-gray-950/95 border border-yellow-600/40 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-yellow-400 text-xs font-mono font-bold tracking-widest">⚗ DEV PANEL</span>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
          aria-label="收合"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Skill selector */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">目標技能</label>
          {skills.length === 0 ? (
            <p className="text-xs text-gray-600 italic">尚無技能</p>
          ) : (
            <select
              value={targetId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
            >
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Quick-add buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={skills.length === 0}
            onClick={() => addMinutesToSkill(targetId, 55)}
            className="flex-1 py-2 rounded-lg bg-yellow-700/60 hover:bg-yellow-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium transition-colors text-yellow-100"
          >
            ＋55m
          </button>
          <button
            type="button"
            disabled={skills.length === 0}
            onClick={() => addMinutesToSkill(targetId, 5_000)}
            className="flex-1 py-2 rounded-lg bg-yellow-700/60 hover:bg-yellow-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium transition-colors text-yellow-100"
            title="約 83 小時，測試高等級用"
          >
            ＋83h
          </button>
        </div>

        {/* Clear all button */}
        {confirmClear ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="flex-1 py-1.5 rounded-lg border border-gray-700 text-gray-400 text-xs transition-colors hover:border-gray-600"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => { clearAll(); setConfirmClear(false); }}
              className="flex-1 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-xs font-semibold transition-colors"
            >
              確認清空
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="w-full py-2 rounded-lg border border-red-900/60 hover:bg-red-900/20 text-red-400 text-sm transition-colors"
          >
            清空所有資料
          </button>
        )}
      </div>
    </div>
  );
};

export default DevPanel;
