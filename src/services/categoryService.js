import { getStoredCategories, saveStoredCategories } from './storageService'
import { createId } from '../utils/formatters'

export function listCategories() {
  return getStoredCategories()
}

export function createCategory(input) {
  const now = new Date().toISOString()
  const category = {
    id: createId('cat'),
    name: input.name.trim(),
    description: input.description?.trim() || '',
    createdAt: now,
  }
  saveStoredCategories([...getStoredCategories(), category])
  return category
}

export function updateCategory(id, input) {
  const categories = getStoredCategories().map((category) =>
    category.id === id
      ? { ...category, name: input.name.trim(), description: input.description?.trim() || '' }
      : category,
  )
  saveStoredCategories(categories)
  return categories.find((category) => category.id === id)
}

export function deleteCategory(id) {
  const categories = getStoredCategories().filter((category) => category.id !== id)
  saveStoredCategories(categories)
}
