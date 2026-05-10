import { useEffect, useState } from 'react';
import { useSkillStore } from '../store/useSkillStore';

// Returns elapsed milliseconds for the active timer session.
// Pass enabled=false (for non-active skill cards) to skip the interval.
export const useElapsedTime = (enabled = true): number => {
  const timer = useSkillStore((s) => s.timer);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setElapsedMs(0);
      return;
    }

    const compute = () =>
      timer.accumulatedMs +
      (timer.isRunning && timer.startedAt !== null ? Date.now() - timer.startedAt : 0);

    setElapsedMs(compute());
    if (!timer.isRunning) return;

    const id = setInterval(() => setElapsedMs(compute()), 1000);
    return () => clearInterval(id);
  }, [timer, enabled]);

  return elapsedMs;
};
