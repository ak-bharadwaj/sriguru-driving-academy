import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 mb-6 uppercase">
          Apex Academy
        </h1>
        <p className="font-body text-asphalt-300 text-lg leading-relaxed mb-8">
          The foundation is laid. Custom design tokens, Tailwind configs, and SVG sprites are active. Start exploring or launch the visual playground to inspect our design assets.
        </p>
        <a
          href="/design-preview.html"
          className="inline-flex items-center justify-center px-6 py-3 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-400 hover:text-asphalt-950 text-amber-400 font-display font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:border-amber-400"
        >
          Launch Design Preview
        </a>
      </div>
    </main>
  </React.StrictMode>,
)
