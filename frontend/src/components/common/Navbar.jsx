import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Menu,
  Bell,
  ArrowRightLeft,
  ShieldCheck
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const Navbar = ({ onOpenSidebar, pageTitle = 'Dashboard' }) => {
  const { user, switchRole, isLecturer } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()

  const handleRoleSwitch = () => {
    switchRole()
    if (isLecturer) {
      navigate('/student/dashboard')
    } else {
      navigate('/lecturer/dashboard')
    }
  }

  const sampleNotifications = [
    {
      id: 1,
      title: 'High Risk Alert: Marcus Chen',
      desc: 'Attendance dropped to 48%. Midterm score 36/100.',
      time: '12m ago',
      type: 'urgent'
    },
    {
      id: 2,
      title: 'Intervention Progress Logged',
      desc: 'Counseling session completed for STU2024-003.',
      time: '1h ago',
      type: 'success'
    },
    {
      id: 3,
      title: 'Re-assessment Recommended',
      desc: '2 students eligible for closed-loop evaluation.',
      time: '3h ago',
      type: 'info'
    }
  ]

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
            {pageTitle}
          </h1>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
            Semester 1 (2026/2027) • Higher Education Academic Analytics
          </p>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2.5">
        {/* Prototype Role Switcher Button */}
        <button
          onClick={handleRoleSwitch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/90 transition-all shadow-2xs"
          title="Switch view between Lecturer Portal and Student Portal"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden md:inline">Switch to</span>
          <span className="underline decoration-blue-400">
            {isLecturer ? 'Student Portal' : 'Lecturer Portal'}
          </span>
        </button>

        {/* Backend readiness badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>FastAPI Ready</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">System Notifications</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-semibold">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {sampleNotifications.map((n) => (
                  <div key={n.id} className="p-2.5 hover:bg-slate-50 rounded-lg text-xs transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'Lecturer'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
