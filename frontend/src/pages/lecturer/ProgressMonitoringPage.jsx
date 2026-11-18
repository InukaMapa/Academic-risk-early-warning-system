import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
  History,
  CheckCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react'
import { RiskBadge } from '../../components/common/RiskBadge'
import { ChartCard } from '../../components/common/ChartCard'
import { LoadingState } from '../../components/common/LoadingState'
import { studentService } from '../../services/studentService'
import { interventionService } from '../../services/interventionService'
import { formatDate } from '../../utils/formatters'
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
import { toast } from 'react-toastify'

export const ProgressMonitoringPage = () => {
  const [students, setStudents] = useState([])
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(true)
  const [reassessingId, setReassessingId] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [stList, intList] = await Promise.all([
        studentService.getStudents(),
        interventionService.getInterventions()
      ])
      setStudents(stList)
      setInterventions(intList)
    } catch (e) {
      toast.error('Failed to load progress monitoring data')
    } finally {
      setLoading(false)
    }
  }

  // Trigger closed-loop re-assessment
  const handleReassessStudent = async (student) => {
    setReassessingId(student.id)
    try {
      // Simulate post-intervention recovery (+6% attendance, +8 midterm marks)
      const newAttendance = Math.min(95, student.attendance + 6)
      const newMidterm = Math.min(92, student.midtermScore + 8)
      const newAssignment = Math.min(92, student.assignmentScore + 6)

      const updated = await studentService.updateStudent(student.id, {
        attendance: newAttendance,
        midtermScore: newMidterm,
        assignmentScore: newAssignment,
        notes: `Re-assessed on ${new Date().toISOString().split('T')[0]}: Attendance improved to ${newAttendance}%, assessment score improved to ${newMidterm}/100 following completed intervention.`
      })

      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      toast.success(
        `Closed-loop re-assessment complete for ${student.name}. Risk transitioned to ${updated.riskCategory} (${updated.riskScore}%)`
      )
    } catch (e) {
      toast.error('Re-assessment calculation failed')
    } finally {
      setReassessingId(null)
    }
  }

  if (loading) {
    return <LoadingState message="Loading closed-loop progress telemetry..." />
  }

  // Cohort longitudinal tracking sample data
  const cohortProgressTrend = [
    { checkpoint: 'Week 2 (Initial)', marcusRisk: 68, liamRisk: 75, sophiaRisk: 72, avgCohortRisk: 52 },
    { checkpoint: 'Week 4 (Post-Detection)', marcusRisk: 74, liamRisk: 68, sophiaRisk: 76, avgCohortRisk: 50 },
    { checkpoint: 'Week 6 (Intervention Active)', marcusRisk: 81, liamRisk: 60, sophiaRisk: 77, avgCohortRisk: 48 },
    { checkpoint: 'Week 8 (Mid-Term Review)', marcusRisk: 84.5, liamRisk: 54, sophiaRisk: 78.2, avgCohortRisk: 46 },
    { checkpoint: 'Week 10 (Current Eval)', marcusRisk: 78, liamRisk: 44, sophiaRisk: 68, avgCohortRisk: 41 }
  ]

  // Calculate closed-loop recovery rate
  const improvedStudents = students.filter(
    (s) => s.riskTrend === 'improving' || (s.previousRisk === 'High' && s.riskCategory !== 'High')
  )
  const recoveryRate = Math.round((improvedStudents.length / (students.length || 1)) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Closed-Loop Progress Monitoring
            </h2>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              Closed-Loop Stage 4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Evaluate academic performance trajectory following personalized interventions. Measure attendance
            recoveries, compare pre- and post-intervention risk levels, and trigger model re-assessments.
          </p>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-right shrink-0">
          <span className="text-[10px] font-bold uppercase text-emerald-700 block">
            Intervention Recovery Rate
          </span>
          <span className="text-2xl font-extrabold text-emerald-800">{recoveryRate}%</span>
        </div>
      </div>

      {/* Closed-Loop Visual Process Stepper */}
      <div className="bg-[#0B132B] text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Adaptive Closed-Loop Operational Lifecycle
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-blue-400 font-mono font-bold text-[10px] block mb-1">01 • DETECTION</span>
            <p className="font-bold text-white">Risk Classification</p>
            <p className="text-slate-400 text-[11px] mt-1 leading-snug">
              ML models identify high risk students from attendance & exam features.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-indigo-400 font-mono font-bold text-[10px] block mb-1">02 • EXPLANATION</span>
            <p className="font-bold text-white">XAI Attribution</p>
            <p className="text-slate-400 text-[11px] mt-1 leading-snug">
              LIME / SHAP reveals root factors (attendance vs coursework deficit).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-emerald-400 font-mono font-bold text-[10px] block mb-1">03 • INTERVENTION</span>
            <p className="font-bold text-white">Targeted Support</p>
            <p className="text-slate-400 text-[11px] mt-1 leading-snug">
              Counseling, tutoring, or remedial workshops assigned with deadlines.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-amber-400 font-mono font-bold text-[10px] block mb-1">04 • MONITORING</span>
            <p className="font-bold text-white">Follow-up Audits</p>
            <p className="text-slate-400 text-[11px] mt-1 leading-snug">
              Supervisor checks attendance recovery and completed milestone logs.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/50 ring-1 ring-blue-500/20">
            <span className="text-sky-300 font-mono font-bold text-[10px] block mb-1">05 • RE-ASSESSMENT</span>
            <p className="font-bold text-white">Loop Closure</p>
            <p className="text-slate-300 text-[11px] mt-1 leading-snug">
              Re-evaluates student risk score to confirm downgrade or escalate.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <ChartCard
        title="Longitudinal Risk Score Trajectory Post-Intervention"
        subtitle="Tracking student risk reduction across 10 academic weeks following personalized support"
        height="h-72"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cohortProgressTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="checkpoint" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
            <Tooltip
              formatter={(val, name) => [`${val}% Risk`, name]}
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
              dataKey="marcusRisk"
              name="Marcus Chen (Counselling)"
              stroke="#f43f5e"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="liamRisk"
              name="Liam Anderson (Peer Tutoring)"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="sophiaRisk"
              name="Sophia Davis (Lecturer 1-on-1)"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="avgCohortRisk"
              name="Cohort Baseline Average"
              stroke="#94a3b8"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Student Progress Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Student Closed-Loop Progress Evaluation Table
            </h4>
            <p className="text-xs text-slate-500">
              Compare baseline risk against current risk level and trigger adaptive re-assessment
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4 text-center">Baseline Risk</th>
                <th className="py-3 px-4 text-center">Current Risk</th>
                <th className="py-3 px-4 text-center">Trajectory</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-center">Midterm Exam</th>
                <th className="py-3 px-4 text-center">Interventions</th>
                <th className="py-3 px-4 text-right">Closed-Loop Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => {
                const isImproved =
                  st.riskTrend === 'improving' ||
                  (st.previousRisk === 'High' && st.riskCategory !== 'High')
                const isDeteriorating = st.riskTrend === 'deteriorating'
                const studentInts = interventions.filter((i) => i.studentId === st.id)
                const completedInts = studentInts.filter((i) => i.status === 'Completed').length

                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 block">{st.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{st.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <RiskBadge risk={st.previousRisk || st.riskCategory} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-center">
                      <RiskBadge risk={st.riskCategory} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                          isImproved
                            ? 'text-emerald-600'
                            : isDeteriorating
                            ? 'text-rose-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {isImproved ? (
                          <>
                            <TrendingDown className="w-3.5 h-3.5" /> Recovering
                          </>
                        ) : isDeteriorating ? (
                          <>
                            <TrendingUp className="w-3.5 h-3.5" /> Deteriorating
                          </>
                        ) : (
                          <>
                            <Activity className="w-3.5 h-3.5 text-slate-400" /> Stable
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {st.attendance}%
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {st.midtermScore}/100
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {completedInts} of {studentInts.length} Done
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleReassessStudent(st)}
                        disabled={reassessingId === st.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors disabled:opacity-50"
                        title="Run adaptive re-assessment based on post-intervention recovery"
                      >
                        {reassessingId === st.id ? (
                          <span className="w-3.5 h-3.5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                        ) : (
                          <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span>Re-assess</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
