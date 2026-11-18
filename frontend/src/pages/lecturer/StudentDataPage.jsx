import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Users,
  Plus,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  Cpu,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react'
import { DataTable } from '../../components/common/DataTable'
import { RiskBadge } from '../../components/common/RiskBadge'
import { StudentModal } from '../../components/lecturer/StudentModal'
import { StudentDetailsDrawer } from '../../components/lecturer/StudentDetailsDrawer'
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog'
import { LoadingState } from '../../components/common/LoadingState'
import { studentService } from '../../services/studentService'
import { toast } from 'react-toastify'

export const StudentDataPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Filter states
  const [riskFilter, setRiskFilter] = useState(searchParams.get('filter') || 'All')
  const [programmeFilter, setProgrammeFilter] = useState('All')

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [viewingStudent, setViewingStudent] = useState(null)
  const [deletingStudent, setDeletingStudent] = useState(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam) setRiskFilter(filterParam)
  }, [searchParams])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const data = await studentService.getStudents()
      setStudents(data)
    } catch (e) {
      toast.error('Failed to load student records')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStudent = async (formData) => {
    setIsActionLoading(true)
    try {
      const created = await studentService.createStudent(formData)
      setStudents((prev) => [created, ...prev])
      setIsAddModalOpen(false)
      toast.success(`Student ${created.name} (${created.id}) created successfully`)
    } catch (e) {
      toast.error('Failed to create student')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleUpdateStudent = async (formData) => {
    setIsActionLoading(true)
    try {
      const updated = await studentService.updateStudent(formData.id, formData)
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      setEditingStudent(null)
      if (viewingStudent?.id === updated.id) {
        setViewingStudent(updated)
      }
      toast.success(`Student ${updated.name} updated successfully`)
    } catch (e) {
      toast.error('Failed to update student')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return
    setIsActionLoading(true)
    try {
      await studentService.deleteStudent(deletingStudent.id)
      setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id))
      toast.success(`Student ${deletingStudent.name} deleted`)
      setDeletingStudent(null)
      if (viewingStudent?.id === deletingStudent.id) {
        setViewingStudent(null)
      }
    } catch (e) {
      toast.error('Failed to delete student')
    } finally {
      setIsActionLoading(false)
    }
  }

  // Filter logic
  const filteredStudents = students.filter((s) => {
    const matchRisk = riskFilter === 'All' || s.riskCategory === riskFilter
    const matchProgramme = programmeFilter === 'All' || s.programme === programmeFilter
    return matchRisk && matchProgramme
  })

  // Export filtered students to CSV
  const exportToCsv = () => {
    if (filteredStudents.length === 0) {
      toast.info('No students to export')
      return
    }
    const headers = [
      'StudentID',
      'Name',
      'Programme',
      'Attendance',
      'MidtermScore',
      'AssignmentScore',
      'PriorGPA',
      'LMSHours',
      'RiskCategory',
      'RiskScore'
    ]
    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.name}"`,
      `"${s.programme}"`,
      s.attendance,
      s.midtermScore,
      s.assignmentScore,
      s.priorGpa,
      s.lmsHours ?? '',
      s.riskCategory,
      s.riskScore
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `eduguard_students_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('Student records exported to CSV')
  }

  const columns = [
    {
      key: 'id',
      header: 'Student ID',
      className: 'w-32',
      render: (val, row) => (
        <span className="font-mono text-xs font-semibold text-slate-800">{val}</span>
      )
    },
    {
      key: 'name',
      header: 'Student Name',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={val}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <div>
            <span className="font-semibold text-slate-900 block">{val}</span>
            <span className="text-[10px] text-slate-400">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'programme',
      header: 'Programme',
      render: (val) => <span className="text-xs text-slate-600 truncate max-w-[150px] block">{val}</span>
    },
    {
      key: 'attendance',
      header: 'Attendance',
      render: (val) => (
        <span
          className={`font-semibold text-xs ${
            val < 60 ? 'text-rose-600' : val < 75 ? 'text-amber-600' : 'text-emerald-600'
          }`}
        >
          {val}%
        </span>
      )
    },
    {
      key: 'midtermScore',
      header: 'Midterm',
      render: (val) => <span className="text-xs text-slate-700 font-medium">{val}/100</span>
    },
    {
      key: 'assignmentScore',
      header: 'Coursework',
      render: (val) => <span className="text-xs text-slate-700 font-medium">{val}/100</span>
    },
    {
      key: 'lmsHours',
      header: 'LMS Activity',
      render: (val) =>
        val !== null && val !== undefined ? (
          <span className="text-xs text-slate-600 font-mono">{val} hrs</span>
        ) : (
          <span className="text-[11px] text-slate-400 italic">N/A</span>
        )
    },
    {
      key: 'riskCategory',
      header: 'Risk Level',
      render: (val, row) => <RiskBadge risk={val} size="sm" />
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
            onClick={() => setViewingStudent(row)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/lecturer/explainability?studentId=${row.id}`)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Explain Risk (XAI)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEditingStudent(row)}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
            title="Edit Record"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingStudent(row)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  if (loading) {
    return <LoadingState message="Loading student academic dataset..." />
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Academic Records</h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-200">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage comprehensive academic features, view individual risk classifications, inspect LMS
            engagement, and launch predictive interventions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportToCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs text-xs">
        <span className="font-semibold text-slate-600 flex items-center gap-1.5 mr-2">
          <Filter className="w-4 h-4 text-slate-400" /> Filter By:
        </span>

        {/* Risk Level Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-500 font-medium">Risk Level:</label>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk Only</option>
            <option value="Medium">Medium Risk Only</option>
            <option value="Low">Low Risk / On Track</option>
          </select>
        </div>

        {/* Programme Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-500 font-medium">Programme:</label>
          <select
            value={programmeFilter}
            onChange={(e) => setProgrammeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Programmes</option>
            <option value="BSc Software Engineering">BSc Software Engineering</option>
            <option value="BSc Computer Science">BSc Computer Science</option>
            <option value="BSc Data Science">BSc Data Science</option>
            <option value="BSc Cyber Security">BSc Cyber Security</option>
          </select>
        </div>

        {(riskFilter !== 'All' || programmeFilter !== 'All') && (
          <button
            onClick={() => {
              setRiskFilter('All')
              setProgrammeFilter('All')
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Student Data Table */}
      <DataTable
        columns={columns}
        data={filteredStudents}
        searchKey="name"
        searchPlaceholder="Search student by name or ID..."
        pageSize={8}
        onRowClick={(row) => setViewingStudent(row)}
      />

      {/* Student Modals and Drawers */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateStudent}
        isLoading={isActionLoading}
      />

      <StudentModal
        isOpen={!!editingStudent}
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSubmit={handleUpdateStudent}
        isLoading={isActionLoading}
      />

      <StudentDetailsDrawer
        isOpen={!!viewingStudent}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(st) => {
          setViewingStudent(null)
          setEditingStudent(st)
        }}
        onDelete={(st) => {
          setViewingStudent(null)
          setDeletingStudent(st)
        }}
      />

      <ConfirmationDialog
        isOpen={!!deletingStudent}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete ${deletingStudent?.name} (${deletingStudent?.id})? This will also remove associated prediction snapshots.`}
        confirmText="Delete Record"
        isDanger={true}
        isLoading={isActionLoading}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
