import { DEFAULT_CATEGORIES, STORAGE_KEYS } from '../utils/constants'
import { createId } from '../utils/formatters'

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function ensureInitialData() {
  if (!read(STORAGE_KEYS.categories, null)) {
    const now = new Date().toISOString()
    const categories = DEFAULT_CATEGORIES.map((name) => ({
      id: createId('cat'),
      name,
      description: '',
      createdAt: now,
    }))
    write(STORAGE_KEYS.categories, categories)
  }
  if (!read(STORAGE_KEYS.clothes, null)) {
    write(STORAGE_KEYS.clothes, [])
  }
}

export function getStoredClothes() {
  ensureInitialData()
  return read(STORAGE_KEYS.clothes, [])
}

export function saveStoredClothes(clothes) {
  write(STORAGE_KEYS.clothes, clothes)
}

export function getStoredCategories() {
  ensureInitialData()
  return read(STORAGE_KEYS.categories, [])
}

export function saveStoredCategories(categories) {
  write(STORAGE_KEYS.categories, categories)
}

export function getStoredTheme() {
  return read(STORAGE_KEYS.theme, 'light')
}

export function saveStoredTheme(theme) {
  write(STORAGE_KEYS.theme, theme)
}

export function resetMetadata() {
  localStorage.removeItem(STORAGE_KEYS.clothes)
  localStorage.removeItem(STORAGE_KEYS.categories)
  localStorage.removeItem(STORAGE_KEYS.seeded)
  ensureInitialData()
}
