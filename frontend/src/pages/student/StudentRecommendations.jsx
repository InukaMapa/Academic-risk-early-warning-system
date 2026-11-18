import { useState, useEffect } from 'react'
import {
  HeartHandshake,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Send,
  MessageSquare
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { interventionService } from '../../services/interventionService'
import { LoadingState } from '../../components/common/LoadingState'
import { formatDate, getStatusBadge } from '../../utils/formatters'
import { toast } from 'react-toastify'

export const StudentRecommendations = () => {
  const { user } = useAuth()
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInterventions()
  }, [user])

  const loadInterventions = async () => {
    setLoading(true)
    try {
      const studentId = user?.studentId || 'STU2024-019'
      const list = await interventionService.getStudentInterventions(studentId)
      setInterventions(list)
    } catch (e) {
      toast.error('Failed to load your recommendations')
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledge = async (item) => {
    try {
      await interventionService.updateStatus(
        item.id,
        'In Progress',
        'Student confirmed receipt of recommendation and agreed to scheduled follow-up.',
        user?.name || 'Student'
      )
      toast.success('Recommendation acknowledged! Your advisor has been notified.')
      loadInterventions()
    } catch (e) {
      toast.error('Could not update status')
    }
  }

  const handleMarkAttended = async (item) => {
    try {
      await interventionService.updateStatus(
        item.id,
        'Completed',
        'Student completed the scheduled advisory workshop session.',
        user?.name || 'Student'
      )
      toast.success('Session logged as completed! Great progress!')
      loadInterventions()
    } catch (e) {
      toast.error('Could not update status')
    }
  }

  if (loading) {
    return <LoadingState message="Loading your assigned recommendations..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Academic Recommendations</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Support plans and guidance assigned by your lecturers and academic advisors to help you overcome
          study hurdles, improve assessment readiness, and achieve your academic goals.
        </p>
      </div>

      {interventions.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No Active Interventions</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You currently have no outstanding academic support actions. Keep up the good work!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interventions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900">{item.type}</span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                </div>

                <div className="text-right sm:min-w-[180px] text-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">
                    Assigned Advisor
                  </span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{item.assignedBy}</span>
                  <span className="text-blue-600 font-medium text-[11px] flex items-center justify-end gap-1 mt-1">
                    <Clock className="w-3 h-3" /> Due: {formatDate(item.followUpDate)}
                  </span>
                </div>
              </div>

              {/* Progress Milestones Checklist */}
              {item.progressLogs && item.progressLogs.length > 0 && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block mb-2">
                    Advisory Meeting Updates & Logs
                  </span>
                  <div className="space-y-2">
                    {item.progressLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">{log.action}: </span>
                          <span>{log.details}</span>
                          <span className="text-slate-400 text-[10px] ml-2">({log.date})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Tracking Reference ID: <strong className="font-mono">{item.id}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {item.status === 'Pending' && (
                    <button
                      onClick={() => handleAcknowledge(item)}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors"
                    >
                      Acknowledge & Confirm Session
                    </button>
                  )}
                  {item.status === 'In Progress' && (
                    <button
                      onClick={() => handleMarkAttended(item)}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                    >
                      Mark Session as Completed
                    </button>
                  )}
                  {item.status === 'Completed' && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Intervention Successfully Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
