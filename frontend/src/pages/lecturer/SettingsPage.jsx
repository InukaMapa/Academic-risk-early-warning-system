import { useState, useEffect } from 'react'
import {
  Settings,
  User,
  Shield,
  Bell,
  Cpu,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { getStoredSettings, saveStoredSettings, resetToDemoData } from '../../utils/storage'
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog'
import { toast } from 'react-toastify'

export const SettingsPage = () => {
  const [settings, setSettings] = useState(getStoredSettings)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'system' | 'notifications'

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      lecturerProfile: {
        ...prev.lecturerProfile,
        [name]: value
      }
    }))
  }

  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSaveSettings = (e) => {
    e.preventDefault()
    saveStoredSettings(settings)
    toast.success('System and profile settings saved successfully')
  }

  const handleResetData = () => {
    resetToDemoData()
    setIsResetConfirmOpen(false)
    toast.success('Demo dataset and state restored to pristine benchmark default')
    setTimeout(() => {
      window.location.reload()
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Settings & Configuration</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage lecturer advisory credentials, configure FastAPI REST connection parameters, calibrate
            risk thresholds, and manage prototype persistence.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200/90 shadow-2xs text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Lecturer Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
            activeTab === 'system'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>FastAPI & Model Configuration</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications & Alerts</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings}>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Lecturer & Academic Advisor Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name & Honorific</label>
                <input
                  type="text"
                  name="name"
                  value={settings.lecturerProfile.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institutional Title</label>
                <input
                  type="text"
                  name="title"
                  value={settings.lecturerProfile.title}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty / Department</label>
                <input
                  type="text"
                  name="department"
                  value={settings.lecturerProfile.department}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">University Email</label>
                <input
                  type="email"
                  name="email"
                  value={settings.lecturerProfile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Office Location</label>
                <input
                  type="text"
                  name="office"
                  value={settings.lecturerProfile.office}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-5 text-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                FastAPI Backend Integration Parameters
              </h3>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  FastAPI REST Base URL (Configurable via VITE_API_URL or Settings)
                </label>
                <input
                  type="text"
                  name="apiUrl"
                  value={settings.apiUrl}
                  onChange={handleSystemChange}
                  placeholder="http://localhost:8000/api/v1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  When the separate FastAPI Python backend is running, the frontend will point to this address.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Default Predictive Model
                  </label>
                  <select
                    name="defaultModel"
                    value={settings.defaultModel}
                    onChange={handleSystemChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="random_forest">Random Forest Classifier (Ensemble)</option>
                    <option value="decision_tree">Decision Tree Classifier (CART)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Active Academic Semester
                  </label>
                  <input
                    type="text"
                    name="academicSemester"
                    value={settings.academicSemester}
                    onChange={handleSystemChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    High Risk Threshold (%)
                  </label>
                  <input
                    type="number"
                    name="highRiskThreshold"
                    value={settings.highRiskThreshold}
                    onChange={handleSystemChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                  <p className="text-[11px] text-slate-400 mt-0.5">Scores at or above this trigger High Risk</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Medium Risk Threshold (%)
                  </label>
                  <input
                    type="number"
                    name="mediumRiskThreshold"
                    value={settings.mediumRiskThreshold}
                    onChange={handleSystemChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                  <p className="text-[11px] text-slate-400 mt-0.5">Scores at or above this trigger Medium Risk</p>
                </div>
              </div>
            </div>

            {/* Prototype Reset Card */}
            <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-2xs space-y-3 text-xs">
              <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-rose-600" />
                Prototype Data Management
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Reset student records, assigned interventions, and prediction logs back to the clean initial demo
                research dataset stored in LocalStorage.
              </p>
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Reset All Demo Data</span>
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Advisory Alert & Communication Preferences
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleSystemChange}
                  className="rounded text-blue-600 focus:ring-blue-500/20"
                />
                <div>
                  <p className="font-bold text-slate-800">High Risk Email Alerts</p>
                  <p className="text-[11px] text-slate-500">
                    Receive instant alerts when a student risk score crosses into High Risk
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="autoFlagInterventions"
                  checked={settings.autoFlagInterventions}
                  onChange={handleSystemChange}
                  className="rounded text-blue-600 focus:ring-blue-500/20"
                />
                <div>
                  <p className="font-bold text-slate-800">Automated Follow-up Reminders</p>
                  <p className="text-[11px] text-slate-500">
                    Flag pending interventions reaching recommended follow-up deadlines
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}
      </form>

      {/* Confirmation Dialog for Data Reset */}
      <ConfirmationDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset Demo Dataset"
        message="This will reset all modified student records, newly assigned interventions, and prediction history back to the original research baseline. Are you sure?"
        confirmText="Confirm Reset"
        isDanger={true}
      />
    </div>
  )
}
