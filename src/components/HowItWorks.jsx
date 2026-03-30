import { useState, useEffect } from "react";
import { Search, Zap, BarChart2, ChevronDown, Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HowItWorks() {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://github.com/facebook/react");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textToType = "HOW IT WORKS".split("");

  return (
    <section id="how-it-works" className="w-full bg-[#0A0F1E] py-32 px-4 relative z-10 overflow-hidden border-t border-b border-white/5 font-sans">
      
      {/* Background Animated Grid & Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" 
           style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full w-1.5 h-1.5 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -50, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: "linear", delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-20">
        
        {/* HOW TO SCAN ACCORDION */}
        <div className="mb-24 max-w-2xl mx-auto">
          <div className="border border-xray-cyan/30 bg-[#0D1326]/80 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,245,255,0.05)] transition-colors hover:border-xray-cyan/60">
            <button 
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-mono font-bold text-xray-cyan tracking-wide">HOW TO FIND A REPOSITORY TO SCAN?</span>
              <motion.div animate={{ rotate: isAccordionOpen ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-xray-cyan" />
              </motion.div>
            </button>
            <AnimatePresence>
              {isAccordionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-xray-cyan/20 px-6 py-6"
                >
                  <p className="text-gray-400 text-sm mb-6">Extract the owner and repository names directly from any GitHub URL.</p>
                  
                  <div className="bg-black/50 border border-gray-700/50 rounded-lg p-4 font-mono text-sm relative">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-gray-500">github.com / <span className="text-white">facebook</span> / <span className="text-xray-cyan">react</span></span>
                       <button onClick={handleCopy} className="text-gray-400 hover:text-white transition group relative">
                         {copied ? <CheckCircle2 className="w-4 h-4 text-xray-green" /> : <Copy className="w-4 h-4" />}
                       </button>
                    </div>
                    
                    <motion.div 
                      className="flex flex-col gap-1 mt-4 text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex font-mono">
                         <span className="w-10 flex justify-center text-gray-600">↓</span>
                         <span className="text-gray-400 ml-4 border-b border-gray-700 pb-1 w-full flex">
                           <span className="w-24 text-gray-500">OWNER:</span> <span className="text-white">facebook</span>
                         </span>
                      </div>
                      <div className="flex font-mono mt-2">
                         <span className="w-10"></span>
                         <span className="w-10 flex justify-center text-xray-cyan ml-[-40px]">↓</span>
                         <span className="text-gray-400 ml-4 w-full flex">
                           <span className="w-24 text-gray-500">REPO:</span> <span className="text-xray-cyan">react</span>
                         </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SECTION HEADER */}
        <div className="text-center mb-24 flex flex-col items-center">
          
          <div className="overflow-hidden w-full max-w-sm mb-6 border border-xray-cyan/20 bg-xray-cyan/5 rounded-full py-1.5 px-3">
             <motion.div 
                className="whitespace-nowrap font-mono text-[10px] tracking-[0.2em] font-bold text-xray-cyan drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]"
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             >
               ⚡ POWERED BY AI • GITHUB API • REAL-TIME ANALYSIS • DEEP OPTIMIZATIONS ⚡
             </motion.div>
          </div>

          <div className="inline-block relative">
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-widest uppercase flex relative pb-4">
              {textToType.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.1, delay: index * 0.1 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h2>
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-xray-cyan shadow-[0_0_15px_rgba(0,245,255,0.8)] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-gray-400 mt-6 font-mono text-sm tracking-wide">Three steps to X-Ray any pipeline in seconds</p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          
          {/* Connecting Animated Glowing Line */}
          <div className="hidden md:block absolute top-[40%] left-[16%] right-[16%] -translate-y-1/2 z-0">
            <div className="h-px border-t-2 border-dashed border-gray-700/60 w-full relative drop-shadow-[0_0_5px_rgba(0,245,255,0.2)]">
               <motion.div
                  className="absolute top-1/2 left-0 w-4 h-4 rounded-full bg-white shadow-[0_0_20px_4px_rgba(0,245,255,1)] -translate-y-1/2"
                  animate={{ left: ["0%", "100%"] }}
                  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
               />
            </div>
          </div>

          {/* CARD 1 — INPUT REPO (Cyan) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ scale: 1.04, y: -8 }}
            className="group glass-panel backdrop-blur-xl bg-[#0F1423]/80 p-8 h-[420px] relative overflow-hidden flex flex-col items-center text-center rounded-2xl cursor-default transition-all duration-300 border-l-4 border-l-xray-cyan/30 border-t border-r border-b border-white/5 hover:border-l-xray-cyan shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(0,245,255,0.15)] z-10"
          >
            <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[180px] font-black font-mono text-white opacity-[0.02] group-hover:opacity-[0.04] transition-opacity select-none pointer-events-none -mr-8">
              01
            </div>

            <div className="relative w-16 h-16 rounded-xl bg-xray-cyan/10 border border-xray-cyan/20 flex items-center justify-center mb-6">
              <Search className="w-7 h-7 text-xray-cyan" />
              <motion.div 
                className="absolute inset-0 rounded-xl border border-xray-cyan"
                animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            </div>

            <h3 className="font-mono font-bold text-xl mb-3 text-white uppercase drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">Input Repo</h3>
            <p className="text-gray-400 text-[13px] mb-6 px-2 leading-relaxed">Connect any public GitHub repository using owner name and repo name.</p>
            
            <div className="w-full font-mono text-xs bg-black/60 border border-xray-cyan/20 rounded-lg p-4 mt-auto shadow-inner text-left group-hover:border-xray-cyan/50 transition-colors">
              <div className="flex border-b border-gray-800 pb-2 mb-2">
                <span className="text-gray-500 w-16">OWNER</span>
                <span className="text-white">facebook</span>
              </div>
              <div className="flex mb-4">
                <span className="text-gray-500 w-16">REPO</span>
                <span className="text-xray-cyan font-bold">react</span>
              </div>
              <button disabled className="w-full bg-xray-cyan/20 border border-xray-cyan text-xray-cyan font-bold py-1.5 rounded items-center flex justify-center gap-2 tracking-widest text-[10px]">
                ANALYZE <Zap className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

          {/* CARD 2 — X-RAY SCAN (Amber) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.04, y: -8 }}
            className="group glass-panel backdrop-blur-xl bg-[#0F1423]/80 p-8 h-[420px] relative overflow-hidden flex flex-col items-center text-center rounded-2xl cursor-default transition-all duration-300 border-l-4 border-l-xray-amber/30 border-t border-r border-b border-white/5 hover:border-l-xray-amber shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(255,184,0,0.15)] z-10"
          >
            <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[180px] font-black font-mono text-white opacity-[0.02] group-hover:opacity-[0.04] transition-opacity select-none pointer-events-none -mr-8">
              02
            </div>

            <div className="relative w-16 h-16 rounded-xl bg-xray-amber/10 border border-xray-amber/20 flex items-center justify-center mb-6">
              <motion.div animate={{ opacity: [1, 0.2, 1, 0.8, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Zap className="w-7 h-7 text-xray-amber fill-xray-amber/40 drop-shadow-[0_0_12px_rgba(255,184,0,0.8)]" />
              </motion.div>
            </div>

            <h3 className="font-mono font-bold text-xl mb-3 text-white uppercase drop-shadow-[0_0_10px_rgba(255,184,0,0.3)]">X-Ray Scan</h3>
            <p className="text-gray-400 text-[13px] mb-6 px-2 leading-relaxed">AI engine scans every workflow layer for bottlenecks, waste and inefficiencies.</p>
            
            <div className="w-full font-mono text-[10px] bg-black/60 border border-xray-amber/20 rounded-lg p-4 mt-auto shadow-inner text-left flex flex-col gap-2.5 relative group-hover:border-xray-amber/50 transition-colors">
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-16 h-1.5 bg-xray-amber shadow-[0_0_5px_rgba(255,184,0,0.8)] rounded-full"/> GitHub API <CheckCircle2 className="w-3 h-3 text-xray-amber ml-auto"/>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden relative"><motion.div className="absolute inset-y-0 left-0 bg-xray-amber" animate={{ width: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity }}/></div> Analysis <span className="text-xray-amber animate-pulse ml-auto">scanning...</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-16 h-1.5 bg-gray-800 rounded-full"/> AI Layer <span className="ml-auto">pending</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-16 h-1.5 bg-gray-800 rounded-full"/> Simulation <span className="ml-auto">pending</span>
              </div>
            </div>
          </motion.div>

          {/* CARD 3 — GET REPORT (Green) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.04, y: -8 }}
            className="group glass-panel backdrop-blur-xl bg-[#0F1423]/80 p-8 h-[420px] relative overflow-hidden flex flex-col items-center text-center rounded-2xl cursor-default transition-all duration-300 border-l-4 border-l-xray-green/30 border-t border-r border-b border-white/5 hover:border-l-xray-green shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(0,255,102,0.15)] z-10"
          >
            <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[180px] font-black font-mono text-white opacity-[0.02] group-hover:opacity-[0.04] transition-opacity select-none pointer-events-none -mr-8">
              03
            </div>

            <div className="relative w-16 h-16 rounded-xl bg-xray-green/10 border border-xray-green/20 flex items-center justify-center mb-6">
              <div className="relative flex items-end gap-1 h-6 w-8 overflow-hidden">
                {[1, 2, 3].map((val, i) => (
                  <motion.div 
                    key={i}
                    className="w-2 bg-xray-green drop-shadow-[0_0_8px_rgba(0,255,102,0.8)] rounded-t-sm"
                    animate={{ height: ['20%', '100%', '20%'] }}
                    transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>

            <h3 className="font-mono font-bold text-xl mb-3 text-white uppercase drop-shadow-[0_0_10px_rgba(0,255,102,0.3)]">Get Report</h3>
            <p className="text-gray-400 text-[13px] mb-6 px-2 leading-relaxed">Receive AI fixes, pipeline health score and before/after optimization simulation.</p>
            
            <div className="w-full font-mono text-[11px] font-bold bg-black/60 border border-xray-green/20 rounded-lg p-5 mt-auto shadow-inner text-left flex flex-col gap-3 group-hover:border-xray-green/50 transition-colors">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-500">X-RAY SCORE</span>
                <span className="text-xray-green tracking-wider">87/100 ✅</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-500">TIME SAVED</span>
                <span className="text-white">2.4 HRS</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-500">BOTTLENECKS</span>
                <span className="text-xray-amber">3 FIXED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">AI FIXES</span>
                <span className="text-xray-cyan">12 READY</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
