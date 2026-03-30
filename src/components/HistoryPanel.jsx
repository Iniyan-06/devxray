import React, { useState, useEffect } from 'react';
import { X, Clock, Trash2, ArrowRight, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function HistoryPanel({ isOpen, onClose, onLoadResult }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory(history.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]"
          />

          {/* Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-xray-bg border-l border-xray-cyan/20 z-[60] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-xray-cyan/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <History className="text-xray-cyan w-5 h-5" />
                <h2 className="font-mono font-bold text-lg tracking-widest text-glow uppercase">Scan History</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-4">
                  <div className="w-8 h-8 border-2 border-xray-cyan/30 border-t-xray-cyan rounded-full animate-spin" />
                  <span className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">Accessing Database...</span>
                </div>
              ) : history.length > 0 ? (
                history.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-xray-cyan/[0.03] hover:border-xray-cyan/20 transition-all cursor-pointer"
                    onClick={() => {
                        onLoadResult(item);
                        onClose();
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col">
                            <span className="font-mono text-[10px] text-xray-cyan/60 tracking-wider uppercase mb-0.5">{item.owner}</span>
                            <span className="font-bold text-white tracking-wide truncate max-w-[180px]">{item.repo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                item.xray_score >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                item.xray_score >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                                SCORE: {item.xray_score}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(item.scanned_at).toLocaleDateString()}
                        </div>
                        <button 
                            onClick={(e) => deleteItem(item.id, e)}
                            className="p-1.5 opacity-0 group-hover:opacity-100 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <Database className="w-12 h-12 text-gray-800 mb-4" />
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-widest leading-loose">
                    No scans yet — analyze your first repo to see history
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
                <div className="p-6 border-t border-xray-cyan/10 bg-black/20">
                    <button 
                        className="w-full py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-mono text-[10px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
                        onClick={() => {/* Implement clear all if needed */}}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All History
                    </button>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
