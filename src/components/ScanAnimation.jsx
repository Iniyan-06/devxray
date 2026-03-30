import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const LAYERS = [
  "User (Next.js Frontend)",
  "Backend API (FastAPI)",
  "GitHub API Context",
  "Analysis Engine",
  "AI Pipeline Layer",
  "Simulation Engine",
  "MongoDB Document Store",
  "Backend Assembly",
  "Docker System Container"
];

const STATUS_MESSAGES = [
  "Connecting to GitHub API...",
  "Fetching CI/CD workflow telemetry...",
  "Initializing Analysis Engine...",
  "Scanning for pipeline bottlenecks...",
  "Running AI-powered optimization...",
  "Executing simulation scenarios...",
  "Persisting results to MongoDB...",
  "Assembling X-ray report telemetry...",
  "Finalizing scan results..."
];

export default function ScanAnimation({ isVisible, onComplete }) {
  const [activeLayer, setActiveLayer] = useState(-1);
  const [statusText, setStatusText] = useState(STATUS_MESSAGES[0]);

  useEffect(() => {
    if (!isVisible) {
      setActiveLayer(-1);
      return;
    }

    // Step through layers every 333ms (total ~3s)
    const interval = setInterval(() => {
      setActiveLayer(prev => {
        if (prev >= LAYERS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 333);

    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    if (activeLayer >= 0 && activeLayer < STATUS_MESSAGES.length) {
      setStatusText(STATUS_MESSAGES[activeLayer]);
    }
  }, [activeLayer]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-xray-bg flex flex-col items-center justify-center p-6"
        >
          {/* Background Wireframe Inside Scan */}
          <div className="absolute inset-0 wireframe-bg opacity-10 pointer-events-none" />
          
          {/* Sweeping Beam */}
          <div className="scan-beam" />

          <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
            <h2 className="text-xray-cyan font-mono text-xl tracking-[0.2em] uppercase mb-12 text-glow">
              Initializing X-Ray Scan
            </h2>

            {/* Pipeline Skeleton */}
            <div className="w-full space-y-3 mb-12">
              {LAYERS.map((layer, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0.2, x: -10 }}
                  animate={{ 
                    opacity: activeLayer >= idx ? 1 : 0.2,
                    x: activeLayer === idx ? 0 : -10,
                    scale: activeLayer === idx ? 1.02 : 1,
                    backgroundColor: activeLayer === idx ? "rgba(0, 245, 255, 0.15)" : "transparent",
                    borderColor: activeLayer === idx ? "rgba(0, 245, 255, 0.5)" : "rgba(26, 44, 66, 0.5)"
                  }}
                  className="p-3 border rounded-lg flex items-center gap-4 transition-all duration-300"
                >
                  <div className={`w-3 h-3 rounded-full border ${activeLayer >= idx ? 'bg-xray-cyan border-xray-cyan shadow-neon' : 'bg-transparent border-gray-600'}`} />
                  <span className={`font-mono text-sm tracking-wide ${activeLayer >= idx ? 'text-white' : 'text-gray-600'}`}>
                    {layer}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Status & Progress */}
            <div className="w-full flex flex-col items-center gap-4">
              <p className="font-mono text-xray-blue text-sm h-6 text-center">
                {statusText}
              </p>
              
              <div className="w-full h-1.5 bg-xray-border/40 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${((activeLayer + 1) / LAYERS.length) * 100}%` }}
                  className="h-full bg-xray-cyan shadow-neon"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
