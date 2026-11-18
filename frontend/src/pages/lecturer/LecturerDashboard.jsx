import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  ArrowRight,
  Cpu,
  UploadCloud,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  HelpCircle
} from 'lucide-react'
import { StatCard } from '../../components/common/StatCard'
import { ChartCard } from '../../components/common/ChartCard'
import { RiskBadge } from '../../components/common/RiskBadge'
import { DisclaimerBanner } from '../../components/common/DisclaimerBanner'
import { LoadingState } from '../../components/common/LoadingState'
import { reportService } from '../../services/reportService'
import { studentService } from '../../services/studentService'
import { interventionService } from '../../services/interventionService'
import { formatDate } from '../../utils/formatters'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

export const LecturerDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [students, setStudents] = useState([])
  const [interventions, setInterventions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [sumData, studentList, intList] = await Promise.all([
        reportService.getDashboardSummary(),
        studentService.getStudents(),
        interventionService.getInterventions()
      ])
      setSummary(sumData)
      setStudents(studentList)
      setInterventions(intList)
    } catch (e) {
      console.error('Error loading dashboard data', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingState message="Aggregating academic analytics dashboard..." />
  }

  // Filter top priority students requiring immediate attention
  const highRiskStudents = students
    .filter((s) => s.riskCategory === 'High')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5)

  const pendingInterventions = interventions
    .filter((i) => i.status === 'Pending' || i.status === 'In Progress')
    .slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Academic Risk Early Warning Dashboard
            </h2>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              Active Cohort
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Monitor real-time student academic risks, review explainable AI (XAI) feature attributions,
            assign personalized interventions, and evaluate post-intervention progress.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/lecturer/risk-prediction')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <Cpu className="w-4 h-4" />
            <span>Run ML Prediction</span>
          </button>
          <button
            onClick={() => navigate('/lecturer/upload')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import Data</span>
          </button>
        </div>
      </div>

      {/* Research Disclaimer */}
      <DisclaimerBanner type="prediction" />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Monitored Students"
          value={summary?.totalStudents || 0}
          subtext="Undergraduate Cohorts"
          icon={Users}
          variant="blue"
          trend="+4 imported recently"
          trendDirection="neutral"
          onClick={() => navigate('/lecturer/students')}
        />
        <StatCard
          title="High Risk Students"
          value={summary?.highRisk || 0}
          subtext={`${summary?.highRiskPercentage}% of total cohort`}
          icon={AlertTriangle}
          variant="rose"
          trend="Immediate Action"
          trendDirection="down"
          onClick={() => navigate('/lecturer/students?filter=High')}
        />
        <StatCard
          title="Medium Risk Students"
          value={summary?.mediumRisk || 0}
          subtext={`${summary?.mediumRiskPercentage}% of total cohort`}
          icon={AlertCircle}
          variant="amber"
          trend="Monitor Attendance"
          trendDirection="neutral"
          onClick={() => navigate('/lecturer/students?filter=Medium')}
        />
        <StatCard
          title="Low Risk / On Track"
          value={summary?.lowRisk || 0}
          subtext={`${summary?.lowRiskPercentage}% of total cohort`}
          icon={CheckCircle}
          variant="emerald"
          trend="Satisfactory"
          trendDirection="up"
          onClick={() => navigate('/lecturer/students?filter=Low')}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Chart */}
        <ChartCard
          title="Student Academic Risk Progression"
          subtitle="Cohort risk distribution across academic weeks"
          className="lg:col-span-2"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary?.trendData || []} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="high"
                name="High Risk"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#highGrad)"
              />
              <Area
                type="monotone"
                dataKey="medium"
                name="Medium Risk"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#medGrad)"
              />
              <Area
                type="monotone"
                dataKey="low"
                name="Low Risk"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#lowGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Risk Category Pie Chart */}
        <ChartCard
          title="Overall Risk Distribution"
          subtitle="Proportion of students by category"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={summary?.riskDistribution || []}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {(summary?.riskDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Two Column Grid: Students Requiring Attention & Pending Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students Requiring Immediate Attention */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Students Requiring Attention</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Highest risk probabilities requiring early advisory contact
              </p>
            </div>
            <button
              onClick={() => navigate('/lecturer/students?filter=High')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-2">Student</th>
                  <th className="pb-3 px-2">Programme</th>
                  <th className="pb-3 px-2 text-center">Attendance</th>
                  <th className="pb-3 px-2 text-center">Midterm</th>
                  <th className="pb-3 px-2 text-center">Risk Score</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {highRiskStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{st.name}</p>
                          <p className="text-[10px] text-slate-400">{st.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-600 max-w-[140px] truncate">{st.programme}</td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`font-semibold ${
                          st.attendance < 60 ? 'text-rose-600' : 'text-amber-600'
                        }`}
                      >
                        {st.attendance}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-slate-700">
                      {st.midtermScore}/100
                    </td>
                    <td className="py-3 px-2 text-center">
                      <RiskBadge risk={st.riskCategory} size="sm" />
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/lecturer/explainability?studentId=${st.id}`)}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                          title="View XAI Feature Attribution"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/lecturer/interventions?studentId=${st.id}`)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                          Intervene
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Interventions & Quick Feed */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Intervention Tracking</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pending follow-ups & active support</p>
              </div>
              <button
                onClick={() => navigate('/lecturer/tracking')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingInterventions.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/60 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">{item.studentName}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        item.status === 'In Progress'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-1">{item.type}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Follow-up: {formatDate(item.followUpDate)}
                    </span>
                    <span className="font-semibold text-rose-600">{item.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick link banner */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate('/lecturer/progress')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Closed-Loop Progress Cycle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
