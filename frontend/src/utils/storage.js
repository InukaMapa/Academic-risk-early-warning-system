// LocalStorage wrapper with prototype persistence and demo data recovery for EduGuard AI

import { initialStudents } from '../data/mockStudents'
import { initialInterventions } from '../data/mockInterventions'

const KEYS = {
  STUDENTS: 'eduguard_students',
  INTERVENTIONS: 'eduguard_interventions',
  PREDICTIONS: 'eduguard_predictions_history',
  SETTINGS: 'eduguard_settings',
  AUTH: 'eduguard_auth_user'
}

export const defaultSettings = {
  apiUrl: 'http://localhost:8000/api/v1',
  defaultModel: 'random_forest',
  highRiskThreshold: 68,
  mediumRiskThreshold: 38,
  emailNotifications: true,
  autoFlagInterventions: true,
  theme: 'light',
  academicSemester: 'Semester 1 - 2026/2027',
  lecturerProfile: {
    name: 'Dr. David Miller',
    title: 'Senior Lecturer & Academic Advisor',
    department: 'Department of Computing & Information Systems',
    email: 'd.miller@university.edu',
    office: 'Academic Block B, Room 304'
  }
}

export const getStoredStudents = () => {
  try {
    const raw = localStorage.getItem(KEYS.STUDENTS)
    if (!raw) {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(initialStudents))
      return initialStudents
    }
    return JSON.parse(raw)
  } catch (_e) {
    return initialStudents
  }
}

export const saveStoredStudents = (students) => {
  try {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students))
  } catch (_e) {
    // ignore
  }
}

export const getStoredInterventions = () => {
  try {
    const raw = localStorage.getItem(KEYS.INTERVENTIONS)
    if (!raw) {
      localStorage.setItem(KEYS.INTERVENTIONS, JSON.stringify(initialInterventions))
      return initialInterventions
    }
    return JSON.parse(raw)
  } catch (_e) {
    return initialInterventions
  }
}

export const saveStoredInterventions = (interventions) => {
  try {
    localStorage.setItem(KEYS.INTERVENTIONS, JSON.stringify(interventions))
  } catch (_e) {
    // ignore
  }
}

export const getStoredPredictions = () => {
  try {
    const raw = localStorage.getItem(KEYS.PREDICTIONS)
    return raw ? JSON.parse(raw) : []
  } catch (_e) {
    return []
  }
}

export const saveStoredPredictions = (predictions) => {
  try {
    localStorage.setItem(KEYS.PREDICTIONS, JSON.stringify(predictions))
  } catch (_e) {
    // ignore
  }
}

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS)
    if (!raw) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings))
      return defaultSettings
    }
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch (_e) {
    return defaultSettings
  }
}

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings))
  } catch (_e) {
    // ignore
  }
}

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(KEYS.AUTH)
    return raw ? JSON.parse(raw) : null
  } catch (_e) {
    return null
  }
}

export const saveStoredAuth = (user) => {
  try {
    if (user) {
      localStorage.setItem(KEYS.AUTH, JSON.stringify(user))
    } else {
      localStorage.removeItem(KEYS.AUTH)
    }
  } catch (_e) {
    // ignore
  }
}

export const resetToDemoData = () => {
  try {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(initialStudents))
    localStorage.setItem(KEYS.INTERVENTIONS, JSON.stringify(initialInterventions))
    localStorage.setItem(KEYS.PREDICTIONS, JSON.stringify([]))
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings))
    return true
  } catch (_e) {
    return false
  }
}
