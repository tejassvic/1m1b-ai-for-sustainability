import { renderToStaticMarkup } from 'react-dom/server'
import App from './App.jsx'

// Server-side render entry, used only by the build-time smoke test
// (`ssr-check.mjs`) to prove every component actually renders without error.
export function render() {
  return renderToStaticMarkup(<App />)
}
