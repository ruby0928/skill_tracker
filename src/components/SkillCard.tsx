import { useState } from 'react';
import { useSkillStore } from '../store/useSkillStore';
import { useElapsedTime } from '../hooks/useElapsedTime';
import { getLevel, getLevelProgress, formatMinutes, formatElapsedMs } from '../utils/skillLevel';
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

  // Include live session progress so the ring and bar update in real time
  const displayMinutes = skill.totalMinutes + Math.floor(elapsedMs / 60000);
  const level = getLevel(displayMinutes);
  const progress = getLevelProgress(displayMinutes);

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

        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="text-3xl leading-none mt-0.5">{skill.icon}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg leading-tight truncate">{skill.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Level <span className="text-green-400 font-semibold">{level}</span>
              {level < 10 && <span className="text-gray-600"> / 10</span>}
              {level === 10 && <span className="text-yellow-400 ml-1">★ MAX</span>}
            </p>
          </div>
        </div>

        {/* Ring + level bar */}
        <div className="flex items-center gap-4">
          <HourRing totalMinutes={displayMinutes} isActive={isThisSkillActive && timer.isRunning} />
          <div className="flex-1 flex flex-col gap-2">
            <SkillLevelBar
              level={level}
              progress={progress}
              isActive={isThisSkillActive && timer.isRunning}
            />
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
