// Analytics & Reports Service for EduGuard AI research evaluation
// Prepares summary indicators and benchmark reports

import { getStoredStudents, getStoredInterventions } from '../utils/storage'
import { availableModels, globalFeatureImportance, modelComparisonTable } from '../data/mockModels'

export const reportService = {
  async getDashboardSummary() {
    const students = getStoredStudents()
    const interventions = getStoredInterventions()

    const totalStudents = students.length
    const highRisk = students.filter((s) => s.riskCategory === 'High').length
    const mediumRisk = students.filter((s) => s.riskCategory === 'Medium').length
    const lowRisk = students.filter((s) => s.riskCategory === 'Low').length

    const pendingInterventions = interventions.filter((i) => i.status === 'Pending').length
    const inProgressInterventions = interventions.filter((i) => i.status === 'In Progress').length
    const completedInterventions = interventions.filter((i) => i.status === 'Completed').length

    const riskDistribution = [
      { name: 'High Risk', value: highRisk, color: '#f43f5e', fill: '#f43f5e' },
      { name: 'Medium Risk', value: mediumRisk, color: '#f59e0b', fill: '#f59e0b' },
      { name: 'Low Risk', value: lowRisk, color: '#10b981', fill: '#10b981' }
    ]

    // Trend progression over weeks
    const trendData = [
      { period: 'Week 2', high: 8, medium: 9, low: 7 },
      { period: 'Week 4', high: 9, medium: 8, low: 7 },
      { period: 'Week 6', high: 7, medium: 10, low: 7 },
      { period: 'Week 8', high: 6, medium: 9, low: 9 },
      { period: 'Current', high: highRisk, medium: mediumRisk, low: lowRisk }
    ]

    return {
      totalStudents,
      highRisk,
      mediumRisk,
      lowRisk,
      highRiskPercentage: Math.round((highRisk / (totalStudents || 1)) * 100),
      mediumRiskPercentage: Math.round((mediumRisk / (totalStudents || 1)) * 100),
      lowRiskPercentage: Math.round((lowRisk / (totalStudents || 1)) * 100),
      pendingInterventions,
      inProgressInterventions,
      completedInterventions,
      totalInterventions: interventions.length,
      riskDistribution,
      trendData
    }
  },

  async getModelBenchmarks() {
    return {
      models: availableModels,
      featureImportance: globalFeatureImportance,
      comparison: modelComparisonTable
    }
  }
}
