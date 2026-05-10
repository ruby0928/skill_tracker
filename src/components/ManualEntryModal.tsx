import { useState } from 'react';
import { useSkillStore } from '../store/useSkillStore';
import { formatMinutes } from '../utils/skillLevel';

interface Props {
  skillId: string;
  skillName: string;
  skillIcon: string;
  onClose: () => void;
}

const ManualEntryModal = ({ skillId, skillName, skillIcon, onClose }: Props) => {
  const addManualSession = useSkillStore((s) => s.addManualSession);

  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const toISO = (d: string, t: string) => new Date(`${d}T${t}`).toISOString();

  const derivedMinutes = (() => {
    if (!date || !startTime || !endTime) return 0;
    const diff = new Date(`${date}T${endTime}`).getTime() - new Date(`${date}T${startTime}`).getTime();
    return Math.floor(diff / 60000);
  })();

  const isValid = derivedMinutes > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    addManualSession(skillId, toISO(date, startTime), toISO(date, endTime), derivedMinutes);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{skillIcon}</span>
          <h2 className="text-xl font-bold">手動補錄</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">{skillName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">日期</label>
            <input
              type="date"
              value={date}
              max={todayStr}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">開始時間</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">結束時間</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          {/* Duration preview */}
          <div className="bg-gray-800/60 rounded-lg px-4 py-3 text-center border border-gray-700/50">
            {derivedMinutes > 0 ? (
              <span className="text-green-400 font-mono font-semibold text-lg">
                ＋ {formatMinutes(derivedMinutes)}
              </span>
            ) : derivedMinutes < 0 ? (
              <span className="text-red-400 text-sm">結束時間須晚於開始時間</span>
            ) : (
              <span className="text-gray-500 text-sm">請選擇起訖時間</span>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-400 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              新增
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualEntryModal;
