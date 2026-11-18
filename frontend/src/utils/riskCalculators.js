// Educational ML risk calculation and XAI local attribution simulation for EduGuard AI

/**
 * Calculates academic risk score, category, and class probabilities.
 * Mimics Decision Tree and Random Forest multi-factor weighting.
 */
export const calculateRisk = (student, modelType = 'random_forest') => {
  const attendance = Number(student.attendance ?? 70)
  const midterm = Number(student.midtermScore ?? 60)
  const assignments = Number(student.assignmentScore ?? 65)
  const quiz = Number(student.quizAverage ?? 60)
  const gpa = Number(student.priorGpa ?? 2.8)
  const gpaNormalized = Math.min(100, Math.max(0, (gpa / 4.0) * 100))

  // Risk formula: Invert positive academic metrics to represent risk (lower score = higher risk)
  const attRisk = Math.max(0, 100 - attendance)
  const midtermRisk = Math.max(0, 100 - midterm)
  const assignRisk = Math.max(0, 100 - assignments)
  const quizRisk = Math.max(0, 100 - quiz)
  const gpaRisk = Math.max(0, 100 - gpaNormalized)

  // Feature weights calibrated to educational research literature
  let weightedRiskScore
  if (modelType === 'random_forest') {
    // Random Forest ensemble: smooth non-linear continuous weights
    weightedRiskScore =
      attRisk * 0.35 +
      midtermRisk * 0.30 +
      assignRisk * 0.18 +
      gpaRisk * 0.12 +
      quizRisk * 0.05
  } else {
    // Decision Tree: slightly more step-function / threshold sensitive
    let score =
      attRisk * 0.38 +
      midtermRisk * 0.32 +
      assignRisk * 0.15 +
      gpaRisk * 0.10 +
      quizRisk * 0.05
    // Decision tree threshold heuristic penalty
    if (attendance < 50 || midterm < 40) {
      score = Math.min(100, score + 6)
    }
    weightedRiskScore = score
  }

  // Bound between 5 and 95 for realistic ML probability
  const finalScore = Math.min(96.5, Math.max(4.2, Number(weightedRiskScore.toFixed(1))))

  let category = 'Low'
  if (finalScore >= 68.0) {
    category = 'High'
  } else if (finalScore >= 38.0) {
    category = 'Medium'
  }

  // Class probabilities
  let pHigh
  let pMed
  let pLow

  if (category === 'High') {
    pHigh = Math.min(0.96, finalScore / 100)
    pMed = Number(((1 - pHigh) * 0.75).toFixed(2))
    pLow = Number((1 - pHigh - pMed).toFixed(2))
  } else if (category === 'Medium') {
    pMed = 0.58 + ((finalScore - 38) / 30) * 0.25
    pHigh = Number(((1 - pMed) * 0.45).toFixed(2))
    pLow = Number((1 - pMed - pHigh).toFixed(2))
  } else {
    pLow = Math.min(0.95, (100 - finalScore) / 100)
    pMed = Number(((1 - pLow) * 0.8).toFixed(2))
    pHigh = Number((1 - pLow - pMed).toFixed(2))
  }

  const confidence = Math.round(
    (category === 'High' ? pHigh : category === 'Medium' ? pMed : pLow) * 100
  )

  return {
    riskScore: finalScore,
    riskCategory: category,
    confidence,
    probabilities: {
      high: Number((pHigh * 100).toFixed(1)),
      medium: Number((pMed * 100).toFixed(1)),
      low: Number((pLow * 100).toFixed(1))
    },
    predictedAt: new Date().toISOString(),
    modelUsed: modelType === 'random_forest' ? 'Random Forest Classifier' : 'Decision Tree Classifier'
  }
}

/**
 * Generates local feature contributions (XAI) simulating LIME / SHAP attribution
 */
export const explainPrediction = (student, modelType = 'random_forest') => {
  const prediction = calculateRisk(student, modelType)
  const attendance = Number(student.attendance ?? 70)
  const midterm = Number(student.midtermScore ?? 60)
  const assignments = Number(student.assignmentScore ?? 65)
  const quiz = Number(student.quizAverage ?? 60)
  const gpa = Number(student.priorGpa ?? 2.8)

  // University cohort benchmark averages
  const cohortAverages = {
    attendance: 78.5,
    midterm: 66.0,
    assignments: 72.5,
    quiz: 68.0,
    gpa: 3.10
  }

  const rawAttributions = [
    {
      feature: 'Attendance Rate',
      studentValue: `${attendance}%`,
      benchmarkValue: `${cohortAverages.attendance}%`,
      delta: attendance - cohortAverages.attendance,
      weight: (cohortAverages.attendance - attendance) * 0.42,
      category: 'Attendance',
      unit: '%'
    },
    {
      feature: 'Midterm Examination',
      studentValue: `${midterm}/100`,
      benchmarkValue: `${cohortAverages.midterm}/100`,
      delta: midterm - cohortAverages.midterm,
      weight: (cohortAverages.midterm - midterm) * 0.38,
      category: 'Summative Assessment',
      unit: 'pts'
    },
    {
      feature: 'Coursework Assignments',
      studentValue: `${assignments}/100`,
      benchmarkValue: `${cohortAverages.assignments}/100`,
      delta: assignments - cohortAverages.assignments,
      weight: (cohortAverages.assignments - assignments) * 0.25,
      category: 'Formative Assessment',
      unit: 'pts'
    },
    {
      feature: 'Prior Cumulative GPA',
      studentValue: `${gpa.toFixed(2)} / 4.0`,
      benchmarkValue: `${cohortAverages.gpa.toFixed(2)} / 4.0`,
      delta: gpa - cohortAverages.gpa,
      weight: (cohortAverages.gpa - gpa) * 12.0,
      category: 'Historical Record',
      unit: 'gpa'
    },
    {
      feature: 'Weekly Quiz Average',
      studentValue: `${quiz}/100`,
      benchmarkValue: `${cohortAverages.quiz}/100`,
      delta: quiz - cohortAverages.quiz,
      weight: (cohortAverages.quiz - quiz) * 0.15,
      category: 'Continuous Assessment',
      unit: 'pts'
    }
  ]

  const features = rawAttributions.map((attr) => {
    const isRiskDriver = attr.weight > 0
    return {
      feature: attr.feature,
      studentValue: attr.studentValue,
      benchmarkValue: attr.benchmarkValue,
      contribution: Number(Math.abs(attr.weight).toFixed(1)),
      direction: isRiskDriver ? 'risk_increasing' : 'risk_decreasing',
      signedValue: Number(attr.weight.toFixed(1)),
      type: isRiskDriver ? 'Adverse Factor' : 'Protective Factor',
      description: isRiskDriver
        ? `${attr.feature} is below average by ${Math.abs(Number(attr.delta.toFixed(1)))}${attr.unit === 'gpa' ? ' GPA' : '%'}, driving predicted risk upward.`
        : `${attr.feature} exceeds the cohort benchmark, buffering the student against elevated risk.`
    }
  })

  // Sort by absolute impact
  features.sort((a, b) => Math.abs(b.signedValue) - Math.abs(a.signedValue))

  const topAdverse = features.filter((f) => f.direction === 'risk_increasing')
  const topProtective = features.filter((f) => f.direction === 'risk_decreasing')

  // Natural Language Summary
  let summary
  if (prediction.riskCategory === 'High') {
    const primary = topAdverse[0]?.feature || 'Academic assessments'
    const secondary = topAdverse[1]?.feature || 'Lecture attendance'
    summary = `The ML model classifies ${student.name || 'this student'} at High Academic Risk (${prediction.riskScore}% risk index, ${prediction.confidence}% model confidence). The primary factors driving this prediction are sub-optimal ${primary} (${topAdverse[0]?.studentValue || 'low'}) and ${secondary} (${topAdverse[1]?.studentValue || 'low'}), representing significant negative deviations from cohort baselines. Immediate academic intervention is advised.`
  } else if (prediction.riskCategory === 'Medium') {
    const primary = topAdverse[0]?.feature || 'Continuous assessment'
    summary = `The student is classified at Medium Academic Risk (${prediction.riskScore}% risk index). While some competencies remain acceptable, warning signs exist in ${primary} (${topAdverse[0]?.studentValue || 'borderline'}). Early preventive support and attendance check-ins are recommended before final examinations.`
  } else {
    const primary = topProtective[0]?.feature || 'High attendance and exam results'
    summary = `The model classifies the student at Low Academic Risk (${prediction.riskScore}% risk index). Academic metrics remain healthy, strongly anchored by ${primary} (${topProtective[0]?.studentValue || 'satisfactory'}). No urgent intervention required; routine progress tracking continues.`
  }

  // Recommended targeted interventions based on top adverse factors
  const targetedInterventions = []
  if (attendance < 65) {
    targetedInterventions.push('Attendance Improvement Support')
  }
  if (midterm < 50) {
    targetedInterventions.push('Assessment Preparation Workshop')
    targetedInterventions.push('Lecturer 1-on-1 Consultation')
  }
  if (assignments < 55) {
    targetedInterventions.push('Peer Tutoring & Learning Support')
  }
  if (prediction.riskCategory === 'High') {
    targetedInterventions.unshift('Academic Counselling')
  }
  if (targetedInterventions.length === 0) {
    targetedInterventions.push('Digital Learning Resources Package')
  }

  return {
    studentId: student.id,
    studentName: student.name,
    prediction,
    features,
    topAdverse,
    topProtective,
    summary,
    targetedInterventions: [...new Set(targetedInterventions)]
  }
}
