import { createContext, createElement, useCallback, useContext, useMemo, useState } from 'react'
import { listCategories } from '../services/categoryService'
import { listClothes } from '../services/clothesService'
import { ensureInitialData } from '../services/storageService'

const WardrobeContext = createContext(null)

export function WardrobeProvider({ children }) {
  ensureInitialData()
  const [clothes, setClothes] = useState(() => listClothes())
  const [categories, setCategories] = useState(() => listCategories())

  const refresh = useCallback(() => {
    ensureInitialData()
    setClothes(listClothes())
    setCategories(listCategories())
  }, [])

  const value = useMemo(() => ({ clothes, categories, refresh }), [clothes, categories, refresh])
  return createElement(WardrobeContext.Provider, { value }, children)
}

export function useWardrobe() {
  const context = useContext(WardrobeContext)
  if (!context) throw new Error('useWardrobe must be used inside WardrobeProvider.')
  return context
}
