import StatusBadge from '@/components/StatusBadge';
import CPUChart from '@/components/CPUChart';
import NetworkChart from '@/components/NetworkChart';
// import GPUChart from '@/components/GPUChart';
import ProcessList from '@/components/ProcessList';
import LeakMeter from '@/components/LeakMeter';
import { useSimulation } from '@/context/SimulationContext';
import { useEffect } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const {
    countdown,
    state,
    setCpuHistory,
    setNetworkHistory
  } = useSimulation();

  // 🔥 Inject mock backend data
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await api.getLiveMetrics();

        setCpuHistory(prev => [...prev.slice(-29), data.cpu]);
        setNetworkHistory(prev => [...prev.slice(-29), data.network_out]);
      } catch (err) {
        console.error("Mock API failed:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [setCpuHistory, setNetworkHistory]);

  const { triggerBackendAttack } = useSimulation();

  useEffect(() => {
    const interval = setInterval(async () => {
      const incident = await api.getIncident();

      if (incident.status === "active") {
        triggerBackendAttack(incident.auto_containment_in);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);



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
