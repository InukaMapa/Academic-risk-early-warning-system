// Student Data Service - prepared for FastAPI REST endpoints
// Endpoint routes:
// GET    /api/v1/students
// GET    /api/v1/students/{id}
// POST   /api/v1/students
// PUT    /api/v1/students/{id}
// DELETE /api/v1/students/{id}
// POST   /api/v1/students/batch-import

import { getStoredStudents, saveStoredStudents } from '../utils/storage'
import { calculateRisk } from '../utils/riskCalculators'

export const studentService = {
  async getStudents() {
    // Simulated async network delay for realistic UX
    await new Promise((r) => setTimeout(r, 60))
    return getStoredStudents()
  },

  async getStudentById(id) {
    await new Promise((r) => setTimeout(r, 40))
    const list = getStoredStudents()
    const student = list.find((s) => s.id === id)
    if (!student) throw new Error(`Student ${id} not found`)
    return student
  },

  async createStudent(studentData) {
    await new Promise((r) => setTimeout(r, 80))
    const list = getStoredStudents()
    
    // Auto calculate initial risk prediction
    const riskResult = calculateRisk(studentData, 'random_forest')
    
    const newStudent = {
      ...studentData,
      id: studentData.id || `STU2024-${String(list.length + 1).padStart(3, '0')}`,
      riskCategory: riskResult.riskCategory,
      riskScore: riskResult.riskScore,
      previousRisk: riskResult.riskCategory,
      riskTrend: 'stable',
      lastPredicted: new Date().toISOString(),
      modelUsed: 'Random Forest',
      avatar: studentData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${studentData.name || 'Student'}`
    }

    const updated = [newStudent, ...list]
    saveStoredStudents(updated)
    return newStudent
  },

  async updateStudent(id, studentData) {
    await new Promise((r) => setTimeout(r, 80))
    const list = getStoredStudents()
    const index = list.findIndex((s) => s.id === id)
    if (index === -1) throw new Error(`Student ${id} not found`)

    // Recalculate risk on feature update
    const previousRisk = list[index].riskCategory
    const riskResult = calculateRisk({ ...list[index], ...studentData }, 'random_forest')
    
    let trend = 'stable'
    if (riskResult.riskScore < list[index].riskScore - 4) trend = 'improving'
    else if (riskResult.riskScore > list[index].riskScore + 4) trend = 'deteriorating'

    const updatedStudent = {
      ...list[index],
      ...studentData,
      previousRisk,
      riskCategory: riskResult.riskCategory,
      riskScore: riskResult.riskScore,
      riskTrend: trend,
      lastPredicted: new Date().toISOString()
    }

    list[index] = updatedStudent
    saveStoredStudents(list)
    return updatedStudent
  },

  async deleteStudent(id) {
    await new Promise((r) => setTimeout(r, 60))
    const list = getStoredStudents()
    const filtered = list.filter((s) => s.id !== id)
    saveStoredStudents(filtered)
    return { success: true, id }
  },

  async importStudents(newRecords, mode = 'prediction') {
    await new Promise((r) => setTimeout(r, 120))
    const list = getStoredStudents()
    const _existingIds = new Set(list.map((s) => s.id))
    
    const processed = newRecords.map((rec, idx) => {
      const studentId = rec.id || rec.StudentID || `STU-IMP-${String(idx + 1).padStart(3, '0')}`
      const riskResult = calculateRisk(rec, 'random_forest')
      
      return {
        id: studentId,
        name: rec.name || rec.StudentName || 'Unknown Student',
        email: rec.email || `${studentId.toLowerCase()}@university.edu`,
        programme: rec.programme || rec.Programme || 'BSc Computer Science',
        academicYear: rec.academicYear || rec.AcademicYear || 'Year 1 - Semester 1',
        attendance: Number(rec.attendance ?? rec.Attendance ?? 75),
        midtermScore: Number(rec.midtermScore ?? rec.MidtermScore ?? 65),
        assignmentScore: Number(rec.assignmentScore ?? rec.AssignmentScore ?? 70),
        quizAverage: Number(rec.quizAverage ?? rec.QuizAverage ?? 68),
        priorGpa: Number(rec.priorGpa ?? rec.PriorGPA ?? 3.0),
        lmsHours: rec.lmsHours !== undefined && rec.lmsHours !== '' ? Number(rec.lmsHours ?? rec.LMSHours) : null,
        riskCategory: riskResult.riskCategory,
        riskScore: riskResult.riskScore,
        previousRisk: riskResult.riskCategory,
        riskTrend: 'stable',
        lastPredicted: new Date().toISOString(),
        modelUsed: 'Random Forest',
        importType: mode === 'training' ? 'Model Training / Benchmark' : 'New Early Warning Cohort',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${rec.name || rec.StudentName || 'S'}`
      }
    })

    // Upsert or append
    const updatedList = [...list]
    processed.forEach((item) => {
      const idx = updatedList.findIndex((s) => s.id === item.id)
      if (idx !== -1) {
        updatedList[idx] = item
      } else {
        updatedList.unshift(item)
      }
    })

    saveStoredStudents(updatedList)
    return {
      total: processed.length,
      importedCount: processed.length,
      mode
    }
  }
}
