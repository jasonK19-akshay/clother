import StatsCard from '../components/StatsCard'
import { useWardrobe } from '../hooks/useWardrobe'
import { categoryName, countBy, formatCurrency } from '../utils/formatters'

function BarList({ title, data }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  const max = Math.max(...entries.map((entry) => entry[1]), 1)
  return (
    <section className="chart-panel">
      <h2>{title}</h2>
      {entries.length ? entries.map(([label, value]) => (
        <div className="bar-row" key={label}>
          <span>{label}</span>
          <div><i style={{ width: `${(value / max) * 100}%` }} /></div>
          <strong>{value}</strong>
        </div>
      )) : <p>No data yet.</p>}
    </section>
  )
}

export default function Statistics() {
  const { clothes, categories } = useWardrobe()
  const byCategory = countBy(clothes, (item) => categoryName(categories, item.categoryId))
  const byColor = countBy(clothes, (item) => item.colors.map((color) => color.name))
  const byStatus = countBy(clothes, (item) => item.status)
  const totalValue = clothes.reduce((sum, item) => sum + Number(item.price || 0), 0)

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Wardrobe insights</p>
          <h1>Statistics</h1>
        </div>
      </header>
      <section className="stats-grid">
        <StatsCard label="Total items" value={clothes.length} />
        <StatsCard label="Favorites" value={clothes.filter((item) => item.favorite).length} />
        <StatsCard label="Categories used" value={Object.keys(byCategory).length} />
        <StatsCard label="Approximate value" value={formatCurrency(totalValue)} />
      </section>
      <div className="charts-grid">
        <BarList title="Items by Category" data={byCategory} />
        <BarList title="Items by Color" data={byColor} />
        <BarList title="Usage Status" data={byStatus} />
      </div>
    </div>
  )
}
