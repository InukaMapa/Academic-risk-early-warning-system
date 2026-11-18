import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Calendar,
  Clock,
  HeartHandshake,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { studentService } from '../../services/studentService'
import { interventionService } from '../../services/interventionService'
import { LoadingState } from '../../components/common/LoadingState'
import { formatDate } from '../../utils/formatters'

export const StudentDashboard = () => {
  const { user } = useAuth()
  const [student, setStudent] = useState(null)
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadStudentData()
  }, [user])

  const loadStudentData = async () => {
    setLoading(true)
    try {
      const studentId = user?.studentId || 'STU2024-019'
      const [st, intList] = await Promise.all([
        studentService.getStudentById(studentId),
        interventionService.getStudentInterventions(studentId)
      ])
      setStudent(st)
      setInterventions(intList)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading your academic profile..." />
  }

  const activeInterventions = interventions.filter(
    (i) => i.status === 'Pending' || i.status === 'In Progress'
  )

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={student?.avatar || user?.avatar}
              alt={student?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/60 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Welcome back, {student?.name}!</h2>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
                  Enrolled
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                Student ID: <strong>{student?.id}</strong> • {student?.programme}
              </p>
              <p className="text-[11px] text-blue-300 mt-0.5">{student?.academicYear}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 text-right sm:min-w-[160px]">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">
              Academic Support Status
            </span>
            <span className="text-sm font-bold text-white mt-1 block">
              {student?.riskCategory === 'High'
                ? 'Support Recommended'
                : student?.riskCategory === 'Medium'
                ? 'Advisory Check-in'
                : 'Good Standing'}
            </span>
          </div>
        </div>
      </div>

      {/* Encouraging Advisory Alert if high or medium risk */}
      {student?.riskCategory !== 'Low' && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 flex items-start gap-3.5 text-xs text-amber-900 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold">Academic Advisory Check-in Available</h4>
            <p className="mt-0.5 leading-relaxed text-amber-800">
              Your academic advisor has recommended targeted support sessions to help boost attendance and
              prepare for upcoming evaluations. Please check your personalized guidance below.
            </p>
          </div>
          <button
            onClick={() => navigate('/student/recommendations')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shrink-0 transition-colors shadow-2xs"
          >
            View Guidance
          </button>
        </div>
      )}

      {/* Academic Highlights Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-500">Lecture Attendance</span>
          <p
            className={`text-2xl font-extrabold mt-1 ${
              student?.attendance < 65 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {student?.attendance}%
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Min required: 75%</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-500">Midterm Examination</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {student?.midtermScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Summative evaluation</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-500">Coursework Marks</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {student?.assignmentScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Continuous labs & tasks</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-500">Cumulative GPA</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">
            {Number(student?.priorGpa || 2.5).toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">/ 4.0</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Academic baseline</p>
        </div>
      </div>

      {/* Active Recommendations Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Academic Support Actions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized interventions arranged with your faculty advisors
            </p>
          </div>
          <button
            onClick={() => navigate('/student/recommendations')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>See All Guidance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeInterventions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No pending academic actions</p>
            <p className="text-[11px] mt-0.5">You are currently meeting all course expectations.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeInterventions.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/60 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.type}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed max-w-xl">{item.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Scheduled Follow-up: <strong>{formatDate(item.followUpDate)}</strong> • Advisor:{' '}
                    {item.assignedBy}
                  </p>
                </div>

                <button
                  onClick={() => navigate('/student/recommendations')}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors shrink-0"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
