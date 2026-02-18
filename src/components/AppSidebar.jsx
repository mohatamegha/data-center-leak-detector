import { NavLink } from "react-router-dom"
import { useSimulation } from "@/context/SimulationContext"
import {
  LayoutDashboard,
  ShieldAlert,
  Leaf,
  FileText,
  Settings,
  Zap,
  Radio,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Incident Center", url: "/incidents", icon: ShieldAlert },
  { title: "Sustainability", url: "/sustainability", icon: Leaf },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
]

export default function AppSidebar() {
  const { state, simulateAttack, countdown } = useSimulation()

  const linkStyle =
    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"

  return (
    <aside className="w-64 min-h-screen border-r bg-muted/40 flex flex-col shrink-0">

      {/* Logo */}
      <div className="p-5 border-b">
        <div className="flex items-center gap-2">
          <Radio className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-sm font-semibold tracking-tight">DataCenter</h1>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
              Leak Detector
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/"}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Attack Section */}
      <div className="p-4 border-t space-y-3">

        {state === "attack" && (
          <div className="text-center text-xs text-destructive font-mono">
            ⚠ ATTACK ACTIVE — {countdown}s
          </div>
        )}

        {state === "containment" && (
          <div className="text-center text-xs text-primary font-mono">
            ✓ CONTAINED
          </div>
        )}

        <button
          onClick={simulateAttack}
          disabled={state !== "normal"}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap className="h-4 w-4" />
          Simulate Attack
        </button>
      </div>

      {/* Status */}
      <div className="p-4 border-t text-xs text-muted-foreground font-mono uppercase tracking-wider flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            state === "normal"
              ? "bg-green-500"
              : state === "attack"
              ? "bg-red-500 animate-pulse"
              : "bg-yellow-500"
          }`}
        />
        {state === "normal"
          ? "All Systems Normal"
          : state === "attack"
          ? "Threat Detected"
          : "Containing..."}
      </div>
    </aside>
  )
}
