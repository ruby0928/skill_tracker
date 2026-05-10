interface Props {
  totalMinutes: number;
  isActive: boolean;
}

// Sims-style circular ring showing progress within the current hour (totalMinutes % 60)
const HourRing = ({ totalMinutes, isActive }: Props) => {
  const minutesInHour = totalMinutes % 60;
  const progress = minutesInHour / 60;

  const cx = 48;
  const cy = 48;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="96" height="96" viewBox="0 0 96 96" aria-label={`此小時進度 ${minutesInHour} 分鐘`}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1f2937" strokeWidth="9" />

        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={isActive ? '#4ade80' : '#22c55e'}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          className="transition-all duration-1000"
          style={{
            filter: isActive ? 'drop-shadow(0 0 5px rgba(74,222,128,0.7))' : 'none',
          }}
        />

        {/* Center: minute count */}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {minutesInHour}m
        </text>
        <text
          x={cx}
          y={cy + 13}
          textAnchor="middle"
          fill="#6b7280"
          fontSize="10"
          fontFamily="sans-serif"
        >
          / 60m
        </text>
      </svg>
      <p className="text-xs text-gray-500">此小時</p>
    </div>
  );
};

export default HourRing;
