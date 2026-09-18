export function createId(prefix = 'id') {
  if (crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function formatCurrency(value) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

export function formatDate(value) {
  if (!value) return 'Not set'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Invalid date'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function categoryName(categories, categoryId) {
  return categories.find((category) => category.id === categoryId)?.name || 'Uncategorized'
}

export function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

export function countBy(items, getter) {
  return items.reduce((totals, item) => {
    const values = [].concat(getter(item) || [])
    values.forEach((value) => {
      const key = value || 'Unknown'
      totals[key] = (totals[key] || 0) + 1
    })
    return totals
  }, {})
}
