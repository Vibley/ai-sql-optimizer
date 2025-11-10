import React, { useState, useEffect } from "react";
import { Database } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "https://i-sql-optimizer-backend.onrender.com/analyze";
const HEALTH_URL = "https://i-sql-optimizer-backend.onrender.com/health";

export default function App() {
  const [dbms, setDbms] = useState("sqlserver");
  const [sql, setSql] = useState("");
  const [plan, setPlan] = useState("");
  const [ctx, setCtx] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [theme, setTheme] = useState("light");
  const isDark = theme === "dark";

  useEffect(() => {
    fetch(HEALTH_URL).catch(() => {});
  }, []);

  const analyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dbms, sql_text: sql, plan_xml: plan, context: ctx }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Backend not reachable or invalid response");
    }
    setLoading(false);
  };

  const subtleText = isDark ? "text-slate-200" : "text-gray-800";
  const sectionBg = isDark ? "bg-[#111827] border border-[#475569]" : "bg-white border border-gray-300";
  const inputCls = isDark
    ? "bg-[#1e293b] border border-[#475569] text-slate-100 rounded-xl p-3 placeholder-slate-400"
    : "bg-gray-100 border border-gray-300 text-gray-900 rounded-xl p-3 placeholder-gray-500";

  return (
    <div className={isDark ? "min-h-screen bg-[#0f172a] text-slate-100" : "min-h-screen bg-[#f8fafc] text-gray-900"}>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <header className={`flex items-center justify-between mb-8 border-b pb-4 ${isDark ? "border-[#475569]" : "border-gray-300"}`}>
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
              <Database className="w-10 h-10 text-indigo-400" />
            </motion.div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              AI SQL Query Optimizer
            </h1>
          </div>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`border rounded-xl px-3 py-1 font-semibold ${
              isDark ? "border-slate-400 text-slate-100 hover:bg-slate-700" : "border-gray-400 hover:bg-gray-200"
            }`}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </header>

        {/* Main Panels */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className={`${sectionBg} rounded-2xl p-5 shadow-lg`}>
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> Input
            </h2>

            <label className="text-sm">DBMS</label>
            <select value={dbms} onChange={(e) => setDbms(e.target.value)} className={`${inputCls} w-full mb-3`}>
              <option value="sqlserver">SQL Server</option>
              <option value="postgres">PostgreSQL</option>
              <option value="mysql">MySQL</option>
            </select>

            <label className="text-sm">SQL Query</label>
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              rows={8}
              placeholder="Paste your SQL query for optimization"
              className={`${inputCls} w-full mb-3`}
            />

            <label className="text-sm">Execution Plan (optional)</label>
            <textarea
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              rows={4}
              placeholder="Paste execution plan XML"
              className={`${inputCls} w-full mb-3`}
            />

            <label className="text-sm">Context (optional)</label>
            <textarea
              value={ctx}
              onChange={(e) => setCtx(e.target.value)}
              rows={3}
              placeholder="Indexes, row counts, etc."
              className={`${inputCls} w-full mb-3`}
            />

            <button
              onClick={analyze}
              disabled={loading}
              className="bg-gradient-to-b from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90"
            >
              {loading ? "Deep diving into your query..." : "Analyze"}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          {/* Results Panel */}
          <div className={`${sectionBg} rounded-2xl p-5 shadow-lg`}>
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" /> Results
            </h2>

            {!result && <p className={subtleText}>No analysis yet. Paste a query and click Analyze.</p>}

            {result && (
              <div className="space-y-6">
                {/* Summary */}
                <section>
                  <h4 className={`font-semibold mb-1 ${isDark ? "text-indigo-200" : "text-indigo-600"}`}>
                    Summary
                  </h4>
                  <p className={isDark ? "text-slate-100" : "text-gray-800"}>
                    {result.summary || "No summary provided."}
                  </p>
                </section>

                {/* Findings */}
                {result.findings?.length > 0 && (
                  <section>
                    <h4 className={`font-semibold mb-1 ${isDark ? "text-indigo-200" : "text-indigo-600"}`}>
                      Findings
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {result.findings.map((f, i) => (
                        <li key={i} className={isDark ? "text-slate-100" : "text-gray-800"}>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Rewritten SQL */}
                {result.rewrite_sql && (
                  <section>
                    <h4 className={`font-semibold mb-1 ${isDark ? "text-indigo-200" : "text-indigo-600"}`}>
                      Rewritten SQL
                    </h4>
                    <pre
                      className={`${
                        isDark
                          ? "bg-[#0f172a] text-slate-100"
                          : "bg-gray-100 text-gray-800"
                      } border border-slate-500 rounded-lg p-3 whitespace-pre-wrap overflow-x-auto`}
                    >
                      {result.rewrite_sql}
                    </pre>
                  </section>
                )}

                {/* Index Recommendations */}
                {result.index_recommendations?.length > 0 && (
                  <section>
                    <h4 className={`font-semibold mb-1 ${isDark ? "text-indigo-200" : "text-indigo-600"}`}>
                      Index Recommendations
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {result.index_recommendations.map((ix, i) => (
                        <li key={i} className={isDark ? "text-slate-100" : "text-gray-800"}>
                          {ix}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Index Script */}
                {result.index_script && (
                  <section>
                    <h4 className={`font-semibold mb-1 ${isDark ? "text-indigo-200" : "text-indigo-600"}`}>
                      Index Script
                    </h4>
                    <pre
                      className={`${
                        isDark
                          ? "bg-[#0f172a] text-slate-100"
                          : "bg-gray-100 text-gray-800"
                      } border border-slate-500 rounded-lg p-3 whitespace-pre-wrap overflow-x-auto`}
                    >
                      {result.index_script}
                    </pre>
                  </section>
                )}

                {/* Risks */}
                {result.risks?.length > 0 && (
                  <section>
                    <h4 className={`font-semibold mb-1 ${isDark ? "text-indigo-200" : "text-indigo-600"}`}>
                      Potential Risks
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {result.risks.map((r, i) => (
                        <li key={i} className={isDark ? "text-slate-100" : "text-gray-800"}>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Validation Steps */}
                {result.test_steps?.length > 0 && (
                  <section>
                    <h4 className={`font-semibold mb-1 ${isDark ? "text-indigo-200" : "text-indigo-600"}`}>
                      Validation Steps
                    </h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      {result.test_steps.map((s, i) => (
                        <li key={i} className={isDark ? "text-slate-100" : "text-gray-800"}>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer
          className={`mt-8 text-sm text-center border-t pt-4 ${
            isDark ? "text-slate-400 border-[#475569]" : "text-gray-500 border-gray-300"
          }`}
        >
          <p>© {new Date().getFullYear()} SQL Optimizer — Powered by AI</p>
        </footer>
      </div>
    </div>
  );
}
