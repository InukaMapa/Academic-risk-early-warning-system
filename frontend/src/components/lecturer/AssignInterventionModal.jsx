import { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { toast } from 'react-toastify'
import { HeartHandshake, Calendar } from 'lucide-react'

export const AssignInterventionModal = ({
  isOpen,
  onClose,
  student,
  template = null,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    type: 'Academic Counselling',
    priority: 'High',
    followUpDate: '',
    assignedBy: 'Dr. David Miller (Senior Lecturer)',
    description: '',
    notes: ''
  })

  useEffect(() => {
    // Default follow-up date to 14 days in the future
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 14)
    const formattedDate = targetDate.toISOString().split('T')[0]

    if (template) {
      setFormData({
        type: template.type || 'Academic Counselling',
        priority: template.priority || 'High',
        followUpDate: formattedDate,
        assignedBy: 'Dr. David Miller (Senior Lecturer)',
        description: template.description || '',
        notes: ''
      })
    } else {
      setFormData({
        type: 'Academic Counselling',
        priority: 'High',
        followUpDate: formattedDate,
        assignedBy: 'Dr. David Miller (Senior Lecturer)',
        description:
          'Structured academic counseling session to formulate a learning recovery contract.',
        notes: ''
      })
    }
  }, [template, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.followUpDate) {
      toast.error('Please specify a recommended follow-up date')
      return
    }

    onSubmit({
      ...formData,
      studentId: student?.id,
      studentName: student?.name,
      programme: student?.programme,
      riskCategory: student?.riskCategory,
      identifiedProblems: [
        `Attendance at ${student?.attendance}%`,
        `Midterm score ${student?.midtermScore}/100`,
        `Current risk index: ${student?.riskScore}%`
      ]
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Academic Intervention"
      subtitle={`Configure personalized support for ${student?.name || 'Selected Student'}`}
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="assign-intervention-form"
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <HeartHandshake className="w-4 h-4 text-emerald-300" />
            <span>Confirm & Assign Intervention</span>
          </button>
        </>
      }
    >
      <form id="assign-intervention-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Student Context Header */}
        {student && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">{student.name}</p>
              <p className="text-slate-500 text-[11px]">
                {student.id} • {student.programme}
              </p>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                student.riskCategory === 'High'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {student.riskCategory} Risk ({student.riskScore}%)
            </span>
          </div>
        )}

        {/* Intervention Type */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Intervention Recommendation Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="Academic Counselling">Academic Counselling (Mandatory 1-on-1)</option>
            <option value="Attendance Improvement Support">Attendance Improvement Support & Check-in</option>
            <option value="Peer Tutoring & Learning Support">Peer Tutoring & Learning Support</option>
            <option value="Assessment Preparation Workshop">Assessment Preparation Workshop & Remedial Labs</option>
            <option value="Lecturer 1-on-1 Consultation">Lecturer 1-on-1 Consultation</option>
            <option value="Digital Learning Resources Package">Digital Learning Resources Package</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Priority */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Critical">Critical (Immediate Action)</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low / Routine Check</option>
            </select>
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Recommended Follow-up Date *
            </label>
            <input
              type="date"
              name="followUpDate"
              required
              value={formData.followUpDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Assigned By */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Supervising Lecturer / Academic Advisor
          </label>
          <input
            type="text"
            name="assignedBy"
            value={formData.assignedBy}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Intervention Objective & Action Items
          </label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Custom Notes */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Advisory Meeting Notes & Instructions
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Schedule meeting on Wednesday afternoon. Review lab exercises 3 & 4."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </form>
    </Modal>
  )
}
