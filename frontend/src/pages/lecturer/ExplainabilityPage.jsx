import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  TrendingDown,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { RiskBadge } from '../../components/common/RiskBadge'
import { ChartCard } from '../../components/common/ChartCard'
import { DisclaimerBanner } from '../../components/common/DisclaimerBanner'
import { LoadingState } from '../../components/common/LoadingState'
import { studentService } from '../../services/studentService'
import { xaiService } from '../../services/xaiService'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  ReferenceLine
} from 'recharts'
import { toast } from 'react-toastify'

export const ExplainabilityPage = () => {
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedModel, setSelectedModel] = useState('random_forest')
  const [loading, setLoading] = useState(true)
  const [explaining, setExplaining] = useState(false)
  const [explanation, setExplanation] = useState(null)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const studentList = await studentService.getStudents()
      setStudents(studentList)

      const paramId = searchParams.get('studentId')
      const targetId =
        paramId && studentList.some((s) => s.id === paramId)
          ? paramId
          : studentList[0]?.id || ''

      setSelectedStudentId(targetId)
      if (targetId) {
        fetchExplanation(targetId, selectedModel)
      }
    } catch (e) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const fetchExplanation = async (studentId, model) => {
    setExplaining(true)
    try {
      const result = await xaiService.getExplanation(studentId, model)
      setExplanation(result)
    } catch (e) {
      toast.error('Failed to generate XAI feature attribution')
    } finally {
      setExplaining(false)
    }
  }

  const handleStudentChange = (id) => {
    setSelectedStudentId(id)
    fetchExplanation(id, selectedModel)
  }

  const handleModelChange = (model) => {
    setSelectedModel(model)
    if (selectedStudentId) {
      fetchExplanation(selectedStudentId, model)
    }
  }

  if (loading) {
    return <LoadingState message="Loading Explainable AI (XAI) framework..." />
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId)

  // Format data for Tornado / Diverging Bar Chart
  const chartData = (explanation?.features || []).map((f) => ({
    feature: f.feature,
    impact: f.signedValue, // positive = risk increasing, negative = protective
    contribution: f.contribution,
    type: f.type,
    studentValue: f.studentValue,
    benchmarkValue: f.benchmarkValue
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Explainable AI (XAI) Attribution
            </h2>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              LIME / SHAP Methodology
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Deconstruct predictive risk decisions into local feature contributions. Discover exactly why a
            student received a specific risk classification to guide transparent academic interventions.
          </p>
        </div>

        {/* Student Selector Dropdown in Header */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-slate-600">Student:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-w-xs"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.id}) - {st.riskCategory} Risk
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Research Disclaimer */}
      <DisclaimerBanner type="xai" />

      {/* Student Profile & Prediction Overview Bar */}
      {selectedStudent && explanation && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Student Info */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <img
              src={selectedStudent.avatar}
              alt={selectedStudent.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
            />
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate">{selectedStudent.name}</h4>
              <p className="text-xs text-slate-500">{selectedStudent.id}</p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{selectedStudent.programme}</p>
            </div>
          </div>

          {/* Classification & Confidence */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Assigned Classification
              </span>
              <div className="mt-1 flex items-center gap-2">
                <RiskBadge risk={explanation.prediction.riskCategory} size="md" />
                <span className="text-xs font-semibold text-slate-600">
                  {explanation.prediction.riskScore}% Risk Index
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-500">Confidence</span>
              <p className="text-base font-bold text-blue-600 mt-0.5">
                {explanation.prediction.confidence}%
              </p>
            </div>
          </div>

          {/* Explainer Method Selector */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Model Explainer Source
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {selectedModel === 'random_forest' ? 'Random Forest (SHAP / LIME)' : 'Decision Tree (CART)'}
              </p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => handleModelChange('random_forest')}
                className={`px-2 py-1 rounded-md transition-all ${
                  selectedModel === 'random_forest'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                RF
              </button>
              <button
                onClick={() => handleModelChange('decision_tree')}
                className={`px-2 py-1 rounded-md transition-all ${
                  selectedModel === 'decision_tree'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                DT
              </button>
            </div>
          </div>
        </div>
      )}

      {explaining ? (
        <LoadingState message="Computing local feature attribution weights..." />
      ) : explanation ? (
        <div className="space-y-6">
          {/* Natural Language Explanation Card */}
          <div className="bg-white p-5 rounded-xl border border-blue-200/90 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Natural Language Diagnostic Explanation
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              {explanation.summary}
            </p>
          </div>

          {/* Feature Importance Chart */}
          <ChartCard
            title="Local Feature Contribution Analysis"
            subtitle="Red bars indicate adverse factors driving risk upward; green bars represent protective academic anchors"
            height="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={[-40, 40]}
                  tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val > 0 ? '+' : ''}${val}% (${item.payload.type})`,
                    'Risk Contribution Weight'
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.5} />
                <Bar dataKey="impact" radius={[4, 4, 4, 4]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.impact > 0 ? '#f43f5e' : '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Feature Attributions Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                Detailed Academic Feature Attribution Weights
              </h4>
              <span className="text-xs text-slate-500">Benchmark vs. Cohort Baseline</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                    <th className="py-2.5 px-4">Academic Feature</th>
                    <th className="py-2.5 px-4 text-center">Student Metric</th>
                    <th className="py-2.5 px-4 text-center">Cohort Baseline</th>
                    <th className="py-2.5 px-4 text-center">Factor Direction</th>
                    <th className="py-2.5 px-4 text-center">XAI Impact Weight</th>
                    <th className="py-2.5 px-4">Actionable Diagnostic Insight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {explanation.features.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{f.feature}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {f.studentValue}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 font-medium">
                        {f.benchmarkValue}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            f.direction === 'risk_increasing'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {f.direction === 'risk_increasing' ? (
                            <>
                              <TrendingUp className="w-3 h-3 text-rose-600" /> Adverse Factor
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3 h-3 text-emerald-600" /> Protective Factor
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        <span
                          className={f.signedValue > 0 ? 'text-rose-600' : 'text-emerald-600'}
                        >
                          {f.signedValue > 0 ? `+${f.signedValue}%` : `${f.signedValue}%`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed">
                        {f.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md">
            <div>
              <p className="font-bold text-sm">Translate XAI Insights into Actionable Intervention</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeted recommendations are generated based on the highest adverse factors for{' '}
                {selectedStudent?.name}.
              </p>
            </div>

            <button
              onClick={() => navigate(`/lecturer/interventions?studentId=${selectedStudentId}`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-300" />
              <span>Review Recommended Interventions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
