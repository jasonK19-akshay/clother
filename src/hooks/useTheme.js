import { useEffect, useState } from 'react'
import { getStoredTheme, saveStoredTheme } from '../services/storageService'

export function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    saveStoredTheme(theme)
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return { theme, setTheme, toggleTheme }
}
