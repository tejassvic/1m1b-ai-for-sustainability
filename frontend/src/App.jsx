import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Mission from './components/Mission'
import AskVerdant from './components/AskVerdant'
import ImpactAnalyzer from './components/ImpactAnalyzer'
import Initiatives from './components/Initiatives'
import SDGSection from './components/SDGSection'
import Community from './components/Community'
import ResponsibleAI from './components/ResponsibleAI'
import GetInvolved from './components/GetInvolved'
import Footer from './components/Footer'

/**
 * App — the whole trail, in order.
 *
 * Sections follow the sequence the product argues for: arrival (Hero), the
 * problem and the five steps out of it (Mission), the assistant that answers
 * questions (AskVerdant), the analyzer that answers them with arithmetic
 * (ImpactAnalyzer), the areas to act in (Initiatives), the goals they serve
 * (SDGSection), the people already acting (Community), the terms on which this
 * advice is given (ResponsibleAI), and the invitation (GetInvolved).
 *
 * `impactInputs` is the one piece of shared state: once a visitor has calculated
 * a profile, the assistant can answer follow-up questions against it. Only the
 * inputs travel — the server recalculates the figures — so the number the model
 * reasons about is always the number the calculator produced.
 */
export default function App() {
  const [impactInputs, setImpactInputs] = useState(null)

  return (
    <>
      {/* Keyboard users can step straight onto the path. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pebble focus:bg-forest focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-mist"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Mission />
        <AskVerdant impactInputs={impactInputs} />
        <ImpactAnalyzer onInputsChange={setImpactInputs} />
        <Initiatives />
        <SDGSection />
        <Community />
        <ResponsibleAI />
        <GetInvolved />
      </main>

      <Footer />
    </>
  )
}
