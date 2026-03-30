import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function ScoreHistoryChart({ history }) {
  if (!history || history.length === 0) return null;

  // Process data for Recharts
  const data = history
    .map(item => ({
      date: new Date(item.scanned_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      score: item.xray_score,
      fullDate: new Date(item.scanned_at).toLocaleString()
    }))
    .reverse(); // Show oldest to newest

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 border border-xray-cyan/10 bg-black/40 relative overflow-hidden h-[300px]"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-xray-cyan w-5 h-5" />
          <h3 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-gray-400">Score Improvement Trend</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-xray-cyan/10 border border-xray-cyan/20">
          <span className="font-mono text-[10px] text-xray-cyan font-bold">X-RAY TELEMETRY</span>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748b' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: '8px',
                fontSize: '10px',
                fontFamily: 'monospace'
              }}
              itemStyle={{ color: '#22d3ee' }}
              cursor={{ stroke: '#22d3ee33', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#22d3ee" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
