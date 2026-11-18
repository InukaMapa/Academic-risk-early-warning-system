// Authentication and Role Context for EduGuard AI
// Provides demo switching between Lecturer and Student portals

import { createContext, useContext, useState, useEffect } from 'react'
import { getStoredAuth, saveStoredAuth, getStoredStudents } from '../utils/storage'

const AuthContext = createContext(null)

export const DEMO_LECTURER = {
  id: 'LEC-001',
  name: 'Dr. David Miller',
  email: 'd.miller@university.edu',
  role: 'lecturer',
  title: 'Senior Lecturer & Research Advisor',
  department: 'Department of Computing & Information Systems',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
}

export const DEMO_STUDENT = {
  id: 'STU2024-019',
  studentId: 'STU2024-019',
  name: 'Maya Lin',
  email: 'm.lin@university.edu',
  role: 'student',
  programme: 'BSc Computer Science',
  academicYear: 'Year 1 - Semester 2',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = getStoredAuth()
    return saved || DEMO_LECTURER // default to lecturer for immediate evaluation
  })

  useEffect(() => {
    saveStoredAuth(user)
  }, [user])

  const loginAsLecturer = () => {
    setUser(DEMO_LECTURER)
    return DEMO_LECTURER
  }

  const loginAsStudent = (studentId = 'STU2024-019') => {
    const students = getStoredStudents()
    const student = students.find((s) => s.id === studentId) || DEMO_STUDENT
    const studentUser = {
      id: student.id,
      studentId: student.id,
      name: student.name,
      email: student.email,
      role: 'student',
      programme: student.programme,
      academicYear: student.academicYear,
      avatar: student.avatar
    }
    setUser(studentUser)
    return studentUser
  }

  const loginWithCredentials = (email, password, role = 'lecturer') => {
    if (role === 'student' || email.includes('student')) {
      return loginAsStudent()
    }
    return loginAsLecturer()
  }

  const switchRole = () => {
    if (user?.role === 'lecturer') {
      return loginAsStudent()
    } else {
      return loginAsLecturer()
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'guest',
        isLecturer: user?.role === 'lecturer',
        isStudent: user?.role === 'student',
        loginAsLecturer,
        loginAsStudent,
        loginWithCredentials,
        switchRole,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
