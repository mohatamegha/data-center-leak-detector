import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import { startAlarm, stopAlarm } from "@/lib/alarm"

const SimContext = createContext(null)

export const useSimulation = () => {
  const ctx = useContext(SimContext)
  if (!ctx) throw new Error("useSimulation must be inside SimProvider")
  return ctx
}

export const SimProvider = ({ children }) => {
  const [state, setState] = useState("normal")
  const [countdown, setCountdown] = useState(45)

  const [cpuHistory, setCpuHistory] = useState(
    Array.from({ length: 30 }, () => 15 + Math.random() * 10)
  )
  const [networkHistory, setNetworkHistory] = useState(
    Array.from({ length: 30 }, () => 20 + Math.random() * 15)
  )

  const [leakPercent, setLeakPercent] = useState(0)
  const [energyWasted, setEnergyWasted] = useState(0)
  const [carbonEmitted, setCarbonEmitted] = useState(0)
  const [costLeakage, setCostLeakage] = useState(0)
  const [preventedDamage, setPreventedDamage] = useState(0)
  const [reports, setReports] = useState([])
  const [attackStartTime, setAttackStartTime] = useState(null)

  const [sensitivity, setSensitivity] = useState(75)
  const [autoContainment, setAutoContainment] = useState(true)
  const [alertDelay, setAlertDelay] = useState(5)

  const stateRef = useRef(state)
  stateRef.current = state

  const attackStartRef = useRef(attackStartTime)
  attackStartRef.current = attackStartTime

  // generate id fallback
  const genId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)

  const containAttack = useCallback((action) => {
    stopAlarm()
    setState("containment")

    const duration = attackStartRef.current
      ? Math.round((Date.now() - attackStartRef.current) / 1000)
      : 0

    const energy = +(duration * 0.8).toFixed(1)

    setPreventedDamage((prev) =>
      prev + +(Math.max(0, (45 - duration) * 0.8)).toFixed(1)
    )

    setReports((prev) => [
      ...prev,
      {
        id: genId(),
        timestamp: new Date(),
        threat: "Unauthorized Compute Activity",
        duration,
        energyLoss: energy,
        action,
        status: "Contained",
      },
    ])

    setTimeout(() => {
      setState("normal")
      setCountdown(45)
      setAttackStartTime(null)
    }, 3000)
  }, [])

  const simulateAttack = useCallback(() => {
    if (stateRef.current !== "normal") return
    setState("attack")
    setCountdown(45)
    setAttackStartTime(Date.now())
    setLeakPercent(0)
    startAlarm()
  }, [])

  const killProcess = useCallback(() => {
    if (stateRef.current === "attack") containAttack("Kill Process")
  }, [containAttack])

  const quarantine = useCallback(() => {
    if (stateRef.current === "attack") containAttack("Quarantine")
  }, [containAttack])

  // countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      if (stateRef.current === "attack") {
        setCountdown((prev) => {
          const next = prev - 1
          if (next <= 0) {
            containAttack("Auto-Containment")
            return 0
          }
          return next
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [containAttack])

  // data simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      const s = stateRef.current

      setCpuHistory((prev) => {
        const next = [...prev.slice(-29)]
        if (s === "attack") next.push(75 + Math.random() * 20)
        else if (s === "containment") next.push(10 + Math.random() * 5)
        else next.push(15 + Math.random() * 10)
        return next
      })

      setNetworkHistory((prev) => {
        const next = [...prev.slice(-29)]
        if (s === "attack") next.push(60 + Math.random() * 30)
        else if (s === "containment") next.push(10 + Math.random() * 8)
        else next.push(20 + Math.random() * 15)
        return next
      })

      if (s === "attack") {
        setLeakPercent((prev) => Math.min(100, prev + 2.5))
        setEnergyWasted((prev) => +(prev + 1.6).toFixed(1))
        setCarbonEmitted((prev) => +(prev + 0.7).toFixed(2))
        setCostLeakage((prev) => +(prev + 12).toFixed(0))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <SimContext.Provider
      value={{
        state,
        countdown,
        cpuHistory,
        networkHistory,
        leakPercent,
        energyWasted,
        carbonEmitted,
        costLeakage,
        preventedDamage,
        reports,
        attackStartTime,
        simulateAttack,
        killProcess,
        quarantine,
        sensitivity,
        setSensitivity,
        autoContainment,
        setAutoContainment,
        alertDelay,
        setAlertDelay,
      }}
    >
      {children}
    </SimContext.Provider>
  )
}
