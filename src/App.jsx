{result && (
  <div className="space-y-6">
    {/* Summary */}
    <section>
      <h4 className="font-semibold text-indigo-300 mb-1">Summary</h4>
      <p className={subtleText}>{result.summary || "No summary provided."}</p>
    </section>

    {/* Findings */}
    {result.findings?.length > 0 && (
      <section>
        <h4 className="font-semibold text-indigo-300 mb-1">Findings</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {result.findings.map((f, i) => (
            <li key={i} className={subtleText}>{f}</li>
          ))}
        </ul>
      </section>
    )}

    {/* Rewritten SQL */}
    {result.rewrite_sql && (
      <section>
        <h4 className="font-semibold text-indigo-300 mb-1">Rewritten SQL</h4>
        <pre
          className={`${isDark ? "bg-[#1e293b] text-slate-100" : "bg-gray-100 text-gray-800"} border border-slate-500 rounded-lg p-3 whitespace-pre-wrap overflow-x-auto`}
        >
          {result.rewrite_sql}
        </pre>
      </section>
    )}

    {/* Index Recommendations */}
    {result.index_recommendations?.length > 0 && (
      <section>
        <h4 className="font-semibold text-indigo-300 mb-1">Index Recommendations</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {result.index_recommendations.map((ix, i) => (
            <li key={i} className={subtleText}>{ix}</li>
          ))}
        </ul>
      </section>
    )}

    {/* Index Script */}
    {result.index_script && (
      <section>
        <h4 className="font-semibold text-indigo-300 mb-1">Index Script</h4>
        <pre
          className={`${isDark ? "bg-[#1e293b] text-slate-100" : "bg-gray-100 text-gray-800"} border border-slate-500 rounded-lg p-3 whitespace-pre-wrap overflow-x-auto`}
        >
          {result.index_script}
        </pre>
      </section>
    )}

    {/* Risks */}
    {result.risks?.length > 0 && (
      <section>
        <h4 className="font-semibold text-indigo-300 mb-1">Potential Risks</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {result.risks.map((r, i) => (
            <li key={i} className={subtleText}>{r}</li>
          ))}
        </ul>
      </section>
    )}

    {/* Validation Steps */}
    {result.test_steps?.length > 0 && (
      <section>
        <h4 className="font-semibold text-indigo-300 mb-1">Validation Steps</h4>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          {result.test_steps.map((s, i) => (
            <li key={i} className={subtleText}>{s}</li>
          ))}
        </ol>
      </section>
    )}
  </div>
)}
