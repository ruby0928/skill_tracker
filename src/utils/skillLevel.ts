// Cumulative minute thresholds to reach each level (Sims-inspired exponential curve)
// Level 1→2h, Level 2→3h, Level 3→6h, …, Level 10→55h total
const LEVEL_THRESHOLDS = [60, 180, 360, 600, 900, 1260, 1680, 2160, 2700, 3300] as const;

export const getLevel = (totalMinutes: number): number =>
  LEVEL_THRESHOLDS.filter((t) => totalMinutes >= t).length;

export const getLevelProgress = (totalMinutes: number): number => {
  const level = getLevel(totalMinutes);
  if (level >= 10) return 1;
  const rangeStart = level === 0 ? 0 : LEVEL_THRESHOLDS[level - 1];
  const rangeEnd = LEVEL_THRESHOLDS[level];
  return (totalMinutes - rangeStart) / (rangeEnd - rangeStart);
};

export const formatMinutes = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const formatElapsedMs = (ms: number): string => {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};
