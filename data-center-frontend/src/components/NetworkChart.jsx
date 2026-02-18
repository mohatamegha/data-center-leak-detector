import { useSimulation } from '@/context/SimulationContext';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function NetworkChart() {
  const { networkHistory } = useSimulation();
  const data = networkHistory.map((v, i) => ({ t: i, net: +v.toFixed(1) }));

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-card-foreground">Network Traffic</h3>
        <span className="text-xs font-mono text-muted-foreground">
          {networkHistory[networkHistory.length - 1]?.toFixed(1)} Mbps
        </span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(210, 90%, 45%)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="hsl(210, 90%, 45%)" stopOpacity={0.02} />
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
            formatter={(v) => [`${v} Mbps`, "Network"]}
          />

          <Area type="monotone" dataKey="net" stroke="hsl(210, 80%, 55%)" strokeWidth={2} fill="url(#netGrad)" dot={false} activeDot={{ r: 3 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
