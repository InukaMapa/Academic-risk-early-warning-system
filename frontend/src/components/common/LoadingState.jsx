export const LoadingState = ({ message = 'Loading academic records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Please wait while data is processed</p>
    </div>
  )
}
