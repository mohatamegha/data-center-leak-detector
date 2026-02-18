import { useSimulation } from "@/context/SimulationContext"
import { Zap, Cloud, DollarSign, Shield } from "lucide-react"
import { motion } from "framer-motion"

const cards = [
  { key: "energy", label: "Energy Wasted", icon: Zap, unit: "kWh", color: "text-warning" },
  { key: "carbon", label: "Carbon Emitted", icon: Cloud, unit: "kg CO₂", color: "text-destructive" },
  { key: "cost", label: "Cost Leakage", icon: DollarSign, unit: "₹", color: "text-warning" },
  { key: "prevented", label: "Prevented Damage", icon: Shield, unit: "kWh saved", color: "text-primary" },
]

export default function SustainabilityImpact() {
  const { energyWasted, carbonEmitted, costLeakage, preventedDamage, state } = useSimulation()

  const values = {
    energy: energyWasted.toFixed(1),
    carbon: carbonEmitted.toFixed(2),
    cost: (+costLeakage).toLocaleString(),
    prevented: preventedDamage.toFixed(1),
  }

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-semibold text-foreground">Sustainability Impact</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Environmental and financial impact of compute anomalies
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-lg p-5"
          >

            <div className="flex items-center gap-2 mb-3">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {card.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-mono font-bold ${card.color}`}>
                {card.key === "cost" ? "₹" : ""}
                {values[card.key]}
              </span>
              <span className="text-xs text-muted-foreground">
                {card.key !== "cost" ? card.unit : ""}
              </span>
            </div>

            {state === "attack" && card.key !== "prevented" && (
              <span className="inline-block mt-2 text-[10px] font-mono text-destructive animate-pulse-glow">
                ▲ INCREASING
              </span>
            )}

          </motion.div>
        ))}
      </div>

    </div>
  )
}
