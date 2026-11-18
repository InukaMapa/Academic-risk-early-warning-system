// Risk Prediction Service - prepared for FastAPI ML inference endpoints
// Endpoint routes:
// POST /api/v1/predict/single
// POST /api/v1/predict/batch
// GET  /api/v1/predict/history

import { getStoredStudents, saveStoredStudents, getStoredPredictions, saveStoredPredictions } from '../utils/storage'
import { calculateRisk } from '../utils/riskCalculators'

export const predictionService = {
  async predictSingle(studentId, modelType = 'random_forest') {
    // Simulate ML model inference latency
    await new Promise((r) => setTimeout(r, 400))
    const students = getStoredStudents()
    const student = students.find((s) => s.id === studentId)
    if (!student) throw new Error(`Student ${studentId} not found`)

    const result = calculateRisk(student, modelType)
    
    // Update student with latest prediction
    const previousRisk = student.riskCategory
    let trend = 'stable'
    if (result.riskScore < student.riskScore - 3) trend = 'improving'
    else if (result.riskScore > student.riskScore + 3) trend = 'deteriorating'

    student.previousRisk = previousRisk
    student.riskCategory = result.riskCategory
    student.riskScore = result.riskScore
    student.riskTrend = trend
    student.lastPredicted = result.predictedAt
    student.modelUsed = result.modelUsed

    saveStoredStudents(students)

    // Save to prediction history log
    const historyItem = {
      id: `PRED-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      programme: student.programme,
      modelType,
      modelName: result.modelUsed,
      riskCategory: result.riskCategory,
      riskScore: result.riskScore,
      confidence: result.confidence,
      probabilities: result.probabilities,
      timestamp: result.predictedAt
    }

    const history = getStoredPredictions()
    saveStoredPredictions([historyItem, ...history.slice(0, 49)])

    return {
      student,
      prediction: result,
      historyItem
    }
  },

  async predictBatch(modelType = 'random_forest') {
    await new Promise((r) => setTimeout(r, 700))
    const students = getStoredStudents()
    const history = getStoredPredictions()

    const results = students.map((student) => {
      const pred = calculateRisk(student, modelType)
      student.previousRisk = student.riskCategory
      student.riskCategory = pred.riskCategory
      student.riskScore = pred.riskScore
      student.lastPredicted = pred.predictedAt
      student.modelUsed = pred.modelUsed

      return {
        id: `PRED-${Date.now()}-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        programme: student.programme,
        modelType,
        modelName: pred.modelUsed,
        riskCategory: pred.riskCategory,
        riskScore: pred.riskScore,
        confidence: pred.confidence,
        probabilities: pred.probabilities,
        timestamp: pred.predictedAt
      }
    })

    saveStoredStudents(students)
    saveStoredPredictions([...results.slice(0, 20), ...history.slice(0, 30)])

    return {
      totalPredicted: results.length,
      highRiskCount: results.filter((r) => r.riskCategory === 'High').length,
      mediumRiskCount: results.filter((r) => r.riskCategory === 'Medium').length,
      lowRiskCount: results.filter((r) => r.riskCategory === 'Low').length,
      modelUsed: modelType === 'random_forest' ? 'Random Forest Classifier' : 'Decision Tree Classifier'
    }
  },

  async getPredictionHistory() {
    await new Promise((r) => setTimeout(r, 50))
    return getStoredPredictions()
  }
}
