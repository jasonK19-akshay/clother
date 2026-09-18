export const STORAGE_KEYS = {
  clothes: 'clother:clothes',
  categories: 'clother:categories',
  theme: 'clother:theme',
  seeded: 'clother:seeded',
}

export const DEFAULT_CATEGORIES = [
  'T-Shirts',
  'Shirts',
  'Jeans',
  'Trousers',
  'Shorts',
  'Jackets',
  'Hoodies',
  'Sweaters',
  'Footwear',
  'Accessories',
  'Other',
]

export const DEFAULT_COLORS = [
  { id: 'black', name: 'Black', hex: '#111827' },
  { id: 'white', name: 'White', hex: '#ffffff' },
  { id: 'grey', name: 'Grey', hex: '#6b7280' },
  { id: 'blue', name: 'Blue', hex: '#2563eb' },
  { id: 'navy', name: 'Navy', hex: '#172554' },
  { id: 'sky-blue', name: 'Sky Blue', hex: '#38bdf8' },
  { id: 'green', name: 'Green', hex: '#16a34a' },
  { id: 'olive', name: 'Olive', hex: '#6b8e23' },
  { id: 'brown', name: 'Brown', hex: '#8b5e34' },
  { id: 'beige', name: 'Beige', hex: '#d6c5a2' },
  { id: 'cream', name: 'Cream', hex: '#fff7d6' },
  { id: 'yellow', name: 'Yellow', hex: '#facc15' },
  { id: 'orange', name: 'Orange', hex: '#f97316' },
  { id: 'red', name: 'Red', hex: '#dc2626' },
  { id: 'maroon', name: 'Maroon', hex: '#7f1d1d' },
  { id: 'pink', name: 'Pink', hex: '#ec4899' },
  { id: 'purple', name: 'Purple', hex: '#7c3aed' },
]

export const USAGE_STATUSES = [
  'Active',
  'Rarely Used',
  'Seasonal',
  'Stored',
  'Donate/Sell',
]

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'name', label: 'Name' },
  { value: 'category', label: 'Category' },
  { value: 'color', label: 'Color' },
  { value: 'brand', label: 'Brand' },
  { value: 'price', label: 'Price' },
]

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const EMPTY_FILTERS = {
  query: '',
  categoryId: '',
  color: '',
  brand: '',
  size: '',
  status: '',
  favorite: '',
  minPrice: '',
  maxPrice: '',
}
