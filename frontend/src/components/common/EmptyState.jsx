import { Inbox } from 'lucide-react'

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Records Found',
  description = 'There are currently no items to display in this view.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
      <div className="p-3 bg-slate-100 rounded-full text-slate-500 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
