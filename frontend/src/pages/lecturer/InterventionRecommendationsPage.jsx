import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  UserCheck,
  Target,
  ListChecks
} from 'lucide-react'
import { RiskBadge } from '../../components/common/RiskBadge'
import { AssignInterventionModal } from '../../components/lecturer/AssignInterventionModal'
import { LoadingState } from '../../components/common/LoadingState'
import { studentService } from '../../services/studentService'
import { interventionService } from '../../services/interventionService'
import { interventionTemplates } from '../../data/mockInterventions'
import { toast } from 'react-toastify'

export const InterventionRecommendationsPage = () => {
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const list = await studentService.getStudents()
      setStudents(list)

      const paramId = searchParams.get('studentId')
      if (paramId && list.some((s) => s.id === paramId)) {
        setSelectedStudentId(paramId)
      } else if (list.length > 0) {
        // Prefer a high-risk student for good demo showcase
        const highRisk = list.find((s) => s.riskCategory === 'High')
        setSelectedStudentId(highRisk ? highRisk.id : list[0].id)
      }
    } catch (e) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId)

  // Derive identified academic problems
  const identifiedProblems = []
  if (selectedStudent) {
    if (selectedStudent.attendance < 60) {
      identifiedProblems.push({
        title: 'Critical Attendance Deficit',
        desc: `Student attendance is at ${selectedStudent.attendance}%, well below institutional 75% requirement.`,
        severity: 'critical'
      })
    } else if (selectedStudent.attendance < 75) {
      identifiedProblems.push({
        title: 'Borderline Attendance',
        desc: `Attendance is at ${selectedStudent.attendance}%, at risk of failing attendance criteria.`,
        severity: 'warning'
      })
    }

    if (selectedStudent.midtermScore < 45) {
      identifiedProblems.push({
        title: 'Summative Exam Underperformance',
        desc: `Midterm examination score is failing at ${selectedStudent.midtermScore}/100.`,
        severity: 'critical'
      })
    } else if (selectedStudent.midtermScore < 60) {
      identifiedProblems.push({
        title: 'Moderate Exam Deficit',
        desc: `Midterm score is ${selectedStudent.midtermScore}/100. Comprehension reinforcement required.`,
        severity: 'warning'
      })
    }

    if (selectedStudent.assignmentScore < 50) {
      identifiedProblems.push({
        title: 'Coursework / Lab Submissions Deficit',
        desc: `Continuous assessment average is ${selectedStudent.assignmentScore}/100 with delayed deliverables.`,
        severity: 'warning'
      })
    }

    if (Number(selectedStudent.priorGpa) < 2.5) {
      identifiedProblems.push({
        title: 'Low Academic Foundation Baseline',
        desc: `Prior cumulative GPA is ${Number(selectedStudent.priorGpa).toFixed(2)}/4.0.`,
        severity: 'info'
      })
    }
  }

  const handleOpenAssignModal = (template) => {
    setSelectedTemplate(template)
    setIsModalOpen(true)
  }

  const handleConfirmAssignment = async (interventionPayload) => {
    setIsAssigning(true)
    try {
      await interventionService.assignIntervention(interventionPayload)
      toast.success(
        `Assigned "${interventionPayload.type}" to ${selectedStudent?.name}. Follow-up scheduled.`
      )
      setIsModalOpen(false)
      navigate('/lecturer/tracking')
    } catch (e) {
      toast.error('Failed to assign intervention')
    } finally {
      setIsAssigning(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading intervention catalog & diagnostics..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Personalized Intervention Recommendations
            </h2>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              Closed-Loop Stage 2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Prescribe targeted academic support protocols tailored to students identified risk drivers.
            Assign advisors, set follow-up milestones, and monitor post-intervention turnaround.
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-slate-600">Student:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
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

      {/* Student Diagnostic Profile Card */}
      {selectedStudent && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                  <RiskBadge risk={selectedStudent.riskCategory} size="sm" />
                </div>
                <p className="text-xs text-slate-500">
                  {selectedStudent.id} • {selectedStudent.programme} • {selectedStudent.academicYear}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center min-w-[90px]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Risk Score</span>
                <span className="text-slate-900 text-sm font-extrabold">{selectedStudent.riskScore}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center min-w-[90px]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Attendance</span>
                <span className={`text-sm font-extrabold ${selectedStudent.attendance < 60 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {selectedStudent.attendance}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center min-w-[90px]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Midterm</span>
                <span className={`text-sm font-extrabold ${selectedStudent.midtermScore < 50 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {selectedStudent.midtermScore}/100
                </span>
              </div>
            </div>
          </div>

          {/* Identified Academic Problems List */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              Identified Academic Bottlenecks & Risk Drivers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              {identifiedProblems.length === 0 ? (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No critical performance deficits detected. Student metrics are on track.</span>
                </div>
              ) : (
                identifiedProblems.map((prob, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                      prob.severity === 'critical'
                        ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                        : prob.severity === 'warning'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                        : 'bg-blue-50/70 border-blue-200 text-blue-900'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        prob.severity === 'critical'
                          ? 'text-rose-600'
                          : prob.severity === 'warning'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }`}
                    />
                    <div>
                      <p className="font-bold">{prob.title}</p>
                      <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{prob.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recommended Interventions Catalog */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Personalized Intervention Protocols
            </h3>
            <p className="text-xs text-slate-500">
              Select and customize appropriate support mechanisms based on diagnostic findings
            </p>
          </div>
          <button
            onClick={() => navigate('/lecturer/tracking')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Assigned Interventions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interventionTemplates.map((template) => {
            const isCritical = template.priority === 'Critical'
            const isHigh = template.priority === 'High'

            return (
              <div
                key={template.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Category and Priority Badges */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {template.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : isHigh
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {template.priority} Priority
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-2">{template.type}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {template.description}
                  </p>

                  {/* Action items preview */}
                  <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1 mb-1.5">
                      <ListChecks className="w-3 h-3 text-blue-600" />
                      Core Action Items
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {template.actionItems.slice(0, 3).map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{template.defaultDurationDays} days cycle
                  </span>
                  <button
                    onClick={() => handleOpenAssignModal(template)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs transition-colors"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Assign Intervention</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Assign Intervention Modal */}
      <AssignInterventionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        template={selectedTemplate}
        onSubmit={handleConfirmAssignment}
        isLoading={isAssigning}
      />
    </div>
  )
}
