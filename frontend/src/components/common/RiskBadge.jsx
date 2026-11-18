import { getRiskColor } from '../../utils/formatters'

export const RiskBadge = ({ risk, size = 'md', showDot = true, confidence }) => {
  const config = getRiskColor(risk)

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-semibold'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs ${config.bg} ${config.text} ${config.border} ${sizeClasses[size] || sizeClasses.md}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
      {confidence !== undefined && (
        <span className="opacity-75 text-[10px] ml-0.5">({confidence}%)</span>
      )}
    </span>
  )
}
