import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { LecturerLayout } from '../layouts/LecturerLayout'
import { StudentLayout } from '../layouts/StudentLayout'

// Lecturer Pages
import { LecturerDashboard } from '../pages/lecturer/LecturerDashboard'
import { StudentDataPage } from '../pages/lecturer/StudentDataPage'
import { UploadAcademicDataPage } from '../pages/lecturer/UploadAcademicDataPage'
import { RiskPredictionPage } from '../pages/lecturer/RiskPredictionPage'
import { ExplainabilityPage } from '../pages/lecturer/ExplainabilityPage'
import { InterventionRecommendationsPage } from '../pages/lecturer/InterventionRecommendationsPage'
import { InterventionTrackingPage } from '../pages/lecturer/InterventionTrackingPage'
import { ProgressMonitoringPage } from '../pages/lecturer/ProgressMonitoringPage'
import { ReportsAnalyticsPage } from '../pages/lecturer/ReportsAnalyticsPage'
import { SettingsPage } from '../pages/lecturer/SettingsPage'

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard'
import { StudentAcademicOverview } from '../pages/student/StudentAcademicOverview'
import { StudentRecommendations } from '../pages/student/StudentRecommendations'
import { StudentProgress } from '../pages/student/StudentProgress'

export const AppRoutes = () => {
  const { user, isLecturer } = useAuth()

  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Root redirect based on active role */}
      <Route
        path="/"
        element={
          user ? (
            isLecturer ? (
              <Navigate to="/lecturer/dashboard" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Lecturer Portal Routes */}
      <Route path="/lecturer" element={<LecturerLayout />}>
        <Route index element={<Navigate to="/lecturer/dashboard" replace />} />
        <Route path="dashboard" element={<LecturerDashboard />} />
        <Route path="students" element={<StudentDataPage />} />
        <Route path="upload" element={<UploadAcademicDataPage />} />
        <Route path="risk-prediction" element={<RiskPredictionPage />} />
        <Route path="explainability" element={<ExplainabilityPage />} />
        <Route path="interventions" element={<InterventionRecommendationsPage />} />
        <Route path="tracking" element={<InterventionTrackingPage />} />
        <Route path="progress" element={<ProgressMonitoringPage />} />
        <Route path="reports" element={<ReportsAnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Student Portal Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="academic" element={<StudentAcademicOverview />} />
        <Route path="recommendations" element={<StudentRecommendations />} />
        <Route path="progress" element={<StudentProgress />} />
      </Route>

      {/* 404 Fallback Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
