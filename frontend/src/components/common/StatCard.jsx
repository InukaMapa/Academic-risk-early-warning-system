export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendDirection = 'neutral', // 'up', 'down', 'neutral'
  variant = 'blue', // 'blue', 'rose', 'amber', 'emerald', 'slate'
  onClick
}) => {
  const variantStyles = {
    blue: {
      bg: 'bg-white',
      border: 'border-slate-200/90 hover:border-blue-400',
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      valueColor: 'text-slate-900',
      glow: 'hover:shadow-md'
    },
    rose: {
      bg: 'bg-white',
      border: 'border-rose-200/90 hover:border-rose-400',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      valueColor: 'text-rose-700',
      glow: 'hover:shadow-rose-100/60 hover:shadow-md'
    },
    amber: {
      bg: 'bg-white',
      border: 'border-amber-200/90 hover:border-amber-400',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      valueColor: 'text-amber-700',
      glow: 'hover:shadow-amber-100/60 hover:shadow-md'
    },
    emerald: {
      bg: 'bg-white',
      border: 'border-emerald-200/90 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      valueColor: 'text-emerald-700',
      glow: 'hover:shadow-emerald-100/60 hover:shadow-md'
    },
    slate: {
      bg: 'bg-white',
      border: 'border-slate-200/90 hover:border-slate-400',
      iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      valueColor: 'text-slate-800',
      glow: 'hover:shadow-md'
    }
  }

  const v = variantStyles[variant] || variantStyles.blue

  const trendColors = {
    up: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    down: 'text-rose-700 bg-rose-50 border-rose-200',
    neutral: 'text-slate-600 bg-slate-50 border-slate-200'
  }

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border ${v.bg} ${v.border} shadow-2xs transition-all duration-200 ${v.glow} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className={`mt-2 text-2xl font-bold tracking-tight ${v.valueColor}`}>{value}</p>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${v.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {trend && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium border text-[11px] ${trendColors[trendDirection]}`}
          >
            {trend}
          </span>
        )}
        {subtext && <span className="text-slate-500 truncate ml-auto">{subtext}</span>}
      </div>
    </div>
  )
}
