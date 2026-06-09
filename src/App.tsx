import './App.css'

export default function App() {
  return (
    <main className="container">
      <header>
        <div className="logo">RR</div>
        <h1>RJW Renovations</h1>
        <p className="tagline">Quality renovations, built to last.</p>
      </header>

      <section className="coming-soon">
        <h2>Coming Soon</h2>
        <p>
          Our new website is on its way.
          In the meantime, get in touch to discuss your renovation project.
        </p>
        <a href="mailto:info@rjwrenovations.co.uk" className="cta">
          Get in touch
        </a>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} RJW Renovations</p>
      </footer>
    </main>
  )
}
