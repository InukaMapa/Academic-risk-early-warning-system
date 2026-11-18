// Sample CSV templates for testing upload functionality in EduGuard AI

export const sampleCsvContent = `StudentID,StudentName,Programme,AcademicYear,Attendance,MidtermScore,AssignmentScore,QuizAverage,PriorGPA,LMSHours
STU2024-101,Aarav Fernando,BSc Software Engineering,Year 1 - Semester 1,48,34,42,38,2.10,7.5
STU2024-102,Natasha Romanova,BSc Computer Science,Year 2 - Semester 1,88,82,85,80,3.65,28.0
STU2024-103,Ethan Hawke,BSc Data Science,Year 1 - Semester 2,52,40,46,44,2.30,11.2
STU2024-104,Priya Jayawardena,BSc Cyber Security,Year 3 - Semester 1,94,89,92,90,3.85,36.5
STU2024-105,Cameron Diaz,BSc Software Engineering,Year 2 - Semester 1,60,54,58,56,2.75,
STU2024-106,Tariq Al-Fahim,BSc Computer Science,Year 1 - Semester 1,42,30,38,32,1.90,5.0
STU2024-107,Grace Hopper,BSc Software Engineering,Year 3 - Semester 1,96,95,98,96,3.95,45.0
STU2024-108,Devin Silva,BSc Data Science,Year 2 - Semester 1,71,62,65,63,2.90,19.5
STU2024-109,Ananya Sen,BSc Cyber Security,Year 2 - Semester 1,55,46,50,48,2.40,13.0
STU2024-110,Noah Taylor,BSc Computer Science,Year 1 - Semester 2,82,77,80,78,3.40,24.0`

export const downloadSampleCsv = (filename = 'eduguard_student_academic_template.csv') => {
  const blob = new Blob([sampleCsvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
