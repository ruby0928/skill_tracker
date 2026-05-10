import { useState } from 'react';
import { useSkillStore } from '../store/useSkillStore';
import { useElapsedTime } from '../hooks/useElapsedTime';
import { getLevel, getLevelName, getTierInfo, formatMinutes, formatElapsedMs } from '../utils/skillLevel';
import SkillLevelBar from './SkillLevelBar';
import HourRing from './HourRing';
import ManualEntryModal from './ManualEntryModal';
import type { Skill } from '../types/skill';

interface Props {
  skill: Skill;
}

const SkillCard = ({ skill }: Props) => {
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, deleteSkill } = useSkillStore();
  const [showManualEntry, setShowManualEntry] = useState(false);

  const isThisSkillActive = timer.activeSkillId === skill.id;
  const isAnotherSkillActive = timer.activeSkillId !== null && !isThisSkillActive;

  const elapsedMs = useElapsedTime(isThisSkillActive);

  // Include live session progress so all displays update in real time
  const displayMinutes = skill.totalMinutes + Math.floor(elapsedMs / 60000);
  const level = getLevel(displayMinutes);
  const levelName = getLevelName(level);
  const { filledTiers, tierProgress } = getTierInfo(displayMinutes);
  const isMaxLevel = level >= 100;

  const handleToggle = () => {
    if (isThisSkillActive) {
      timer.isRunning ? pauseTimer() : resumeTimer();
    } else {
      startTimer(skill.id);
    }
  };

  return (
    <>
      <div
        className={`relative rounded-xl p-5 border transition-all duration-300 flex flex-col gap-4 ${
          isThisSkillActive
            ? 'bg-gray-900 border-green-500 animate-glow'
            : 'bg-gray-900 border-gray-800 hover:border-gray-700'
        } ${isAnotherSkillActive ? 'opacity-50' : ''}`}
      >
        {/* Delete button — hidden while timer is active */}
        {!isThisSkillActive && (
          <button
            type="button"
            onClick={() => deleteSkill(skill.id)}
            className="absolute top-3 right-3 w-6 h-6 rounded-full text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-colors text-sm flex items-center justify-center"
            aria-label="刪除技能"
          >
            ✕
          </button>
        )}

        {/* Header: icon + name + level badge */}
        <div className="flex items-start gap-3">
          <span className="text-3xl leading-none mt-0.5">{skill.icon}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg leading-tight truncate">{skill.name}</h2>
            <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
              <span className="text-sm font-mono text-green-400 font-semibold">
                Lv.{level}
              </span>
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                  isMaxLevel
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {levelName}
              </span>
              {!isMaxLevel && (
                <span className="text-xs text-gray-600">/ 100</span>
              )}
            </div>
          </div>
        </div>

        {/* HourRing + level bar + time */}
        <div className="flex items-center gap-4">
          <HourRing totalMinutes={displayMinutes} isActive={isThisSkillActive && timer.isRunning} />
          <div className="flex-1 flex flex-col gap-2">
            <div>
              <p className="text-xs text-gray-600 mb-1">階段進度（每段 10 Lv）</p>
              <SkillLevelBar
                level={filledTiers}
                progress={tierProgress}
                isActive={isThisSkillActive && timer.isRunning}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500">累計時間</p>
              <p className="font-mono font-semibold">{formatMinutes(skill.totalMinutes)}</p>
              {isThisSkillActive && (
                <p className="font-mono text-green-400 text-sm tabular-nums">
                  +{formatElapsedMs(elapsedMs)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-800">
          <button
            type="button"
            onClick={() => setShowManualEntry(true)}
            disabled={isThisSkillActive}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded-lg hover:bg-gray-800"
          >
            ✎ 補錄時數
          </button>

          <div className="flex items-center gap-2">
            {isThisSkillActive && (
              <button
                type="button"
                onClick={stopTimer}
                className="w-8 h-8 rounded-full bg-red-700/60 hover:bg-red-700 text-sm flex items-center justify-center transition-colors"
                aria-label="結束"
              >
                ⏹
              </button>
            )}
            <button
              type="button"
              onClick={handleToggle}
              disabled={isAnotherSkillActive}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-base transition-all ${
                isThisSkillActive && timer.isRunning
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
                  : isAnotherSkillActive
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-400 text-black hover:scale-110'
              }`}
              aria-label={isThisSkillActive && timer.isRunning ? '暫停' : isThisSkillActive ? '繼續' : '開始'}
            >
              {isThisSkillActive ? (timer.isRunning ? '⏸' : '▶') : '▶'}
            </button>
          </div>
        </div>
      </div>

      {showManualEntry && (
        <ManualEntryModal
          skillId={skill.id}
          skillName={skill.name}
          skillIcon={skill.icon}
          onClose={() => setShowManualEntry(false)}
        />
      )}
    </>
  );
};

export default SkillCard;
