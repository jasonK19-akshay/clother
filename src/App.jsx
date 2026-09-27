import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import Auth from './components/Auth'

import { supabase } from './lib/supabaseClient'
import { WardrobeProvider } from './hooks/useWardrobe'

import AddClothing from './pages/AddClothing'
import Categories from './pages/Categories'
import ClothingDetails from './pages/ClothingDetails'
import Dashboard from './pages/Dashboard'
import EditClothing from './pages/EditClothing'
import Settings from './pages/Settings'
import Statistics from './pages/Statistics'
import Wardrobe from './pages/Wardrobe'

function AuthGate() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (mounted) {
        setSession(currentSession)
        setLoading(false)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      },
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        Loading Clother...
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    <WardrobeProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />

            <Route
              path="/wardrobe"
              element={<Wardrobe />}
            />

            <Route
              path="/wardrobe/:id"
              element={<ClothingDetails />}
            />

            <Route
              path="/add"
              element={<AddClothing />}
            />

            <Route
              path="/edit/:id"
              element={<EditClothing />}
            />

            <Route
              path="/categories"
              element={<Categories />}
            />

            <Route
              path="/favorites"
              element={<Wardrobe favoritesOnly />}
            />

            <Route
              path="/statistics"
              element={<Statistics />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Route>
        </Routes>
      </HashRouter>
    </WardrobeProvider>
  )
}

export default function App() {
  return <AuthGate />
}