// Explainable AI (XAI) Service - prepared for FastAPI LIME/SHAP endpoints
// Endpoint route:
// GET /api/v1/xai/explain/{student_id}?model={model_type}

import { getStoredStudents } from '../utils/storage'
import { explainPrediction } from '../utils/riskCalculators'

export const xaiService = {
  async getExplanation(studentId, modelType = 'random_forest') {
    // Simulate XAI feature attribution calculation time (LIME perturbation / SHAP tree explainer)
    await new Promise((r) => setTimeout(r, 450))
    const students = getStoredStudents()
    const student = students.find((s) => s.id === studentId)
    if (!student) throw new Error(`Student ${studentId} not found`)

    return explainPrediction(student, modelType)
  }
}
