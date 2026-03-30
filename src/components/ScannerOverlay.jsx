import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PIPELINE_LAYERS = [
  { id: 0, label: "Next.js Frontend",         icon: "🖥",  sublabel: "User Interface Layer"         },
  { id: 1, label: "FastAPI Backend",           icon: "⚡",  sublabel: "API Gateway"                  },
  { id: 2, label: "GitHub API",                icon: "🐙",  sublabel: "CI/CD Data Fetch"             },
  { id: 3, label: "Analysis Engine",           icon: "🔬",  sublabel: "Time Waste + Scoring"         },
  { id: 4, label: "AI Layer",                  icon: "🤖",  sublabel: "Insights + Fix Generation"    },
  { id: 5, label: "Simulation Engine",         icon: "⚗️",  sublabel: "Before / After Compute"       },
  { id: 6, label: "MongoDB",                   icon: "🗄",  sublabel: "Data Storage"                 },
  { id: 7, label: "Backend Response",          icon: "📡",  sublabel: "Result Assembly"              },
  { id: 8, label: "X-Ray Report UI",           icon: "📊",  sublabel: "Frontend Rendering"           },
  { id: 9, label: "Docker Container",          icon: "🐳",  sublabel: "Full System Deployment"       },
];

const STATUS_MESSAGES = [
  "Connecting to GitHub API...",
  "Fetching CI/CD workflow data...",
  "Running analysis engine...",
  "Calculating time waste & bottlenecks...",
  "Generating AI insights & fixes...",
  "Running before/after simulation...",
  "Persisting results to MongoDB...",
  "Assembling backend response...",
  "Preparing your X-Ray report...",
  "Finalizing Docker telemetry...",
];

export default function ScannerOverlay({ scanning }) {
  const [litNodes, setLitNodes] = useState(new Set());
  const [statusIdx, setStatusIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  // Beam sweep timing: light nodes sequentially
  useEffect(() => {
    if (!scanning) {
      setLitNodes(new Set());
      setStatusIdx(0);
      setProgress(0);
      return;
    }

    const totalDuration = 2500; // must match App.jsx minimum
    const perNode = totalDuration / PIPELINE_LAYERS.length;

    const timers = PIPELINE_LAYERS.map((_, i) =>
      setTimeout(() => {
        setLitNodes((prev) => new Set([...prev, i]));
        setStatusIdx(i);
        setProgress(Math.round(((i + 1) / PIPELINE_LAYERS.length) * 100));
      }, i * perNode)
    );

    return () => timers.forEach(clearTimeout);
  }, [scanning]);

  return (
    <AnimatePresence>
      {scanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] bg-xray-bg flex items-center justify-center overflow-hidden"
        >
          {/* Grid background */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,245,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.6) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* CRT lines */}
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)'
            }}
          />

          {/* Sweeping scan beam */}
          <div className="scan-beam" />

          {/* Ambient radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,245,255,0.06) 0%, transparent 70%)' }}
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center w-full max-w-xl px-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-xray-cyan/30 bg-xray-cyan/5 mb-4">
                <span className="w-2 h-2 rounded-full bg-xray-cyan animate-pulse" />
                <span className="font-mono text-xray-cyan text-xs tracking-widest uppercase">X-Ray Scan Active</span>
              </div>
              <h2 className="font-black text-3xl text-white text-glow tracking-tight">
                Scanning Pipeline...
              </h2>
            </motion.div>

            {/* Pipeline Layers */}
            <div className="w-full space-y-0 mb-10">
              {PIPELINE_LAYERS.map((layer, i) => {
                const isLit = litNodes.has(i);
                const isActive = statusIdx === i;
                return (
                  <div key={i} className="flex items-stretch gap-0">
                    {/* Left icon column */}
                    <div className="flex flex-col items-center w-12 shrink-0">
                      <div
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all duration-500 ${
                          isLit
                            ? isActive
                              ? 'border-xray-cyan bg-xray-cyan/20 scale-110 shadow-[0_0_25px_rgba(0,245,255,0.7)]'
                              : 'border-xray-cyan/50 bg-xray-cyan/10 shadow-[0_0_12px_rgba(0,245,255,0.3)]'
                            : 'border-xray-border/50 bg-xray-panel/30'
                        }`}
                        style={{ transition: 'all 0.4s ease' }}
                      >
                        <span className={`transition-all duration-500 ${isLit ? '' : 'opacity-30 grayscale'}`}>
                          {layer.icon}
                        </span>
                      </div>
                      {/* Connector line */}
                      {i < PIPELINE_LAYERS.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[16px] transition-all duration-700 ${
                          isLit ? 'bg-xray-cyan/50 shadow-[0_0_4px_rgba(0,245,255,0.4)]' : 'bg-xray-border/30'
                        }`} />
                      )}
                    </div>

                    {/* Layer info */}
                    <div className={`flex-1 ml-3 py-1.5 pb-3 transition-all duration-500 ${
                      isActive ? 'opacity-100' : isLit ? 'opacity-70' : 'opacity-30'
                    }`}>
                      <div className={`font-mono font-bold text-sm transition-colors duration-500 ${
                        isLit ? 'text-xray-cyan' : 'text-gray-500'
                      }`}>
                        {layer.label}
                      </div>
                      <div className={`font-mono text-xs transition-colors duration-500 ${
                        isLit ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        {layer.sublabel}
                      </div>
                    </div>

                    {/* Active indicator */}
                    <div className="w-8 flex items-start pt-2 shrink-0">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-2 h-2 rounded-full bg-xray-cyan mt-1 shadow-[0_0_8px_rgba(0,245,255,0.8)]"
                          style={{ animation: 'pulse 1s ease-in-out infinite' }}
                        />
                      )}
                      {isLit && !isActive && (
                        <svg className="w-4 h-4 text-xray-cyan mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status message */}
            <div className="w-full mb-4 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-sm text-xray-cyan/80"
                >
                  {STATUS_MESSAGES[statusIdx]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Progress</span>
                <span className="font-mono text-xs text-xray-cyan">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-xray-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-xray-blue to-xray-cyan rounded-full"
                  style={{ boxShadow: '0 0 10px rgba(0,245,255,0.6)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
