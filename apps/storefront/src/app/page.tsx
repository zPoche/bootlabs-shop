import { siteContent } from "@/content/site"

export default function Home() {
  const { brand, hero } = siteContent

  return (
    <div className="site-shell">
      <header className="site-header">
        <span className="brand">{brand.name}</span>
        <span className="phase-pill">{hero.status}</span>
      </header>
      <main className="hero">
        <p className="brand">{brand.tagline}</p>
        <h1>{hero.headline}</h1>
        <p>{hero.support}</p>
      </main>
      <footer className="site-footer">
        <p>© Bootlabs · Shop-Fundament Phase 0</p>
      </footer>
    </div>
  )
}
