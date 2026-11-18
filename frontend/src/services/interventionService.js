// Intervention Management Service - prepared for FastAPI endpoints
// Endpoint routes:
// GET   /api/v1/interventions
// POST  /api/v1/interventions
// PATCH /api/v1/interventions/{id}
// GET   /api/v1/interventions/student/{student_id}

import { getStoredInterventions, saveStoredInterventions, getStoredStudents, saveStoredStudents } from '../utils/storage'

export const interventionService = {
  async getInterventions() {
    await new Promise((r) => setTimeout(r, 60))
    return getStoredInterventions()
  },

  async assignIntervention(data) {
    await new Promise((r) => setTimeout(r, 100))
    const list = getStoredInterventions()
    const students = getStoredStudents()
    const student = students.find((s) => s.id === data.studentId)

    const newIntervention = {
      id: `INT-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, '0')}`,
      studentId: data.studentId,
      studentName: student?.name || data.studentName || 'Student',
      programme: student?.programme || data.programme || 'Undergraduate',
      riskCategory: student?.riskCategory || data.riskCategory || 'Medium',
      type: data.type,
      priority: data.priority || 'High',
      assignedDate: data.assignedDate || new Date().toISOString().split('T')[0],
      followUpDate: data.followUpDate,
      status: 'Pending',
      assignedBy: data.assignedBy || 'Lecturer & Academic Advisor',
      description: data.description || '',
      identifiedProblems: data.identifiedProblems || [],
      notes: data.notes || '',
      progressLogs: [
        {
          date: new Date().toISOString().split('T')[0],
          author: data.assignedBy || 'Academic Advisor',
          action: 'Intervention Assigned',
          details: `Assigned ${data.type} with follow-up scheduled for ${data.followUpDate}.`
        }
      ]
    }

    const updated = [newIntervention, ...list]
    saveStoredInterventions(updated)
    return newIntervention
  },

  async updateStatus(id, newStatus, logDetails = '', author = 'Lecturer') {
    await new Promise((r) => setTimeout(r, 80))
    const list = getStoredInterventions()
    const index = list.findIndex((i) => i.id === id)
    if (index === -1) throw new Error(`Intervention ${id} not found`)

    const item = list[index]
    const today = new Date().toISOString().split('T')[0]

    const updatedLogs = [
      ...(item.progressLogs || []),
      {
        date: today,
        author,
        action: `Status updated to ${newStatus}`,
        details: logDetails || `Status transitioned from ${item.status} to ${newStatus}.`
      }
    ]

    list[index] = {
      ...item,
      status: newStatus,
      notes: logDetails ? `${item.notes ? item.notes + ' | ' : ''}${logDetails}` : item.notes,
      progressLogs: updatedLogs
    }

    saveStoredInterventions(list)

    // If intervention is marked completed, simulate a positive closed-loop impact on the student
    if (newStatus === 'Completed') {
      const students = getStoredStudents()
      const sIdx = students.findIndex((s) => s.id === item.studentId)
      if (sIdx !== -1) {
        const prevScore = students[sIdx].riskScore
        const improvedScore = Math.max(12, Number((prevScore - 12.5).toFixed(1)))
        let newCat = 'Low'
        if (improvedScore >= 68) newCat = 'High'
        else if (improvedScore >= 38) newCat = 'Medium'

        students[sIdx].previousRisk = students[sIdx].riskCategory
        students[sIdx].riskScore = improvedScore
        students[sIdx].riskCategory = newCat
        students[sIdx].riskTrend = 'improving'
        saveStoredStudents(students)
      }
    }

    return list[index]
  },

  async getStudentInterventions(studentId) {
    await new Promise((r) => setTimeout(r, 50))
    const list = getStoredInterventions()
    return list.filter((i) => i.studentId === studentId)
  }
}
