import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Lock, Search, ShieldAlert, Ghost, ExternalLink, X } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import ScanAnimation from "./components/ScanAnimation";
import ResultsDashboard from "./components/ResultsDashboard";
import SimpleScanner from "./components/SimpleScanner";
import HistoryPanel from "./components/HistoryPanel";
import CompareRepos from "./components/CompareRepos";
import "./index.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState("xray"); // 'xray' or 'simple'
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState(null);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogin = async () => {
    const pat = prompt("Enter your GitHub Personal Access Token (PAT) to connect:");
    if (!pat) return;

    setToast("Connecting to GitHub...");
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `token ${pat}` }
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser({
          name: userData.name || userData.login,
          avatar: userData.avatar_url,
          token: pat
        });
        setToast(`Welcome, ${userData.login}!`);
      } else {
        setToast("Connection failed. Check your token.");
      }
    } catch (err) {
      setToast("Error connecting to GitHub.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToast("Logged out from GitHub");
  };

  const handleAnalyze = async () => {
    // Sanitize repo name
    let cleanRepo = repo.trim();
    if (repo !== cleanRepo || /\s/.test(repo)) {
      cleanRepo = cleanRepo.replace(/\s+/g, '-');
      setRepo(cleanRepo);
      setToast("Repo name cleaned automatically");
    }

    if (!owner.trim() || !cleanRepo) {
      setError({
        type: 'validation',
        title: 'Coordinates Missing',
        message: 'Specify GitHub Owner and Repository to begin scan.',
        icon: Ghost
      });
      return;
    }

    // Soft amber warning for missing token
    if (!token.trim()) {
      setToast("⚠ No token added — limited to 60 scans/hour");
    }

    setError(null);
    setShowResults(false);
    setIsScanning(true);

    try {
      // Parallel: fetch + minimum animation duration
      const [res] = await Promise.all([
        fetch(`${API_BASE}/github-ci`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            owner: owner.trim(), 
            repo: cleanRepo, 
            token: token.trim() || user?.token || null 
          })
        }),
        new Promise((r) => setTimeout(r, 4500)), 
      ]);

      if (!res.ok) {
        const errData = await res.json();
        const status = res.status;
        
        let errorType = {
          title: "Scan Interrupted",
          message: errData.detail || "Unknown error occurred",
          subtext: "System was unable to complete the X-Ray procedure.",
          icon: AlertTriangle,
          color: "amber"
        };

        if (status === 404) {
          errorType = {
            title: "Repository Not Found",
            message: "Check the owner and repository name for typos.",
            icon: Search,
            color: "red"
          };
        } else if (status === 403) {
          errorType = {
            title: "GitHub API Rate Limit Reached",
            message: "Add a GitHub token to continue scanning unlimited repos.",
            icon: Lock,
            color: "amber",
            action: {
              label: "Get Free Token →",
              link: "https://github.com/settings/tokens"
            }
          };
        } else if (status === 401) {
          errorType = {
            title: "This repository is private",
            message: "Add a token with 'repo' access to scan private repositories.",
            icon: ShieldAlert,
            color: "red"
          };
        } else if (status === 422) {
          errorType = {
            title: "NO WORKFLOWS DETECTED",
            message: "This repository has no GitHub Actions workflows yet.",
            subtext: "Add a .github/workflows/ci.yml file to your repo so I can demo my DevX-Ray tool on it!",
            icon: Ghost,
            color: "amber",
            isWorkflowError: true
          };
        }

        setError(errorType);
        setIsScanning(false);
        return;
      }

      const json = await res.json();
      json.repo = `${owner}/${cleanRepo}`;
      setData(json);
      setIsScanning(false);
      setShowResults(true);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      console.error(err);
      setError({
        title: "Telemetry Fault",
        message: "Connection to analysis engine failed. Backend may be offline.",
        icon: AlertTriangle,
        color: "red"
      });
      setIsScanning(false);
    }
  };

  const handleLoadResult = (historicalData) => {
    // Transform historical DB data back into the format used by the results dashboard
    const loadedData = {
        ...historicalData,
        repo: `${historicalData.owner}/${historicalData.repo}`
    };
    setData(loadedData);
    setShowResults(true);
    setToast(`Loaded report for ${historicalData.repo}`);
    setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <div className="relative min-h-screen bg-xray-bg text-white selection:bg-xray-cyan/25 overflow-x-hidden">
      <div className="crt-overlay" />
      <div className="wireframe-bg" />

      <ScanAnimation isVisible={isScanning} />

      <Navbar 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onOpenHistory={() => setShowHistory(true)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <HistoryPanel 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        onLoadResult={handleLoadResult}
      />

      <main className="w-full relative z-10 pt-20">
        {viewMode === "xray" ? (
          <>
            <Hero
              owner={owner} setOwner={setOwner}
              repo={repo}   setRepo={setRepo}
              token={token} setToken={setToken}
              onAnalyze={handleAnalyze}
              disabled={isScanning}
            />
            {!showResults && !isScanning && <HowItWorks />}
            <ResultsDashboard data={data} isVisible={showResults} />
          </>
        ) : viewMode === "compare" ? (
          <CompareRepos token={user?.token || token} />
        ) : (
          <div className="max-w-4xl mx-auto px-6 py-12">
            <SimpleScanner />
          </div>
        )}

        {/* Global Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] toast-animation"
            >
              <div className="bg-slate-900 border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-xs text-slate-300 font-bold tracking-wider">{toast}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="max-w-3xl mx-auto px-4 mb-20 relative z-50"
            >
              <div className={`error-flicker glass-panel p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl border ${error.color === 'red' ? 'border-red-500/40' : 'border-amber-500/40'}`}>
                <div className={`w-20 h-20 shrink-0 rounded-3xl border flex items-center justify-center relative overflow-hidden ${error.color === 'red' ? 'border-red-500/30 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-amber-500/30 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.2)]'}`}>
                  <div className="scan-line opacity-20" />
                  <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                    <error.icon className={`w-10 h-10 drop-shadow-md ${error.color === 'red' ? 'text-red-400' : 'text-amber-400'}`} />
                  </motion.div>
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <h3 className={`font-black text-xl mb-2 uppercase tracking-tight drop-shadow-sm ${error.color === 'red' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}>
                    {error.title}
                  </h3>
                  <p className="text-slate-200 font-medium mb-1 font-mono text-sm">{error.message}</p>
                  {error.subtext && <p className="text-slate-500 text-xs italic font-mono mt-2">{error.subtext}</p>}
                  
                  {error.action && (
                    <a 
                      href={error.action.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest hover:text-cyan-300 transition-colors"
                    >
                      {error.action.label} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {error.isWorkflowError && (
                    <div className="mt-8 p-4 rounded-xl border border-xray-cyan/40 bg-xray-cyan/5 w-full max-w-lg">
                      <p className="font-mono text-xs text-xray-cyan mb-3 flex items-center gap-2">
                        💡 Try these repos with active CI/CD:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['vercel/next.js', 'facebook/react', 'microsoft/vscode'].map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              const [o, rp] = r.split('/');
                              setOwner(o);
                              setRepo(rp);
                              setError(null);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-xray-navy/80 border border-xray-border hover:border-xray-cyan/50 hover:bg-xray-cyan/10 hover:shadow-neon-cyan transition-all font-mono text-xs text-gray-300 hover:text-white"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setError(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors self-start md:self-center"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="w-full py-12 flex flex-col items-center gap-4 opacity-10 pointer-events-none">
        <div className="w-px h-24 bg-gradient-to-t from-cyan-400 to-transparent" />
        <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Integrated DevX-Ray System v2.1.0</span>
      </footer>
    </div>
  );
}

export default App;