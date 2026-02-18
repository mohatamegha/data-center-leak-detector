import { useSimulation } from '@/context/SimulationContext';
import { motion, AnimatePresence } from 'framer-motion';

const normalProcesses = [
  { name: 'nginx_worker', cpu: '2.1%', mem: '128MB', pid: 1042 },
  { name: 'postgres_db', cpu: '4.3%', mem: '512MB', pid: 1187 },
  { name: 'redis_cache', cpu: '1.8%', mem: '64MB', pid: 1203 },
];

const maliciousProcess = { name: 'xmrig_miner', cpu: '78.4%', mem: '2.1GB', pid: 6666 };

export default function ProcessList() {
  const { state } = useSimulation();
  const showMalicious = state === 'attack';

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-sm font-medium text-card-foreground mb-3">Active Processes</h3>
      <div className="space-y-1 font-mono text-xs">
        <div className="grid grid-cols-4 gap-2 text-muted-foreground px-2 py-1">
          <span>PROCESS</span><span>PID</span><span>CPU</span><span>MEM</span>
        </div>
        {normalProcesses.map(p => (
          <div key={p.name} className="grid grid-cols-4 gap-2 px-2 py-1.5 rounded hover:bg-muted/50 text-card-foreground">
            <span className="text-primary">{p.name}</span>
            <span>{p.pid}</span>
            <span>{p.cpu}</span>
            <span>{p.mem}</span>
          </div>
        ))}
        <AnimatePresence>
          {showMalicious && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-4 gap-2 px-2 py-1.5 rounded bg-destructive/10 text-destructive border border-destructive/20"
            >
              <span className="font-semibold">{maliciousProcess.name}</span>
              <span>{maliciousProcess.pid}</span>
              <span>{maliciousProcess.cpu}</span>
              <span>{maliciousProcess.mem}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
