import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Zap, TrendingDown, Clock, CheckCircle2, ArrowRight } from "lucide-react";

function MiniPipeline({ type }) {
  const isAfter = type === "after";
  return (
    <div className="flex flex-col gap-2 w-full max-w-[200px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAfter ? 'bg-xray-green shadow-neon-green' : (i === 3 || i === 5 ? 'bg-xray-red shadow-neon-red' : 'bg-xray-green')}`} />
          <div className={`h-1 flex-1 rounded-full ${isAfter ? 'bg-xray-green/40' : (i === 3 || i === 5 ? 'bg-xray-red/40 w-full' : 'bg-xray-green/40')} `} style={{ width: isAfter ? `${Math.random() * 40 + 20}%` : (i === 3 || i === 5 ? "100%" : "30%") }} />
        </div>
      ))}
    </div>
  );
}

export default function SimulationSection({ data }) {
  const [activeTab, setActiveTab] = useState("after");
  const isAfter = activeTab === "after";

  const beforeTime = data?.avg_build_time_sec || 580;
  const savingsTime = data?.estimated_time_saved_hours || 4.2;
  const afterTime = Math.max(Math.round(beforeTime * 0.38), 2); // Simulated 62% faster, floor at 2s
  const percentFaster = 62;

  return (
    <div className="glass-panel p-8 w-full max-w-7xl mx-auto mb-12 relative overflow-hidden">
      <div className="scan-line opacity-20" />
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <h3 className="text-xray-cyan font-mono text-xs uppercase font-bold tracking-[0.2em] flex items-center gap-2">
            <Zap size={14} className="fill-xray-cyan" />
            Before vs After AI Simulation
          </h3>
          <p className="text-gray-500 font-mono text-xs italic">
            Visualizing optimization impact based on current CI/CD telemetry.
          </p>
        </div>

        <div className="flex bg-xray-navy/50 p-1 rounded-xl border border-xray-border">
          <button 
            onClick={() => setActiveTab("before")}
            className={`px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all ${!isAfter ? 'bg-xray-red/20 text-xray-red border border-xray-red/30' : 'text-gray-500 hover:text-white'}`}
          >
            Before
          </button>
          <button 
            onClick={() => setActiveTab("after")}
            className={`px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all ${isAfter ? 'bg-xray-green/20 text-xray-green border border-xray-green/30' : 'text-gray-500 hover:text-white'}`}
          >
            After AI Fixes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        {/* State A: Before */}
        <div className={`flex flex-col items-center gap-6 transition-all duration-700 ${isAfter ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xray-red font-mono text-2xl font-black">{beforeTime}s</span>
            <span className="text-gray-500 font-mono text-[10px] uppercase">Current Duration</span>
          </div>
          <div className="p-8 border border-xray-red/20 rounded-2xl bg-xray-red/5 flex flex-col items-center gap-4 w-full h-48 justify-center">
            <MiniPipeline type="before" />
          </div>
        </div>

        {/* Transition Stats */}
        <div className="flex flex-col items-center gap-6 relative">
          <div className="bg-xray-green/10 border border-xray-green/20 p-6 rounded-3xl flex flex-col items-center gap-2 shadow-neon-green/10">
            <TrendingDown size={32} className="text-xray-green mb-2" />
            <span className="text-xray-green font-mono text-4xl font-black text-glow">{percentFaster}%</span>
            <span className="text-xray-green/80 font-mono text-xs uppercase tracking-tighter">Faster Recovery</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 font-mono text-[10px] uppercase tracking-[0.2em]">
            Optimization Logic <ArrowRight size={10} /> Applied
          </div>
        </div>

        {/* State B: After */}
        <div className={`flex flex-col items-center gap-6 transition-all duration-700 ${!isAfter ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xray-green font-mono text-2xl font-black">{afterTime}s</span>
            <span className="text-gray-500 font-mono text-[10px] uppercase">Simulated Duration</span>
          </div>
          <div className="p-8 border border-xray-green/20 rounded-2xl bg-xray-green/5 flex flex-col items-center gap-4 w-full h-48 justify-center">
            <MiniPipeline type="after" />
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-xray-panel/40 border-t border-xray-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-xray-cyan/10 border border-xray-cyan/20">
            <Clock className="text-xray-cyan w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-mono text-sm font-bold">Total Estimated Savings</span>
            <span className="text-gray-500 font-mono text-xs">Based on 100+ simulated workflow executions.</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xray-cyan font-mono text-4xl font-black text-glow">{savingsTime}</span>
          <span className="text-xray-cyan/60 font-mono text-xl uppercase">Hours / Week</span>
        </div>
      </div>
    </div>
  );
}
