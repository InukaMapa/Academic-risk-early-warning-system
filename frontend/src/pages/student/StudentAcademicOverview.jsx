import { useState, useEffect } from 'react'
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ArrowUpRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { studentService } from '../../services/studentService'
import { LoadingState } from '../../components/common/LoadingState'

export const StudentAcademicOverview = () => {
  const { user } = useAuth()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudent()
  }, [user])

  const loadStudent = async () => {
    setLoading(true)
    try {
      const studentId = user?.studentId || 'STU2024-019'
      const st = await studentService.getStudentById(studentId)
      setStudent(st)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading your academic coursework overview..." />
  }

  // Realistic sample module enrollment
  const modules = [
    {
      code: 'CS201',
      title: 'Data Structures and Algorithms',
      credits: 4,
      attendance: student?.attendance || 52,
      midterm: student?.midtermScore || 43,
      coursework: student?.assignmentScore || 49,
      status: 'Attention Needed',
      lecturer: 'Dr. David Miller'
    },
    {
      code: 'CS204',
      title: 'Object-Oriented Programming & Design Patterns',
      credits: 3,
      attendance: Math.min(100, (student?.attendance || 52) + 12),
      midterm: Math.min(100, (student?.midtermScore || 43) + 15),
      coursework: Math.min(100, (student?.assignmentScore || 49) + 10),
      status: 'On Track',
      lecturer: 'Prof. Helen Ross'
    },
    {
      code: 'MATH103',
      title: 'Discrete Mathematics & Probability',
      credits: 3,
      attendance: Math.max(30, (student?.attendance || 52) - 8),
      midterm: Math.max(25, (student?.midtermScore || 43) - 5),
      coursework: student?.assignmentScore || 49,
      status: 'Attention Needed',
      lecturer: 'Dr. Michael Chang'
    },
    {
      code: 'SE210',
      title: 'Software Engineering Principles',
      credits: 3,
      attendance: Math.min(100, (student?.attendance || 52) + 18),
      midterm: Math.min(100, (student?.midtermScore || 43) + 20),
      coursework: Math.min(100, (student?.assignmentScore || 49) + 14),
      status: 'Good Standing',
      lecturer: 'Dr. Sarah Jenkins'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Academic Overview</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Detailed breakdown of your enrolled modules, formative coursework marks, lecture attendance, and
          learning platform engagement for {student?.academicYear || 'Semester 1'}.
        </p>
      </div>

      {/* Module Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <div
            key={mod.code}
            className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4 hover:shadow-xs transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {mod.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5">{mod.title}</h3>
                <p className="text-[11px] text-slate-400">
                  Instructor: {mod.lecturer} • {mod.credits} Credits
                </p>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  mod.status === 'Good Standing'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : mod.status === 'On Track'
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {mod.status}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Attendance</span>
                <span
                  className={`font-extrabold text-sm ${
                    mod.attendance < 65 ? 'text-rose-600' : 'text-slate-800'
                  }`}
                >
                  {mod.attendance}%
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Midterm</span>
                <span
                  className={`font-extrabold text-sm ${
                    mod.midterm < 50 ? 'text-rose-600' : 'text-slate-800'
                  }`}
                >
                  {mod.midterm}/100
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Coursework</span>
                <span className="font-extrabold text-sm text-slate-800">{mod.coursework}/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Engagement Insights */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
          Study & Digital Learning Platform Insights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium text-[11px] block">LMS Study Hours Logged</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {student?.lmsHours ? `${student.lmsHours} Hours` : '10.0 Hours'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Cohort benchmark: 22.5 Hours</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium text-[11px] block">Tutorial & Lab Presence</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {student?.attendance}%
            </p>
            <p className="text-[11px] text-slate-400 mt-1">3 sessions missed this semester</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium text-[11px] block">Quiz Completion Average</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {student?.quizAverage || 46}%
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Continuous formative checkpoints</p>
          </div>
        </div>
      </div>
    </div>
  )
}
