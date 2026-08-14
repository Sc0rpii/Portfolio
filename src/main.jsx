import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'

import {router} from "./router/router.js";

const rootElement = document.getElementById('root')
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

// react-snap writes the rendered application into #root at build time. Hydrating
// that markup keeps the initial HTML visible while React attaches its handlers.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
