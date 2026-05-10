import { useEffect, useState } from 'react';
import { useSkillStore } from '../store/useSkillStore';

// Returns elapsed milliseconds for the active timer session.
// Uses Date.now() comparison so accuracy is preserved when the tab is backgrounded.
// The visibilitychange listener forces an immediate re-render when the tab regains focus,
// correcting any display lag caused by throttled background intervals.
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

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') setElapsedMs(compute());
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [timer, enabled]);

  return elapsedMs;
};
