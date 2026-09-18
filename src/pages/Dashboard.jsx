import { Link } from 'react-router-dom'
import ClothingCard from '../components/ClothingCard'
import EmptyState from '../components/EmptyState'
import StatsCard from '../components/StatsCard'
import { useWardrobe } from '../hooks/useWardrobe'
import { categoryName, countBy, formatCurrency } from '../utils/formatters'

export default function Dashboard() {
  const { clothes, categories } = useWardrobe()
  const colorCounts = countBy(clothes, (item) => item.colors.map((color) => color.name))
  const mostUsedColor = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
  const categoryCounts = countBy(clothes, (item) => categoryName(categories, item.categoryId))
  const totalValue = clothes.reduce((sum, item) => sum + Number(item.price || 0), 0)
  const recent = clothes.slice(0, 4)

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Personal wardrobe</p>
          <h1>Dashboard</h1>
        </div>
        <div className="actions">
          <Link className="button" to="/add">Add Clothing</Link>
          <Link className="button ghost" to="/wardrobe">View Wardrobe</Link>
          <Link className="button ghost" to="/categories">Manage Categories</Link>
        </div>
      </header>

      <section className="stats-grid">
        <StatsCard label="Total clothing items" value={clothes.length} detail={formatCurrency(totalValue)} />
        <StatsCard label="Total categories" value={categories.length} />
        <StatsCard label="Most-used color" value={mostUsedColor} />
        <StatsCard label="Favorites" value={clothes.filter((item) => item.favorite).length} />
        <StatsCard label="Tops" value={(categoryCounts['T-Shirts'] || 0) + (categoryCounts.Shirts || 0)} />
        <StatsCard label="Bottoms" value={(categoryCounts.Jeans || 0) + (categoryCounts.Trousers || 0) + (categoryCounts.Shorts || 0)} />
        <StatsCard label="Footwear" value={categoryCounts.Footwear || 0} />
        <StatsCard label="Accessories" value={categoryCounts.Accessories || 0} />
      </section>

      <section className="section-header">
        <div>
          <h2>Recently Added</h2>
          <p>The newest pieces in your wardrobe.</p>
        </div>
      </section>
      {recent.length ? (
        <div className="wardrobe-grid">
          {recent.map((item) => <ClothingCard key={item.id} item={item} categories={categories} />)}
        </div>
      ) : (
        <EmptyState title="Your wardrobe is empty. Add your first clothing item." actionLabel="Add Clothing" actionTo="/add" />
      )}
    </div>
  )
}
