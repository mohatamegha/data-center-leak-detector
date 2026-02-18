import { BrowserRouter, Routes, Route } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"

import { SimProvider } from "@/context/SimulationContext"

import DashboardLayout from "@/components/DashboardLayout"
import Dashboard from "@/pages/Dashboard"
import IncidentCenter from "@/pages/IncidentCenter"
import SustainabilityImpact from "@/pages/SustainabilityImpact"
import Reports from "@/pages/Reports"
import SettingsPage from "@/pages/Settings"
// import NotFound from "@/pages/NotFound"

export default function App() {
  return (
    <TooltipProvider>
      <SimProvider>
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/incidents" element={<IncidentCenter />} />
              <Route path="/sustainability" element={<SustainabilityImpact />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </SimProvider>
    </TooltipProvider>
  )
}
