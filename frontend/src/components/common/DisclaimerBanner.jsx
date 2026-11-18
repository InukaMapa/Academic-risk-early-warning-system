import { Sparkles } from 'lucide-react'

export const DisclaimerBanner = ({
  type = 'prediction', // 'prediction', 'xai', 'benchmark'
  className = ''
}) => {
  const contentMap = {
    prediction: {
      title: 'Research Prototype: Simulated ML Inference Mode',
      description:
        'Prediction probabilities and risk classifications are simulated using empirical rule-weightings for research validation. The frontend architecture is configured for real-time inference via future Python FastAPI endpoints.'
    },
    xai: {
      title: 'Explainable AI Interface (LIME / SHAP Integration Ready)',
      description:
        'Feature attribution weights and directional contributions reflect simulated local surrogate calculations. Real LIME / SHAP explainer weights will be dynamically streamed once the backend ML pipeline is deployed.'
    },
    benchmark: {
      title: 'Illustrative Model Evaluation Benchmarks',
      description:
        'Accuracy, precision, recall, and ROC-AUC metrics displayed represent preliminary validation benchmarks. Final empirical figures will be populated following completed experiments on the finalized institutional dataset.'
    }
  }

  const { title, description } = contentMap[type] || contentMap.prediction

  return (
    <div
      className={`rounded-xl border border-blue-200/90 bg-blue-50/70 p-3.5 flex items-start gap-3 shadow-2xs ${className}`}
    >
      <div className="p-1 rounded-md bg-blue-100 text-blue-700 shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="text-xs">
        <span className="font-semibold text-blue-900">{title}: </span>
        <span className="text-blue-800/90 leading-relaxed">{description}</span>
      </div>
    </div>
  )
}
