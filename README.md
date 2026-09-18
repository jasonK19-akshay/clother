# Clother - Clothes Tracking System

Clother is a frontend-only personal wardrobe tracker built with React and Vite. It lets you maintain a local digital wardrobe with clothing photos, custom categories, multiple colors per item, search, filters, statistics, favorites, and backup/restore tools.

## Features

- Dashboard with wardrobe totals, category counts, most-used color, favorites, recent items, and approximate value.
- Clothing CRUD with image upload, preview, validation, multi-color support, favorites, status, price, brand, material, purchase date, description, and notes.
- Fully customizable categories with item counts.
- Wardrobe grid and compact list views with search, multi-filter support, active filter count, sorting, and empty states.
- Clothing detail pages with large image view, favorite toggle, edit, and delete confirmation.
- Favorites-only view.
- Statistics page with category, color, and usage status charts.
- Light and dark modes with persisted preference.
- Local persistence using localStorage for metadata and IndexedDB for compressed uploaded images.
- JSON export, import, and reset in Settings.
- Responsive layout for desktop, tablet, and mobile.
- GitHub Pages deployment workflow using HashRouter-safe routing.

## Technology Stack

- React.js
- Vite
- JavaScript / JSX
- React Router
- Plain CSS
- localStorage and IndexedDB

No backend, Tailwind CSS, Bootstrap, or external image hosting is required.

## Folder Structure

```text
src/
  components/     Reusable UI and form components
  hooks/          Wardrobe state and theme hooks
  pages/          Route-level pages
  services/       localStorage, IndexedDB, CRUD, and backup services
  styles/         Global CSS theme and responsive layout
  utils/          Constants, validators, and formatters
```

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Data Storage

Clothing metadata and categories are stored in `localStorage`. Uploaded images are compressed to WEBP in the browser and stored in IndexedDB under the `clother-images` database. All data remains local to the browser and survives refreshes and browser restarts.

## Backup and Restore

Open `Settings`, then use:

- `Export Backup` to download a JSON file containing categories, clothing metadata, and image data.
- `Import Backup` to restore a previously exported file.
- `Reset All Data` to clear local wardrobe data and restore default categories.

## GitHub Pages Deployment

This project includes `.github/workflows/deploy.yml`. To deploy:

1. Push the project to GitHub.
2. In repository settings, enable GitHub Pages using GitHub Actions.
3. Push to the `main` branch.

The Vite `base` is configured from `GITHUB_REPOSITORY` during GitHub Actions builds and falls back to `./` locally. Routing uses `HashRouter`, so direct navigation works from a GitHub Pages subpath.
