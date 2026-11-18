import { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { toast } from 'react-toastify'

export const StudentModal = ({
  isOpen,
  onClose,
  onSubmit,
  student = null,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    programme: 'BSc Software Engineering',
    academicYear: 'Year 2 - Semester 1',
    attendance: 75,
    midtermScore: 65,
    assignmentScore: 70,
    quizAverage: 65,
    priorGpa: 3.0,
    lmsHours: '',
    notes: ''
  })

  useEffect(() => {
    if (student) {
      setFormData({
        id: student.id || '',
        name: student.name || '',
        email: student.email || '',
        programme: student.programme || 'BSc Software Engineering',
        academicYear: student.academicYear || 'Year 2 - Semester 1',
        attendance: student.attendance ?? 75,
        midtermScore: student.midtermScore ?? 65,
        assignmentScore: student.assignmentScore ?? 70,
        quizAverage: student.quizAverage ?? 65,
        priorGpa: student.priorGpa ?? 3.0,
        lmsHours: student.lmsHours !== null && student.lmsHours !== undefined ? student.lmsHours : '',
        notes: student.notes || ''
      })
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        programme: 'BSc Software Engineering',
        academicYear: 'Year 2 - Semester 1',
        attendance: 75,
        midtermScore: 65,
        assignmentScore: 70,
        quizAverage: 65,
        priorGpa: 3.0,
        lmsHours: '',
        notes: ''
      })
    }
  }, [student, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Student Name is required')
      return
    }

    const payload = {
      ...formData,
      attendance: Number(formData.attendance),
      midtermScore: Number(formData.midtermScore),
      assignmentScore: Number(formData.assignmentScore),
      quizAverage: Number(formData.quizAverage),
      priorGpa: Number(formData.priorGpa),
      lmsHours: formData.lmsHours !== '' ? Number(formData.lmsHours) : null
    }

    onSubmit(payload)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? `Edit Student: ${student.name}` : 'Add New Student Record'}
      subtitle="Enter academic features for risk evaluation"
      maxWidth="max-w-xl"
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
            form="student-form"
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {student ? 'Save Changes' : 'Add Student'}
          </button>
        </>
      }
    >
      <form id="student-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Student ID {student && '(Read-only)'}
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={!!student}
              placeholder="e.g. STU2024-025 (auto-generated if empty)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rachel Adams"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Academic Programme</label>
            <select
              name="programme"
              value={formData.programme}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            >
              <option value="BSc Software Engineering">BSc Software Engineering</option>
              <option value="BSc Computer Science">BSc Computer Science</option>
              <option value="BSc Data Science">BSc Data Science</option>
              <option value="BSc Cyber Security">BSc Cyber Security</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Academic Year / Semester</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="e.g. Year 2 - Semester 1"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>
        </div>

        {/* Academic Feature Inputs */}
        <div className="pt-2 border-t border-slate-100">
          <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2.5">
            Academic Performance & Risk Factors
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Attendance Rate (%)
              </label>
              <input
                type="number"
                name="attendance"
                min="0"
                max="100"
                required
                value={formData.attendance}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Midterm Exam (0-100)
              </label>
              <input
                type="number"
                name="midtermScore"
                min="0"
                max="100"
                required
                value={formData.midtermScore}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Coursework / Assign. (0-100)
              </label>
              <input
                type="number"
                name="assignmentScore"
                min="0"
                max="100"
                required
                value={formData.assignmentScore}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Quiz Average (0-100)
              </label>
              <input
                type="number"
                name="quizAverage"
                min="0"
                max="100"
                required
                value={formData.quizAverage}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Prior Cumulative GPA (0-4.0)
              </label>
              <input
                type="number"
                name="priorGpa"
                step="0.01"
                min="0"
                max="4.0"
                required
                value={formData.priorGpa}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                LMS Hours <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                name="lmsHours"
                step="0.5"
                min="0"
                placeholder="Leave blank if N/A"
                value={formData.lmsHours}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Advisory Notes</label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add relevant qualitative observations regarding this student..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </form>
    </Modal>
  )
}
