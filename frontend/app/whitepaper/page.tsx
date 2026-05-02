import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Whitepaper() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16 prose prose-invert">
        <h1 className="text-4xl font-bold gradient-text mb-2">The GreenPrompt Whitepaper</h1>
        <p className="text-slate-400 mb-8">A primer on the energy economics of large language models.</p>

        <h2>1. Why prompt efficiency matters</h2>
        <p>
          Training a single large language model can emit hundreds of tonnes of CO₂ — but
          inference, repeated billions of times daily, now dominates lifetime emissions.
          Every redundant token in a prompt directly translates to GPU cycles, energy, and carbon.
        </p>

        <h2>2. Energy coefficients</h2>
        <p>GreenPrompt uses these research-aligned coefficients (Wh per 1k tokens):</p>
        <ul>
          <li><strong>GPT-4o</strong>: 0.005 Wh</li>
          <li><strong>GPT-4o-mini</strong>: 0.0004 Wh</li>
          <li><strong>Gemini 1.5 Pro</strong>: 0.004 Wh</li>
          <li><strong>Gemini 1.5 Flash</strong>: 0.0003 Wh</li>
        </ul>

        <h2>3. Carbon intensity</h2>
        <p>
          Global average grid intensity: <strong>0.475 g CO₂e per Wh</strong> (IEA, 2023).
          Real values vary by region and time of day.
        </p>

        <h2>4. Real-world equivalents</h2>
        <ul>
          <li>Smartphone charge ≈ 12 Wh</li>
          <li>LED bulb hour ≈ 9 Wh</li>
          <li>Laptop minute ≈ 0.83 Wh (50W avg)</li>
          <li>Google search ≈ 0.3 Wh</li>
          <li>EV km ≈ 180 Wh (Tesla Model 3)</li>
          <li>Tree absorption ≈ 21 kg CO₂/year</li>
        </ul>

        <h2>5. References</h2>
        <ol>
          <li>Patterson, D. et al. (2021). <em>Carbon Emissions and Large Neural Network Training.</em> arXiv:2104.10350.</li>
          <li>Luccioni, A. S., Viguier, S., Ligozat, A. L. (2023). <em>Estimating the Carbon Footprint of BLOOM.</em> JMLR.</li>
          <li>Strubell, E., Ganesh, A., McCallum, A. (2019). <em>Energy and Policy Considerations for Deep Learning in NLP.</em> ACL.</li>
          <li>IEA (2023). <em>Electricity Grid Emissions Factors.</em></li>
          <li>Google (2024). <em>Environmental Report.</em></li>
        </ol>

        <h2>6. Limitations</h2>
        <p>
          Coefficients are public-research estimates — true per-token energy depends on hardware,
          batching, KV-cache reuse, and datacenter PUE. Treat numbers as comparative, not absolute.
        </p>
      </main>
      <Footer />
    </>
  );
}