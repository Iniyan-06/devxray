import { useState, useEffect } from "react";
import { Rocket, History, Zap, ExternalLink, LogOut, X, Ghost, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function Navbar({ viewMode, setViewMode, user, onLogin, onLogout }) {
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch history when panel opens
  useEffect(() => {
    if (showHistory) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const res = await fetch("http://localhost:8000/history");
          if (res.ok) {
            const data = await res.json();
            setHistoryData(data);
          }
        } catch (error) {
          console.error("Failed to fetch history:", error);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [showHistory]);

  const handleComingSoon = () => {
    toast("Coming Soon 🚀", {
      icon: '🚧',
      style: {
        borderRadius: '10px',
        background: '#0D1326',
        color: '#fff',
        border: '1px solid rgba(0,245,255,0.3)',
      },
    });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Toaster position="top-center" />
      <nav className="w-full fixed top-0 left-0 z-40 border-b border-xray-cyan/10 bg-xray-bg/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-xray-cyan/30 bg-xray-cyan/10">
              <Rocket className="text-xray-cyan w-5 h-5" />
              <div className="absolute inset-0 rounded-lg bg-xray-cyan blur-md opacity-20 pointer-events-none" />
            </div>
            <span className="font-mono font-bold text-xl tracking-widest text-glow">
              DEVX<span className="text-xray-cyan">-RAY</span>
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 backdrop-blur-xl">
              <button 
                  onClick={() => setViewMode("xray")}
                  className={`px-4 py-2 rounded-lg font-mono text-[10px] tracking-[0.2em] uppercase transition-all ${viewMode === 'xray' ? 'bg-xray-cyan/20 text-xray-cyan border border-xray-cyan/30 shadow-[0_0_15px_rgba(0,245,255,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                  X-RAY
              </button>
              <button 
                  onClick={handleComingSoon}
                  className={`px-4 py-2 rounded-lg font-mono text-[10px] tracking-[0.2em] uppercase transition-all ${viewMode === 'compare' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                  COMPARE
              </button>
              <button 
                  onClick={handleComingSoon}
                  className={`px-4 py-2 rounded-lg font-mono text-[10px] tracking-[0.2em] uppercase transition-all ${viewMode === 'simple' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                  SIMPLE
              </button>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={scrollToHowItWorks} className="px-3 py-2 rounded-lg text-gray-400 hover:text-xray-cyan hover:bg-xray-cyan/5 transition-all text-xs font-mono tracking-wide flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">HOW IT WORKS</span>
            </button>
            <button 
              onClick={() => setShowHistory(true)}
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-xray-cyan hover:bg-xray-cyan/5 transition-all text-xs font-mono tracking-wide flex items-center gap-2"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">HISTORY</span>
            </button>
            
            <div className="w-px h-5 bg-xray-cyan/15 mx-1 hidden sm:block" />
            
            {user ? (
              <div className="flex items-center gap-3 pl-2 group relative">
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Verified Dev</span>
                  <span className="text-xs font-bold text-white tracking-tight">{user.name}</span>
                </div>
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-xray-cyan/30 p-0.5 hover:border-xray-cyan transition-all"
                />
                <button 
                  onClick={onLogout}
                  className="absolute -bottom-10 right-0 py-2 px-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all flex items-center gap-2 hover:bg-red-500/20"
                >
                  <LogOut size={12} /> LOGOUT
                </button>
              </div>
            ) : (
              <a 
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-mono font-bold tracking-widest hover:bg-xray-cyan/10 hover:border-xray-cyan/30 transition-all flex items-center gap-2"
              >
                <ExternalLink size={14} className="text-xray-cyan" /> CONNECT GITHUB
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Slide-in History Panel */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0A0F1E]/95 backdrop-blur-xl border-l-2 border-xray-cyan z-50 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-mono font-bold text-lg text-white flex items-center gap-2">
                  <span>📋</span> Scan History
                </h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {loadingHistory ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/5 rounded-xl h-24 border border-xray-cyan/10" />
                  ))
                ) : historyData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50 p-8 text-center gap-4">
                    <Ghost className="w-16 h-16" />
                    <p className="font-mono text-sm leading-relaxed">No scans yet — analyze your first repo above.</p>
                  </div>
                ) : (
                  historyData.map((scan) => (
                    <div key={scan.id || scan.scanned_at} className="bg-black/40 border border-white/5 rounded-xl block p-4 hover:border-xray-cyan/30 transition-colors group relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-xray-cyan/50" />
                      <div className="flex justify-between items-start mb-2 pl-2">
                        <div className="font-mono text-sm font-bold text-xray-cyan truncate pr-2">
                          {scan.owner} / {scan.repo}
                        </div>
                        <div className="bg-xray-cyan/20 border border-xray-cyan/40 text-xray-cyan text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          {scan.xray_score || "N/A"}
                        </div>
                      </div>
                      <div className="pl-2 flex justify-between items-end mt-4">
                        <div className="text-[10px] font-mono text-gray-500">
                          {new Date(scan.scanned_at).toLocaleDateString()}
                        </div>
                        <button className="text-[10px] font-mono text-white bg-white/5 hover:bg-xray-cyan/20 hover:text-xray-cyan px-2 py-1 rounded flex items-center gap-1 transition-colors">
                          View Report <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
