interface Props {
  level: number;    // 0–10  filled tier segments (each segment = 10 levels)
  progress: number; // 0–1   fractional fill of the current segment
  isActive: boolean;
}

// Sims-style 10-segment bar. Each segment represents one tier (10 levels).
// Segment 10 filled = Level 100 (10,000 h — the legend cap).
const SkillLevelBar = ({ level, progress, isActive }: Props) => (
  <div className="relative">
    <div className="flex gap-1">
      {Array.from({ length: 10 }, (_, i) => {
        const filled = i < level;
        const isCurrent = i === level && level < 10;
        return (
          <div
            key={i}
            className={`h-3.5 flex-1 rounded-sm ${filled ? 'bg-green-500' : 'bg-gray-700'} relative overflow-hidden`}
          >
            {isCurrent && progress > 0 && (
              <div
                className="absolute inset-y-0 left-0 bg-green-500/40 transition-all duration-1000"
                style={{ width: `${progress * 100}%` }}
              />
            )}
          </div>
        );
      })}
    </div>

    {/* Shimmer sweep across filled segments when timer is running */}
    {isActive && level > 0 && (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${level * 10}%` }}
      >
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    )}
  </div>
);

export default SkillLevelBar;
