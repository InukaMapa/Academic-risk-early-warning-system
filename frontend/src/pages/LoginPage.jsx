import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  Cpu,
  HeartHandshake
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('lecturer')
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const { loginAsLecturer, loginAsStudent, loginWithCredentials } = useAuth()
  const navigate = useNavigate()

  const handleDemoLecturer = () => {
    setIsLoading(true)
    setTimeout(() => {
      loginAsLecturer()
      toast.success('Signed in as Senior Lecturer & Academic Advisor')
      navigate('/lecturer/dashboard')
    }, 300)
  }

  const handleDemoStudent = () => {
    setIsLoading(true)
    setTimeout(() => {
      loginAsStudent('STU2024-019')
      toast.success('Signed in to Student Portal (Maya Lin)')
      navigate('/student/dashboard')
    }, 300)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your university email address')
      return
    }
    if (!password) {
      toast.error('Please enter your password')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      loginWithCredentials(email, password, selectedRole)
      toast.success(`Welcome back! Signed in as ${selectedRole}`)
      if (selectedRole === 'student') {
        navigate('/student/dashboard')
      } else {
        navigate('/lecturer/dashboard')
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        {/* Brand Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/25 mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">EduGuard AI</h2>
        <p className="mt-2 text-xs font-medium text-slate-400 max-w-sm mx-auto leading-relaxed">
          An Adaptive Closed-Loop Early Warning System for Academic Risk Detection & Personalized
          Intervention
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100">
          {/* Quick Demo Access Bar */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/90">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Quick One-Click Demo Access
              </span>
              <span className="text-[10px] text-slate-500 font-medium">No password needed</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDemoLecturer}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 p-3 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xs hover:shadow-md disabled:opacity-50"
              >
                <Cpu className="w-4 h-4" />
                <span>Demo Lecturer Portal</span>
              </button>

              <button
                type="button"
                onClick={handleDemoStudent}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 p-3 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-all shadow-xs hover:shadow-md disabled:opacity-50"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Demo Student Portal</span>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Or Sign In with University Credentials
              </span>
            </div>
          </div>

          {/* Role selector tab */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('lecturer')
                setEmail('d.miller@university.edu')
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'lecturer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Lecturer / Faculty
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student')
                setEmail('m.lin@university.edu')
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'student'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Enrolled Student
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'lecturer'
                      ? 'e.g. d.miller@university.edu'
                      : 'e.g. m.lin@university.edu'
                  }
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                />
                <span>Remember session</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); toast.info('For this research prototype, use any password or click the Quick Demo buttons above.') }} className="text-blue-600 hover:underline font-medium">
                Demo Credentials Help
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In as {selectedRole === 'lecturer' ? 'Lecturer' : 'Student'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Research Context Footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" /> Academic Research Prototype
            </span>
            <span>Version 1.0 (FastAPI-ready)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
