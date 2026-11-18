import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/common/Sidebar'
import { Navbar } from '../components/common/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const LecturerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Map route to clean title
  const getPageTitle = (pathname) => {
    if (pathname.includes('/dashboard')) return 'Academic Overview Dashboard'
    if (pathname.includes('/students')) return 'Student Data Management'
    if (pathname.includes('/upload')) return 'Upload Academic Records'
    if (pathname.includes('/risk-prediction')) return 'AI Academic Risk Prediction'
    if (pathname.includes('/explainability')) return 'Explainable AI (XAI) Feature Attribution'
    if (pathname.includes('/interventions')) return 'Personalized Intervention Recommendations'
    if (pathname.includes('/tracking')) return 'Intervention Action Tracking'
    if (pathname.includes('/progress')) return 'Closed-Loop Student Progress Monitoring'
    if (pathname.includes('/reports')) return 'Research Reports & Model Analytics'
    if (pathname.includes('/settings')) return 'System Settings & API Configuration'
    return 'EduGuard AI Dashboard'
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Toast Notifications Container */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          pageTitle={getPageTitle(location.pathname)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>

        <footer className="py-4 px-6 border-t border-slate-200/80 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>EduGuard AI • Final Year Research Project in Higher Education Analytics</span>
          <span className="text-[11px] text-slate-400">
            An Adaptive Closed-Loop Early Warning System for Academic Risk Detection
          </span>
        </footer>
      </div>
    </div>
  )
}
