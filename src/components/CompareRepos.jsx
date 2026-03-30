import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Split, ArrowRight, Zap, Target, TrendingUp, Sparkles, X } from 'lucide-react';
import StatCards from './StatCards';
import ScoreHistoryChart from './ScoreHistoryChart';

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function CompareRepos({ token }) {
  const [repo1, setRepo1] = useState({ owner: '', name: '', data: null, history: [] });
  const [repo2, setRepo2] = useState({ owner: '', name: '', data: null, history: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRepoData = async (owner, repo) => {
    const res = await fetch(`${API_BASE}/github-ci`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, repo, token })
    });
    if (!res.ok) throw new Error(`Failed to fetch ${owner}/${repo}`);
    const data = await res.json();
    
    // Fetch individual history too
    const histRes = await fetch(`${API_BASE}/history/${owner}/${repo}`);
    const history = histRes.ok ? await histRes.json() : [];
    
    return { data, history };
  };

  const handleCompare = async () => {
    if (!repo1.owner || !repo1.name || !repo2.owner || !repo2.name) {
      setError("Please specify both repositories.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [res1, res2] = await Promise.all([
        fetchRepoData(repo1.owner, repo1.name),
        fetchRepoData(repo2.owner, repo2.name)
      ]);
      
      setRepo1(prev => ({ ...prev, data: res1.data, history: res1.history }));
      setRepo2(prev => ({ ...prev, data: res2.data, history: res2.history }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center gap-4 mb-4">
          <Split className="text-xray-cyan w-10 h-10" />
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-glow">DIAGNOSTIC <span className="text-xray-cyan">COMPARISON</span></h1>
        </div>
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">Select Two Targets for Parallel CI/CD X-Ray</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Repo 1 Input */}
        <div className="glass-panel p-6 border-white/5 bg-white/5">
          <label className="text-[10px] font-mono font-bold text-xray-cyan tracking-widest block mb-4 uppercase">Target Alpha</label>
          <div className="flex gap-4">
            <input 
              placeholder="OWNER" 
              className="bg-black/40 border border-white/10 rounded-lg p-3 w-1/3 font-mono text-xs focus:border-xray-cyan/50 outline-none"
              value={repo1.owner}
              onChange={e => setRepo1(p => ({ ...p, owner: e.target.value }))}
            />
            <input 
              placeholder="REPOSITORY" 
              className="bg-black/40 border border-white/10 rounded-lg p-3 flex-1 font-mono text-xs focus:border-xray-cyan/50 outline-none"
              value={repo1.name}
              onChange={e => setRepo1(p => ({ ...p, name: e.target.value }))}
            />
          </div>
        </div>

        {/* Repo 2 Input */}
        <div className="glass-panel p-6 border-white/5 bg-white/5">
          <label className="text-[10px] font-mono font-bold text-blue-400 tracking-widest block mb-4 uppercase">Target Beta</label>
          <div className="flex gap-4">
            <input 
              placeholder="OWNER" 
              className="bg-black/40 border border-white/10 rounded-lg p-3 w-1/3 font-mono text-xs focus:border-blue-400/50 outline-none"
              value={repo2.owner}
              onChange={e => setRepo2(p => ({ ...p, owner: e.target.value }))}
            />
            <input 
              placeholder="REPOSITORY" 
              className="bg-black/40 border border-white/10 rounded-lg p-3 flex-1 font-mono text-xs focus:border-blue-400/50 outline-none"
              value={repo2.name}
              onChange={e => setRepo2(p => ({ ...p, name: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-16">
        <button 
          onClick={handleCompare}
          disabled={loading}
          className="group relative px-10 py-4 bg-xray-cyan text-black font-black uppercase italic tracking-tighter rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:grayscale"
        >
          {loading ? "SCANNING..." : "INITIATE COMPARISON"}
          <div className="absolute inset-0 bg-white blur-xl opacity-0 group-hover:opacity-30 transition-opacity rounded-xl" />
        </button>
      </div>

      {error && <div className="text-red-400 text-center font-mono text-sm mb-12">{error}</div>}

      {/* Comparison Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden lg:block" />
        
        {/* Repo 1 Results */}
        <div className={`transition-all duration-1000 ${repo1.data ? 'opacity-100' : 'opacity-20'}`}>
          {repo1.data && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-xray-cyan/20 pb-4">
                <h2 className="text-xl font-bold font-mono tracking-tight text-white">{repo1.owner}/<span className="text-xray-cyan">{repo1.name}</span></h2>
                <span className="text-4xl font-black italic text-xray-cyan opacity-50">ALPHA</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 bg-black/40">
                  <span className="text-[10px] font-mono text-gray-500 block">SCORE</span>
                  <span className="text-3xl font-black text-xray-cyan italic">{repo1.data.xray_score}</span>
                </div>
                <div className="glass-panel p-4 bg-black/40">
                  <span className="text-[10px] font-mono text-gray-500 block">AVG BUILD</span>
                  <span className="text-3xl font-black text-white italic">{repo1.data.avg_build_time_sec}s</span>
                </div>
              </div>
              
              {repo1.history.length > 1 && <ScoreHistoryChart history={repo1.history} />}
            </div>
          )}
        </div>

        {/* Repo 2 Results */}
        <div className={`transition-all duration-1000 ${repo2.data ? 'opacity-100' : 'opacity-20'}`}>
          {repo2.data && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                <h2 className="text-xl font-bold font-mono tracking-tight text-white">{repo2.owner}/<span className="text-blue-400">{repo2.name}</span></h2>
                <span className="text-4xl font-black italic text-blue-500 opacity-50">BETA</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 bg-black/40">
                  <span className="text-[10px] font-mono text-gray-500 block">SCORE</span>
                  <span className="text-3xl font-black text-blue-400 italic">{repo2.data.xray_score}</span>
                </div>
                <div className="glass-panel p-4 bg-black/40">
                  <span className="text-[10px] font-mono text-gray-500 block">AVG BUILD</span>
                  <span className="text-3xl font-black text-white italic">{repo2.data.avg_build_time_sec}s</span>
                </div>
              </div>
              
              {repo2.history.length > 1 && <ScoreHistoryChart history={repo2.history} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
