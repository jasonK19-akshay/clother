import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
const repository = globalThis.process?.env?.GITHUB_REPOSITORY

export default defineConfig({
  base: repository ? `/${repository.split('/')[1]}/` : './',
  plugins: [react()],
  base: '/clother/'
})
