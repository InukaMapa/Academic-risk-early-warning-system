import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UploadCloud,
  Cpu,
  HelpCircle,
  HeartHandshake,
  ListTodo,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Sparkles,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navSections = [
    {
      category: 'OVERVIEW',
      items: [
        {
          label: 'Dashboard',
          path: '/lecturer/dashboard',
          icon: LayoutDashboard
        }
      ]
    },
    {
      category: 'DATA MANAGEMENT',
      items: [
        {
          label: 'Student Data',
          path: '/lecturer/students',
          icon: Users
        },
        {
          label: 'Upload Academic Data',
          path: '/lecturer/upload',
          icon: UploadCloud
        }
      ]
    },
    {
      category: 'AI ANALYTICS',
      items: [
        {
          label: 'Risk Prediction',
          path: '/lecturer/risk-prediction',
          icon: Cpu,
          badge: 'ML'
        },
        {
          label: 'Explainability (XAI)',
          path: '/lecturer/explainability',
          icon: HelpCircle,
          badge: 'XAI'
        }
      ]
    },
    {
      category: 'STUDENT INTERVENTION',
      items: [
        {
          label: 'Intervention Recommendations',
          path: '/lecturer/interventions',
          icon: HeartHandshake
        },
        {
          label: 'Intervention Tracking',
          path: '/lecturer/tracking',
          icon: ListTodo
        },
        {
          label: 'Progress Monitoring',
          path: '/lecturer/progress',
          icon: TrendingUp,
          badge: 'Loop'
        }
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        {
          label: 'Reports & Analytics',
          path: '/lecturer/reports',
          icon: BarChart3
        },
        {
          label: 'Settings',
          path: '/lecturer/settings',
          icon: Settings
        }
      ]
    }
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B132B] text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-[#090F22]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight text-base">EduGuard</span>
                <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-tight font-medium">Early Warning System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Research Title Sub-badge */}
        <div className="px-5 py-2.5 bg-blue-950/40 border-b border-blue-900/30 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <p className="text-[11px] text-blue-200/90 font-medium leading-tight truncate">
            Adaptive Closed-Loop EWS
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navSections.map((section) => (
            <div key={section.category}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {section.category}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => onClose && onClose()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-800 text-blue-400 border border-slate-700'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090F22]">
          <div className="flex items-center justify-between px-2 py-1.5 mb-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name || 'Lecturer'}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Lecturer'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.title || 'Academic Advisor'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors border border-transparent hover:border-rose-900/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
