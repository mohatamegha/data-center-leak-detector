import { useSimulation } from "@/context/SimulationContext"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, Clock, Skull, Ban, AlertTriangle } from "lucide-react"

export default function IncidentCenter() {
  const { state, countdown, killProcess, quarantine } = useSimulation()

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Incident Center</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Active threat monitoring and response
        </p>
      </div>

      <AnimatePresence mode="wait">

        {/* ATTACK STATE */}
        {state === "attack" && (
          <motion.div
            key="attack"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="bg-card border border-destructive/30 rounded-lg p-6 glow-red"
          >

            <div className="flex items-start gap-4">

              {/* Icon */}
              <div className="p-3 rounded-lg bg-destructive/10">
                <ShieldAlert className="h-6 w-6 text-destructive" />
              </div>

              <div className="flex-1">

                {/* Title */}
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Unauthorized Compute Activity
                  </h3>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-destructive/10 text-destructive border border-destructive/20">
                    CRITICAL
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-5">
                  Confidence: <span className="text-foreground font-medium">92%</span> ·
                  Behavior: sustained high CPU with low inbound traffic
                </p>

                {/* TIMER */}
                <div className="bg-muted rounded-lg p-4 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-foreground">
                      Auto-Containment Timer
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-mono font-bold text-warning">
                      {countdown}s
                    </span>

                    <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-warning"
                        animate={{ width: `${(countdown / 45) * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">

                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    <Ban className="h-4 w-4" />
                    Ignore
                  </button>

                  <button
                    onClick={quarantine}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20 transition-colors"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Quarantine
                  </button>

                  <button
                    onClick={killProcess}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  >
                    <Skull className="h-4 w-4" />
                    Kill Process
                  </button>

                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CONTAINMENT STATE */}
        {state === "containment" && (
          <motion.div
            key="contained"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="bg-card border border-warning/30 rounded-lg p-6 glow-amber"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-warning" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Threat Contained
                </h3>
                <p className="text-sm text-muted-foreground">
                  Malicious process terminated. System returning to normal.
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Killed Process
              </h4>

              <div className="grid grid-cols-4 gap-2 font-mono text-xs text-muted-foreground px-2 py-1">
                <span>PROCESS</span>
                <span>PID</span>
                <span>CPU</span>
                <span>MEM</span>
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono text-sm px-2 py-1.5 text-destructive/70 line-through">
                <span className="font-semibold">xmrig_miner</span>
                <span>6666</span>
                <span>78.4%</span>
                <span>2.1GB</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* NORMAL STATE */}
        {state === "normal" && (
          <motion.div
            key="normal"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="bg-card border border-border rounded-lg p-12 text-center"
          >
            <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <h3 className="text-lg font-medium text-muted-foreground">
              No Active Incidents
            </h3>
            <p className="text-sm text-muted-foreground/60 mt-1">
              All systems operating normally. Use "Simulate Attack" to test.
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
