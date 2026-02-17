import { useState } from "react";

export default function App() {
  const [bullet, setBullet] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function rewriteBullet() {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bullet }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>CV Bullet Rewriter</h1>

      <textarea
        rows={4}
        style={{ width: "100%", padding: 10 }}
        placeholder="Paste a CV bullet here…"
        value={bullet}
        onChange={(e) => setBullet(e.target.value)}
      />

      <button
        onClick={rewriteBullet}
        disabled={!bullet || loading}
        style={{ marginTop: 10 }}
      >
        {loading ? "Rewriting..." : "Rewrite"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Rewrite</h3>
          <p>{result.rewrite}</p>

          <h3>Suggested edits</h3>
          <ul>
            {result.suggested_edits.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>

          {result.confidence_score && (
            <p>
              <strong>Confidence score:</strong> {result.confidence_score}
            </p>
          )}
        </div>
      )}
    </div>
  );
}







const result = {
  rewrite: "...",
  suggested_edits: [],
  confidence_score: 0.92,
};



