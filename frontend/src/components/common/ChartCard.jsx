export const ChartCard = ({
  title,
  subtitle,
  children,
  action,
  className = '',
  height = 'h-72'
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-shadow ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      <div className={`w-full ${height}`}>{children}</div>
    </div>
  )
}
