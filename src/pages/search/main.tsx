import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Search } from './Search'
import '@/index.css'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Search />
    </StrictMode>
  )
}
