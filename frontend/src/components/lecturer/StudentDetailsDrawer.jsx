import { useNavigate } from 'react-router-dom'
import {
  X,
  HelpCircle,
  HeartHandshake,
  TrendingDown,
  TrendingUp,
  Activity,
  Edit2,
  Trash2,
  Cpu
} from 'lucide-react'
import { RiskBadge } from '../common/RiskBadge'
import { formatDate } from '../../utils/formatters'

export const StudentDetailsDrawer = ({
  isOpen,
  onClose,
  student,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate()

  if (!isOpen || !student) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Student Profile & Risk Factors</h3>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(student)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                title="Edit Student Record"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(student)}
                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                title="Delete Student"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Student Header Card */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/90">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900 truncate">{student.name}</h4>
                <RiskBadge risk={student.riskCategory} size="sm" />
              </div>
              <p className="text-slate-500 font-mono mt-0.5">{student.id}</p>
              <p className="text-slate-600 font-medium mt-1 truncate">{student.programme}</p>
              <p className="text-slate-400 text-[11px]">{student.academicYear}</p>
            </div>
          </div>

          {/* Risk Prediction Summary Card */}
          <div className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Cpu className="w-4 h-4 text-blue-600" />
                Latest ML Risk Prediction
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {student.modelUsed || 'Random Forest'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Risk Score</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{student.riskScore}%</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Category</p>
                <p
                  className={`text-sm font-bold mt-1 ${
                    student.riskCategory === 'High'
                      ? 'text-rose-600'
                      : student.riskCategory === 'Medium'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {student.riskCategory} Risk
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Trend</p>
                <div className="flex items-center justify-center gap-1 mt-1 font-semibold text-slate-700 capitalize">
                  {student.riskTrend === 'improving' ? (
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                  ) : student.riskTrend === 'deteriorating' ? (
                    <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                  ) : (
                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{student.riskTrend || 'stable'}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-right">
              Last Evaluated: {formatDate(student.lastPredicted)}
            </p>
          </div>

          {/* Academic Attributes Breakdown */}
          <div>
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">
              Academic Factor Breakdown
            </h5>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 text-[11px]">Attendance Rate</span>
                <p className="text-base font-bold text-slate-900 mt-1">{student.attendance}%</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${
                      student.attendance < 60 ? 'bg-rose-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${student.attendance}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 text-[11px]">Midterm Examination</span>
                <p className="text-base font-bold text-slate-900 mt-1">{student.midtermScore} / 100</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${
                      student.midtermScore < 50 ? 'bg-rose-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${student.midtermScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 text-[11px]">Coursework / Assignments</span>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {student.assignmentScore} / 100
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 text-[11px]">Prior Cumulative GPA</span>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {Number(student.priorGpa).toFixed(2)} / 4.0
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 text-[11px]">Quiz Average</span>
                <p className="text-base font-bold text-slate-900 mt-1">{student.quizAverage} / 100</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-slate-500 text-[11px]">
                  LMS Activity <span className="text-[10px] text-slate-400">(Optional)</span>
                </span>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {student.lmsHours !== null && student.lmsHours !== undefined
                    ? `${student.lmsHours} hrs`
                    : 'Not Available'}
                </p>
              </div>
            </div>
          </div>

          {/* Qualitative Notes */}
          {student.notes && (
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80">
              <span className="font-semibold text-amber-900">Academic Advisory Notes:</span>
              <p className="text-amber-800 text-xs mt-1 leading-relaxed">{student.notes}</p>
            </div>
          )}
        </div>

        {/* Drawer Action Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
          <button
            onClick={() => {
              onClose()
              navigate(`/lecturer/explainability?studentId=${student.id}`)
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Explain Risk Prediction (XAI)</span>
          </button>

          <button
            onClick={() => {
              onClose()
              navigate(`/lecturer/interventions?studentId=${student.id}`)
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold transition-colors"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Assign Personalized Intervention</span>
          </button>
        </div>
      </div>
    </div>
  )
}
