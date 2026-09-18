import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'

const links = [
  ['/', 'Dashboard'],
  ['/wardrobe', 'Wardrobe'],
  ['/add', 'Add Clothing'],
  ['/categories', 'Categories'],
  ['/favorites', 'Favorites'],
  ['/statistics', 'Statistics'],
  ['/settings', 'Settings'],
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="app-shell">
      <header className="mobile-topbar">
        <button type="button" className="icon-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          ☰
        </button>
        <strong>Clother</strong>
        <button type="button" className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">C</span>
          <div>
            <strong>Clother</strong>
            <small>Wardrobe System</small>
          </div>
        </div>
        <nav aria-label="Main navigation">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
