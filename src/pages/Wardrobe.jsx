import { useMemo, useState } from 'react'
import ClothingCard from '../components/ClothingCard'
import EmptyState from '../components/EmptyState'
import FilterPanel from '../components/FilterPanel'
import { EMPTY_FILTERS, SORT_OPTIONS } from '../utils/constants'
import { categoryName, normalizeText } from '../utils/formatters'
import { useWardrobe } from '../hooks/useWardrobe'

function matchesFilters(item, categories, filters) {
  const haystack = [
    item.name,
    item.brand,
    categoryName(categories, item.categoryId),
    item.notes,
    item.colors.map((color) => color.name).join(' '),
  ].join(' ').toLowerCase()
  if (filters.query && !haystack.includes(normalizeText(filters.query))) return false
  if (filters.categoryId && item.categoryId !== filters.categoryId) return false
  if (filters.color && !item.colors.some((color) => color.name === filters.color)) return false
  if (filters.brand && item.brand !== filters.brand) return false
  if (filters.size && item.size !== filters.size) return false
  if (filters.status && item.status !== filters.status) return false
  if (filters.favorite === 'yes' && !item.favorite) return false
  if (filters.favorite === 'no' && item.favorite) return false
  if (filters.minPrice && Number(item.price || 0) < Number(filters.minPrice)) return false
  if (filters.maxPrice && Number(item.price || 0) > Number(filters.maxPrice)) return false
  return true
}

function sortItems(items, categories, sortBy) {
  const next = [...items]
  return next.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'category') return categoryName(categories, a.categoryId).localeCompare(categoryName(categories, b.categoryId))
    if (sortBy === 'color') return (a.colors[0]?.name || '').localeCompare(b.colors[0]?.name || '')
    if (sortBy === 'brand') return (a.brand || '').localeCompare(b.brand || '')
    if (sortBy === 'price') return Number(b.price || 0) - Number(a.price || 0)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

export default function Wardrobe({ favoritesOnly = false }) {
  const { clothes, categories } = useWardrobe()
  const [filters, setFilters] = useState(favoritesOnly ? { ...EMPTY_FILTERS, favorite: 'yes' } : EMPTY_FILTERS)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('recent')

  const brands = useMemo(() => [...new Set(clothes.map((item) => item.brand).filter(Boolean))], [clothes])
  const sizes = useMemo(() => [...new Set(clothes.map((item) => item.size).filter(Boolean))], [clothes])
  const visibleItems = useMemo(() => {
    const filtered = clothes.filter((item) => matchesFilters(item, categories, filters))
    return sortItems(filtered, categories, sortBy)
  }, [clothes, categories, filters, sortBy])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{favoritesOnly ? 'Favorites' : 'My wardrobe'}</p>
          <h1>{favoritesOnly ? 'Favorite Clothing' : 'My Wardrobe'}</h1>
        </div>
        <div className="toolbar">
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort wardrobe">
            {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <div className="segmented" aria-label="View mode">
            <button type="button" className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>Grid</button>
            <button type="button" className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List</button>
          </div>
        </div>
      </header>
      <div className="wardrobe-layout">
        <FilterPanel filters={filters} setFilters={setFilters} categories={categories} brands={brands} sizes={sizes} />
        <section className={viewMode === 'grid' ? 'wardrobe-grid' : 'wardrobe-list'}>
          {visibleItems.length ? (
            visibleItems.map((item) => <ClothingCard key={item.id} item={item} categories={categories} compact={viewMode === 'list'} />)
          ) : (
            <EmptyState
              title={favoritesOnly ? 'No favorite items yet.' : clothes.length ? 'No clothing items match the active filters.' : 'Your wardrobe is empty. Add your first clothing item.'}
              actionLabel={clothes.length ? '' : 'Add Clothing'}
              actionTo="/add"
            />
          )}
        </section>
      </div>
    </div>
  )
}
