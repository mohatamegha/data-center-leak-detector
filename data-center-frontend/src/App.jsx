import { BrowserRouter, Routes, Route } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"

import { SimProvider } from "@/context/SimulationContext"
import { AuthProvider } from "@/context/AuthContext"
import ProtectedRoute from "@/routes/ProtectedRoute"

import DashboardLayout from "@/components/DashboardLayout"
import Dashboard from "@/pages/Dashboard"
import IncidentCenter from "@/pages/IncidentCenter"
import SustainabilityImpact from "@/pages/SustainabilityImpact"
import Reports from "@/pages/Reports"
import SettingsPage from "@/pages/Settings"

import Login from "@/pages/Login"
import Signup from "@/pages/Signup"

export default function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <SimProvider>
          <BrowserRouter>
            <Toaster />
            <Routes>

              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/incidents" element={<IncidentCenter />} />
                <Route path="/sustainability" element={<SustainabilityImpact />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

            </Routes>
          </BrowserRouter>
        </SimProvider>
      </AuthProvider>
    </TooltipProvider>
  )
}
