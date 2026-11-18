// Base API client configuration for future FastAPI integration
// Base URL is configurable via environment variable or system settings

import { getStoredSettings } from '../utils/storage'

export const getBaseApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) return envUrl
  const settings = getStoredSettings()
  return settings.apiUrl || 'http://localhost:8000/api/v1'
}

/**
 * Standard HTTP request wrapper prepared for REST API integration with FastAPI
 * Demonstrates proper error handling, JSON serialization, and headers.
 */
export const apiClient = async (endpoint, options = {}) => {
  const baseUrl = getBaseApiUrl()
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }

  // Future JWT token integration
  const token = localStorage.getItem('eduguard_token')
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, config)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API Error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    // In prototype stage, we fall back to mock service layer
    // When FastAPI backend is online, real network errors will be thrown
    console.warn(`[FastAPI Backend Not Connected at ${baseUrl}]: Falling back to LocalStorage simulation.`, error.message)
    throw error
  }
}
