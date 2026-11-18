import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Layers,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react'
import { parseAcademicFile, validateDataset } from '../../utils/csvHelper'
import { downloadSampleCsv } from '../../data/sampleCsvData'
import { studentService } from '../../services/studentService'
import { toast } from 'react-toastify'

export const UploadAcademicDataPage = () => {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const [validationResult, setValidationResult] = useState(null)
  const [importMode, setImportMode] = useState('prediction') // 'prediction' | 'training'
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0])
    }
  }

  const processSelectedFile = async (uploadedFile) => {
    const ext = uploadedFile.name.split('.').pop().toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      toast.error('Please upload a valid CSV or Excel (.xlsx, .xls) file.')
      return
    }

    setFile(uploadedFile)
    setIsProcessing(true)

    try {
      const parsed = await parseAcademicFile(uploadedFile)
      setParsedData(parsed)

      // Fetch existing students to check duplicates
      const currentStudents = await studentService.getStudents()
      const existingIds = new Set(currentStudents.map((s) => s.id))

      const validation = validateDataset(parsed.rows, existingIds)
      setValidationResult(validation)

      toast.success(
        `Parsed ${parsed.rows.length} rows successfully. ${validation.summary.valid} valid records ready.`
      )
    } catch (err) {
      toast.error(err.message || 'Error processing academic file')
      setFile(null)
      setParsedData(null)
      setValidationResult(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmImport = async () => {
    if (!validationResult || validationResult.summary.valid === 0) {
      toast.error('No valid records found to import.')
      return
    }

    setIsImporting(true)
    try {
      const validRows = validationResult.validatedRows.filter((r) => r._isValid)
      await studentService.importStudents(validRows, importMode)

      toast.success(
        `Successfully imported ${validRows.length} academic records (${
          importMode === 'prediction' ? 'New Prediction Cohort' : 'Research Training Data'
        })`
      )

      setTimeout(() => {
        navigate('/lecturer/students')
      }, 1200)
    } catch (e) {
      toast.error('Failed to import academic dataset')
    } finally {
      setIsImporting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setParsedData(null)
    setValidationResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upload Academic Data</h2>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              CSV & Excel Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Import student academic performance files. The parser dynamically accommodates optional
            features such as LMS platform activity and attendance, validates column integrity, and detects
            duplicate IDs.
          </p>
        </div>

        <button
          onClick={() => downloadSampleCsv()}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* Import Mode Selector Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Dataset Target Pipeline
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              importMode === 'prediction'
                ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="importMode"
              value="prediction"
              checked={importMode === 'prediction'}
              onChange={() => setImportMode('prediction')}
              className="mt-0.5 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <p className="font-bold text-slate-900">New Student Cohort (For Risk Prediction)</p>
              <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">
                Import current enrolled students into active monitoring for immediate early risk classification
                and XAI feature explanations.
              </p>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              importMode === 'training'
                ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500/20'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="importMode"
              value="training"
              checked={importMode === 'training'}
              onChange={() => setImportMode('training')}
              className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <p className="font-bold text-slate-900">Research Model Training / Benchmark Dataset</p>
              <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">
                Import historical student semester outcomes to benchmark Machine Learning models and
                evaluate precision, recall, and fairness.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* File Upload Dropzone */}
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50/60 scale-[0.99]'
              : 'border-slate-300 bg-white hover:border-slate-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Drag and drop your academic dataset here
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Supports CSV, XLSX, and XLS formats up to 25MB. Columns like LMS activity and attendance are
            dynamically detected.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Browse Files
            </button>
            <button
              type="button"
              onClick={() => downloadSampleCsv()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
            >
              Use Sample Template
            </button>
          </div>
        </div>
      ) : (
        /* Preview & Validation Results */
        <div className="space-y-6">
          {/* File summary bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB • {parsedData?.rows.length || 0} total rows parsed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={isImporting}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Choose Different File
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isImporting || !validationResult || validationResult.summary.valid === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
              >
                {isImporting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Import ({validationResult?.summary.valid || 0} Records)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Validation Metrics */}
          {validationResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500">Total Rows</span>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {validationResult.summary.total}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid Records
                </span>
                <p className="text-xl font-bold text-emerald-800 mt-1">
                  {validationResult.summary.valid}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[10px] font-bold uppercase text-amber-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Duplicate / Warnings
                </span>
                <p className="text-xl font-bold text-amber-800 mt-1">
                  {validationResult.summary.duplicates}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
                <span className="text-[10px] font-bold uppercase text-rose-700 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Invalid / Missing
                </span>
                <p className="text-xl font-bold text-rose-800 mt-1">
                  {validationResult.summary.invalid}
                </p>
              </div>
            </div>
          )}

          {/* Column Mapping Feedback */}
          {parsedData && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Detected Column Mappings: </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {Object.entries(parsedData.headerMapping).map(([orig, standard]) => (
                  <span
                    key={orig}
                    className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px]"
                  >
                    <span className="font-semibold text-slate-900">{orig}</span> →{' '}
                    <span className="text-blue-600 font-medium">{standard}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Data Preview Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Parsed Dataset Preview</h4>
                <p className="text-xs text-slate-500">
                  Showing first 15 records with row-level integrity checks
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Programme</th>
                    <th className="py-2.5 px-3 text-center">Attendance</th>
                    <th className="py-2.5 px-3 text-center">Midterm</th>
                    <th className="py-2.5 px-3 text-center">Assignments</th>
                    <th className="py-2.5 px-3 text-center">GPA</th>
                    <th className="py-2.5 px-3 text-center">LMS Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {validationResult?.validatedRows.slice(0, 15).map((row, idx) => (
                    <tr
                      key={idx}
                      className={row._isValid ? 'hover:bg-slate-50/60' : 'bg-rose-50/40'}
                    >
                      <td className="py-2.5 px-3">
                        {row._isValid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Valid
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 text-rose-700 font-semibold text-[11px]"
                            title={row._errors.join(', ')}
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Error
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                        {row.id || row.StudentID || '—'}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {row.name || row.StudentName || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                        {row.programme || row.Programme || 'BSc Computer Science'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium">
                        {row.attendance ?? row.Attendance ?? '—'}%
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium">
                        {row.midtermScore ?? row.MidtermScore ?? '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium">
                        {row.assignmentScore ?? row.AssignmentScore ?? '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium">
                        {row.priorGpa ?? row.PriorGPA ?? '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium text-slate-500">
                        {row.lmsHours !== undefined && row.lmsHours !== ''
                          ? `${row.lmsHours ?? row.LMSHours} hrs`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
