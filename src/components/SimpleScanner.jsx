import { useState } from "react";

export default function SimpleScanner() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    try {
        const res = await fetch(
        `http://127.0.0.1:8000/ci-data?owner=${owner}&repo=${repo}`
        );
        const result = await res.json();
        setData(result);
    } catch (err) {
        console.error("Scan failed", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl">
      
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Quick CI Scanner
      </h1>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <input
            placeholder="GitHub Owner"
            className="p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
            onChange={(e) => setOwner(e.target.value)}
        />

        <input
            placeholder="Repository Name"
            className="p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
            onChange={(e) => setRepo(e.target.value)}
        />

        <button
            onClick={handleScan}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
            {loading ? "Scanning..." : "Scan CI"}
        </button>
      </div>

      {data && (
        <div className="mt-6 w-full max-w-md bg-white/5 border border-white/10 p-4 rounded-xl overflow-hidden">
          <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Results:</h2>
          <pre className="text-xs text-blue-300 font-mono overflow-auto max-h-60 p-2 custom-scrollbar">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
