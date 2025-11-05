import React, { useState, useEffect } from "react";

// Absolute backend URLs (no relative paths)
const API_URL    = "https://i-sql-optimizer-backend.onrender.com/analyze";
const HEALTH_URL = "https://i-sql-optimizer-backend.onrender.com/health";

export default function App() {
  const [dbms, setDbms] = useState("sqlserver");
  const [sql, setSql] = useState("");
  const [plan, setPlan] = useState("");
  const [ctx, setCtx] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("");

  const [theme, setTheme] = useState("light");
  const isDark = theme === "dark";

  const [apiOk, setApiOk] = useState(null);

  // Health check once on mount
  useEffect(() => {
    fetch(HEALTH_URL)
      .then(r => setApiOk(r.ok))
      .catch(() => setApiOk(false));
  }, []);

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      dbms,
      sql_text: sql,
      plan_xml: plan || null,
      context: ctx || null,
      version: "2022",
    };

    // Abort after 25s so UI never spins forever
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 25000);

    try {
      console.log("POST", API_URL, payload);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText}${text ? " — " + text.slice(0,200) : ""}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      const msg = e.name === "AbortError"
        ? "Request timed out (25s). Backend might be waking up. Try again."
        : `API call failed: ${e.message}`;
      setError(msg);
    } finally {
      clearTimeout(t);
      setLoading(false);
    }
  }

  async function sendForm(e) {
    e.preventDefault();
    setFormStatus("Sending...");
    try {
      await fetch("https://formspree.io/f/your-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: formData.name,
          Email: formData.email,
          Message: formData.message,
          DBMS: dbms,
          SQL: sql,
          Plan: plan,
          Context: ctx,
        }),
      });
      setFormStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setFormStatus("Error sending message. Try again.");
    }
  }

  function Section({ title, children }) {
    const bg = isDark
      ? "bg-[#0f172a] border-[#23304b] text-[#e6e9ef]"
      : "bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a]";
    return (
      <div className={`${bg} border rounded-2xl p-5`}>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {children}
      </div>
    );
  }

  return (
    <div className={isDark ? "min-h-screen bg-[#0b1220] text-[#e6e9ef]" : "min-h-screen bg-[#e2e8f0] text-[#0f172a]"}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className={`sticky top-0 -mx-4 px-4 py-3 mb-6 backdrop-blur z-10 flex items-center justify-between ${isDark ? "bg-[#0b1220]/80 border-b border-[#23304b]" : "bg-[#f1f5f9]/90 border-b border-[#cbd5e1]"}`}>
          {/* Left: brand + API badge */}
          <div className="flex items-center gap-3 font-extrabold">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-400 grid place-items-center text-white">NS</div>
            <span>NathSpire DBA Optimizer — AI SQL Analyzer</span>
            <span className={`text-xs ml-3 px-2 py-1 rounded-md border ${
              apiOk===null ? "border-gray-300 text-gray-600" :
              apiOk ? "border-green-300 text-green-700" : "border-rose-300 text-rose-700"
            }`}>
              {apiOk===null ? "Checking API…" : apiOk ? "API Connected" : "API Offline"}
            </span>
          </div>

          {/* Right: CTA */}
          <button
            type="button"                 // prevent accidental form submit
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-300 bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold"
          >
            Get Pro Review
          </button>
        </header>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className={(isDark ? "bg-[#0f172a] text-[#e6e9ef] border border-[#23304b]" : "bg-white text-[#0f172a] border border-[#cbd5e1]") + " rounded-2xl p-6 w-full max-w-md relative shadow-lg"}>
              <button onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-[#64748b]">✕</button>
              <h3 className="text-xl font-semibold mb-4">Request a Pro Review</h3>
              <form onSubmit={sendForm} className="grid gap-3">
                <input type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-gray-100 border border-gray-300 rounded-xl p-3" required />
                <input type="email" placeholder="Your Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-gray-100 border border-gray-300 rounded-xl p-3" required />
                <textarea placeholder="Message or additional details" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="bg-gray-100 border border-gray-300 rounded-xl p-3" rows={4}></textarea>
                <button type="submit" className="bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-xl p-3 font-semibold text-white">Send</button>
                <p className="text-sm text-center text-gray-500">{formStatus}</p>
              </form>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Section title="Input">
            <div className="grid gap-3">
              <label className="text-sm">DBMS</label>
              <select value={dbms} onChange={(e) => setDbms(e.target.value)} className="bg-gray-100 border border-gray-300 rounded-xl p-2">
                <option value="sqlserver">SQL Server</option>
                <option value="postgres">PostgreSQL</option>
                <option value="mysql">MySQL</option>
              </select>

              <label className="text-sm mt-2">SQL Text</label>
              <textarea value={sql} onChange={(e) => setSql(e.target.value)} rows={10} placeholder="Paste SQL here (anonymize identifiers if possible)" className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3" />

              <label className="text-sm mt-2">Execution Plan XML (optional)</label>
              <textarea value={plan} onChange={(e) => setPlan(e.target.value)} rows={6} placeholder="Paste estimated/actual plan XML" className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3" />

              <label className="text-sm mt-2">Context</label>
              <textarea value={ctx} onChange={(e) => setCtx(e.target.value)} rows={4} placeholder="Rowcounts, known indexes, parameters, symptoms" className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3" />

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"   // <-- important
                  onClick={analyze}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold disabled:opacity-60"
                >
                  {loading ? "Analyzing…" : "Analyze"}
                </button>
                <span className="text-sm text-gray-500">
                  {loading ? "Contacting backend…" : (error || "Anonymize identifiers; avoid PII.")}
                </span>
              </div>
            </div>
          </Section>

          <Section title="Results">
            {!result && <p className="text-gray-500">No analysis yet. Paste a query and click Analyze.</p>}
            {result && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Summary</h4>
                  <p>{result.summary}</p>
                </div>
                {result.findings?.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Findings</h4>
                    <ul className="list-disc pl-5">{result.findings.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  </div>
                )}
                {result.rewrite_sql && (
                  <div>
                    <h4 className="font-semibold">Rewrite SQL</h4>
                    <pre className="bg-gray-100 border border-gray-300 rounded-xl p-3 whitespace-pre-wrap overflow-auto">{result.rewrite_sql}</pre>
                  </div>
                )}
                {result.index_recommendations?.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Index Recommendations</h4>
                    <ul className="list-disc pl-5">{result.index_recommendations.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  </div>
                )}
                {result.risks?.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Risks</h4>
                    <ul className="list-disc pl-5">{result.risks.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  </div>
                )}
                {result.test_steps?.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Test Steps</h4>
                    <ol className="list-decimal pl-5">{result.test_steps.map((f, i) => <li key={i}>{f}</li>)}</ol>
                  </div>
                )}
              </div>
            )}
          </Section>
        </div>

        <footer className={`text-sm mt-8 border-t pt-4 flex justify-between items-center ${isDark ? "text-[#98a2b3] border-[#23304b]" : "text-[#475569] border-[#cbd5e1]"}`}>
          <span>© {new Date().getFullYear()} NathSpire DBA Optimizer</span>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="px-3 py-1 rounded-lg border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold"
            title="Toggle Theme"
          >
            Display Mode
          </button>
        </footer>
      </div>
    </div>
  );
}
