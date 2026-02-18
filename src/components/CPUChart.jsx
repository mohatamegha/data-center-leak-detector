import { useSimulation } from '@/context/SimulationContext';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function CPUChart() {
  const { cpuHistory, state } = useSimulation();
  const data = cpuHistory.map((v, i) => ({ t: i, cpu: +v.toFixed(1) }));

  const color = state === 'attack'
    ? 'hsl(0, 80%, 48%)'
    : state === 'containment'
    ? 'hsl(38, 85%, 50%)'
    : 'hsl(160, 85%, 40%)';

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-card-foreground">CPU Usage</h3>
        <span className="text-xs font-mono text-muted-foreground">
          {cpuHistory[cpuHistory.length - 1]?.toFixed(1)}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <XAxis dataKey="t" hide />
          <YAxis domain={[0, 100]} hide />

          <Tooltip
            contentStyle={{
              background: 'hsl(220, 18%, 10%)',
              border: '1px solid hsl(220, 14%, 18%)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ display: 'none' }}
            formatter={(v) => [`${v}%`, "CPU"]}
          />

          <Area type="monotone" dataKey="cpu" stroke={color} strokeWidth={2} fill="url(#cpuGrad)" dot={false} activeDot={{ r: 3 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
