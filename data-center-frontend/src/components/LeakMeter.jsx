import { useSimulation } from '@/context/SimulationContext';

export default function LeakMeter() {
  const { leakPercent, state } = useSimulation();
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (leakPercent / 100) * circumference;

  const color = leakPercent > 60 ? 'hsl(0, 72%, 55%)' : leakPercent > 30 ? 'hsl(38, 92%, 55%)' : 'hsl(152, 70%, 45%)';

  return (
    <div className="bg-card rounded-lg border border-border p-4 flex flex-col items-center">
      <h3 className="text-sm font-medium text-card-foreground mb-3">Environmental Leak</h3>
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="hsl(220, 14%, 18%)" strokeWidth="8" />
          <circle
            cx="70" cy="70" r={radius} fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl font-mono font-bold text-card-foreground">{leakPercent.toFixed(0)}%</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {state === 'attack' ? 'RISING' : state === 'containment' ? 'STOPPED' : 'NOMINAL'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
