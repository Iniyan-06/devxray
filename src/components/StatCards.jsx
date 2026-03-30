import { motion } from "framer-motion";
import { Clock, Calendar, Zap, Trophy } from "lucide-react";

function CountUp({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalMilisecondsChildOut = duration * 1000;
    let incrementTime = (totalMilisecondsChildOut / end);

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

function StatCard({ icon: Icon, label, value, unit, colorClass, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-panel p-6 relative overflow-hidden flex flex-col gap-2 group hover:border-${colorClass}/50 transition-all`}
    >
      <div className="scan-line opacity-30" />
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg bg-${colorClass}/10 border border-${colorClass}/20`}>
          <Icon className={`w-5 h-5 text-${colorClass}`} />
        </div>
        <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className={`text-4xl font-mono font-black text-${colorClass} text-glow-` + colorClass.split('-')[1]}>
          <CountUp value={value} />
        </h3>
        <span className="text-gray-500 font-mono text-sm uppercase">{unit}</span>
      </div>
    </motion.div>
  );
}

function RadialGauge({ score, delay }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = () => {
    if (score >= 70) return "text-xray-green";
    if (score >= 40) return "text-xray-amber";
    return "text-xray-red";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-6 relative overflow-hidden flex items-center justify-between gap-6"
    >
      <div className="scan-line opacity-30" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-xray-blue" />
          <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">X-Ray Score</span>
        </div>
        <div className={`text-3xl font-mono font-black ${getColor()} text-glow`}>
          {score}<span className="text-gray-500 text-sm ml-1">/100</span>
        </div>
      </div>

      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48" cy="48" r={radius}
            fill="transparent"
            stroke="rgba(26, 44, 66, 0.4)"
            strokeWidth="8"
          />
          <motion.circle
            cx="48" cy="48" r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }}
            className={getColor()}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute font-mono font-bold text-lg ${getColor()}`}>{score}</span>
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";

export default function StatCards({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto mb-12 px-4">
      <StatCard 
        icon={Clock} 
        label="Avg Build Time" 
        value={data.avg_build_time || 0} 
        unit="sec" 
        colorClass="xray-cyan"
        delay={0.1}
      />
      <StatCard 
        icon={Calendar} 
        label="Weekly Waste" 
        value={data.weekly_waste || 0} 
        unit="hrs" 
        colorClass="xray-amber"
        delay={0.2}
      />
      <StatCard 
        icon={Zap} 
        label="Optimization Savings" 
        value={data.optimization_savings || 0} 
        unit="hrs/wk" 
        colorClass="xray-green"
        delay={0.3}
      />
      <RadialGauge 
        score={data.xray_score || 0} 
        delay={0.4}
      />
    </div>
  );
}
