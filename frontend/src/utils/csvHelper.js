// Data Import and Parsing Utility using PapaParse and XLSX for EduGuard AI

import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// Flexible column aliases for mapping university datasets
export const KNOWN_COLUMN_MAP = {
  id: ['studentid', 'student_id', 'id', 'student number', 'reg_no', 'index_no'],
  name: ['studentname', 'student_name', 'name', 'full_name', 'student'],
  programme: ['programme', 'program', 'degree', 'department', 'course'],
  academicYear: ['academicyear', 'academic_year', 'year', 'semester', 'cohort'],
  attendance: ['attendance', 'attendance_rate', 'attendance_pct', 'attendance%'],
  midtermScore: ['midtermscore', 'midterm', 'midterm_score', 'exam_score', 'midterm_exam'],
  assignmentScore: ['assignmentscore', 'assignment', 'coursework', 'assignment_score', 'assignments'],
  quizAverage: ['quizaverage', 'quiz', 'quizzes', 'quiz_avg', 'quiz_score'],
  priorGpa: ['priorgpa', 'prior_gpa', 'gpa', 'cgpa', 'previous_gpa'],
  lmsHours: ['lmshours', 'lms_hours', 'lms_engagement', 'online_hours', 'lms_activity']
}

export const matchColumnKey = (rawHeader) => {
  if (!rawHeader) return null
  const clean = rawHeader.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const [standardKey, aliases] of Object.entries(KNOWN_COLUMN_MAP)) {
    for (const alias of aliases) {
      if (clean === alias.replace(/[^a-z0-9]/g, '')) {
        return standardKey
      }
    }
  }
  return null
}

/**
 * Parses CSV or Excel file and maps columns flexibly
 */
export const parseAcademicFile = (file) => {
  return new Promise((resolve, reject) => {
    const extension = file.name.split('.').pop().toLowerCase()

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          resolve(processParsedRows(results.data, results.meta.fields || []))
        },
        error: (err) => reject(new Error(`CSV parsing failed: ${err.message}`))
      })
    } else if (['xlsx', 'xls'].includes(extension)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
          const headers = json.length > 0 ? Object.keys(json[0]) : []
          resolve(processParsedRows(json, headers))
        } catch (err) {
          reject(new Error(`Excel parsing failed: ${err.message}`))
        }
      }
      reader.onerror = () => reject(new Error('File reading error'))
      reader.readAsArrayBuffer(file)
    } else {
      reject(new Error('Unsupported file format. Please upload CSV or Excel (.xlsx, .xls) files.'))
    }
  })
}

const processParsedRows = (rawRows, originalHeaders) => {
  // Map headers to standardized keys
  const headerMapping = {}
  originalHeaders.forEach((orig) => {
    const matched = matchColumnKey(orig)
    if (matched) {
      headerMapping[orig] = matched
    }
  })

  const rows = rawRows.map((row, index) => {
    const mapped = { _rawIndex: index + 1, _errors: [] }
    Object.entries(row).forEach(([origKey, val]) => {
      const standardKey = headerMapping[origKey] || origKey
      mapped[standardKey] = typeof val === 'string' ? val.trim() : val
    })
    return mapped
  })

  return {
    rows,
    originalHeaders,
    headerMapping,
    detectedFields: Object.values(headerMapping)
  }
}

/**
 * Validates parsed rows against required and optional columns, checks duplicates and missing values
 */
export const validateDataset = (rows, existingStudentIds = new Set()) => {
  const seenInBatch = new Set()
  let validCount = 0
  let invalidCount = 0
  let duplicateCount = 0
  let missingValuesCount = 0

  const validatedRows = rows.map((row) => {
    const errors = []
    const warnings = []

    // ID validation
    const id = row.id || row.StudentID || row.student_id
    if (!id) {
      errors.push('Missing Student ID')
      missingValuesCount++
    } else {
      if (seenInBatch.has(id)) {
        errors.push(`Duplicate ID within file: ${id}`)
        duplicateCount++
      } else if (existingStudentIds.has(id)) {
        warnings.push(`Existing Student ID in system: ${id} (will update)`)
      }
      seenInBatch.add(id)
    }

    // Name validation
    const name = row.name || row.StudentName || row.student_name
    if (!name) {
      errors.push('Missing Student Name')
      missingValuesCount++
    }

    // Attendance validation (optional in some datasets, but if present must be numeric 0-100)
    if (row.attendance !== undefined && row.attendance !== '') {
      const att = Number(row.attendance)
      if (isNaN(att) || att < 0 || att > 100) {
        errors.push('Invalid Attendance % (must be 0-100)')
      }
    } else {
      warnings.push('Attendance not provided (defaults to 75%)')
    }

    // Midterm validation
    if (row.midtermScore !== undefined && row.midtermScore !== '') {
      const mid = Number(row.midtermScore)
      if (isNaN(mid) || mid < 0 || mid > 100) {
        errors.push('Invalid Midterm Score (must be 0-100)')
      }
    } else {
      warnings.push('Midterm score not provided (defaults to 60)')
    }

    // LMS Hours (strictly optional)
    if (row.lmsHours !== undefined && row.lmsHours !== '') {
      const lms = Number(row.lmsHours)
      if (isNaN(lms) || lms < 0) {
        warnings.push('Invalid LMS hours value')
      }
    }

    const isValid = errors.length === 0
    if (isValid) validCount++
    else invalidCount++

    return {
      ...row,
      _isValid: isValid,
      _errors: errors,
      _warnings: warnings
    }
  })

  return {
    validatedRows,
    summary: {
      total: rows.length,
      valid: validCount,
      invalid: invalidCount,
      duplicates: duplicateCount,
      missingValues: missingValuesCount
    }
  }
}
