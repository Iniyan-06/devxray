import { motion } from "framer-motion";
import { Terminal, Zap, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

const INSIGHTS = [
  {
    id: 1,
    severity: "critical",
    problem: "Step 'Build Artifact' consumes 54% of total workflow duration.",
    fix: "Implement Docker multi-stage build caching to reduce build time from 212s to ~95s.",
    code: "jobs:\n  build:\n    steps:\n      - uses: actions/cache@v3\n        with:\n          path: /tmp/.buildx-cache\n          key: ${{ runner.os }}-buildx"
  },
  {
    id: 2,
    severity: "warning",
    problem: "Unit tests are running sequentially on a large monorepo structure.",
    fix: "Shard the test suite into 4 parallel jobs to see a 62% decrease in duration.",
    code: "strategy:\n  fail-fast: false\n  matrix:\n    shard: [1, 2, 3, 4]"
  },
  {
    id: 3,
    severity: "info",
    problem: "Redundant dependency installation detected in linting job.",
    fix: "Leverage a shared environment or pre-built base image for secondary jobs.",
    code: "container:\n  image: node:18-slim\n  options: --user 1001"
  }
];

function SeverityBadge({ severity }) {
  const styles = {
    critical: "border-xray-red/30 bg-xray-red/10 text-xray-red",
    warning: "border-xray-amber/30 bg-xray-amber/10 text-xray-amber",
    info: "border-xray-blue/30 bg-xray-blue/10 text-xray-blue"
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-widest ${styles[severity]}`}>
      {severity}
    </span>
  );
}

import { useState } from "react";

export default function AIInsights() {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplied(true);
    }, 2000);
  };

  return (
    <div className="glass-panel p-8 h-full flex flex-col relative overflow-visible">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Terminal size={140} className="text-xray-blue" />
      </div>
      
      <h3 className="text-xray-blue font-mono text-xs uppercase font-bold tracking-[0.2em] mb-8 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-xray-blue shadow-neon-blue" />
        🤖 AI-Powered Optimization Insights
      </h3>

      <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        {INSIGHTS.map((insight, idx) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + idx * 0.15 }}
            className="border border-xray-border/40 rounded-xl bg-xray-navy/30 p-5 group hover:border-xray-blue/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <SeverityBadge severity={insight.severity} />
              <p className="text-gray-300 font-mono text-xs leading-relaxed">
                {insight.problem}
              </p>
            </div>

            <div className="bg-[#050810] rounded-lg p-4 border border-xray-border/30 mb-4 group-hover:border-xray-cyan/20 transition-all">
              <p className="text-xray-cyan font-mono text-[10px] uppercase mb-2 flex items-center gap-1.5">
                <Zap size={10} className="fill-xray-cyan" /> Optimization Fix
              </p>
              <pre className="text-xray-green/80 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                {insight.code}
              </pre>
            </div>

            <p className="text-gray-500 font-mono text-[11px] italic">
              Fix logic: {insight.fix}
            </p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-xray-border/40">
        <button 
          onClick={handleApply}
          disabled={isApplying || applied}
          className={`w-full py-3 border transition-all rounded-xl font-mono text-xs uppercase tracking-[0.1em] font-bold flex items-center justify-center gap-2 shadow-neon-blue/20 ${
            applied 
            ? "bg-xray-green/10 border-xray-green/30 text-xray-green" 
            : "bg-xray-blue/10 border-xray-blue/30 text-xray-blue hover:bg-xray-blue hover:text-white"
          } disabled:opacity-50`}
        >
          {isApplying ? (
            <span className="animate-pulse">Optimizing Pipeline...</span>
          ) : applied ? (
            <><CheckCircle2 size={16} /> Optimizations Implemented</>
          ) : (
            <><Zap size={16} className="fill-current" /> Apply All AI Recommendations</>
          )}
        </button>
      </div>
    </div>
  );
}
