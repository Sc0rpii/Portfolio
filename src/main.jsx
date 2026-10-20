import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'

import {router} from "./router/router.js";

import './hooks/i18n.js';

const rootElement = document.getElementById('root')
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
