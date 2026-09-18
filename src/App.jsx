import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { WardrobeProvider } from './hooks/useWardrobe'
import AddClothing from './pages/AddClothing'
import Categories from './pages/Categories'
import ClothingDetails from './pages/ClothingDetails'
import Dashboard from './pages/Dashboard'
import EditClothing from './pages/EditClothing'
import Settings from './pages/Settings'
import Statistics from './pages/Statistics'
import Wardrobe from './pages/Wardrobe'

export default function App() {
  return (
    <WardrobeProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/wardrobe/:id" element={<ClothingDetails />} />
            <Route path="/add" element={<AddClothing />} />
            <Route path="/edit/:id" element={<EditClothing />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Wardrobe favoritesOnly />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </WardrobeProvider>
  )
}
