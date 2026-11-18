import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Target,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { studentService } from '../../services/studentService'
import { ChartCard } from '../../components/common/ChartCard'
import { LoadingState } from '../../components/common/LoadingState'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts'

export const StudentProgress = () => {
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
    return <LoadingState message="Loading your personal progress timeline..." />
  }

  // Student weekly historical checkpoints
  const historyData = student?.historicalScores || [
    { week: 'Week 2', attendance: 58, avgScore: 48 },
    { week: 'Week 4', attendance: 54, avgScore: 45 },
    { week: 'Week 6', attendance: 53, avgScore: 44 },
    { week: 'Week 8', attendance: student?.attendance || 52, avgScore: student?.midtermScore || 45 },
    { week: 'Current', attendance: Math.min(100, (student?.attendance || 52) + 6), avgScore: Math.min(100, (student?.midtermScore || 45) + 8) }
  ]

  const milestones = [
    {
      title: 'Initial Academic Diagnostic',
      date: 'Week 2',
      status: 'Completed',
      desc: 'Semester risk baseline established.'
    },
    {
      title: 'Advisory Consultation Attended',
      date: 'Week 5',
      status: 'Completed',
      desc: 'Met with Dr. David Miller to map out study strategy.'
    },
    {
      title: 'Remedial Programming Lab Session',
      date: 'Week 7',
      status: 'Completed',
      desc: 'Completed recursion and tree algorithm exercises.'
    },
    {
      title: 'End-of-Semester Re-assessment Target',
      date: 'Week 12',
      status: 'Upcoming',
      desc: 'Target: Raise attendance above 75% and exam average to 65%.'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Academic Growth & Progress</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Track your continuous recovery trajectory across the semester. Every lecture attended and
          assignment submitted brings you closer to your target academic standing.
        </p>
      </div>

      {/* Progress Chart */}
      <ChartCard
        title="My Attendance & Assessment Trajectory"
        subtitle="Tracking improvements from Week 2 to Current Checkpoint"
        height="h-72"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
            <Tooltip
              formatter={(val, name) => [`${val}%`, name]}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Line
              type="monotone"
              dataKey="attendance"
              name="Lecture Attendance %"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="avgScore"
              name="Assessment Performance %"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Milestones & Positive Reinforcement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milestone Steps */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-600" />
            My Learning Journey Milestones
          </h3>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {milestones.map((m, i) => (
              <div key={i} className="relative flex items-start gap-3 pl-8 text-xs">
                <div
                  className={`absolute left-2 top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${
                    m.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
                <div className="flex-1 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{m.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        m.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {m.date}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-snug">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Strategy & Tips */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4 text-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Advisor Recommendations for Success
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100">
                <p className="font-bold text-blue-900">1. Target Attendance Threshold (75%)</p>
                <p className="text-blue-800 text-[11px] mt-0.5 leading-relaxed">
                  Attending the upcoming 4 lectures will elevate your cumulative attendance from 52% to 64%,
                  safeguarding exam eligibility.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <p className="font-bold text-emerald-900">2. Complete Weekly Diagnostic Quizzes</p>
                <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                  Students who practice weekly quizzes score an average of 18% higher in final module exams.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-100">
                <p className="font-bold text-purple-900">3. Office Hours Consultation</p>
                <p className="text-purple-800 text-[11px] mt-0.5 leading-relaxed">
                  Book a 15-minute slot with Dr. David Miller before the upcoming practical evaluation.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 text-white flex items-center justify-between">
            <span className="font-semibold text-[11px]">Ready for next week's labs?</span>
            <span className="text-blue-400 font-bold text-[11px]">Keep Going! 🚀</span>
          </div>
        </div>
      </div>
    </div>
  )
}
