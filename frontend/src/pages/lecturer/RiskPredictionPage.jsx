import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Cpu,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
  Clock,
  History,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Gauge
} from 'lucide-react'
import { RiskBadge } from '../../components/common/RiskBadge'
import { DisclaimerBanner } from '../../components/common/DisclaimerBanner'
import { LoadingState } from '../../components/common/LoadingState'
import { studentService } from '../../services/studentService'
import { predictionService } from '../../services/predictionService'
import { availableModels } from '../../data/mockModels'
import { formatDate } from '../../utils/formatters'
import { toast } from 'react-toastify'

export const RiskPredictionPage = () => {
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedModel, setSelectedModel] = useState('random_forest')
  const [activeTab, setActiveTab] = useState('single') // 'single' | 'batch'
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)
  const [predictionResult, setPredictionResult] = useState(null)
  const [predictionHistory, setPredictionHistory] = useState([])
  const [batchSummary, setBatchSummary] = useState(null)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    initData()
  }, [])

  const initData = async () => {
    setLoading(true)
    try {
      const [studentList, history] = await Promise.all([
        studentService.getStudents(),
        predictionService.getPredictionHistory()
      ])
      setStudents(studentList)
      setPredictionHistory(history)

      // Set initial selected student from query param or first student
      const paramId = searchParams.get('studentId')
      if (paramId && studentList.some((s) => s.id === paramId)) {
        setSelectedStudentId(paramId)
      } else if (studentList.length > 0) {
        setSelectedStudentId(studentList[0].id)
      }
    } catch (e) {
      toast.error('Failed to load students for prediction')
    } finally {
      setLoading(false)
    }
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId)

  const handlePredictSingle = async () => {
    if (!selectedStudentId) {
      toast.error('Please select a student')
      return
    }

    setPredicting(true)
    try {
      const res = await predictionService.predictSingle(selectedStudentId, selectedModel)
      setPredictionResult(res.prediction)
      setPredictionHistory((prev) => [res.historyItem, ...prev.slice(0, 29)])
      
      // Update student in local state
      setStudents((prev) =>
        prev.map((s) => (s.id === selectedStudentId ? res.student : s))
      )

      toast.success(
        `Risk predicted: ${res.prediction.riskCategory} Risk (${res.prediction.riskScore}%)`
      )
    } catch (e) {
      toast.error('Prediction failed')
    } finally {
      setPredicting(false)
    }
  }

  const handlePredictBatch = async () => {
    setPredicting(true)
    try {
      const res = await predictionService.predictBatch(selectedModel)
      setBatchSummary(res)
      const updatedList = await studentService.getStudents()
      setStudents(updatedList)
      const updatedHistory = await predictionService.getPredictionHistory()
      setPredictionHistory(updatedHistory)
      toast.success(`Batch prediction executed for ${res.totalPredicted} students`)
    } catch (e) {
      toast.error('Batch prediction failed')
    } finally {
      setPredicting(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading AI Prediction module..." />
  }

  const modelInfo = availableModels.find((m) => m.id === selectedModel) || availableModels[0]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Risk Prediction</h2>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              ML Inference Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Execute machine learning inference to classify academic risk levels (Low, Medium, High). Select
            between Decision Tree and Random Forest classifiers.
          </p>
        </div>

        {/* Tab switch between Single and Batch */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'single'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Individual Student
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'batch'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Cohort Batch Prediction
          </button>
        </div>
      </div>

      {/* Research Disclaimer */}
      <DisclaimerBanner type="prediction" />

      {/* Model Selection Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Select Predictive Model Architecture
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableModels.map((m) => {
            const isSelected = selectedModel === m.id
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="modelSelector"
                      checked={isSelected}
                      onChange={() => setSelectedModel(m.id)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
                  </div>
                  {m.isRecommended && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Recommended
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{m.description}</p>

                <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Accuracy: <strong className="text-slate-800">{m.metrics.accuracy}%</strong></span>
                  <span>F1-Score: <strong className="text-slate-800">{m.metrics.f1Score}%</strong></span>
                  <span>ROC-AUC: <strong className="text-slate-800">{m.metrics.rocAuc}</strong></span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Single Prediction View */}
      {activeTab === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Student Selector & Academic Features */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Target Student for Prediction
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value)
                    setPredictionResult(null)
                  }}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-w-xs"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.id}) - {st.riskCategory} Risk
                    </option>
                  ))}
                </select>
              </div>

              {selectedStudent && (
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{selectedStudent.name}</h4>
                      <p className="text-xs text-slate-500">
                        {selectedStudent.id} • {selectedStudent.programme}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{selectedStudent.academicYear}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                        Recorded Status
                      </span>
                      <RiskBadge risk={selectedStudent.riskCategory} size="sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Feature Matrix */}
              {selectedStudent && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Feature Input Vector for ML Inference
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px]">Attendance Rate</span>
                      <p className="text-base font-bold text-slate-900 mt-0.5">
                        {selectedStudent.attendance}%
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px]">Midterm Score</span>
                      <p className="text-base font-bold text-slate-900 mt-0.5">
                        {selectedStudent.midtermScore}/100
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px]">Assignments Average</span>
                      <p className="text-base font-bold text-slate-900 mt-0.5">
                        {selectedStudent.assignmentScore}/100
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px]">Prior Cumulative GPA</span>
                      <p className="text-base font-bold text-slate-900 mt-0.5">
                        {Number(selectedStudent.priorGpa).toFixed(2)}/4.0
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px]">Quiz Average</span>
                      <p className="text-base font-bold text-slate-900 mt-0.5">
                        {selectedStudent.quizAverage}/100
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px]">LMS Hours</span>
                      <p className="text-base font-bold text-slate-900 mt-0.5">
                        {selectedStudent.lmsHours !== null && selectedStudent.lmsHours !== undefined
                          ? `${selectedStudent.lmsHours} hrs`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Predict Button */}
              <button
                type="button"
                onClick={handlePredictSingle}
                disabled={predicting || !selectedStudent}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
              >
                {predicting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Running ML Model Inference...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Execute Risk Prediction ({modelInfo.shortName})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Col: Prediction Result Card */}
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Inference Result Output
              </h3>

              {predictionResult ? (
                <div className="space-y-4">
                  {/* Result Badge & Score */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-center">
                    <RiskBadge risk={predictionResult.riskCategory} size="lg" />
                    <div className="mt-3">
                      <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                        Predicted Risk Score
                      </span>
                      <p className="text-3xl font-extrabold text-slate-900 mt-1">
                        {predictionResult.riskScore}%
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Model Confidence: <strong>{predictionResult.confidence}%</strong>
                      </p>
                    </div>
                  </div>

                  {/* Probability Breakdown Progress Bars */}
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Class Probability Distribution
                    </span>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-semibold text-rose-700">High Risk Class</span>
                        <span className="font-mono text-slate-700">
                          {predictionResult.probabilities.high}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-rose-500 h-2 rounded-full"
                          style={{ width: `${predictionResult.probabilities.high}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-semibold text-amber-700">Medium Risk Class</span>
                        <span className="font-mono text-slate-700">
                          {predictionResult.probabilities.medium}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${predictionResult.probabilities.medium}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-semibold text-emerald-700">Low Risk Class</span>
                        <span className="font-mono text-slate-700">
                          {predictionResult.probabilities.low}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${predictionResult.probabilities.low}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions to XAI and Interventions */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() =>
                        navigate(`/lecturer/explainability?studentId=${selectedStudentId}`)
                      }
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Explain This Prediction (XAI)</span>
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/lecturer/interventions?studentId=${selectedStudentId}`)
                      }
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
                    >
                      <span>Recommend Personalized Intervention</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <Gauge className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>Click "Execute Risk Prediction" to compute academic risk classification.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Batch Prediction View */
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cohort Batch Risk Prediction</h3>
              <p className="text-xs text-slate-500 mt-1">
                Run simultaneous inference across all {students.length} students currently in the academic
                monitoring registry.
              </p>
            </div>

            <button
              onClick={handlePredictBatch}
              disabled={predicting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              {predicting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Cohort ({modelInfo.shortName})...</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-4 h-4" />
                  <span>Execute Full Cohort Prediction</span>
                </>
              )}
            </button>
          </div>

          {batchSummary && (
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Batch Execution Completed Successfully
                </span>
                <span className="text-[11px] text-blue-800 font-medium font-mono">
                  Model: {batchSummary.modelUsed}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Total Evaluated</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{batchSummary.totalPredicted}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-rose-200">
                  <span className="text-rose-600 text-[10px] uppercase font-bold">High Risk</span>
                  <p className="text-lg font-bold text-rose-700 mt-0.5">{batchSummary.highRiskCount}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-amber-200">
                  <span className="text-amber-600 text-[10px] uppercase font-bold">Medium Risk</span>
                  <p className="text-lg font-bold text-amber-700 mt-0.5">{batchSummary.mediumRiskCount}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                  <span className="text-emerald-600 text-[10px] uppercase font-bold">Low Risk</span>
                  <p className="text-lg font-bold text-emerald-700 mt-0.5">{batchSummary.lowRiskCount}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prediction History Log */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h4 className="text-sm font-bold text-slate-900">Recent ML Prediction Snapshots</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">{predictionHistory.length} recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Model Architecture</th>
                <th className="py-2.5 px-4 text-center">Risk Classification</th>
                <th className="py-2.5 px-4 text-center">Score</th>
                <th className="py-2.5 px-4 text-center">Confidence</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {predictionHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No recent predictions logged. Execute a prediction above.
                  </td>
                </tr>
              ) : (
                predictionHistory.slice(0, 10).map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {h.studentName} <span className="text-slate-400 text-[10px]">({h.studentId})</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 font-medium">
                      {h.modelName || h.modelType}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <RiskBadge risk={h.riskCategory} size="sm" />
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-slate-900">
                      {h.riskScore}%
                    </td>
                    <td className="py-2.5 px-4 text-center text-slate-600 font-medium">
                      {h.confidence || 88}%
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                      {formatDate(h.timestamp)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/lecturer/explainability?studentId=${h.studentId}`)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Explain (XAI)
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
