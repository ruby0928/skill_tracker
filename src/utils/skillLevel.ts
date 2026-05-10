// 10,000-Hour Rule: level 1–100, with level 100 requiring exactly 600,000 minutes (10,000 h).
// Curve: level = 1 + floor(99 × √(minutes / MAX)), giving a square-root shape —
// early levels are fast to earn; each subsequent level demands proportionally more time.
const MAX_MINUTES = 600_000;

// Minutes needed to reach level L: MAX × ((L-1)/99)²
const minutesForLevel = (l: number): number => MAX_MINUTES * ((l - 1) / 99) ** 2;

export const getLevel = (totalMinutes: number): number => {
  const ratio = Math.min(1, totalMinutes / MAX_MINUTES);
  return 1 + Math.floor(99 * Math.sqrt(ratio));
};

export const getLevelProgress = (totalMinutes: number): number => {
  const level = getLevel(totalMinutes);
  if (level >= 100) return 1;
  const start = minutesForLevel(level);
  const end = minutesForLevel(level + 1);
  return Math.min(1, (totalMinutes - start) / (end - start));
};

// Each tier covers 10 levels. Returns { filledTiers, tierProgress } for SkillLevelBar.
// filledTiers: number of fully completed 10-level tiers (0–10).
// tierProgress: fractional fill of the current (next) bar segment (0–1).
export const getTierInfo = (totalMinutes: number): { filledTiers: number; tierProgress: number } => {
  const level = getLevel(totalMinutes);
  const progress = getLevelProgress(totalMinutes);
  const filledTiers = Math.floor((level - 1) / 10);
  const withinTier = (level - 1) % 10;
  return {
    filledTiers,
    tierProgress: (withinTier + progress) / 10,
  };
};

const RANK_NAMES = [
  '新手',      // Lv  1–10  Novice
  '學徒',      // Lv 11–20  Apprentice
  '習學者',    // Lv 21–30  Student
  '實踐者',    // Lv 31–40  Practitioner
  '熟練者',    // Lv 41–50  Journeyman
  '專家',      // Lv 51–60  Expert
  '資深專家',  // Lv 61–70  Veteran
  '大師',      // Lv 71–80  Master
  '宗師',      // Lv 81–90  Grandmaster
  '傳奇',      // Lv 91–100 Legend
] as const;

export const getLevelName = (level: number): string => {
  if (level >= 100) return '萬小時傳奇';
  return RANK_NAMES[Math.floor((level - 1) / 10)];
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
