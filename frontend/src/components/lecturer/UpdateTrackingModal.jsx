import { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { toast } from 'react-toastify'
import { CheckCircle2 } from 'lucide-react'

export const UpdateTrackingModal = ({
  isOpen,
  onClose,
  intervention,
  onSubmit,
  isLoading = false
}) => {
  const [status, setStatus] = useState('In Progress')
  const [logNotes, setLogNotes] = useState('')
  const [author, setAuthor] = useState('Dr. David Miller (Senior Lecturer)')

  useEffect(() => {
    if (intervention) {
      setStatus(intervention.status || 'In Progress')
      setLogNotes('')
    }
  }, [intervention, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!status) {
      toast.error('Please select an intervention status')
      return
    }

    onSubmit(intervention.id, status, logNotes, author)
  }

  if (!intervention) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Intervention Progress"
      subtitle={`Tracking ID: ${intervention.id} • ${intervention.studentName}`}
      maxWidth="max-w-md"
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
            form="update-tracking-form"
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Save Status & Log Notes</span>
          </button>
        </>
      }
    >
      <form id="update-tracking-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <p className="font-bold text-slate-900">{intervention.type}</p>
          <p className="text-slate-500 text-[11px] mt-0.5">{intervention.studentName} ({intervention.studentId})</p>
          <p className="text-slate-400 text-[10px]">Assigned on {intervention.assignedDate} • Follow-up by {intervention.followUpDate}</p>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Intervention Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="Pending">Pending (Scheduled / Awaiting Meeting)</option>
            <option value="In Progress">In Progress (Active Advisory Sessions)</option>
            <option value="Completed">Completed (Milestones Achieved / Closed Loop)</option>
            <option value="Cancelled">Cancelled (Not Applicable / Withdrawn)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Supervisor / Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Progress Meeting Log & Observations
          </label>
          <textarea
            rows="3"
            value={logNotes}
            onChange={(e) => setLogNotes(e.target.value)}
            placeholder="Record summary of discussion, student commitments, or exam score improvements..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </form>
    </Modal>
  )
}
