import { DEFAULT_COLORS, EMPTY_FILTERS, USAGE_STATUSES } from '../utils/constants'

export default function FilterPanel({ filters, setFilters, categories, brands, sizes }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <aside className="filter-panel">
      <div className="panel-heading">
        <h2>Filters</h2>
        {activeCount > 0 && <span>{activeCount} active</span>}
      </div>
      <label>
        Search
        <input value={filters.query} onChange={(event) => update('query', event.target.value)} placeholder="Name, brand, notes" />
      </label>
      <label>
        Category
        <select value={filters.categoryId} onChange={(event) => update('categoryId', event.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <label>
        Color
        <select value={filters.color} onChange={(event) => update('color', event.target.value)}>
          <option value="">All colors</option>
          {DEFAULT_COLORS.map((color) => <option key={color.id} value={color.name}>{color.name}</option>)}
        </select>
      </label>
      <label>
        Brand
        <select value={filters.brand} onChange={(event) => update('brand', event.target.value)}>
          <option value="">All brands</option>
          {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
        </select>
      </label>
      <label>
        Size
        <select value={filters.size} onChange={(event) => update('size', event.target.value)}>
          <option value="">All sizes</option>
          {sizes.map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
      <label>
        Usage status
        <select value={filters.status} onChange={(event) => update('status', event.target.value)}>
          <option value="">All statuses</option>
          {USAGE_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>
      <label>
        Favorite
        <select value={filters.favorite} onChange={(event) => update('favorite', event.target.value)}>
          <option value="">Any</option>
          <option value="yes">Favorites only</option>
          <option value="no">Not favorite</option>
        </select>
      </label>
      <div className="range-row">
        <label>
          Min price
          <input type="number" min="0" value={filters.minPrice} onChange={(event) => update('minPrice', event.target.value)} />
        </label>
        <label>
          Max price
          <input type="number" min="0" value={filters.maxPrice} onChange={(event) => update('maxPrice', event.target.value)} />
        </label>
      </div>
      <button type="button" className="button ghost full" onClick={() => setFilters(EMPTY_FILTERS)}>
        Clear Filters
      </button>
    </aside>
  )
}
