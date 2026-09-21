import React from 'react'
import ReactDOM from 'react-dom/client'

// Self-hosted, latin-subset font weights only.
// Shipping just the weights and script the site actually uses keeps the
// download small — no render-blocking third-party requests, no wasted bytes.
import '@fontsource/fraunces/latin-600.css'
import '@fontsource/fraunces/latin-700.css'
import '@fontsource/nunito-sans/latin-400.css'
import '@fontsource/nunito-sans/latin-600.css'
import '@fontsource/nunito-sans/latin-700.css'

import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
