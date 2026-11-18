// Utility formatting functions for EduGuard AI

export const formatPercentage = (val) => {
  if (val === undefined || val === null || isNaN(val)) return 'N/A'
  return `${Math.round(val)}%`
}

export const formatScore = (val, max = 100) => {
  if (val === undefined || val === null || isNaN(val)) return 'N/A'
  return `${Number(val).toFixed(1)} / ${max}`
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

export const getRiskColor = (risk) => {
  const r = (risk || '').toLowerCase()
  if (r === 'high' || r === 'high risk') {
    return {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      fill: '#f43f5e',
      label: 'High Risk'
    }
  }
  if (r === 'medium' || r === 'medium risk') {
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      fill: '#f59e0b',
      label: 'Medium Risk'
    }
  }
  return {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    fill: '#10b981',
    label: 'Low Risk'
  }
}

export const getPriorityBadge = (priority) => {
  const p = (priority || '').toLowerCase()
  if (p === 'critical' || p === 'high') {
    return 'bg-rose-100 text-rose-800 border-rose-200'
  }
  if (p === 'medium') {
    return 'bg-amber-100 text-amber-800 border-amber-200'
  }
  return 'bg-blue-100 text-blue-800 border-blue-200'
}

export const getStatusBadge = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'completed') {
    return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
  if (s === 'in progress') {
    return 'bg-sky-100 text-sky-800 border-sky-200'
  }
  if (s === 'pending') {
    return 'bg-amber-100 text-amber-800 border-amber-200'
  }
  return 'bg-slate-100 text-slate-700 border-slate-200'
}
