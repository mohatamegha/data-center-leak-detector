import StatusBadge from '@/components/StatusBadge';
import CPUChart from '@/components/CPUChart';
import NetworkChart from '@/components/NetworkChart';
// import GPUChart from '@/components/GPUChart';
import ProcessList from '@/components/ProcessList';
import LeakMeter from '@/components/LeakMeter';
import { useSimulation } from '@/context/SimulationContext';

export default function Dashboard() {
  const { countdown, state } = useSimulation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time infrastructure monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          {state === 'attack' && (
            <span className="font-mono text-sm text-destructive animate-pulse-glow">
              ⏱ {countdown}s
            </span>
          )}
          <StatusBadge />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <CPUChart />
          <NetworkChart />
          {/* <GPUChart /> */}
        </div>
        <div className="space-y-4">
          <LeakMeter />
          <ProcessList />
        </div>
      </div>
    </div>
  );
}
