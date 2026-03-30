import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Search, 
  Terminal, 
  Shield, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const TAGLINES = [
  "Find wasted time.",
  "Get AI fixes.",
  "Simulate results.",
  "Ship faster.",
];

export default function Hero({ owner, setOwner, repo, setRepo, token, setToken, onAnalyze, disabled }) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineVisible, setTaglineVisible] = useState(true);
  const [isCharging, setIsCharging] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [errors, setErrors] = useState({ owner: false, repo: false });

  const examples = [
    { name: 'vercel/next.js', owner: 'vercel', repo: 'next.js' },
    { name: 'facebook/react', owner: 'facebook', repo: 'react' },
    { name: 'microsoft/vscode', owner: 'microsoft', repo: 'vscode' }
  ];

  // Cycle taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineVisible(false);
      setTimeout(() => {
        setTaglineIndex((i) => (i + 1) % TAGLINES.length);
        setTaglineVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleExampleClick = (ex) => {
    setOwner(ex.owner);
    setRepo(ex.repo);
    setErrors({ owner: false, repo: false });
  };

  const handleAnalyzeClick = async () => {
    if (disabled) return;
    
    let hasError = false;
    const newErrors = { owner: false, repo: false };

    if (!owner.trim()) {
      newErrors.owner = true;
      hasError = true;
    }
    if (!repo.trim()) {
      newErrors.repo = true;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => setErrors({ owner: false, repo: false }), 500);
      return;
    }

    setIsCharging(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsCharging(false);
    onAnalyze();
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <div className="w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.03) 0%, transparent 70%)' }} />
      </div>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="text-center mb-12 relative z-10 max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-cyan-400 text-[10px] tracking-widest uppercase font-bold">
            Powered by AI · GitHub API · Real-time Analysis
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-6">
          <span className="text-white">X-Ray Your</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-glow">
            CI/CD Pipeline
          </span>
        </h1>

        <div className="h-8 flex items-center justify-center overflow-hidden mb-4">
          <motion.p
            key={taglineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: taglineVisible ? 1 : 0, y: taglineVisible ? 0 : -10 }}
            transition={{ duration: 0.35 }}
            className="font-mono text-cyan-400/70 text-lg tracking-wide"
          >
            {TAGLINES[taglineIndex]}
          </motion.p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">🔍 Analyze ANY public GitHub repository</h2>
        <p className="text-slate-500 text-sm">Paste repo details below to X-Ray their pipeline</p>
      </motion.div>

      {/* Main Input Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass-panel w-full max-w-2xl relative z-10 overflow-hidden"
      >
        <div className="scan-line opacity-40" />

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="block font-mono text-[10px] text-cyan-400/60 uppercase tracking-widest mb-2 ml-1 font-bold">GitHub Owner</label>
              <div className={`relative ${errors.owner ? 'shake' : ''}`}>
                <input
                  type="text"
                  placeholder="e.g. facebook"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className={`w-full bg-slate-900/50 border ${errors.owner ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all text-sm`}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              </div>
            </div>
            <div className="text-left">
              <label className="block font-mono text-[10px] text-cyan-400/60 uppercase tracking-widest mb-2 ml-1 font-bold">Repository Name</label>
              <div className={`relative ${errors.repo ? 'shake' : ''}`}>
                <input
                  type="text"
                  placeholder="e.g. react"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className={`w-full bg-slate-900/50 border ${errors.repo ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all text-sm`}
                />
                <Terminal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="text-left">
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block font-mono text-[10px] text-cyan-400/60 uppercase tracking-widest font-bold">GitHub Token (Optional)</label>
              {token ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                  <CheckCircle2 className="w-3 h-3" /> UNLIMITED SCANS
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  <AlertTriangle className="w-3 h-3" /> RATE LIMITED
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                placeholder="ghp_xxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-400 transition-colors"
                type="button"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1">
               <p className="text-[10px] text-slate-500 italic">Unlocks unlimited scans & private repos</p>
               <a href="https://github.com/settings/tokens" target="_blank" rel="noopener" className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors uppercase tracking-wider">
                 Get Free Token <ExternalLink className="w-2.5 h-2.5" />
               </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-white/5">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mr-2">Try:</span>
            {examples.map((ex) => (
              <button key={ex.name} onClick={() => handleExampleClick(ex)} className="repo-chip">
                <GithubIcon className="w-3 h-3" /> {ex.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleAnalyzeClick}
            disabled={disabled}
            className="w-full group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-70"
          >
            <div className="relative z-10 flex items-center justify-center gap-3 font-black text-white uppercase tracking-widest text-sm">
              {isCharging ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Analyze Pipeline</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </button>
        </div>

        {/* Accordion Guide */}
        <div className="border-t border-white/5 bg-slate-900/30">
          <button 
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full flex items-center justify-between px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
          >
            <span>How to scan any repo? 👇</span>
            {isAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {isAccordionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-8 pt-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/20 group-hover:bg-cyan-500/50 transition-colors" />
                      <p className="text-[10px] font-bold text-cyan-400 mb-1 uppercase tracking-widest">Step 1</p>
                      <p className="text-xs text-slate-300 font-medium">Find your target repo on GitHub</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/20 group-hover:bg-cyan-500/50 transition-colors" />
                      <p className="text-[10px] font-bold text-cyan-400 mb-1 uppercase tracking-widest">Step 2</p>
                      <p className="text-xs text-slate-300 font-medium">Copy the owner and repo name</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/20 group-hover:bg-cyan-500/50 transition-colors" />
                      <p className="text-[10px] font-bold text-cyan-400 mb-1 uppercase tracking-widest">Step 3</p>
                      <p className="text-xs text-slate-300 font-medium">Paste above & click Analyze</p>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-slate-950/80 rounded-xl border border-white/10 font-mono text-[11px] relative">
                    <div className="flex items-center gap-2 text-slate-500 mb-4 opacity-60">
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>github.com / <span className="text-cyan-400/70">facebook</span> / <span className="text-cyan-400/70">react</span></span>
                    </div>
                    <div className="flex gap-16 ml-20">
                      <div className="flex flex-col items-center">
                        <div className="w-px h-6 bg-cyan-500/40 mb-1" />
                        <span className="text-[10px] font-bold text-cyan-400 tracking-tighter">OWNER</span>
                      </div>
                      <div className="flex flex-col items-center ml-2">
                        <div className="w-px h-6 bg-cyan-500/40 mb-1" />
                        <span className="text-[10px] font-bold text-cyan-400 tracking-tighter">REPO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase font-bold">Scroll to explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
      </motion.div>
    </section>
  );
}
