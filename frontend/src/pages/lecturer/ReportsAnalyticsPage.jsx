import { useState, useEffect } from 'react'
import {
  BarChart3,
  Download,
  Printer,
  Sparkles,
  Layers,
  Cpu,
  Target,
  CheckCircle2,
  AlertTriangle,
  Award,
  TrendingUp,
  FileText
} from 'lucide-react'
import { DisclaimerBanner } from '../../components/common/DisclaimerBanner'
import { ChartCard } from '../../components/common/ChartCard'
import { LoadingState } from '../../components/common/LoadingState'
import { reportService } from '../../services/reportService'
import { availableModels, globalFeatureImportance, modelComparisonTable } from '../../data/mockModels'
import { toast } from 'react-toastify'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts'

export const ReportsAnalyticsPage = () => {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [selectedModelId, setSelectedModelId] = useState('random_forest')

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const data = await reportService.getDashboardSummary()
      setSummary(data)
    } catch (e) {
      toast.error('Failed to load analytical reports')
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    const reportData = [
      ['EduGuard AI - Research Analytics & Benchmark Report'],
      ['Generated On', new Date().toLocaleString()],
      ['Academic Semester', 'Semester 1 - 2026/2027'],
      [''],
      ['--- COHORT RISK DISTRIBUTION ---'],
      ['Total Students Monitored', summary?.totalStudents || 0],
      ['High Risk Students', `${summary?.highRisk} (${summary?.highRiskPercentage}%)`],
      ['Medium Risk Students', `${summary?.mediumRisk} (${summary?.mediumRiskPercentage}%)`],
      ['Low Risk / Satisfactory', `${summary?.lowRisk} (${summary?.lowRiskPercentage}%)`],
      [''],
      ['--- INTERVENTION PROTOCOLS ---'],
      ['Total Assigned Interventions', summary?.totalInterventions || 0],
      ['Pending Interventions', summary?.pendingInterventions || 0],
      ['In Progress', summary?.inProgressInterventions || 0],
      ['Completed (Closed Loop)', summary?.completedInterventions || 0],
      [''],
      ['--- ILLUSTRATIVE RESEARCH BENCHMARK METRICS ---'],
      ['Model Architecture', 'Random Forest Classifier', 'Decision Tree Classifier'],
      ['Accuracy', '91.8%', '84.2%'],
      ['Precision (High Risk)', '89.4%', '81.5%'],
      ['Recall / Sensitivity', '93.1%', '86.0%'],
      ['F1-Score', '91.2%', '83.7%'],
      ['ROC-AUC', '0.946', '0.872']
    ]

    const csvContent = reportData.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `eduguard_research_report_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('Research Analytics Report exported to CSV')
  }

  const handlePrintReport = () => {
    window.print()
  }

  if (loading) {
    return <LoadingState message="Generating research evaluation reports..." />
  }

  const currentModel = availableModels.find((m) => m.id === selectedModelId) || availableModels[0]

  return (
    <div className="space-y-6 print:p-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs print:shadow-none print:border-none">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Reports & Model Evaluation Analytics
            </h2>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              Research Evaluation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Examine academic risk distribution statistics, comparative Machine Learning benchmarks
            (Accuracy, Precision, Recall, F1-Score), confusion matrices, and intervention efficacy indicators.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 print:hidden">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print View</span>
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export Full Report</span>
          </button>
        </div>
      </div>

      {/* Benchmark Disclaimer Banner */}
      <DisclaimerBanner type="benchmark" />

      {/* Model Benchmark Performance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-500">Validation Accuracy</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">
            {currentModel.metrics.accuracy}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{currentModel.shortName} (Test Set)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-500">Precision (High Risk)</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {currentModel.metrics.precision}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Minimizes false alarms</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-500">Recall / Sensitivity</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">
            {currentModel.metrics.recall}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Catches at-risk students</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-500">F1-Score Harmonic Mean</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">
            {currentModel.metrics.f1Score}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Balanced metric</p>
        </div>
      </div>

      {/* Model Architecture Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Comparative Machine Learning Benchmark (CART vs. Ensemble)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Preliminary empirical comparison on synthetic higher education dataset (N = 1,812)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-500">Selected Model:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedModelId('random_forest')}
                className={`px-3 py-1 rounded-md transition-all ${
                  selectedModelId === 'random_forest'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Random Forest
              </button>
              <button
                onClick={() => setSelectedModelId('decision_tree')}
                className={`px-3 py-1 rounded-md transition-all ${
                  selectedModelId === 'decision_tree'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Decision Tree
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <th className="py-2.5 px-4">Evaluation Metric</th>
                <th className="py-2.5 px-4 text-center">Decision Tree (CART)</th>
                <th className="py-2.5 px-4 text-center">Random Forest (100 Trees)</th>
                <th className="py-2.5 px-4">Research Analysis & Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modelComparisonTable.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.metric}</td>
                  <td
                    className={`py-3 px-4 text-center font-mono font-bold ${
                      row.highlight === 'DT' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    {row.decisionTree}
                  </td>
                  <td
                    className={`py-3 px-4 text-center font-mono font-bold ${
                      row.highlight === 'RF' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    {row.randomForest}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{row.difference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Columns: Confusion Matrix & Global Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Visualization */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Confusion Matrix ({currentModel.shortName})
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Test partition evaluation (362 test observations)
          </p>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            {/* True Positive */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                True Positive (TP)
              </span>
              <p className="text-2xl font-extrabold text-emerald-800 mt-1">
                {currentModel.confusionMatrix.truePositive}
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">
                Correctly identified High Risk students
              </p>
            </div>

            {/* False Positive */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold uppercase text-amber-700 block">
                False Positive (FP - False Alarm)
              </span>
              <p className="text-2xl font-extrabold text-amber-800 mt-1">
                {currentModel.confusionMatrix.falsePositive}
              </p>
              <p className="text-[11px] text-amber-700 mt-1">
                Low risk students flagged as high risk
              </p>
            </div>

            {/* False Negative */}
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] font-bold uppercase text-rose-700 block">
                False Negative (FN - Missed Risk)
              </span>
              <p className="text-2xl font-extrabold text-rose-800 mt-1">
                {currentModel.confusionMatrix.falseNegative}
              </p>
              <p className="text-[11px] text-rose-700 mt-1">
                Critical to minimize in academic early warning
              </p>
            </div>

            {/* True Negative */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-600 block">
                True Negative (TN)
              </span>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">
                {currentModel.confusionMatrix.trueNegative}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Correctly classified Low Risk students
              </p>
            </div>
          </div>
        </div>

        {/* Global Feature Importance Chart */}
        <ChartCard
          title="Global Feature Importance Weights"
          subtitle="Gini impurity reduction across all training iterations"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={globalFeatureImportance}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `${Math.round(val * 100)}%`}
              />
              <YAxis
                type="category"
                dataKey="feature"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                formatter={(val) => [`${(val * 100).toFixed(1)}%`, 'Feature Importance']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16}>
                {globalFeatureImportance.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#1d4ed8' : index === 1 ? '#2563eb' : '#3b82f6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
