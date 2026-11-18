// Model definitions, configuration, and research benchmark evaluation metrics for EduGuard AI

export const availableModels = [
  {
    id: 'random_forest',
    name: 'Random Forest Classifier',
    shortName: 'Random Forest',
    version: 'v1.4.2 (Ensemble)',
    type: 'Ensemble Learning',
    description: 'An ensemble of 100 decorrelated decision trees using bagging and random feature subspaces. Delivers highest predictive stability and generalizability on tabular student academic records.',
    isRecommended: true,
    hyperparameters: {
      n_estimators: 100,
      max_depth: 8,
      min_samples_split: 5,
      criterion: 'gini',
      class_weight: 'balanced'
    },
    metrics: {
      accuracy: 91.8,
      precision: 89.4,
      recall: 93.1,
      f1Score: 91.2,
      rocAuc: 0.946,
      trainingSamples: 1450,
      testSamples: 362
    },
    confusionMatrix: {
      truePositive: 162, // High risk correctly caught
      falsePositive: 19, // Low risk predicted as high
      trueNegative: 170, // Low risk correctly classified
      falseNegative: 11  // High risk missed (crucial to minimize)
    }
  },
  {
    id: 'decision_tree',
    name: 'Decision Tree Classifier',
    shortName: 'Decision Tree',
    version: 'v1.2.0 (CART)',
    type: 'Single Estimator',
    description: 'Standard Classification and Regression Tree (CART) model. Highly interpretable white-box architecture with rule-based branching logic, well suited for educational policy explainability.',
    isRecommended: false,
    hyperparameters: {
      max_depth: 6,
      min_samples_split: 10,
      criterion: 'entropy',
      class_weight: 'balanced'
    },
    metrics: {
      accuracy: 84.2,
      precision: 81.5,
      recall: 86.0,
      f1Score: 83.7,
      rocAuc: 0.872,
      trainingSamples: 1450,
      testSamples: 362
    },
    confusionMatrix: {
      truePositive: 150,
      falsePositive: 34,
      trueNegative: 155,
      falseNegative: 23
    }
  }
]

export const globalFeatureImportance = [
  { feature: 'Attendance Rate (%)', importance: 0.32, category: 'Engagement', description: 'Percentage of lectures and lab sessions attended' },
  { feature: 'Midterm Exam Score', importance: 0.28, category: 'Assessment', description: 'Score out of 100 in mid-semester evaluation' },
  { feature: 'Assignment Submissions', importance: 0.18, category: 'Continuous Assessment', description: 'Weighted average of homework and programming assignments' },
  { feature: 'Prior Cumulative GPA', importance: 0.12, category: 'Historical Record', description: 'Previous academic semester GPA baseline' },
  { feature: 'Quiz Average (%)', importance: 0.07, category: 'Continuous Assessment', description: 'Average score across weekly formative quizzes' },
  { feature: 'LMS Platform Activity', importance: 0.03, category: 'Digital Engagement (Optional)', description: 'Weekly hours spent on the learning management portal' }
]

export const modelComparisonTable = [
  {
    metric: 'Accuracy',
    decisionTree: '84.2%',
    randomForest: '91.8%',
    difference: '+7.6% (RF Higher)',
    highlight: 'RF'
  },
  {
    metric: 'Precision (High Risk)',
    decisionTree: '81.5%',
    randomForest: '89.4%',
    difference: '+7.9% (Fewer false alarms)',
    highlight: 'RF'
  },
  {
    metric: 'Recall / Sensitivity',
    decisionTree: '86.0%',
    randomForest: '93.1%',
    difference: '+7.1% (Critical for early warning)',
    highlight: 'RF'
  },
  {
    metric: 'F1-Score',
    decisionTree: '83.7%',
    randomForest: '91.2%',
    difference: '+7.5%',
    highlight: 'RF'
  },
  {
    metric: 'ROC-AUC',
    decisionTree: '0.872',
    randomForest: '0.946',
    difference: '+0.074',
    highlight: 'RF'
  },
  {
    metric: 'Interpretability',
    decisionTree: 'Direct Tree Graph (High)',
    randomForest: 'Requires XAI (LIME/SHAP)',
    difference: 'DT more transparent natively',
    highlight: 'DT'
  }
]
