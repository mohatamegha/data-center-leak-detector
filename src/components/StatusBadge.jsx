import { useSimulation } from '@/context/SimulationContext';
import { motion } from 'framer-motion';

export default function StatusBadge() {
  const { state } = useSimulation();

  const config = {
    normal: { label: 'Healthy', className: 'bg-primary/10 text-primary border-primary/30 glow-green' },
    attack: { label: 'Suspicious', className: 'bg-destructive/10 text-destructive border-destructive/30 glow-red' },
    containment: { label: 'Contained', className: 'bg-warning/10 text-warning border-warning/30 glow-amber' },
  }[state];

  return (
    <motion.div
      key={state}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium font-mono ${config.className}`}
    >
      <span className={`h-2 w-2 rounded-full ${
        state === 'normal' ? 'bg-primary' : state === 'attack' ? 'bg-destructive animate-pulse-glow' : 'bg-warning'
      }`} />
      {config.label}
    </motion.div>
  );
}
