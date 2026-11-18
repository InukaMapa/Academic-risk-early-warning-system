import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  Filter,
  Plus,
  ArrowRight,
  User,
  Calendar,
  FileText
} from 'lucide-react'
import { DataTable } from '../../components/common/DataTable'
import { RiskBadge } from '../../components/common/RiskBadge'
import { StatCard } from '../../components/common/StatCard'
import { Modal } from '../../components/common/Modal'
import { UpdateTrackingModal } from '../../components/lecturer/UpdateTrackingModal'
import { LoadingState } from '../../components/common/LoadingState'
import { interventionService } from '../../services/interventionService'
import { formatDate, getStatusBadge, getPriorityBadge } from '../../utils/formatters'
import { toast } from 'react-toastify'

export const InterventionTrackingPage = () => {
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [updatingItem, setUpdatingItem] = useState(null)
  const [historyItem, setHistoryItem] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    loadInterventions()
  }, [])

  const loadInterventions = async () => {
    setLoading(true)
    try {
      const data = await interventionService.getInterventions()
      setInterventions(data)
    } catch (e) {
      toast.error('Failed to load assigned interventions')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status, notes, author) => {
    setIsUpdating(true)
    try {
      const updated = await interventionService.updateStatus(id, status, notes, author)
      setInterventions((prev) => prev.map((item) => (item.id === id ? updated : item)))
      setUpdatingItem(null)
      toast.success(`Intervention ${id} updated to "${status}"`)
    } catch (e) {
      toast.error('Failed to update intervention')
    } finally {
      setIsUpdating(false)
    }
  }

  const filtered = interventions.filter((item) => {
    if (statusFilter === 'All') return true
    return item.status === statusFilter
  })

  const pendingCount = interventions.filter((i) => i.status === 'Pending').length
  const inProgressCount = interventions.filter((i) => i.status === 'In Progress').length
  const completedCount = interventions.filter((i) => i.status === 'Completed').length

  const columns = [
    {
      key: 'id',
      header: 'Tracking ID',
      className: 'w-28',
      render: (val) => <span className="font-mono text-xs font-semibold text-slate-800">{val}</span>
    },
    {
      key: 'studentName',
      header: 'Student Information',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {row.studentId} • {row.programme}
          </span>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Intervention Protocol',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-xs text-slate-800 block">{val}</span>
          <span className="text-[11px] text-slate-500 line-clamp-1">{row.description}</span>
        </div>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (val) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(
            val
          )}`}
        >
          {val}
        </span>
      )
    },
    {
      key: 'assignedDate',
      header: 'Assigned / Follow-up',
      render: (_, row) => (
        <div className="text-xs">
          <span className="text-slate-600 block">{formatDate(row.assignedDate)}</span>
          <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-500" />
            Due: {formatDate(row.followUpDate)}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
            val
          )}`}
        >
          {val === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
          {val === 'In Progress' && <Clock className="w-3.5 h-3.5 animate-spin" />}
          {val === 'Pending' && <AlertTriangle className="w-3.5 h-3.5" />}
          <span>{val}</span>
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      className: 'text-right',
      render: (_, row) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setHistoryItem(row)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            title="View Progress Logs"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            onClick={() => setUpdatingItem(row)}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Update
          </button>
        </div>
      )
    }
  ]

  if (loading) {
    return <LoadingState message="Loading intervention tracking logs..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Intervention Tracking</h2>
            <span className="text-[10px] bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded-full border border-sky-200">
              Closed-Loop Stage 3
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Monitor active intervention lifecycles, log counseling sessions, update milestone statuses, and
            verify that recommended follow-up deadlines are maintained.
          </p>
        </div>

        <button
          onClick={() => navigate('/lecturer/interventions')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Recommendation</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Assigned"
          value={interventions.length}
          subtext="Cumulative Protocols"
          icon={ListTodo}
          variant="slate"
        />
        <StatCard
          title="Pending Action"
          value={pendingCount}
          subtext="Awaiting Initial Meeting"
          icon={AlertTriangle}
          variant="amber"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtext="Active Advisory Cycles"
          icon={Clock}
          variant="blue"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          subtext="Milestones Concluded"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs text-xs font-semibold">
        <span className="text-slate-500 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        {['All', 'Pending', 'In Progress', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Main Tracking Table */}
      <DataTable
        columns={columns}
        data={filtered}
        searchKey="studentName"
        searchPlaceholder="Search intervention by student name or ID..."
        pageSize={8}
      />

      {/* Update Tracking Modal */}
      <UpdateTrackingModal
        isOpen={!!updatingItem}
        intervention={updatingItem}
        onClose={() => setUpdatingItem(null)}
        onSubmit={handleUpdateStatus}
        isLoading={isUpdating}
      />

      {/* Progress History Modal */}
      <Modal
        isOpen={!!historyItem}
        onClose={() => setHistoryItem(null)}
        title="Intervention Audit & Progress Timeline"
        subtitle={`Audit Log for ${historyItem?.studentName} (${historyItem?.id})`}
        maxWidth="max-w-lg"
        footer={
          <button
            type="button"
            onClick={() => setHistoryItem(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        }
      >
        {historyItem && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-sm">{historyItem.type}</span>
              <p className="text-slate-600 mt-1 leading-relaxed">{historyItem.description}</p>
              <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                <span>Supervisor: <strong>{historyItem.assignedBy}</strong></span>
                <span>Follow-up: <strong>{formatDate(historyItem.followUpDate)}</strong></span>
              </div>
            </div>

            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Progress Logs & Milestones
            </h4>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {(historyItem.progressLogs || []).map((log, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-8">
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-[10px] text-slate-400">{formatDate(log.date)}</span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{log.details}</p>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-medium">By: {log.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
