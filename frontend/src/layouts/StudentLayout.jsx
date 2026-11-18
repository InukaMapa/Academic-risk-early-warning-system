import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  HeartHandshake,
  TrendingUp,
  ArrowRightLeft,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const StudentLayout = () => {
  const { user, switchRole, logout } = useAuth()
  const navigate = useNavigate()

  const handleRoleSwitch = () => {
    switchRole()
    navigate('/lecturer/dashboard')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const studentNavItems = [
    { label: 'My Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Academic Overview', path: '/student/academic', icon: BookOpen },
    { label: 'My Recommendations', path: '/student/recommendations', icon: HeartHandshake },
    { label: 'My Progress', path: '/student/progress', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
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

      {/* Top Student Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0B132B] text-white border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">EduGuard AI</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                    Student Portal
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Student Academic Guidance & Growth</p>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRoleSwitch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition-colors shadow-2xs"
                title="Switch view back to Lecturer Portal"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Switch to Lecturer Portal</span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'}
                  alt={user?.name || 'Student'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{user?.name || 'Maya Lin'}</p>
                  <p className="text-[10px] text-slate-400">{user?.studentId || 'STU2024-019'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Student Horizontal Nav Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-4 border-t border-slate-800/80 overflow-x-auto py-2">
            {studentNavItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Student Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Outlet />
      </main>

      <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        EduGuard AI Student Learning Companion • Your personal academic success hub
      </footer>
    </div>
  )
}
