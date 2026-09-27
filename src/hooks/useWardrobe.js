import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { listCategories } from '../services/categoryService'
import { listClothes } from '../services/clothesService'

const WardrobeContext = createContext(null)

export function WardrobeProvider({ children }) {
  const [clothes, setClothes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)

      const [clothingData, categoryData] = await Promise.all([
        listClothes(),
        listCategories(),
      ])

      setClothes(clothingData)
      setCategories(categoryData)
    } catch (error) {
      console.error('Unable to load wardrobe:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      clothes,
      categories,
      loading,
      refresh,
    }),
    [clothes, categories, loading, refresh],
  )

  return createElement(
    WardrobeContext.Provider,
    { value },
    children,
  )
}

export function useWardrobe() {
  const context = useContext(WardrobeContext)

  if (!context) {
    throw new Error(
      'useWardrobe must be used inside WardrobeProvider.',
    )
  }

  return context
}