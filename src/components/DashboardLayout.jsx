import { Outlet } from "react-router-dom"
import AppSidebar from "@/components/AppSidebar"

export default function DashboardLayout() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex">
      
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        
        {/* Top spacing / future header */}
        <header className="h-14 border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60" />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-7xl p-6">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}
