// Intervention templates and assigned tracking records for EduGuard AI

export const interventionTemplates = [
  {
    id: 'TPL-01',
    type: 'Academic Counselling',
    category: 'High Risk Focus',
    priority: 'Critical',
    defaultDurationDays: 14,
    description: 'One-on-one academic counseling session to diagnose root causes of persistent academic underperformance and build a customized recovery plan.',
    actionItems: [
      'Conduct 45-minute comprehensive diagnostic review',
      'Identify personal, schedule or comprehension roadblocks',
      'Establish a weekly study hour contract and milestone targets',
      'Schedule bi-weekly check-in checkpoint'
    ],
    recommendedFor: ['Critical Midterm Failure (<40%)', 'Severe Attendance Drops (<60%)', 'Low Prior GPA (<2.2)']
  },
  {
    id: 'TPL-02',
    type: 'Attendance Improvement Support',
    category: 'Attendance Focus',
    priority: 'High',
    defaultDurationDays: 10,
    description: 'Targeted intervention protocol for students exhibiting attendance below required minimum thresholds, with structured verification.',
    actionItems: [
      'Send formal attendance warning and policy clarification',
      'Verify course schedule clashes or transportation impediments',
      'Implement digital attendance check-in verification',
      'Notify academic advisor on subsequent unexplained absences'
    ],
    recommendedFor: ['Attendance below 65%', 'Pattern of missed tutorial sessions', 'Chronic Monday/Friday absences']
  },
  {
    id: 'TPL-03',
    type: 'Peer Tutoring & Learning Support',
    category: 'Coursework Focus',
    priority: 'Medium',
    defaultDurationDays: 21,
    description: 'Pair student with high-achieving peer mentor or teaching assistant for focused subject revision and assignment preparation.',
    actionItems: [
      'Assign verified Senior Student Mentor for 2 hours weekly',
      'Focus on core problematic modules (Algorithms, Mathematics, Programming)',
      'Review upcoming assignment rubrics and milestone drafts',
      'Submit weekly mentor feedback log'
    ],
    recommendedFor: ['Coursework marks between 40-55%', 'Assignment submission delays', 'Struggling with coding labs']
  },
  {
    id: 'TPL-04',
    type: 'Assessment Preparation Workshop',
    category: 'Exam Focus',
    priority: 'High',
    defaultDurationDays: 14,
    description: 'Enrolment in targeted remedial workshops covering past papers, exam question structuring, and time management strategies.',
    actionItems: [
      'Provide curated repository of model answers and past exams',
      'Assign guided mock exam with personalized feedback',
      'Review exam stress mitigation and time allocation strategies',
      'Follow-up quiz to measure comprehension gains'
    ],
    recommendedFor: ['Midterm score below 50%', 'Quiz average decline', 'Test anxiety indicators']
  },
  {
    id: 'TPL-05',
    type: 'Lecturer 1-on-1 Consultation',
    category: 'Mentorship Focus',
    priority: 'High',
    defaultDurationDays: 7,
    description: 'Direct consultative office hours meeting with the module lecturer to address conceptual gaps and realign learning objectives.',
    actionItems: [
      'Examine specific exam questions where marks were lost',
      'Clarify theoretical prerequisites and misconceptions',
      'Provide targeted supplementary reading materials',
      'Agree on revised target score for final examination'
    ],
    recommendedFor: ['High Risk students', 'Sudden grade drop', 'Lecturer referral required']
  },
  {
    id: 'TPL-06',
    type: 'Digital Learning Resources Package',
    category: 'Self-Paced Focus',
    priority: 'Low',
    defaultDurationDays: 30,
    description: 'Curated self-paced interactive modules, practice problem sets, and video walkthroughs tailored to the student weak competencies.',
    actionItems: [
      'Enroll in supplemental LMS remediation course section',
      'Complete interactive diagnostic problem sets',
      'Track self-study hour logs on LMS platform'
    ],
    recommendedFor: ['Medium Risk students with low LMS hours', 'Moderate assignment deficit']
  }
]

export const initialInterventions = [
  {
    id: 'INT-2026-001',
    studentId: 'STU2024-001',
    studentName: 'Marcus Chen',
    programme: 'BSc Software Engineering',
    riskCategory: 'High',
    type: 'Academic Counselling',
    priority: 'Critical',
    assignedDate: '2026-11-05',
    followUpDate: '2026-11-19',
    status: 'In Progress',
    assignedBy: 'Dr. David Miller (Senior Lecturer)',
    description: 'Mandatory one-on-one session with student success counselor regarding 48% attendance and mid-term exam failure.',
    identifiedProblems: [
      'Attendance rate dropped to 48%',
      'Midterm exam score critically low at 36%',
      'Consecutive missed lab sessions'
    ],
    notes: 'Student attended initial diagnostic on Nov 10. Agreed to attend remedial lab on Wednesdays.',
    progressLogs: [
      {
        date: '2026-11-05',
        author: 'Dr. David Miller',
        action: 'Intervention Created',
        details: 'Assigned Academic Counselling following high risk prediction.'
      },
      {
        date: '2026-11-10',
        author: 'Sarah Jenkins (Counselor)',
        action: 'Diagnostic Session Held',
        details: 'Marcus identified employment shifts conflicting with 8 AM lectures. Exploring section switch.'
      }
    ]
  },
  {
    id: 'INT-2026-002',
    studentId: 'STU2024-002',
    studentName: 'Sophia Davis',
    programme: 'BSc Computer Science',
    riskCategory: 'High',
    type: 'Lecturer 1-on-1 Consultation',
    priority: 'High',
    assignedDate: '2026-11-08',
    followUpDate: '2026-11-22',
    status: 'Pending',
    assignedBy: 'Dr. David Miller (Senior Lecturer)',
    description: 'Consultation to review Discrete Math and Algorithm theory gaps.',
    identifiedProblems: [
      'Attendance below requirement (55%)',
      'Midterm score 44%',
      'Incomplete coursework assignment 2'
    ],
    notes: 'Invitation sent via email. Awaiting confirmation of meeting slot.',
    progressLogs: [
      {
        date: '2026-11-08',
        author: 'Dr. David Miller',
        action: 'Intervention Created',
        details: 'Scheduled 1-on-1 consultation for mathematical foundations.'
      }
    ]
  },
  {
    id: 'INT-2026-003',
    studentId: 'STU2024-008',
    studentName: 'Kavindu Perera',
    programme: 'BSc Data Science',
    riskCategory: 'High',
    type: 'Attendance Improvement Support',
    priority: 'Critical',
    assignedDate: '2026-11-12',
    followUpDate: '2026-11-24',
    status: 'Pending',
    assignedBy: 'Prof. Helen Ross',
    description: 'Formal attendance warning and student services check-in.',
    identifiedProblems: [
      'Attendance at 44%',
      'Missing 3 practical sessions in Data Science Labs',
      'Current risk score 89.2%'
    ],
    notes: 'Formal notice issued. Student affairs advisor alerted.',
    progressLogs: [
      {
        date: '2026-11-12',
        author: 'Prof. Helen Ross',
        action: 'Intervention Created',
        details: 'Critical attendance contract initiated.'
      }
    ]
  },
  {
    id: 'INT-2026-004',
    studentId: 'STU2024-003',
    studentName: 'Liam Anderson',
    programme: 'BSc Data Science',
    riskCategory: 'Medium',
    type: 'Peer Tutoring & Learning Support',
    priority: 'Medium',
    assignedDate: '2026-10-25',
    followUpDate: '2026-11-15',
    status: 'Completed',
    assignedBy: 'Dr. David Miller (Senior Lecturer)',
    description: 'Assigned Senior Peer Tutor (Lucas Silva) for Linear Algebra and Probability.',
    identifiedProblems: [
      'Initial midterm score 52%',
      'Struggling with statistical calculus'
    ],
    notes: 'Liam attended all 4 tutoring sessions. Quiz average improved from 45% to 55%. Risk downgraded to Medium.',
    progressLogs: [
      {
        date: '2026-10-25',
        author: 'Dr. David Miller',
        action: 'Intervention Created',
        details: 'Assigned peer tutor Lucas Silva.'
      },
      {
        date: '2026-11-02',
        author: 'Lucas Silva (Peer Tutor)',
        action: 'Session 1 & 2 Completed',
        details: 'Covered matrix operations and eigenvalues. Good engagement.'
      },
      {
        date: '2026-11-15',
        author: 'Dr. David Miller',
        action: 'Intervention Completed',
        details: 'Successful outcome. Progress monitoring re-assessed risk score to 54%.'
      }
    ]
  },
  {
    id: 'INT-2026-005',
    studentId: 'STU2024-019',
    studentName: 'Maya Lin',
    programme: 'BSc Computer Science',
    riskCategory: 'High',
    type: 'Assessment Preparation Workshop',
    priority: 'High',
    assignedDate: '2026-11-10',
    followUpDate: '2026-11-25',
    status: 'In Progress',
    assignedBy: 'Dr. David Miller (Senior Lecturer)',
    description: 'Targeted assessment workshop series for Data Structures programming tests.',
    identifiedProblems: [
      'Attendance at 52%',
      'Midterm score 43%',
      'Assignment submission pending'
    ],
    notes: 'Enrolled in Saturday revision cohort. Submitted practice test 1.',
    progressLogs: [
      {
        date: '2026-11-10',
        author: 'Dr. David Miller',
        action: 'Intervention Created',
        details: 'Enrolled in revision workshop cohort.'
      },
      {
        date: '2026-11-14',
        author: 'Workshop Lead',
        action: 'Workshop 1 Attended',
        details: 'Completed exercises on binary trees and graphs.'
      }
    ]
  },
  {
    id: 'INT-2026-006',
    studentId: 'STU2024-020',
    studentName: 'Benjamin Brooks',
    programme: 'BSc Software Engineering',
    riskCategory: 'Low',
    type: 'Academic Counselling',
    priority: 'Medium',
    assignedDate: '2026-10-18',
    followUpDate: '2026-11-08',
    status: 'Completed',
    assignedBy: 'Dr. David Miller',
    description: 'Study habits and time management consultation.',
    identifiedProblems: [
      'Initial week 2 score drops and scheduling conflicts'
    ],
    notes: 'Completed successfully. Student transitioned from Medium Risk to Low Risk.',
    progressLogs: [
      {
        date: '2026-10-18',
        author: 'Dr. David Miller',
        action: 'Intervention Created',
        details: 'Initial scheduling check-in.'
      },
      {
        date: '2026-11-08',
        author: 'Dr. David Miller',
        action: 'Closed as Completed',
        details: 'Risk score lowered to 24.5%. Closed loop complete.'
      }
    ]
  }
]
